"""
supabase_client.py — Cliente Supabase para o backend FastAPI
"""
import os
from supabase import create_client, Client
from dotenv import load_dotenv

load_dotenv()

SUPABASE_URL        = os.getenv("SUPABASE_URL", "")
SUPABASE_SECRET_KEY = os.getenv("SUPABASE_SECRET_KEY", "")  # service key — só backend

supabase: Client = create_client(SUPABASE_URL, SUPABASE_SECRET_KEY)