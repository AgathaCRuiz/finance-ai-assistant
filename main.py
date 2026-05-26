"""
main.py — Entry point FastAPI com SQLite
Rode com: uvicorn main:app --reload --port 8000
"""

import sys, os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "src"))

from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from sqlalchemy.orm import Session
from sqlalchemy import func
import asyncio, json, uuid
from datetime import datetime, timedelta
from collections import defaultdict

from database.models import (
    criar_tabelas, Usuario, Transacao, Investimento,
    Meta, IndicesMercado, SessaoChat, MensagemChat
)
from database.session import get_db
from services.chat_service import responder_com_historico

app = FastAPI(title="Edu Finance API", version="2.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:3000",
        "https://finance-ai-assistant-kohl.vercel.app",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

criar_tabelas()

USUARIO_ID    = 1
MAX_HISTORICO = 20


class MensagemRequest(BaseModel):
    mensagem:   str
    session_id: str | None = None


def get_mes_referencia(db: Session) -> tuple[datetime, datetime]:
    """
    Retorna (inicio, fim) do mês a ser exibido.
    Se o mês atual não tiver transações, usa o mês mais recente com dados.
    """
    hoje   = datetime.now()
    inicio = hoje.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
    fim    = hoje

    count = db.query(Transacao).filter(
        Transacao.usuario_id == USUARIO_ID,
        Transacao.data >= inicio,
    ).count()

    if count == 0:
        # Busca o mês mais recente com transações
        ultima = db.query(func.max(Transacao.data)).filter(
            Transacao.usuario_id == USUARIO_ID
        ).scalar()

        if ultima:
            inicio = ultima.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
            # Fim = último dia do mês
            if ultima.month == 12:
                fim = ultima.replace(year=ultima.year + 1, month=1, day=1) - timedelta(seconds=1)
            else:
                fim = ultima.replace(month=ultima.month + 1, day=1) - timedelta(seconds=1)

    return inicio, fim


# ── GET /dados ────────────────────────────────────────────────
@app.get("/dados")
async def get_dados(db: Session = Depends(get_db)):
    usuario = db.query(Usuario).filter(Usuario.id == USUARIO_ID).first()
    if not usuario:
        return {"erro": "Usuário não encontrado. Execute: python scripts/seed.py"}

    inicio, fim = get_mes_referencia(db)

    transacoes_mes = db.query(Transacao).filter(
        Transacao.usuario_id == USUARIO_ID,
        Transacao.data >= inicio,
        Transacao.data <= fim,
    ).all()

    saidas   = [t for t in transacoes_mes if t.tipo == "saida"]
    entradas = [t for t in transacoes_mes if t.tipo == "entrada"]

    total_receita = sum(t.valor for t in entradas)
    total_gastos  = sum(t.valor for t in saidas)
    saldo_mes     = total_receita - total_gastos
    taxa_poupanca = round((saldo_mes / total_receita) * 100, 1) if total_receita else 0

    # Gastos por categoria
    gastos_cat: dict[str, float] = defaultdict(float)
    for t in saidas:
        gastos_cat[t.categoria] += t.valor
    gastos_categoria = [
        {"cat": cat, "valor": round(val, 2)}
        for cat, val in sorted(gastos_cat.items(), key=lambda x: -x[1])
    ]

    # Histórico dos últimos 6 meses para o gráfico
    historico_mensal = []
    for i in range(5, -1, -1):
        ref = inicio - timedelta(days=i * 30)
        ini = ref.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
        if ini.month == 12:
            prox = ini.replace(year=ini.year + 1, month=1, day=1)
        else:
            prox = ini.replace(month=ini.month + 1, day=1)

        ts = db.query(Transacao).filter(
            Transacao.usuario_id == USUARIO_ID,
            Transacao.data >= ini,
            Transacao.data < prox,
        ).all()

        g = sum(t.valor for t in ts if t.tipo == "saida")
        e = sum(t.valor for t in ts if t.tipo == "entrada")
        historico_mensal.append({
            "mes":    ini.strftime("%b/%y"),
            "gastos": round(g, 2),
            "receita": round(e, 2),
        })

    # Metas
    metas_db           = db.query(Meta).filter(Meta.usuario_id == USUARIO_ID).all()
    reserva_necessaria = usuario.reserva_necessaria or 15000
    reserva_atual      = usuario.reserva_emergencia or 0
    pct_reserva        = round((reserva_atual / reserva_necessaria) * 100, 1)

    metas = [
        {
            "meta":       m.titulo,
            "necessario": m.valor_necessario,
            "prazo":      m.prazo,
            "progresso":  round((m.valor_atual / m.valor_necessario) * 100, 1) if m.valor_necessario else None,
        }
        for m in metas_db
    ]

    # Investimentos
    investimentos = db.query(Investimento).filter(Investimento.usuario_id == USUARIO_ID).all()
    carteira = [
        {
            "nome":          i.nome,
            "tipo":          i.tipo,
            "valor":         i.valor_atual,
            "rentabilidade": i.rentabilidade,
            "variacao_dia":  i.variacao_dia,
        }
        for i in investimentos
    ]

    # Índices de mercado
    indices = {
        i.nome: {"valor": i.valor, "variacao": i.variacao, "atualizado_em": str(i.atualizado_em)}
        for i in db.query(IndicesMercado).all()
    }

    # Mês de referência para o frontend saber qual período está sendo exibido
    mes_referencia = inicio.strftime("%B/%Y")

    return {
        "perfil": {
            "nome":              usuario.nome,
            "renda_mensal":      usuario.renda_mensal,
            "patrimonio_total":  usuario.patrimonio_total,
            "perfil_investidor": usuario.perfil_investidor,
            "objetivo":          usuario.objetivo_principal,
        },
        "metricas": {
            "total_receita":   round(total_receita, 2),
            "total_gastos":    round(total_gastos, 2),
            "saldo_mes":       round(saldo_mes, 2),
            "taxa_poupanca":   taxa_poupanca,
            "mes_referencia":  mes_referencia,
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
        "carteira": carteira,
        "indices":  indices,
    }


# ── POST /chat ────────────────────────────────────────────────
@app.post("/chat")
async def chat(req: MensagemRequest, db: Session = Depends(get_db)):
    session_id = req.session_id or str(uuid.uuid4())

    sessao = db.query(SessaoChat).filter(SessaoChat.id == session_id).first()
    if not sessao:
        sessao = SessaoChat(id=session_id, usuario_id=USUARIO_ID, titulo=req.mensagem[:40])
        db.add(sessao)
        db.commit()

    msgs = db.query(MensagemChat).filter(
        MensagemChat.sessao_id == session_id
    ).order_by(MensagemChat.criado_em).limit(MAX_HISTORICO).all()

    historico = [{"role": m.role, "content": m.content} for m in msgs]
    resposta  = responder_com_historico(req.mensagem, historico)

    db.add(MensagemChat(sessao_id=session_id, role="user",      content=req.mensagem))
    db.add(MensagemChat(sessao_id=session_id, role="assistant", content=resposta))
    sessao.atualizado_em = datetime.utcnow()
    db.commit()

    return {"resposta": resposta, "session_id": session_id}


# ── GET /chat/stream ──────────────────────────────────────────
@app.get("/chat/stream")
async def chat_stream(mensagem: str, session_id: str | None = None, db: Session = Depends(get_db)):
    sid = session_id or str(uuid.uuid4())

    sessao = db.query(SessaoChat).filter(SessaoChat.id == sid).first()
    if not sessao:
        sessao = SessaoChat(id=sid, usuario_id=USUARIO_ID, titulo=mensagem[:40])
        db.add(sessao)
        db.commit()

    msgs = db.query(MensagemChat).filter(
        MensagemChat.sessao_id == sid
    ).order_by(MensagemChat.criado_em).limit(MAX_HISTORICO).all()

    historico = [{"role": m.role, "content": m.content} for m in msgs]
    resposta  = responder_com_historico(mensagem, historico)

    db.add(MensagemChat(sessao_id=sid, role="user",      content=mensagem))
    db.add(MensagemChat(sessao_id=sid, role="assistant", content=resposta))
    sessao.atualizado_em = datetime.utcnow()
    db.commit()

    async def gerar():
        yield f"data: {json.dumps({'session_id': sid})}\n\n"
        palavras = resposta.split(" ")
        for i, palavra in enumerate(palavras):
            token = palavra + ("" if i == len(palavras) - 1 else " ")
            yield f"data: {json.dumps({'token': token})}\n\n"
            await asyncio.sleep(0.04)
        yield f"data: {json.dumps({'done': True})}\n\n"

    return StreamingResponse(gerar(), media_type="text/event-stream")


# ── DELETE /chat/session/:id ──────────────────────────────────
@app.delete("/chat/session/{session_id}")
async def delete_session(session_id: str, db: Session = Depends(get_db)):
    db.query(SessaoChat).filter(SessaoChat.id == session_id).delete()
    db.commit()
    return {"ok": True}


# ── GET /mercado ──────────────────────────────────────────────
@app.get("/mercado")
async def get_mercado(db: Session = Depends(get_db)):
    indices = db.query(IndicesMercado).all()
    return {i.nome: {"valor": i.valor, "variacao": i.variacao} for i in indices}


# ── GET / ─────────────────────────────────────────────────────
@app.get("/")
async def root():
    return {"status": "online", "versao": "2.0.0", "agente": "Edu Finance"}


# ── GET /evolucao ─────────────────────────────────────────────
@app.get("/evolucao")
async def get_evolucao(db: Session = Depends(get_db)):
    """
    Retorna evolução patrimonial dos últimos 12 meses.
    Calcula receitas, gastos e saldo acumulado mês a mês.
    """
    usuario = db.query(Usuario).filter(Usuario.id == USUARIO_ID).first()
    if not usuario:
        return []

    hoje = datetime.now()
    patrimonio_base = usuario.patrimonio_total or 0
    resultado = []

    for i in range(11, -1, -1):
        ref = hoje - timedelta(days=i * 30)
        ini = ref.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
        if ini.month == 12:
            prox = ini.replace(year=ini.year + 1, month=1, day=1)
        else:
            prox = ini.replace(month=ini.month + 1, day=1)

        ts = db.query(Transacao).filter(
            Transacao.usuario_id == USUARIO_ID,
            Transacao.data >= ini,
            Transacao.data < prox,
        ).all()

        receita = sum(t.valor for t in ts if t.tipo == "entrada")
        gastos  = sum(t.valor for t in ts if t.tipo == "saida")
        saldo   = receita - gastos

        # Simula crescimento patrimonial acumulado
        fator = 1 + (0.008 * (12 - i))  # ~10% ao ano
        patrimonio_mes = round(patrimonio_base * fator + saldo * (12 - i) * 0.5, 2)

        resultado.append({
            "mes":        ini.strftime("%b/%y"),
            "patrimonio": patrimonio_mes,
            "receita":    round(receita, 2),
            "gastos":     round(gastos, 2),
            "saldo":      round(saldo, 2),
        })

    return resultado


# ── GET /perfil ───────────────────────────────────────────────
@app.get("/perfil")
async def get_perfil(db: Session = Depends(get_db)):
    usuario = db.query(Usuario).filter(Usuario.id == USUARIO_ID).first()
    if not usuario:
        return {"erro": "Usuário não encontrado"}
    metas = db.query(Meta).filter(Meta.usuario_id == USUARIO_ID).all()
    return {
        "id":                  usuario.id,
        "nome":                usuario.nome,
        "email":               usuario.email,
        "idade":               usuario.idade,
        "perfil_investidor":   usuario.perfil_investidor,
        "objetivo_principal":  usuario.objetivo_principal,
        "renda_mensal":        usuario.renda_mensal,
        "patrimonio_total":    usuario.patrimonio_total,
        "reserva_emergencia":  usuario.reserva_emergencia,
        "reserva_necessaria":  usuario.reserva_necessaria,
        "metas": [
            {
                "id":               m.id,
                "titulo":           m.titulo,
                "valor_necessario": m.valor_necessario,
                "valor_atual":      m.valor_atual,
                "prazo":            m.prazo,
                "status":           m.status,
            }
            for m in metas
        ],
    }


# ── PUT /perfil ───────────────────────────────────────────────
class PerfilUpdate(BaseModel):
    nome:               str | None = None
    email:              str | None = None
    idade:              int | None = None
    perfil_investidor:  str | None = None
    objetivo_principal: str | None = None
    renda_mensal:       float | None = None
    patrimonio_total:   float | None = None
    reserva_emergencia: float | None = None
    reserva_necessaria: float | None = None

@app.put("/perfil")
async def update_perfil(body: PerfilUpdate, db: Session = Depends(get_db)):
    usuario = db.query(Usuario).filter(Usuario.id == USUARIO_ID).first()
    if not usuario:
        return {"erro": "Usuário não encontrado"}
    for field, value in body.model_dump(exclude_none=True).items():
        setattr(usuario, field, value)
    db.commit()
    return {"ok": True}


# ── POST /perfil/metas ────────────────────────────────────────
class MetaCreate(BaseModel):
    titulo:           str
    valor_necessario: float
    valor_atual:      float = 0
    prazo:            str

@app.post("/perfil/metas")
async def create_meta(body: MetaCreate, db: Session = Depends(get_db)):
    meta = Meta(usuario_id=USUARIO_ID, **body.model_dump())
    db.add(meta)
    db.commit()
    db.refresh(meta)
    return {"id": meta.id, "ok": True}


# ── PUT /perfil/metas/{id} ────────────────────────────────────
class MetaUpdate(BaseModel):
    titulo:           str | None = None
    valor_necessario: float | None = None
    valor_atual:      float | None = None
    prazo:            str | None = None
    status:           str | None = None

@app.put("/perfil/metas/{meta_id}")
async def update_meta(meta_id: int, body: MetaUpdate, db: Session = Depends(get_db)):
    meta = db.query(Meta).filter(Meta.id == meta_id, Meta.usuario_id == USUARIO_ID).first()
    if not meta:
        return {"erro": "Meta não encontrada"}
    for field, value in body.model_dump(exclude_none=True).items():
        setattr(meta, field, value)
    db.commit()
    return {"ok": True}


# ── DELETE /perfil/metas/{id} ─────────────────────────────────
@app.delete("/perfil/metas/{meta_id}")
async def delete_meta(meta_id: int, db: Session = Depends(get_db)):
    meta = db.query(Meta).filter(Meta.id == meta_id, Meta.usuario_id == USUARIO_ID).first()
    if meta:
        db.delete(meta)
        db.commit()
    return {"ok": True}