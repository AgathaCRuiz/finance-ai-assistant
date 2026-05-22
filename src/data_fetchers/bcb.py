"""
bcb.py — Banco Central do Brasil
Busca SELIC, CDI e IPCA via API pública (sem autenticação)
Docs: https://dadosabertos.bcb.gov.br
"""

import requests
from datetime import datetime, timedelta
from typing import Optional

BCB_BASE = "https://api.bcb.gov.br/dados/serie/bcdata.sgs.{code}/dados/ultimos/{n}?formato=json"

SERIES = {
    "selic":  11,    # Taxa SELIC
    "cdi":    12,    # CDI acumulado
    "ipca":   433,   # IPCA mensal
    "poupanca": 195, # Poupança
}


def _fetch_serie(codigo: int, n: int = 1) -> Optional[list[dict]]:
    try:
        url = BCB_BASE.format(code=codigo, n=n)
        r = requests.get(url, timeout=10)
        r.raise_for_status()
        return r.json()
    except Exception as e:
        print(f"⚠️  BCB erro (série {codigo}): {e}")
        return None


def get_selic() -> Optional[float]:
    """Retorna taxa SELIC atual (% ao ano)."""
    data = _fetch_serie(SERIES["selic"])
    if data:
        return float(data[-1]["valor"].replace(",", "."))
    return None


def get_cdi() -> Optional[float]:
    """Retorna CDI acumulado (% ao ano)."""
    data = _fetch_serie(SERIES["cdi"])
    if data:
        return float(data[-1]["valor"].replace(",", "."))
    return None


def get_ipca() -> Optional[float]:
    """Retorna IPCA do último mês (%)."""
    data = _fetch_serie(SERIES["ipca"])
    if data:
        return float(data[-1]["valor"].replace(",", "."))
    return None


def get_ipca_12meses() -> Optional[float]:
    """Retorna IPCA acumulado dos últimos 12 meses."""
    data = _fetch_serie(SERIES["ipca"], n=12)
    if data:
        total = sum(float(d["valor"].replace(",", ".")) for d in data)
        return round(total, 2)
    return None


def get_todos_indices() -> dict:
    """Retorna todos os índices de uma vez."""
    return {
        "selic":       get_selic(),
        "cdi":         get_cdi(),
        "ipca":        get_ipca(),
        "ipca_12m":    get_ipca_12meses(),
    }


if __name__ == "__main__":
    indices = get_todos_indices()
    print("📊 Índices BCB:")
    for k, v in indices.items():
        print(f"  {k}: {v}%")