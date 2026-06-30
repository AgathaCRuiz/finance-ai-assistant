"""
main.py — FastAPI com Supabase + Auth JWT
"""
import sys, os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "src"))

from fastapi import FastAPI, Depends, HTTPException, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from datetime import datetime, timedelta
from collections import defaultdict
import asyncio, json, uuid
from dotenv import load_dotenv

load_dotenv()

from auth.supabase_client import supabase
from auth.auth_middleware import get_current_user
from services.chat_service import responder_com_historico
from parsers.csv_parser import parsear_extrato

app = FastAPI(title="Edu Finance API", version="3.0.0")

ALLOWED_ORIGINS = os.getenv("ALLOWED_ORIGINS", "http://localhost:5173,http://localhost:3000").split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

MAX_HISTORICO = 20


# ── Helpers ───────────────────────────────────────────────────
def _uid(user: dict) -> str:
    return user["user_id"]


# ── GET /me ───────────────────────────────────────────────────
@app.get("/me")
async def get_me(user: dict = Depends(get_current_user)):
    """Retorna dados do usuário autenticado."""
    res = supabase.table("profiles").select("*").eq("id", _uid(user)).single().execute()
    if not res.data:
        raise HTTPException(404, "Perfil não encontrado")
    return res.data


# ── GET /dados ────────────────────────────────────────────────
@app.get("/dados")
async def get_dados(periodo: str = "1m", user: dict = Depends(get_current_user)):
    uid = _uid(user)

    meses_map = {"1m": 1, "3m": 3, "6m": 6, "12m": 12}
    n_meses   = meses_map.get(periodo, 1)
    hoje      = datetime.now()
    inicio    = (hoje - timedelta(days=n_meses * 30)).replace(day=1, hour=0, minute=0, second=0)

    # Perfil
    perfil_res = supabase.table("profiles").select("*").eq("id", uid).single().execute()
    if not perfil_res.data:
        raise HTTPException(404, "Perfil não encontrado. Complete o onboarding.")
    perfil = perfil_res.data

    # Transações do período
    trans_res = supabase.table("transacoes") \
        .select("*") \
        .eq("user_id", uid) \
        .gte("data", inicio.isoformat()) \
        .execute()
    transacoes = trans_res.data or []

    saidas   = [t for t in transacoes if t["tipo"] == "saida"]
    entradas = [t for t in transacoes if t["tipo"] == "entrada"]

    total_receita = sum(t["valor"] for t in entradas)
    total_gastos  = sum(t["valor"] for t in saidas)
    saldo_mes     = total_receita - total_gastos
    taxa_poupanca = round((saldo_mes / total_receita) * 100, 1) if total_receita else 0

    # Gastos por categoria
    gastos_cat: dict[str, float] = defaultdict(float)
    for t in saidas:
        gastos_cat[t.get("categoria", "outros")] += t["valor"]
    gastos_categoria = [
        {"cat": cat, "valor": round(val, 2)}
        for cat, val in sorted(gastos_cat.items(), key=lambda x: -x[1])
    ]

    # Histórico 6 meses
    historico_mensal = []
    for i in range(5, -1, -1):
        ref = hoje - timedelta(days=i * 30)
        ini = ref.replace(day=1, hour=0, minute=0, second=0)
        if ini.month == 12:
            prox = ini.replace(year=ini.year + 1, month=1, day=1)
        else:
            prox = ini.replace(month=ini.month + 1, day=1)

        mes_trans = [t for t in transacoes
                     if ini.isoformat() <= t["data"] < prox.isoformat()]
        g = sum(t["valor"] for t in mes_trans if t["tipo"] == "saida")
        e = sum(t["valor"] for t in mes_trans if t["tipo"] == "entrada")
        historico_mensal.append({
            "mes":    ini.strftime("%b/%y"),
            "gastos": round(g, 2),
            "receita": round(e, 2),
        })

    # Metas
    metas_res = supabase.table("metas").select("*").eq("user_id", uid).execute()
    metas_db  = metas_res.data or []

    reserva_atual      = perfil.get("reserva_emergencia", 0) or 0
    reserva_necessaria = perfil.get("reserva_necessaria", 15000) or 15000
    pct_reserva        = round((reserva_atual / reserva_necessaria) * 100, 1) if reserva_necessaria else 0

    metas = [
        {
            "meta":       m["titulo"],
            "necessario": m["valor_necessario"],
            "prazo":      m["prazo"],
            "progresso":  round((m["valor_atual"] / m["valor_necessario"]) * 100, 1)
                          if m["valor_necessario"] else None,
        }
        for m in metas_db
    ]

    return {
        "perfil": {
            "nome":              perfil.get("nome", ""),
            "renda_mensal":      perfil.get("renda_mensal", 0),
            "patrimonio_total":  perfil.get("patrimonio_total", 0),
            "perfil_investidor": perfil.get("perfil_investidor", "moderado"),
            "objetivo":          perfil.get("objetivo_principal", ""),
        },
        "metricas": {
            "total_receita":  round(total_receita, 2),
            "total_gastos":   round(total_gastos, 2),
            "saldo_mes":      round(saldo_mes, 2),
            "taxa_poupanca":  taxa_poupanca,
            "mes_referencia": inicio.strftime("%B/%Y"),
            "periodo":        periodo,
        },
        "gastos_categoria": gastos_categoria,
        "historico_mensal": historico_mensal,
        "metas":   metas,
        "reserva": {
            "atual":          reserva_atual,
            "necessaria":     reserva_necessaria,
            "meses_cobertos": round(reserva_atual / (total_gastos if total_gastos else 1), 1),
            "percentual":     pct_reserva,
        },
        "carteira": [],
    }


# ── GET /evolucao ─────────────────────────────────────────────
@app.get("/evolucao")
async def get_evolucao(user: dict = Depends(get_current_user)):
    uid  = _uid(user)
    hoje = datetime.now()

    perfil_res = supabase.table("profiles").select("patrimonio_total").eq("id", uid).single().execute()
    patrimonio_base = (perfil_res.data or {}).get("patrimonio_total", 0) or 0

    trans_res = supabase.table("transacoes").select("*").eq("user_id", uid).execute()
    transacoes = trans_res.data or []

    resultado = []
    for i in range(11, -1, -1):
        ref = hoje - timedelta(days=i * 30)
        ini = ref.replace(day=1, hour=0, minute=0, second=0)
        if ini.month == 12:
            prox = ini.replace(year=ini.year + 1, month=1, day=1)
        else:
            prox = ini.replace(month=ini.month + 1, day=1)

        mes_trans = [t for t in transacoes
                     if ini.isoformat() <= t["data"] < prox.isoformat()]
        receita = sum(t["valor"] for t in mes_trans if t["tipo"] == "entrada")
        gastos  = sum(t["valor"] for t in mes_trans if t["tipo"] == "saida")
        saldo   = receita - gastos

        fator            = 1 + (0.008 * (12 - i))
        patrimonio_mes   = round(patrimonio_base * fator + saldo * (12 - i) * 0.5, 2)

        resultado.append({
            "mes":        ini.strftime("%b/%y"),
            "patrimonio": patrimonio_mes,
            "receita":    round(receita, 2),
            "gastos":     round(gastos, 2),
            "saldo":      round(saldo, 2),
        })

    return resultado


# ── PUT /perfil ───────────────────────────────────────────────
class PerfilUpdate(BaseModel):
    nome:               str | None = None
    idade:              int | None = None
    perfil_investidor:  str | None = None
    objetivo_principal: str | None = None
    renda_mensal:       float | None = None
    patrimonio_total:   float | None = None
    reserva_emergencia: float | None = None
    reserva_necessaria: float | None = None

@app.put("/perfil")
async def update_perfil(body: PerfilUpdate, user: dict = Depends(get_current_user)):
    uid     = _uid(user)
    payload = body.model_dump(exclude_none=True)
    supabase.table("profiles").update(payload).eq("id", uid).execute()
    return {"ok": True}


# ── METAS ─────────────────────────────────────────────────────
class MetaCreate(BaseModel):
    titulo: str
    valor_necessario: float
    valor_atual: float = 0
    prazo: str

@app.get("/perfil/metas")
async def list_metas(user: dict = Depends(get_current_user)):
    res = supabase.table("metas").select("*").eq("user_id", _uid(user)).execute()
    return res.data or []

@app.post("/perfil/metas")
async def create_meta(body: MetaCreate, user: dict = Depends(get_current_user)):
    res = supabase.table("metas").insert({**body.model_dump(), "user_id": _uid(user)}).execute()
    return {"id": res.data[0]["id"], "ok": True}

@app.put("/perfil/metas/{meta_id}")
async def update_meta(meta_id: int, body: dict, user: dict = Depends(get_current_user)):
    supabase.table("metas").update(body).eq("id", meta_id).eq("user_id", _uid(user)).execute()
    return {"ok": True}

@app.delete("/perfil/metas/{meta_id}")
async def delete_meta(meta_id: int, user: dict = Depends(get_current_user)):
    supabase.table("metas").delete().eq("id", meta_id).eq("user_id", _uid(user)).execute()
    return {"ok": True}


# ── UPLOAD CSV ────────────────────────────────────────────────
@app.post("/upload/csv")
async def upload_csv(
    file: UploadFile = File(...),
    user: dict = Depends(get_current_user),
):
    uid = _uid(user)

    if not file.filename.endswith(".csv"):
        raise HTTPException(400, "Apenas arquivos .csv são aceitos")

    conteudo = await file.read()
    resultado = parsear_extrato(conteudo, user_id=uid)

    if not resultado["transacoes"]:
        raise HTTPException(400, f"Nenhuma transação encontrada. Erros: {resultado['erros']}")

    # Insere em lotes de 100
    transacoes = resultado["transacoes"]
    for i in range(0, len(transacoes), 100):
        lote = transacoes[i:i+100]
        supabase.table("transacoes").insert(lote).execute()

    return {
        "ok":       True,
        "banco":    resultado["banco"],
        "total":    resultado["total"],
        "entradas": resultado["entradas"],
        "saidas":   resultado["saidas"],
    }


# ── CHAT ──────────────────────────────────────────────────────
class MensagemRequest(BaseModel):
    mensagem:   str
    session_id: str | None = None

@app.post("/chat")
async def chat(req: MensagemRequest, user: dict = Depends(get_current_user)):
    uid        = _uid(user)
    session_id = req.session_id or str(uuid.uuid4())

    # Garante sessão no banco
    sess_res = supabase.table("sessoes_chat").select("id").eq("id", session_id).execute()
    if not sess_res.data:
        supabase.table("sessoes_chat").insert({
            "id": session_id, "user_id": uid,
            "titulo": req.mensagem[:40],
        }).execute()

    # Histórico
    msgs_res = supabase.table("mensagens_chat") \
        .select("role,content") \
        .eq("sessao_id", session_id) \
        .order("created_at") \
        .limit(MAX_HISTORICO) \
        .execute()
    historico = [{"role": m["role"], "content": m["content"]} for m in (msgs_res.data or [])]

    # Monta contexto com dados reais do usuário autenticado
    from agent.context import montar_contexto
    contexto = montar_contexto(uid, supabase)

    from agent.llm import perguntar
    resposta = perguntar(req.mensagem, contexto, historico)

    # Salva mensagens
    supabase.table("mensagens_chat").insert([
        {"sessao_id": session_id, "role": "user",      "content": req.mensagem},
        {"sessao_id": session_id, "role": "assistant",  "content": resposta},
    ]).execute()

    return {"resposta": resposta, "session_id": session_id}


@app.get("/chat/stream")
async def chat_stream(
    mensagem: str,
    session_id: str | None = None,
    user: dict = Depends(get_current_user),
):
    uid = _uid(user)
    sid = session_id or str(uuid.uuid4())

    sess_res = supabase.table("sessoes_chat").select("id").eq("id", sid).execute()
    if not sess_res.data:
        supabase.table("sessoes_chat").insert({
            "id": sid, "user_id": uid, "titulo": mensagem[:40],
        }).execute()

    msgs_res = supabase.table("mensagens_chat") \
        .select("role,content") \
        .eq("sessao_id", sid) \
        .order("created_at") \
        .limit(MAX_HISTORICO) \
        .execute()
    historico = [{"role": m["role"], "content": m["content"]} for m in (msgs_res.data or [])]

    from agent.context import montar_contexto
    contexto = montar_contexto(uid, supabase)

    from agent.llm import perguntar
    resposta = perguntar(mensagem, contexto, historico)

    supabase.table("mensagens_chat").insert([
        {"sessao_id": sid, "role": "user",      "content": mensagem},
        {"sessao_id": sid, "role": "assistant",  "content": resposta},
    ]).execute()

    async def gerar():
        yield f"data: {json.dumps({'session_id': sid})}\n\n"
        for i, palavra in enumerate(resposta.split(" ")):
            token = palavra + ("" if i == len(resposta.split(" ")) - 1 else " ")
            yield f"data: {json.dumps({'token': token})}\n\n"
            await asyncio.sleep(0.04)
        yield f"data: {json.dumps({'done': True})}\n\n"

    return StreamingResponse(gerar(), media_type="text/event-stream")


@app.delete("/chat/session/{session_id}")
async def delete_session(session_id: str, user: dict = Depends(get_current_user)):
    supabase.table("sessoes_chat").delete() \
        .eq("id", session_id).eq("user_id", _uid(user)).execute()
    return {"ok": True}


@app.get("/")
async def root():
    return {"status": "online", "versao": "3.0.0"}