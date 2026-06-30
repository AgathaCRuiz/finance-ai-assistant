import requests
from config.settings import GROQ_API_KEY, GROQ_API_URL, MODELO
from agent.prompt import SYSTEM_PROMPT


def perguntar(mensagem: str, contexto: str, historico: list[dict] | None = None) -> str:
    """
    Envia mensagem para a Groq com contexto real do usuário.

    Args:
        mensagem:  Última mensagem do usuário.
        contexto:  Dados reais do cliente (perfil, transações, metas).
        historico: Histórico da conversa no formato OpenAI.

    Returns:
        Texto da resposta do modelo.
    """
    if historico is None:
        historico = []

    system_content = f"""{SYSTEM_PROMPT}

{contexto}"""

    messages = [
        {"role": "system", "content": system_content},
        *historico[-16:],  # últimas 8 trocas para não estourar contexto
        {"role": "user", "content": mensagem},
    ]

    headers = {
        "Authorization": f"Bearer {GROQ_API_KEY}",
        "Content-Type": "application/json",
    }

    payload = {
        "model":       MODELO,
        "messages":    messages,
        "max_tokens":  1024,
        "temperature": 0.5,  # menos criativo, mais fiel aos dados
    }

    try:
        r = requests.post(GROQ_API_URL, headers=headers, json=payload, timeout=30)
        resposta = r.json()

        if "choices" in resposta:
            return resposta["choices"][0]["message"]["content"]
        else:
            return f"Erro na API: {resposta}"

    except requests.exceptions.Timeout:
        return "Desculpe, a requisição demorou demais. Tente novamente."
    except Exception as e:
        return f"Erro inesperado: {str(e)}"