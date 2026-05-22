"""
seed.py — Popula o banco com dados sintéticos + índices reais das APIs
Execute: python scripts/seed.py

Requer: pip install faker sqlalchemy requests
"""

import sys, os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "src"))

from faker import Faker
from faker.providers import person, address
from datetime import datetime, timedelta
from sqlalchemy.orm import Session
import random
import math

from database.models import (
    criar_tabelas, engine, Usuario, Transacao,
    Investimento, Meta, IndicesMercado
)
from data_fetchers.bcb import get_todos_indices
from data_fetchers.hgbrasil import get_resumo_mercado

fake = Faker("pt_BR")
random.seed(42)

# ── Configuração do usuário ──────────────────────────────────
USUARIO = {
    "nome":               "João Silva",
    "email":              "joao.silva@email.com",
    "idade":              32,
    "perfil_investidor":  "moderado",
    "objetivo_principal": "Construir reserva de emergência e iniciar carteira de investimentos",
    "renda_mensal":       5000.0,
    "patrimonio_total":   20000.0,
    "reserva_emergencia": 10000.0,
    "reserva_necessaria": 15000.0,
}

# ── Categorias de gastos com sazonalidade ───────────────────
CATEGORIAS_SAIDA = {
    "moradia":       {"base": 1400, "variacao": 0.02},
    "alimentacao":   {"base": 700,  "variacao": 0.12},
    "transporte":    {"base": 350,  "variacao": 0.08},
    "saude":         {"base": 180,  "variacao": 0.15},
    "lazer":         {"base": 220,  "variacao": 0.25},
    "educacao":      {"base": 150,  "variacao": 0.05},
    "vestuario":     {"base": 120,  "variacao": 0.40},
    "servicos":      {"base": 90,   "variacao": 0.10},
    "outros":        {"base": 80,   "variacao": 0.30},
}

DESCRICOES_POR_CATEGORIA = {
    "moradia":     ["Aluguel", "Condomínio", "IPTU", "Luz", "Água", "Internet", "Seguro residencial"],
    "alimentacao": ["Supermercado", "Feira", "iFood", "Restaurante", "Padaria", "Mercado bairro"],
    "transporte":  ["Combustível", "Uber", "Ônibus", "Estacionamento", "Manutenção carro", "IPVA"],
    "saude":       ["Farmácia", "Consulta médica", "Plano de saúde", "Academia", "Dentista"],
    "lazer":       ["Cinema", "Streaming", "Bares", "Viagem", "Shows", "Spotify", "Netflix"],
    "educacao":    ["Curso online", "Livros", "Udemy", "Inglês", "Pós-graduação"],
    "vestuario":   ["Roupas", "Calçados", "Acessórios", "Shopping"],
    "servicos":    ["Celular", "Barbeiro", "Lavanderia", "Assinatura"],
    "outros":      ["Presente", "Doação", "Imprevisto", "Miscellaneous"],
}

# ── Investimentos da carteira ────────────────────────────────
INVESTIMENTOS = [
    {"nome": "Tesouro Selic 2027",     "tipo": "tesouro_selic", "ticker": None,    "valor": 5000,  "rent": 10.65},
    {"nome": "CDB Nubank 110% CDI",    "tipo": "cdb",           "ticker": None,    "valor": 3000,  "rent": 11.72},
    {"nome": "PETR4",                  "tipo": "acao",           "ticker": "PETR4", "valor": 2000,  "rent": 12.0},
    {"nome": "MXRF11 FII",             "tipo": "fii",            "ticker": "MXRF11","valor": 1500,  "rent": 10.0},
    {"nome": "LCI Banco XP",           "tipo": "lci",            "ticker": None,    "valor": 2500,  "rent": 9.8},
]

METAS = [
    {"titulo": "Reserva de emergência", "necessario": 15000, "atual": 10000, "prazo": "2025-06"},
    {"titulo": "Viagem Europa",          "necessario": 12000, "atual": 2800,  "prazo": "2026-12"},
    {"titulo": "Aposentadoria",          "necessario": 500000,"atual": 8500,  "prazo": "2050-01"},
]


def gerar_valor_mes(config: dict, mes: int, ano: int) -> float:
    """Gera valor com variação sazonal realista."""
    base = config["base"]
    var  = config["variacao"]

    # Sazonalidade: dezembro mais caro, fevereiro mais barato
    sazonalidade = 1.0
    if mes == 12: sazonalidade = 1.35   # natal
    elif mes == 1: sazonalidade = 1.15  # ano novo
    elif mes == 7: sazonalidade = 1.10  # férias
    elif mes == 2: sazonalidade = 0.85  # pós-festas

    # Inflação acumulada (simula ~5% ao ano)
    meses_desde_inicio = (ano - 2024) * 12 + mes
    inflacao = 1 + (0.05 / 12) * meses_desde_inicio

    valor = base * sazonalidade * inflacao
    valor *= (1 + random.uniform(-var, var))
    return round(valor, 2)


def buscar_indices_reais() -> dict:
    print("🌐 Buscando índices do Banco Central...")
    bcb = get_todos_indices()
    print(f"   SELIC: {bcb.get('selic')}% | CDI: {bcb.get('cdi')}% | IPCA: {bcb.get('ipca')}%")

    print("🌐 Buscando dados HG Brasil...")
    hg = get_resumo_mercado()

    return {"bcb": bcb, "hg": hg}


def seed(limpar: bool = True):
    criar_tabelas()
    db = Session(engine)

    try:
        if limpar:
            print("🧹 Limpando banco...")
            db.query(IndicesMercado).delete()
            db.query(Transacao).delete()
            db.query(Investimento).delete()
            db.query(Meta).delete()
            db.query(Usuario).delete()
            db.commit()

        # ── Busca índices reais ──────────────────────────────
        indices = buscar_indices_reais()
        bcb = indices["bcb"]
        hg  = indices["hg"]

        # Salva índices no banco
        print("💾 Salvando índices de mercado...")
        indices_db = [
            IndicesMercado(nome="selic",    valor=bcb.get("selic") or 10.65,  fonte="bcb"),
            IndicesMercado(nome="cdi",      valor=bcb.get("cdi") or 10.62,    fonte="bcb"),
            IndicesMercado(nome="ipca",     valor=bcb.get("ipca") or 0.44,    fonte="bcb"),
            IndicesMercado(nome="ipca_12m", valor=bcb.get("ipca_12m") or 4.83, fonte="bcb"),
            IndicesMercado(nome="dolar",
                valor=hg.get("dolar", {}).get("buy") or 5.10,
                variacao=hg.get("dolar", {}).get("variation"),
                fonte="hgbrasil"),
            IndicesMercado(nome="ibovespa",
                valor=hg.get("ibovespa", {}).get("points") or 128000,
                variacao=hg.get("ibovespa", {}).get("variation"),
                fonte="hgbrasil"),
            IndicesMercado(nome="bitcoin",
                valor=hg.get("bitcoin", {}).get("buy") or 350000,
                variacao=hg.get("bitcoin", {}).get("variation"),
                fonte="hgbrasil"),
        ]
        db.add_all(indices_db)
        db.commit()

        # ── Cria usuário ─────────────────────────────────────
        selic = bcb.get("selic") or 10.65
        print("👤 Criando usuário...")
        usuario = Usuario(**USUARIO)
        db.add(usuario)
        db.flush()

        # ── Gera 12 meses de transações ──────────────────────
        print("💳 Gerando 12 meses de transações...")
        total_transacoes = 0
        hoje = datetime.now()

        for meses_atras in range(12, 0, -1):
            data_ref = hoje - timedelta(days=meses_atras * 30)
            mes  = data_ref.month
            ano  = data_ref.year

            # Salário (entrada)
            salario_base = USUARIO["renda_mensal"]
            # Simula pequeno reajuste anual
            salario = salario_base * (1 + 0.005 * (12 - meses_atras))
            db.add(Transacao(
                usuario_id=usuario.id,
                data=data_ref.replace(day=5),
                descricao="Salário",
                categoria="receita",
                valor=round(salario, 2),
                tipo="entrada",
            ))

            # Freelance ocasional (30% chance)
            if random.random() < 0.30:
                db.add(Transacao(
                    usuario_id=usuario.id,
                    data=data_ref.replace(day=random.randint(10, 25)),
                    descricao=random.choice(["Freela dev", "Consultoria", "Projeto extra"]),
                    categoria="receita_extra",
                    valor=round(random.uniform(300, 1500), 2),
                    tipo="entrada",
                ))

            # Gastos por categoria
            for cat, config in CATEGORIAS_SAIDA.items():
                n_transacoes = random.randint(1, 4) if cat != "moradia" else 1
                valor_total  = gerar_valor_mes(config, mes, ano)
                valor_por    = valor_total / n_transacoes

                for _ in range(n_transacoes):
                    dia = random.randint(1, 28)
                    db.add(Transacao(
                        usuario_id=usuario.id,
                        data=data_ref.replace(day=dia),
                        descricao=random.choice(DESCRICOES_POR_CATEGORIA[cat]),
                        categoria=cat,
                        valor=round(valor_por + random.uniform(-20, 20), 2),
                        tipo="saida",
                    ))
                    total_transacoes += 1

        db.commit()
        print(f"   ✅ {total_transacoes} transações criadas")

        # ── Cria investimentos ───────────────────────────────
        print("📈 Criando investimentos...")
        cdi = bcb.get("cdi") or 10.62

        for inv in INVESTIMENTOS:
            # Rentabilidade baseada no CDI real quando possível
            if inv["tipo"] == "tesouro_selic":
                rent = selic
            elif inv["tipo"] == "cdb":
                rent = cdi * 1.10  # 110% do CDI
            elif inv["tipo"] == "lci":
                rent = cdi * 0.93  # 93% do CDI isento IR
            else:
                rent = inv["rent"]

            meses_investido = random.randint(3, 18)
            valor_atual = inv["valor"] * (1 + rent / 100 / 12) ** meses_investido

            db.add(Investimento(
                usuario_id=usuario.id,
                nome=inv["nome"],
                tipo=inv["tipo"],
                ticker=inv["ticker"],
                valor_investido=inv["valor"],
                valor_atual=round(valor_atual, 2),
                rentabilidade=round(rent, 2),
                data_compra=hoje - timedelta(days=meses_investido * 30),
                fonte_dados="bcb" if not inv["ticker"] else "hgbrasil",
                atualizado_em=hoje,
            ))

        db.commit()
        print(f"   ✅ {len(INVESTIMENTOS)} investimentos criados")

        # ── Cria metas ───────────────────────────────────────
        print("🎯 Criando metas...")
        for m in METAS:
            db.add(Meta(
                usuario_id=usuario.id,
                titulo=m["titulo"],
                valor_necessario=m["necessario"],
                valor_atual=m["atual"],
                prazo=m["prazo"],
            ))
        db.commit()
        print(f"   ✅ {len(METAS)} metas criadas")

        print("\n✅ Seed concluído com sucesso!")
        print(f"   👤 Usuário: {USUARIO['nome']}")
        print(f"   💳 Transações: {total_transacoes}")
        print(f"   📈 Investimentos: {len(INVESTIMENTOS)}")
        print(f"   🎯 Metas: {len(METAS)}")
        print(f"   📊 Índices de mercado: {len(indices_db)}")

    except Exception as e:
        db.rollback()
        print(f"❌ Erro no seed: {e}")
        raise
    finally:
        db.close()


if __name__ == "__main__":
    seed(limpar=True)