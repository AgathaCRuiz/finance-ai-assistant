from agent.llm import perguntar
from agent.context import montar_contexto
from data.loader import carregar_dados

# Carrega os dados uma única vez ao iniciar (evita reler arquivos a cada request)
_perfil, _transacoes, _historico_csv, _produtos = carregar_dados()
_contexto = montar_contexto(_perfil, _transacoes, _historico_csv, _produtos)


def responder_com_historico(mensagem: str, historico: list[dict]) -> str:
    """
    Responde usando o contexto do cliente + histórico da conversa atual.

    Args:
        mensagem:  Última mensagem do usuário.
        historico: Lista de mensagens anteriores da sessão
                   [{"role": "user"|"assistant", "content": "..."}]
    """
    return perguntar(mensagem, _contexto, historico)


# Mantém compatibilidade com código legado que chama responder(msg)
def responder(mensagem: str) -> str:
    return responder_com_historico(mensagem, [])