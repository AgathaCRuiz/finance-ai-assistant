import requests
from config.settings import GROQ_API_KEY, GROQ_API_URL, MODELO
from agent.prompt import SYSTEM_PROMPT

def perguntar(mensagem: str, contexto: str, historico: list[dict] = []) -> str:
    """
    Envia mensagem para a Groq mantendo o histórico da conversa.

    Args:
        mensagem:  Última mensagem do usuário.
        contexto:  Dados do cliente (perfil, transações, metas).
        historico: Lista de mensagens anteriores no formato
                   [{"role": "user"|"assistant", "content": "..."}]

    Returns:
        Texto da resposta do modelo.
    """

    # System prompt inclui o contexto do cliente — enviado uma única vez
    system_content = f"""{SYSTEM_PROMPT}

CONTEXTO DO CLIENTE:
{contexto}"""

    # Monta o array completo: system + histórico + nova mensagem
    messages = [
        {"role": "system", "content": system_content},
        *historico,
        {"role": "user", "content": mensagem},
    ]

    headers = {
        "Authorization": f"Bearer {GROQ_API_KEY}",
        "Content-Type": "application/json",
    }

    payload = {
        "model": MODELO,
        "messages": messages,
        "max_tokens": 1024,
        "temperature": 0.7,
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