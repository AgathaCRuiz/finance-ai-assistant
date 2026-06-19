"""
auth_middleware.py — Valida JWT do Supabase em cada requisição
"""
import os
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import jwt, JWTError
import httpx
from functools import lru_cache
from dotenv import load_dotenv

load_dotenv()

SUPABASE_URL  = os.getenv("SUPABASE_URL", "")
JWKS_URL      = f"{SUPABASE_URL}/auth/v1/.well-known/jwks.json"

bearer_scheme = HTTPBearer(auto_error=False)


@lru_cache(maxsize=1)
def _get_jwks() -> dict:
    """Busca as chaves públicas do Supabase (cached)."""
    resp = httpx.get(JWKS_URL, timeout=10)
    resp.raise_for_status()
    return resp.json()


def get_current_user(
    credentials: HTTPAuthorizationCredentials | None = Depends(bearer_scheme),
) -> dict:
    """
    Dependency do FastAPI — valida o JWT e retorna o payload do usuário.
    Uso: user = Depends(get_current_user)
    """
    if not credentials:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token de autenticação não fornecido",
            headers={"WWW-Authenticate": "Bearer"},
        )

    token = credentials.credentials

    try:
        jwks = _get_jwks()
        # Tenta cada chave do JWKS
        payload = None
        last_error = None
        for key in jwks.get("keys", []):
            try:
                payload = jwt.decode(
                    token,
                    key,
                    algorithms=["RS256"],
                    options={"verify_aud": False},
                )
                break
            except JWTError as e:
                last_error = e
                continue

        if payload is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail=f"Token inválido: {last_error}",
            )

        return {
            "user_id": payload.get("sub"),
            "email":   payload.get("email"),
            "role":    payload.get("role", "authenticated"),
        }

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Erro ao validar token: {str(e)}",
        )