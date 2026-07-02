"""
csv_parser.py — Parser de extratos bancários com categorização por IA (Groq)
"""
import pandas as pd
import io
import json
import requests
from datetime import datetime
from typing import Optional
import os
from dotenv import load_dotenv

load_dotenv()

GROQ_API_KEY = os.getenv("GROQ_API_KEY", "")
GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions"
MODELO       = os.getenv("MODELO", "llama-3.3-70b-versatile")

# ── Categorização por IA ─────────────────────────────────────
CATEGORIAS_VALIDAS = [
    "moradia", "alimentacao", "transporte", "saude", "educacao",
    "lazer", "vestuario", "investimento", "receita", "fatura",
    "servicos", "outros"
]

def categorizar_lote_ia(descricoes: list[dict]) -> dict[str, str]:
    """
    Envia lote de transações para o Groq categorizar.
    Retorna dict {id: categoria}
    """
    if not descricoes or not GROQ_API_KEY:
        return {}

    lista = "\n".join(
        f'{d["id"]}|{d["descricao"]}|{d["historico"]}|{d["tipo"]}'
        for d in descricoes
    )

    prompt = f"""Categorize cada transação bancária brasileira abaixo.
Retorne APENAS um JSON válido no formato: {{"id": "categoria", ...}}

Categorias válidas: {", ".join(CATEGORIAS_VALIDAS)}

Regras:
- "receita": salários, Pix recebidos, transferências recebidas, rendimentos
- "investimento": rendimentos B3, CDB, tesouro, dividendos, evento B3
- "fatura": pagamento de fatura de cartão
- "moradia": aluguel, condomínio, luz, água, internet
- "alimentacao": supermercado, restaurante, delivery, padaria, iFood
- "transporte": Uber, combustível, estacionamento, pedágio, ônibus
- "saude": farmácia, hospital, plano de saúde, academia
- "educacao": escola, curso, faculdade, livros
- "lazer": Netflix, Spotify, cinema, bar, viagem
- "vestuario": roupas, calçados, acessórios
- "servicos": telefone, celular, streaming, assinatura
- "outros": qualquer outra coisa

Transações (formato: id|descrição|histórico|tipo):
{lista}

Responda APENAS com o JSON, sem explicações:"""

    try:
        r = requests.post(
            GROQ_API_URL,
            headers={"Authorization": f"Bearer {GROQ_API_KEY}", "Content-Type": "application/json"},
            json={
                "model": MODELO,
                "messages": [{"role": "user", "content": prompt}],
                "max_tokens": 500,
                "temperature": 0.1,
            },
            timeout=20,
        )
        content = r.json()["choices"][0]["message"]["content"].strip()
        # Remove markdown se vier com ```json
        content = content.replace("```json", "").replace("```", "").strip()
        return json.loads(content)
    except Exception:
        return {}


def categorizar_fallback(descricao: str, historico: str = "") -> str:
    """Fallback por palavras-chave se a IA falhar."""
    CATEGORIAS: dict[str, list[str]] = {
        "moradia":     ["aluguel", "condominio", "luz", "energia", "agua", "gas", "internet"],
        "alimentacao": ["supermercado", "mercado", "padaria", "ifood", "restaurante",
                        "lanchonete", "delivery", "cantina"],
        "transporte":  ["uber", "99pop", "combustivel", "posto", "gasolina",
                        "estacionamento", "pedagio"],
        "saude":       ["farmacia", "drogaria", "hospital", "clinica", "academia", "smartfit"],
        "educacao":    ["escola", "faculdade", "curso", "udemy", "alura", "livro"],
        "lazer":       ["netflix", "spotify", "amazon prime", "disney", "cinema", "bar"],
        "vestuario":   ["roupa", "calcado", "sapato", "tenis", "renner", "c&a"],
        "investimento":["tesouro", "cdb", "rendimento", "evento b3", "dividendo", "juros"],
        "receita":     ["salario", "pix recebido", "credito", "recebido", "transferencia recebida"],
        "fatura":      ["pagamento fatura", "fatura cartao"],
    }
    texto = (descricao + " " + historico).lower()
    for cat, palavras in CATEGORIAS.items():
        if any(p in texto for p in palavras):
            return cat
    return "outros"


# ── Parsers por banco ─────────────────────────────────────────
def _parse_inter_novo(df: pd.DataFrame) -> list[dict]:
    transacoes = []
    col_data  = next((c for c in df.columns if "data" in c.lower()), None)
    col_hist  = next((c for c in df.columns if "hist" in c.lower()), None)
    col_desc  = next((c for c in df.columns if "descri" in c.lower()), None)
    col_valor = next((c for c in df.columns if "valor" in c.lower()), None)

    if not all([col_data, col_valor]):
        raise ValueError("Colunas obrigatórias não encontradas")

    for idx, row in df.iterrows():
        try:
            data_str = str(row[col_data]).strip()
            for fmt in ("%d/%m/%Y", "%Y-%m-%d", "%d/%m/%y"):
                try:
                    data = datetime.strptime(data_str, fmt); break
                except ValueError:
                    continue
            else:
                continue

            valor_str = str(row[col_valor]).replace(".", "").replace(",", ".").strip()
            valor_raw = float(valor_str)
            if valor_raw == 0:
                continue
            valor = abs(valor_raw)

            historico = str(row[col_hist]).strip() if col_hist else ""
            descricao = str(row[col_desc]).strip() if col_desc else historico
            if not descricao or descricao == "nan":
                descricao = historico

            tipo = "entrada" if valor_raw > 0 or any(
                p in historico.lower() for p in
                ["pix recebido", "crédito", "credito", "recebido",
                 "rendimento", "evento b3", "juros s/capital"]
            ) else "saida"

            transacoes.append({
                "_idx":     str(idx),
                "data":     data.isoformat(),
                "descricao": descricao[:100],
                "historico": historico[:100],
                "valor":    round(valor, 2),
                "tipo":     tipo,
                "categoria": "",  # preenchida depois pela IA
            })
        except Exception:
            continue
    return transacoes


def _parse_nubank(df: pd.DataFrame) -> list[dict]:
    transacoes = []
    col_data  = next((c for c in df.columns if "data" in c.lower()), None)
    col_desc  = next((c for c in df.columns if "descri" in c.lower() or "title" in c.lower()), None)
    col_valor = next((c for c in df.columns if "valor" in c.lower() or "amount" in c.lower()), None)

    if not all([col_data, col_desc, col_valor]):
        raise ValueError("Formato Nubank não reconhecido")

    for idx, row in df.iterrows():
        try:
            data_str = str(row[col_data]).strip()
            for fmt in ("%Y-%m-%d", "%d/%m/%Y", "%d/%m/%y"):
                try:
                    data = datetime.strptime(data_str, fmt); break
                except ValueError:
                    continue
            else:
                continue

            valor_str = str(row[col_valor]).replace(",", ".").strip()
            valor_raw = float(valor_str)
            valor = abs(valor_raw)
            if valor == 0:
                continue

            descricao = str(row[col_desc]).strip()
            tipo = "entrada" if valor_raw > 0 else "saida"

            transacoes.append({
                "_idx":      str(idx),
                "data":      data.isoformat(),
                "descricao": descricao[:100],
                "historico": "",
                "valor":     round(valor, 2),
                "tipo":      tipo,
                "categoria": "",
            })
        except Exception:
            continue
    return transacoes


# ── Detectores ───────────────────────────────────────────────
def _encontrar_header(linhas: list[str], sep: str) -> int:
    for i, linha in enumerate(linhas):
        l = linha.lower()
        if any(k in l for k in ["data lançamento", "data lancamento", "data", "date"]):
            if sep in linha:
                return i
    return 0

def _detectar_banco(df: pd.DataFrame) -> str:
    cols = " ".join(c.lower() for c in df.columns)
    if "histórico" in cols or "historico" in cols:
        return "inter_novo"
    if "data" in cols and len(df.columns) <= 4:
        return "nubank"
    return "inter_novo"


# ── Função principal ──────────────────────────────────────────
def parsear_extrato(
    conteudo: bytes | str,
    user_id: Optional[str] = None,
    nome_arquivo: str = "",
    usar_ia: bool = True,
) -> dict:
    erros: list[str] = []

    if isinstance(conteudo, bytes):
        for encoding in ["utf-8", "latin-1", "cp1252", "iso-8859-1"]:
            try:
                conteudo_str = conteudo.decode(encoding); break
            except UnicodeDecodeError:
                continue
        else:
            return {"banco": "desconhecido", "total": 0, "transacoes": [], "erros": ["Encoding não reconhecido"]}
    else:
        conteudo_str = conteudo

    conteudo_str = conteudo_str.lstrip("\ufeff")
    separador = ";" if conteudo_str.count(";") > conteudo_str.count(",") else ","

    try:
        linhas = conteudo_str.strip().split('\n')
        skip   = _encontrar_header(linhas, separador)

        df = pd.read_csv(
            io.StringIO(conteudo_str),
            sep=separador, skiprows=skip, dtype=str, on_bad_lines="skip",
        )
        df = df.dropna(how="all")
        df.columns = [str(c).strip() for c in df.columns]
        df = df[[c for c in df.columns if not c.startswith("Unnamed")]]

        banco  = _detectar_banco(df)
        parser = {"inter_novo": _parse_inter_novo, "nubank": _parse_nubank}.get(banco, _parse_inter_novo)
        transacoes = parser(df)

        # ── Categorização por IA ──────────────────────────
        if usar_ia and transacoes and GROQ_API_KEY:
            # Envia em lotes de 30 para não estourar o contexto
            LOTE = 30
            for i in range(0, len(transacoes), LOTE):
                lote = transacoes[i:i+LOTE]
                payload = [
                    {"id": t["_idx"], "descricao": t["descricao"],
                     "historico": t["historico"], "tipo": t["tipo"]}
                    for t in lote
                ]
                resultado_ia = categorizar_lote_ia(payload)
                for t in lote:
                    cat = resultado_ia.get(t["_idx"])
                    if cat and cat in CATEGORIAS_VALIDAS:
                        t["categoria"] = cat
                    else:
                        # Fallback por palavras-chave
                        t["categoria"] = categorizar_fallback(t["descricao"], t["historico"])
        else:
            # Só palavras-chave
            for t in transacoes:
                t["categoria"] = categorizar_fallback(t["descricao"], t["historico"])

        # Remove campos internos antes de salvar
        for t in transacoes:
            t.pop("_idx", None)
            t.pop("historico", None)
            if user_id:
                t["user_id"] = user_id

        entradas = sum(1 for t in transacoes if t["tipo"] == "entrada")
        saidas   = sum(1 for t in transacoes if t["tipo"] == "saida")

        return {
            "banco":      banco,
            "total":      len(transacoes),
            "entradas":   entradas,
            "saidas":     saidas,
            "transacoes": transacoes,
            "erros":      erros,
        }

    except Exception as e:
        return {"banco": "desconhecido", "total": 0, "transacoes": [], "erros": [str(e)]}