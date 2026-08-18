import os
from datetime import datetime, timedelta, timezone

from dotenv import load_dotenv
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from passlib.context import CryptContext
from sqlalchemy.orm import Session

from app.database import pegar_banco
from app.models.usuario import Usuario

load_dotenv()

# no projeto de verdade essa chave nunca ficaria escrita aqui, mas é só pro trabalho da ETEC
CHAVE_SECRETA = os.getenv("CHAVE_SECRETA", "chave-super-secreta-etec-2026")
ALGORITMO = "HS256"
MINUTOS_PARA_EXPIRAR = 60

contexto_senha = CryptContext(schemes=["bcrypt"], deprecated="auto")
esquema_oauth2 = OAuth2PasswordBearer(tokenUrl="/auth/login")


def criptografar_senha(senha: str) -> str:
    return contexto_senha.hash(senha)


def senha_esta_correta(senha_digitada: str, senha_do_banco: str) -> bool:
    return contexto_senha.verify(senha_digitada, senha_do_banco)


def criar_token(dados: dict) -> str:
    # copio o dicionário pra não alterar o original sem querer
    dados_do_token = dados.copy()
    data_de_expiracao = datetime.now(timezone.utc) + timedelta(minutes=MINUTOS_PARA_EXPIRAR)
    dados_do_token.update({"exp": data_de_expiracao})
    return jwt.encode(dados_do_token, CHAVE_SECRETA, algorithm=ALGORITMO)


def pegar_usuario_logado(
    token: str = Depends(esquema_oauth2),
    banco: Session = Depends(pegar_banco),
) -> Usuario:
    # esse erro é reaproveitado nos dois "if" de baixo pra não repetir código
    erro_de_login = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Token inválido ou expirado, faz login de novo",
        headers={"WWW-Authenticate": "Bearer"},
    )

    try:
        payload = jwt.decode(token, CHAVE_SECRETA, algorithms=[ALGORITMO])
        nome_usuario = payload.get("sub")
        if nome_usuario is None:
            raise erro_de_login
    except JWTError:
        raise erro_de_login

    usuario = banco.query(Usuario).filter(Usuario.nome_usuario == nome_usuario).first()
    if usuario is None:
        raise erro_de_login

    return usuario
