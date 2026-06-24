"""
auth_middleware.py — Valida JWT do Supabase (suporta RS256 e ES256)
"""
import os
import httpx
from functools import lru_cache
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import jwt, JWTError
from dotenv import load_dotenv

load_dotenv()

SUPABASE_URL  = os.getenv("SUPABASE_URL", "")
JWKS_URL      = f"{SUPABASE_URL}/auth/v1/.well-known/jwks.json"

bearer_scheme = HTTPBearer(auto_error=False)


@lru_cache(maxsize=1)
def _get_jwks() -> dict:
    resp = httpx.get(JWKS_URL, timeout=10)
    resp.raise_for_status()
    return resp.json()


def get_current_user(
    credentials: HTTPAuthorizationCredentials | None = Depends(bearer_scheme),
) -> dict:
    if not credentials:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token de autenticação não fornecido",
            headers={"WWW-Authenticate": "Bearer"},
        )

    token = credentials.credentials

    try:
        jwks = _get_jwks()
        keys = jwks.get("keys", [])

        # Pega o kid do header do token para encontrar a chave certa
        unverified_header = jwt.get_unverified_header(token)
        token_kid = unverified_header.get("kid")
        token_alg = unverified_header.get("alg", "RS256")

        # Filtra a chave pelo kid se disponível
        matching_keys = [k for k in keys if k.get("kid") == token_kid] if token_kid else keys
        if not matching_keys:
            matching_keys = keys  # fallback: tenta todas

        payload = None
        last_error = None

        for key in matching_keys:
            try:
                payload = jwt.decode(
                    token,
                    key,
                    algorithms=[token_alg, "RS256", "ES256"],
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