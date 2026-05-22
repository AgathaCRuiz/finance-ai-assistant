"""
alphavantage.py — Alpha Vantage API
Busca cotações de ações internacionais (AAPL, MSFT, etc)
Free tier: 25 req/dia
Docs: https://www.alphavantage.co/documentation
Chave gratuita: https://www.alphavantage.co/support/#api-key
"""

import requests
from typing import Optional
import os

AV_BASE    = "https://www.alphavantage.co/query"
AV_API_KEY = os.getenv("ALPHA_VANTAGE_API_KEY", "demo")


def get_cotacao(symbol: str) -> Optional[dict]:
    """Retorna cotação atual de uma ação (ex: AAPL, MSFT, AMZN)."""
    try:
        r = requests.get(AV_BASE, params={
            "function": "GLOBAL_QUOTE",
            "symbol":   symbol,
            "apikey":   AV_API_KEY,
        }, timeout=10)
        r.raise_for_status()
        data = r.json().get("Global Quote", {})
        if not data:
            return None
        return {
            "symbol":       data.get("01. symbol"),
            "preco":        float(data.get("05. price", 0)),
            "variacao":     float(data.get("10. change percent", "0").replace("%", "")),
            "volume":       int(data.get("06. volume", 0)),
            "fechamento":   data.get("08. previous close"),
        }
    except Exception as e:
        print(f"⚠️  Alpha Vantage erro ({symbol}): {e}")
        return None


def get_fx_brl(from_currency: str = "USD") -> Optional[float]:
    """Retorna taxa de câmbio para BRL."""
    try:
        r = requests.get(AV_BASE, params={
            "function":      "CURRENCY_EXCHANGE_RATE",
            "from_currency": from_currency,
            "to_currency":   "BRL",
            "apikey":        AV_API_KEY,
        }, timeout=10)
        data = r.json().get("Realtime Currency Exchange Rate", {})
        if data:
            return float(data.get("5. Exchange Rate", 0))
    except Exception as e:
        print(f"⚠️  Alpha Vantage FX erro: {e}")
    return None


def get_portfolio_internacional(tickers: list[str]) -> dict[str, dict]:
    """Busca cotações de múltiplos tickers internacionais."""
    resultado = {}
    for ticker in tickers:
        cotacao = get_cotacao(ticker)
        if cotacao:
            resultado[ticker] = cotacao
    return resultado


if __name__ == "__main__":
    print("📊 Alpha Vantage:")
    for ticker in ["AAPL", "MSFT"]:
        c = get_cotacao(ticker)
        print(f"  {ticker}: {c}")