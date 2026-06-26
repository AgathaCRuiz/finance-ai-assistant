"""
csv_parser.py — Parser de extratos bancários brasileiros
Suporta: Inter (novo formato), Nubank, Banco do Brasil, genérico
"""

import pandas as pd
import io
from datetime import datetime
from typing import Optional

# ── Categorização automática ─────────────────────────────────
CATEGORIAS: dict[str, list[str]] = {
    "moradia":     ["aluguel", "condominio", "iptu", "luz", "energia", "agua", "gas",
                    "internet", "telefone", "seguro resid", "mobili"],
    "alimentacao": ["supermercado", "mercado", "padaria", "acougue", "hortifruti",
                    "ifood", "rappi", "uber eats", "restaurante", "lanchonete",
                    "pizz", "hamburguer", "sushi", "delivery", "panificadora",
                    "confeit", "bomloja", "cantina"],
    "transporte":  ["uber", "99pop", "cabify", "onibus", "metro", "combustivel",
                    "posto", "gasolina", "etanol", "estacionamento", "pedagio",
                    "ipva", "mecanica", "borracharia"],
    "saude":       ["farmacia", "drogaria", "hospital", "clinica", "laboratorio",
                    "dentist", "medico", "consulta", "exame", "plano de saude",
                    "unimed", "amil", "sulamerica", "academia", "smartfit"],
    "educacao":    ["escola", "faculdade", "universidade", "curso", "udemy",
                    "alura", "livro", "livraria", "xerox", "papelaria"],
    "lazer":       ["netflix", "spotify", "amazon prime", "disney", "hbo",
                    "globoplay", "cinema", "teatro", "show", "ingresso", "bar"],
    "vestuario":   ["roupa", "calcado", "sapato", "tenis", "renner", "c&a",
                    "riachuelo", "hering", "zara", "farm", "arezzo"],
    "investimento":["tesouro", "cdb", "lci", "lca", "fundo", "acao", "fii",
                    "cripto", "bitcoin", "rendimento", "evento b3", "prov",
                    "juros s/capital", "dividendo"],
    "receita":     ["salario", "pagamento recebido", "pix recebido", "credito",
                    "reembolso", "freelance", "deposito", "bonus",
                    "transferencia recebida"],
    "fatura":      ["pagamento fatura", "fatura cartao", "fatura"],
}

def categorizar(descricao: str, historico: str = "") -> str:
    texto = (descricao + " " + historico).lower()
    for categoria, palavras in CATEGORIAS.items():
        if any(p in texto for p in palavras):
            return categoria
    return "outros"


# ── Parser Inter novo formato ─────────────────────────────────
def _parse_inter_novo(df: pd.DataFrame) -> list[dict]:
    """
    Formato Inter atual:
    Data Lançamento | Histórico | Descrição | Valor | Saldo
    23/06/2026      | Pix recebido | Nome    | 20,00 | 375,17
    16/06/2026      | Compra no débito | Loja | -5,00 | 350,17
    """
    transacoes = []

    col_data  = next((c for c in df.columns if "data" in c.lower()), None)
    col_hist  = next((c for c in df.columns if "hist" in c.lower()), None)
    col_desc  = next((c for c in df.columns if "descri" in c.lower()), None)
    col_valor = next((c for c in df.columns if "valor" in c.lower()), None)

    if not all([col_data, col_valor]):
        raise ValueError("Colunas obrigatórias não encontradas")

    for _, row in df.iterrows():
        try:
            data_str = str(row[col_data]).strip()
            for fmt in ("%d/%m/%Y", "%Y-%m-%d", "%d/%m/%y"):
                try:
                    data = datetime.strptime(data_str, fmt)
                    break
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

            # Se descrição for vazia, usa histórico
            if not descricao or descricao == "nan":
                descricao = historico

            categoria = categorizar(descricao, historico)

            # Determina tipo pelo sinal do valor e pelo histórico
            if valor_raw > 0 or any(p in historico.lower() for p in
                ["pix recebido", "crédito", "credito", "recebido", "rendimento",
                 "evento b3", "juros s/capital"]):
                tipo = "entrada"
            else:
                tipo = "saida"

            transacoes.append({
                "data":      data.isoformat(),
                "descricao": descricao[:100],
                "categoria": categoria,
                "valor":     round(valor, 2),
                "tipo":      tipo,
            })
        except Exception:
            continue

    return transacoes


# ── Parser Nubank ─────────────────────────────────────────────
def _parse_nubank(df: pd.DataFrame) -> list[dict]:
    transacoes = []
    col_data  = next((c for c in df.columns if "data" in c.lower()), None)
    col_desc  = next((c for c in df.columns if "descri" in c.lower() or "title" in c.lower()), None)
    col_valor = next((c for c in df.columns if "valor" in c.lower() or "amount" in c.lower()), None)

    if not all([col_data, col_desc, col_valor]):
        raise ValueError("Formato Nubank não reconhecido")

    for _, row in df.iterrows():
        try:
            data_str = str(row[col_data]).strip()
            for fmt in ("%Y-%m-%d", "%d/%m/%Y", "%d/%m/%y"):
                try:
                    data = datetime.strptime(data_str, fmt)
                    break
                except ValueError:
                    continue
            else:
                continue

            valor_str = str(row[col_valor]).replace(",", ".").strip()
            valor_raw = float(valor_str)
            valor     = abs(valor_raw)
            if valor == 0:
                continue

            descricao = str(row[col_desc]).strip()
            categoria = categorizar(descricao)
            tipo      = "entrada" if valor_raw > 0 else "saida"

            transacoes.append({
                "data":      data.isoformat(),
                "descricao": descricao[:100],
                "categoria": categoria,
                "valor":     round(valor, 2),
                "tipo":      tipo,
            })
        except Exception:
            continue

    return transacoes


# ── Parser BB ─────────────────────────────────────────────────
def _parse_bb(df: pd.DataFrame) -> list[dict]:
    transacoes = []
    col_data = next((c for c in df.columns if "data" in c.lower()), None)
    col_desc = next((c for c in df.columns if "hist" in c.lower()), None)
    col_cred = next((c for c in df.columns if "créd" in c.lower() or "cred" in c.lower()), None)
    col_deb  = next((c for c in df.columns if "déb" in c.lower() or "deb" in c.lower()), None)

    if not all([col_data, col_desc]):
        raise ValueError("Formato BB não reconhecido")

    for _, row in df.iterrows():
        try:
            data_str = str(row[col_data]).strip()
            for fmt in ("%d/%m/%Y", "%Y-%m-%d"):
                try:
                    data = datetime.strptime(data_str, fmt)
                    break
                except ValueError:
                    continue
            else:
                continue

            descricao = str(row[col_desc]).strip()
            categoria = categorizar(descricao)
            valor = 0.0
            tipo  = "saida"

            if col_cred and str(row[col_cred]).strip() not in ["", "nan", "0"]:
                v = str(row[col_cred]).replace(".", "").replace(",", ".").strip()
                try:
                    valor = abs(float(v)); tipo = "entrada"
                except ValueError:
                    pass

            if col_deb and str(row[col_deb]).strip() not in ["", "nan", "0"]:
                v = str(row[col_deb]).replace(".", "").replace(",", ".").strip()
                try:
                    valor = abs(float(v)); tipo = "saida"
                except ValueError:
                    pass

            if valor == 0:
                continue

            transacoes.append({
                "data":      data.isoformat(),
                "descricao": descricao[:100],
                "categoria": categoria,
                "valor":     round(valor, 2),
                "tipo":      tipo,
            })
        except Exception:
            continue

    return transacoes


# ── Detecção de banco e linha de header ───────────────────────
def _encontrar_header(linhas: list[str], sep: str) -> int:
    """Encontra a linha real do header ignorando metadados do banco."""
    for i, linha in enumerate(linhas):
        l = linha.lower()
        if any(k in l for k in ["data lançamento", "data lancamento", "data", "date"]):
            if sep in linha:
                return i
    return 0

def _detectar_banco(df: pd.DataFrame) -> str:
    cols = " ".join(c.lower() for c in df.columns)
    if "histórico" in cols or "historico" in cols:
        if "descrição" in cols or "descricao" in cols:
            return "inter_novo"
        return "bb"
    if "data" in cols and len(df.columns) <= 4:
        return "nubank"
    return "generico"


# ── Função principal ──────────────────────────────────────────
def parsear_extrato(
    conteudo: bytes | str,
    user_id: Optional[str] = None,
    nome_arquivo: str = "",
) -> dict:
    erros: list[str] = []

    if isinstance(conteudo, bytes):
        for encoding in ["utf-8", "latin-1", "cp1252", "iso-8859-1"]:
            try:
                conteudo_str = conteudo.decode(encoding)
                break
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

        # Encontra a linha do header real
        skip = _encontrar_header(linhas, separador)

        df = pd.read_csv(
            io.StringIO(conteudo_str),
            sep=separador,
            skiprows=skip,
            dtype=str,
            on_bad_lines="skip",
        )
        df = df.dropna(how="all")
        df.columns = [str(c).strip() for c in df.columns]

        # Remove colunas sem nome
        df = df[[c for c in df.columns if not c.startswith("Unnamed")]]

        banco = _detectar_banco(df)

        PARSERS = {
            "inter_novo": _parse_inter_novo,
            "nubank":     _parse_nubank,
            "bb":         _parse_bb,
        }

        parser = PARSERS.get(banco, _parse_inter_novo)  # fallback para inter_novo
        transacoes = parser(df)

        if not transacoes:
            # Tenta o parser genérico como fallback
            try:
                transacoes = _parse_inter_novo(df)
            except Exception as e:
                erros.append(str(e))

        if user_id:
            for t in transacoes:
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
        return {
            "banco":      "desconhecido",
            "total":      0,
            "transacoes": [],
            "erros":      [str(e)],
        }