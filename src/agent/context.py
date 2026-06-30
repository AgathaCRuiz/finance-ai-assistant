"""
context.py — Monta o contexto do cliente para o LLM
Busca dados reais do Supabase baseado no user_id autenticado
"""
from datetime import datetime, timedelta
from collections import defaultdict


def montar_contexto(user_id: str, supabase) -> str:
    """
    Busca todos os dados do usuário no Supabase e monta
    um contexto rico para o LLM responder com precisão.
    """
    try:
        # ── Perfil ─────────────────────────────────────────
        perfil_res = supabase.table("profiles").select("*").eq("id", user_id).single().execute()
        perfil = perfil_res.data or {}

        nome               = perfil.get("nome", "Usuário")
        idade              = perfil.get("idade") or "não informada"
        perfil_inv         = perfil.get("perfil_investidor", "moderado")
        objetivo           = perfil.get("objetivo_principal") or "não informado"
        renda              = perfil.get("renda_mensal") or 0
        patrimonio         = perfil.get("patrimonio_total") or 0
        reserva_atual      = perfil.get("reserva_emergencia") or 0
        reserva_necessaria = perfil.get("reserva_necessaria") or 15000

        # ── Transações últimos 3 meses ──────────────────────
        inicio = (datetime.now() - timedelta(days=90)).isoformat()
        trans_res = supabase.table("transacoes") \
            .select("data,descricao,categoria,valor,tipo") \
            .eq("user_id", user_id) \
            .gte("data", inicio) \
            .order("data", desc=True) \
            .limit(50) \
            .execute()
        transacoes = trans_res.data or []

        total_receita = sum(t["valor"] for t in transacoes if t["tipo"] == "entrada")
        total_gastos  = sum(t["valor"] for t in transacoes if t["tipo"] == "saida")
        saldo         = total_receita - total_gastos
        taxa_poupanca = round((saldo / total_receita) * 100, 1) if total_receita else 0

        # Gastos por categoria
        gastos_cat: dict[str, float] = defaultdict(float)
        for t in transacoes:
            if t["tipo"] == "saida":
                gastos_cat[t.get("categoria", "outros")] += t["valor"]

        gastos_cat_str = "\n".join(
            f"  - {cat}: R$ {val:.2f} ({round(val/total_gastos*100, 1)}% dos gastos)"
            for cat, val in sorted(gastos_cat.items(), key=lambda x: -x[1])
        ) if gastos_cat else "  Nenhuma transação registrada ainda."

        # Últimas 10 transações
        ultimas_str = "\n".join(
            f"  - {t['data'][:10]} | {t['tipo']:7} | {t.get('categoria','outros'):12} | "
            f"R$ {t['valor']:.2f} | {t.get('descricao','')[:40]}"
            for t in transacoes[:10]
        ) if transacoes else "  Nenhuma transação registrada ainda."

        # ── Metas ──────────────────────────────────────────
        metas_res = supabase.table("metas").select("*").eq("user_id", user_id).execute()
        metas = metas_res.data or []

        metas_str = "\n".join(
            f"  - {m['titulo']}: R$ {m['valor_atual']:.2f} / R$ {m['valor_necessario']:.2f} "
            f"({round(m['valor_atual']/m['valor_necessario']*100, 1) if m['valor_necessario'] else 0}%) "
            f"| Prazo: {m.get('prazo', 'sem prazo')}"
            for m in metas
        ) if metas else "  Nenhuma meta cadastrada ainda."

        # ── Monta contexto ──────────────────────────────────
        pct_reserva = round((reserva_atual / reserva_necessaria) * 100, 1) if reserva_necessaria else 0
        meses_reserva = round(reserva_atual / (total_gastos / 3), 1) if total_gastos else 0

        return f"""
════════ DADOS DO CLIENTE ════════
Nome: {nome}
Idade: {idade} anos
Perfil de investidor: {perfil_inv}
Objetivo principal: {objetivo}

════════ SITUAÇÃO FINANCEIRA ════════
Renda mensal declarada: R$ {renda:,.2f}
Patrimônio total: R$ {patrimonio:,.2f}
Reserva de emergência: R$ {reserva_atual:,.2f} de R$ {reserva_necessaria:,.2f} ({pct_reserva}%)
Meses de despesa cobertos pela reserva: {meses_reserva} meses

════════ ÚLTIMOS 3 MESES (transações reais) ════════
Receita total: R$ {total_receita:,.2f}
Gastos totais: R$ {total_gastos:,.2f}
Saldo: R$ {saldo:,.2f}
Taxa de poupança: {taxa_poupanca}%

Gastos por categoria:
{gastos_cat_str}

Últimas transações:
{ultimas_str}

════════ METAS FINANCEIRAS ════════
{metas_str}
""".strip()

    except Exception as e:
        return f"Erro ao carregar dados do cliente: {str(e)}"