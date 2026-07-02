"""
chat_service.py — Serviço de chat com contexto real do Supabase
O contexto agora é montado por requisição com dados do usuário autenticado
"""
from agent.llm import perguntar
from agent.context import montar_contexto


def responder_com_historico(
    mensagem: str,
    historico: list[dict],
    user_id: str,
    supabase,
) -> str:
    """
    Responde usando dados reais do usuário + histórico da conversa.

    Args:
        mensagem:  Última mensagem do usuário.
        historico: Histórico da sessão atual.
        user_id:   UUID do usuário autenticado.
        supabase:  Cliente Supabase para buscar dados.
    """
    contexto = montar_contexto(user_id, supabase)
    return perguntar(mensagem, contexto, historico)