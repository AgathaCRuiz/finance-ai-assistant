"""
hgbrasil.py — HG Brasil Finance API
Busca cotação do dólar, Bitcoin, Ibovespa e ações BR
Free tier: 30 req/dia sem chave
Docs: https://finance.hgbrasil.com/documentation
"""

import requests
from typing import Optional
import os

HG_BASE    = "https://api.hgbrasil.com/finance"
HG_API_KEY = os.getenv("HG_BRASIL_API_KEY", "")   # opcional no free tier


def _get(endpoint: str, params: dict = {}) -> Optional[dict]:
    try:
        if HG_API_KEY:
            params["key"] = HG_API_KEY
        r = requests.get(f"{HG_BASE}{endpoint}", params=params, timeout=10)
        r.raise_for_status()
        return r.json()
    except Exception as e:
        print(f"⚠️  HG Brasil erro: {e}")
        return None


def get_dolar() -> Optional[dict]:
    """Retorna cotação atual do dólar."""
    data = _get("", {"format": "1"})
    if data and "results" in data:
        usd = data["results"]["currencies"].get("USD", {})
        return {
            "nome":     "Dólar",
            "compra":   usd.get("buy"),
            "venda":    usd.get("sell"),
            "variacao": usd.get("variation"),
        }
    return None


def get_bitcoin() -> Optional[dict]:
    """Retorna cotação atual do Bitcoin em BRL."""
    data = _get("", {"format": "1"})
    if data and "results" in data:
        btc = data["results"]["currencies"].get("BTC", {})
        return {
            "nome":     "Bitcoin",
            "preco":    btc.get("buy"),
            "variacao": btc.get("variation"),
        }
    return None


def get_ibovespa() -> Optional[dict]:
    """Retorna Ibovespa atual."""
    data = _get("", {"format": "1"})
    if data and "results" in data:
        ibov = data["results"]["stocks"].get("IBOVESPA", {})
        return {
            "nome":         "Ibovespa",
            "pontos":       ibov.get("points"),
            "variacao":     ibov.get("variation"),
            "market_cap_brl": ibov.get("market_cap"),
        }
    return None


def get_acao(ticker: str) -> Optional[dict]:
    """Retorna cotação de uma ação BR (ex: PETR4, VALE3)."""
    data = _get(f"/stock_price", {"symbol": ticker, "format": "1"})
    if data and "results" in data:
        stock = data["results"].get(ticker.upper(), {})
        return {
            "ticker":   ticker.upper(),
            "nome":     stock.get("name"),
            "preco":    stock.get("price"),
            "variacao": stock.get("change_percent"),
            "volume":   stock.get("volume"),
        }
    return None


def get_resumo_mercado() -> dict:
    """Retorna dólar, Bitcoin e Ibovespa de uma vez."""
    data = _get("", {"format": "1"})
    if not data or "results" not in data:
        return {}

    r = data["results"]
    return {
        "dolar":    r.get("currencies", {}).get("USD", {}),
        "bitcoin":  r.get("currencies", {}).get("BTC", {}),
        "ibovespa": r.get("stocks", {}).get("IBOVESPA", {}),
        "euro":     r.get("currencies", {}).get("EUR", {}),
    }


if __name__ == "__main__":
    mercado = get_resumo_mercado()
    print("📈 HG Brasil:")
    for k, v in mercado.items():
        print(f"  {k}: {v}")