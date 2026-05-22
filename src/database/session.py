"""
session.py — Gerenciador de sessão do SQLAlchemy
"""

from sqlalchemy.orm import sessionmaker
from .models import engine

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def get_db():
    """Dependency para FastAPI — garante fechamento da sessão."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()