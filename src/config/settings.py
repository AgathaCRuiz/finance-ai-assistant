import os
from dotenv import load_dotenv

# Carrega variáveis do .env
load_dotenv()

# ── Configuração da IA ─────────────────────────
GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions"
GROQ_API_KEY = os.getenv("GROQ_API_KEY")
MODELO = os.getenv("MODELO", "llama-3.3-70b-versatile")

# ── APIs de dados ──────────────────────────────
ALPHA_VANTAGE_API_KEY = os.getenv("ALPHA_VANTAGE_API_KEY")
HG_BRASIL_API_KEY = os.getenv("HG_BRASIL_API_KEY")