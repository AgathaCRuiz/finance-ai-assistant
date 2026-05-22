"""
models.py — Modelos SQLAlchemy
Tabelas: usuarios, transacoes, investimentos, metas, sessoes_chat, mensagens_chat, indices_mercado
"""

from sqlalchemy import (
    create_engine, Column, Integer, String, Float,
    DateTime, ForeignKey, Text
)
from sqlalchemy.orm import declarative_base, relationship
from datetime import datetime
import os

Base = declarative_base()

DB_PATH = os.path.join(os.path.dirname(__file__), "..", "..", "data", "financas.db")
DB_URL  = f"sqlite:///{os.path.abspath(DB_PATH)}"
engine  = create_engine(DB_URL, connect_args={"check_same_thread": False})


class Usuario(Base):
    __tablename__ = "usuarios"
    id                 = Column(Integer, primary_key=True)
    nome               = Column(String(100), nullable=False)
    email              = Column(String(100), unique=True)
    idade              = Column(Integer)
    perfil_investidor  = Column(String(20))
    objetivo_principal = Column(String(200))
    renda_mensal       = Column(Float)
    patrimonio_total   = Column(Float)
    reserva_emergencia = Column(Float)
    reserva_necessaria = Column(Float)
    criado_em          = Column(DateTime, default=datetime.utcnow)

    transacoes    = relationship("Transacao",    back_populates="usuario", cascade="all, delete")
    investimentos = relationship("Investimento", back_populates="usuario", cascade="all, delete")
    metas         = relationship("Meta",         back_populates="usuario", cascade="all, delete")
    sessoes       = relationship("SessaoChat",   back_populates="usuario", cascade="all, delete")


class Transacao(Base):
    __tablename__ = "transacoes"
    id         = Column(Integer, primary_key=True)
    usuario_id = Column(Integer, ForeignKey("usuarios.id"), nullable=False)
    data       = Column(DateTime, nullable=False)
    descricao  = Column(String(200))
    categoria  = Column(String(50))
    valor      = Column(Float, nullable=False)
    tipo       = Column(String(10))   # entrada | saida
    criado_em  = Column(DateTime, default=datetime.utcnow)
    usuario    = relationship("Usuario", back_populates="transacoes")


class Investimento(Base):
    __tablename__ = "investimentos"
    id              = Column(Integer, primary_key=True)
    usuario_id      = Column(Integer, ForeignKey("usuarios.id"), nullable=False)
    nome            = Column(String(100))
    tipo            = Column(String(50))
    ticker          = Column(String(10), nullable=True)
    valor_investido = Column(Float)
    valor_atual     = Column(Float)
    rentabilidade   = Column(Float)
    data_compra     = Column(DateTime)
    preco_atual     = Column(Float, nullable=True)
    variacao_dia    = Column(Float, nullable=True)
    fonte_dados     = Column(String(50), nullable=True)
    atualizado_em   = Column(DateTime, nullable=True)
    usuario         = relationship("Usuario", back_populates="investimentos")


class Meta(Base):
    __tablename__ = "metas"
    id               = Column(Integer, primary_key=True)
    usuario_id       = Column(Integer, ForeignKey("usuarios.id"), nullable=False)
    titulo           = Column(String(100))
    valor_necessario = Column(Float)
    valor_atual      = Column(Float, default=0)
    prazo            = Column(String(20))
    status           = Column(String(20), default="em_andamento")
    usuario          = relationship("Usuario", back_populates="metas")


class SessaoChat(Base):
    __tablename__ = "sessoes_chat"
    id            = Column(String(36), primary_key=True)
    usuario_id    = Column(Integer, ForeignKey("usuarios.id"), nullable=False)
    titulo        = Column(String(100), default="Nova conversa")
    criado_em     = Column(DateTime, default=datetime.utcnow)
    atualizado_em = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    usuario       = relationship("Usuario", back_populates="sessoes")
    mensagens     = relationship("MensagemChat", back_populates="sessao",
                                 cascade="all, delete", order_by="MensagemChat.criado_em")


class MensagemChat(Base):
    __tablename__ = "mensagens_chat"
    id        = Column(Integer, primary_key=True)
    sessao_id = Column(String(36), ForeignKey("sessoes_chat.id"), nullable=False)
    role      = Column(String(10))
    content   = Column(Text)
    criado_em = Column(DateTime, default=datetime.utcnow)
    sessao    = relationship("SessaoChat", back_populates="mensagens")


class IndicesMercado(Base):
    """Cache dos índices econômicos reais"""
    __tablename__ = "indices_mercado"
    id            = Column(Integer, primary_key=True)
    nome          = Column(String(50), unique=True)
    valor         = Column(Float)
    variacao      = Column(Float, nullable=True)
    fonte         = Column(String(30))
    atualizado_em = Column(DateTime, default=datetime.utcnow)


def criar_tabelas():
    Base.metadata.create_all(engine)
    print("✅ Tabelas criadas!")


if __name__ == "__main__":
    criar_tabelas()