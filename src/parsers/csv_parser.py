"""
csv_parser.py — Parser de extratos bancários brasileiros
Suporta: Inter, Nubank, Banco do Brasil, Itaú, Bradesco, Caixa

Uso:
    from parsers.csv_parser import parsear_extrato
    transacoes = parsear_extrato("extrato.csv", user_id="uuid-do-usuario")
"""

import pandas as pd
import io
from datetime import datetime
from typing import Optional

# ── Categorização automática ─────────────────────────────────
CATEGORIAS: dict[str, list[str]] = {
    "moradia":     ["aluguel", "condominio", "iptu", "luz", "energia", "agua", "gas", "internet",
                    "telefone", "seguro resid", "serasa", "mobili"],
    "alimentacao": ["supermercado", "mercado", "padaria", "acougue", "hortifruti", "ifood",
                    "rappi", "uber eats", "restaurante", "lanchonete", "pizz", "hamburguer",
                    "sushi", "delivery", "pao de acucar", "carrefour", "extra", "atacadao",
                    "assai", "perini", "hortifruti"],
    "transporte":  ["uber", "99pop", "cabify", "onibus", "metro", "trem", "combustivel",
                    "posto", "gasolina", "etanol", "estacionamento", "pedagio", "ipva",
                    "detran", "auto escola", "mecanica", "borracharia", "lavagem"],
    "saude":       ["farmacia", "drogaria", "hospital", "clinica", "laboratorio", "dentist",
                    "medico", "consulta", "exame", "plano de saude", "unimed", "amil",
                    "sulamerica", "academia", "gym", "smartfit", "bio ritmo"],
    "educacao":    ["escola", "faculdade", "universidade", "curso", "udemy", "alura",
                    "coursera", "livro", "livraria", "amazon kindle", "duolingo", "ingles",
                    "idioma", "colegio", "mensalidade"],
    "lazer":       ["netflix", "spotify", "amazon prime", "disney", "hbo", "globoplay",
                    "youtube", "cinema", "teatro", "show", "ingresso", "bar", "balada",
                    "viagem", "hotel", "airbnb", "booking", "passagem", "decathlon",
                    "centauro", "steam", "playstation", "xbox"],
    "vestuario":   ["roupa", "calcado", "sapato", "tenis", "renner", "c&a", "riachuelo",
                    "hering", "zara", "farm", "arezzo", "reserva", "shopping"],
    "servicos":    ["celular", "tim", "vivo", "claro", "oi", "net", "sky", "barbeiro",
                    "cabelereiro", "manicure", "lavanderia", "assinatura", "mensalidade app"],
    "investimento":["tesouro", "cdb", "lci", "lca", "fundo", "acao", "fii", "cripto",
                    "bitcoin", "xp", "rico", "nuinvest", "clear", "btg", "itau invest"],
    "receita":     ["salario", "pagamento", "transferencia recebida", "pix recebido",
                    "credito", "reembolso", "rendimento", "dividendo", "freelance",
                    "deposito", "bonus"],
}

def categorizar(descricao: str) -> str:
    desc = descricao.lower()
    for categoria, palavras in CATEGORIAS.items():
        if any(p in desc for p in palavras):
            return categoria
    return "outros"

def inferir_tipo(valor: float, descricao: str, categoria: str) -> str:
    if categoria == "receita":
        return "entrada"
    if valor > 0:
        return "entrada"
    return "saida"

# ── Detectores de formato ────────────────────────────────────

def _detectar_banco(df: pd.DataFrame) -> str:
    cols = [c.lower().strip() for c in df.columns]
    cols_str = " ".join(cols)

    if "data lançamento" in cols_str or "data lancamento" in cols_str:
        return "inter"
    if "docto." in cols_str or "histórico" in cols_str:
        return "bb"
    if "data" in cols_str and "descrição" in cols_str and len(df.columns) <= 4:
        return "nubank"
    if "lançamentos" in cols_str or "lancamentos" in cols_str:
        return "itau"
    if "data" in cols_str and "histórico" in cols_str:
        return "bradesco"
    return "generico"

# ── Parsers por banco ────────────────────────────────────────

def _parse_inter(df: pd.DataFrame) -> list[dict]:
    """
    Formato Inter:
    Data Lançamento | Descrição | Tipo | Valor
    05/01/2024      | Supermercado | Débito | 234,50
    """
    transacoes = []
    col_data  = next((c for c in df.columns if "data" in c.lower()), None)
    col_desc  = next((c for c in df.columns if "descri" in c.lower()), None)
    col_tipo  = next((c for c in df.columns if "tipo" in c.lower()), None)
    col_valor = next((c for c in df.columns if "valor" in c.lower()), None)

    if not all([col_data, col_desc, col_valor]):
        raise ValueError("Formato Inter não reconhecido — colunas não encontradas")

    for _, row in df.iterrows():
        try:
            data_str = str(row[col_data]).strip()
            # Tenta dd/mm/yyyy e yyyy-mm-dd
            for fmt in ("%d/%m/%Y", "%Y-%m-%d", "%d/%m/%y"):
                try:
                    data = datetime.strptime(data_str, fmt)
                    break
                except ValueError:
                    continue
            else:
                continue

            valor_str = str(row[col_valor]).replace(".", "").replace(",", ".").strip()
            valor = abs(float(valor_str))
            if valor == 0:
                continue

            descricao = str(row[col_desc]).strip()
            categoria = categorizar(descricao)

            # Inter indica débito/crédito na coluna Tipo
            if col_tipo:
                tipo_raw = str(row[col_tipo]).lower()
                tipo = "entrada" if "crédito" in tipo_raw or "credito" in tipo_raw else "saida"
            else:
                tipo = inferir_tipo(valor, descricao, categoria)

            transacoes.append({
                "data":      data.isoformat(),
                "descricao": descricao,
                "categoria": categoria,
                "valor":     valor,
                "tipo":      tipo,
            })
        except Exception:
            continue

    return transacoes


def _parse_nubank(df: pd.DataFrame) -> list[dict]:
    """
    Formato Nubank:
    Data       | Descrição              | Valor
    2024-01-05 | Supermercado           | -234.50
    2024-01-06 | Pagamento recebido     | 5000.00
    """
    transacoes = []
    col_data  = next((c for c in df.columns if "data" in c.lower()), None)
    col_desc  = next((c for c in df.columns if "descri" in c.lower() or "title" in c.lower()), None)
    col_valor = next((c for c in df.columns if "valor" in c.lower() or "amount" in c.lower()), None)

    if not all([col_data, col_desc, col_valor]):
        raise ValueError("Formato Nubank não reconhecido")

    for _, row in df.iterrows():
        try:
            data_str  = str(row[col_data]).strip()
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
                "descricao": descricao,
                "categoria": categoria,
                "valor":     valor,
                "tipo":      tipo,
            })
        except Exception:
            continue

    return transacoes


def _parse_bb(df: pd.DataFrame) -> list[dict]:
    """
    Formato Banco do Brasil:
    Data       | Histórico     | Docto. | Crédito   | Débito    | Saldo
    05/01/2024 | Supermercado  |        |           | 234,50    | 4.765,50
    """
    transacoes = []
    col_data   = next((c for c in df.columns if "data" in c.lower()), None)
    col_desc   = next((c for c in df.columns if "histórico" in c.lower() or "historico" in c.lower()), None)
    col_cred   = next((c for c in df.columns if "crédito" in c.lower() or "credito" in c.lower()), None)
    col_deb    = next((c for c in df.columns if "débito" in c.lower() or "debito" in c.lower()), None)

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

            # BB tem colunas separadas para crédito e débito
            valor = 0.0
            tipo  = "saida"

            if col_cred and str(row[col_cred]).strip() not in ["", "nan", "0"]:
                v = str(row[col_cred]).replace(".", "").replace(",", ".").strip()
                try:
                    valor = abs(float(v))
                    tipo  = "entrada"
                except ValueError:
                    pass

            if col_deb and str(row[col_deb]).strip() not in ["", "nan", "0"]:
                v = str(row[col_deb]).replace(".", "").replace(",", ".").strip()
                try:
                    valor = abs(float(v))
                    tipo  = "saida"
                except ValueError:
                    pass

            if valor == 0:
                continue

            transacoes.append({
                "data":      data.isoformat(),
                "descricao": descricao,
                "categoria": categoria,
                "valor":     valor,
                "tipo":      tipo,
            })
        except Exception:
            continue

    return transacoes


def _parse_generico(df: pd.DataFrame) -> list[dict]:
    """Fallback para bancos não mapeados — tenta encontrar as colunas por heurística."""
    transacoes = []
    col_data  = next((c for c in df.columns if "data" in c.lower()), None)
    col_desc  = next((c for c in df.columns if any(k in c.lower() for k in ["descri", "histor", "lancam", "title"])), None)
    col_valor = next((c for c in df.columns if any(k in c.lower() for k in ["valor", "amount", "quantia"])), None)

    if not all([col_data, col_desc, col_valor]):
        raise ValueError("Não foi possível detectar o formato do CSV. Verifique se o arquivo está correto.")

    for _, row in df.iterrows():
        try:
            data_str = str(row[col_data]).strip()
            for fmt in ("%d/%m/%Y", "%Y-%m-%d", "%d/%m/%y", "%d-%m-%Y"):
                try:
                    data = datetime.strptime(data_str, fmt)
                    break
                except ValueError:
                    continue
            else:
                continue

            valor_str = str(row[col_valor]).replace(".", "").replace(",", ".").strip()
            valor_raw = float(valor_str)
            valor     = abs(valor_raw)
            if valor == 0:
                continue

            descricao = str(row[col_desc]).strip()
            categoria = categorizar(descricao)
            tipo      = inferir_tipo(valor_raw, descricao, categoria)

            transacoes.append({
                "data":      data.isoformat(),
                "descricao": descricao,
                "categoria": categoria,
                "valor":     valor,
                "tipo":      tipo,
            })
        except Exception:
            continue

    return transacoes

# ── Função principal ─────────────────────────────────────────

def parsear_extrato(
    conteudo: bytes | str,
    user_id: Optional[str] = None,
    nome_arquivo: str = "",
) -> dict:
    """
    Parseia um extrato bancário em CSV e retorna transações normalizadas.

    Args:
        conteudo:      Bytes ou string do arquivo CSV
        user_id:       UUID do usuário (para associar as transações)
        nome_arquivo:  Nome do arquivo (ajuda na detecção do banco)

    Returns:
        {
            "banco":       str,
            "total":       int,
            "transacoes":  list[dict],
            "erros":       list[str],
        }
    """
    erros: list[str] = []

    # Tenta diferentes encodings
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

    # Remove BOM se presente
    conteudo_str = conteudo_str.lstrip("\ufeff")

    # Detecta separador
    separador = ";" if conteudo_str.count(";") > conteudo_str.count(",") else ","

    try:
        # Tenta pular linhas de cabeçalho extras (alguns bancos têm)
        for skip in [0, 1, 2, 3, 4]:
            try:
                df = pd.read_csv(
                    io.StringIO(conteudo_str),
                    sep=separador,
                    skiprows=skip,
                    dtype=str,
                    on_bad_lines="skip",
                )
                # Valida se tem colunas úteis
                if len(df.columns) >= 2 and len(df) > 0:
                    break
            except Exception:
                continue
        else:
            return {"banco": "desconhecido", "total": 0, "transacoes": [], "erros": ["Não foi possível ler o CSV"]}

        # Remove linhas completamente vazias
        df = df.dropna(how="all")
        df.columns = [str(c).strip() for c in df.columns]

        banco = _detectar_banco(df)

        # Parsers por banco
        PARSERS = {
            "inter":   _parse_inter,
            "nubank":  _parse_nubank,
            "bb":      _parse_bb,
            "generico": _parse_generico,
        }

        parser = PARSERS.get(banco, _parse_generico)
        transacoes = parser(df)

        # Adiciona user_id se fornecido
        if user_id:
            for t in transacoes:
                t["user_id"] = user_id

        # Resumo
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


if __name__ == "__main__":
    # Teste com CSV de exemplo do Inter
    csv_exemplo = """Data Lançamento;Descrição;Tipo;Valor
05/01/2024;Supermercado Extra;Débito;450,00
06/01/2024;Salário Empresa;Crédito;5000,00
07/01/2024;Uber *Trip;Débito;23,90
08/01/2024;Netflix;Débito;55,90
10/01/2024;Farmácia Drogasil;Débito;87,50
15/01/2024;iFood Restaurante;Débito;45,00
20/01/2024;Aluguel;Débito;1400,00
25/01/2024;Freela Dev;Crédito;800,00
"""
    resultado = parsear_extrato(csv_exemplo.encode())
    print(f"Banco detectado: {resultado['banco']}")
    print(f"Total: {resultado['total']} transações")
    print(f"Entradas: {resultado['entradas']} | Saídas: {resultado['saidas']}")
    print("\nPrimeiras 3 transações:")
    for t in resultado["transacoes"][:3]:
        print(f"  {t['data']} | {t['descricao'][:30]} | {t['tipo']} | R${t['valor']}")