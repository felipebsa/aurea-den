import os
from datetime import datetime, timedelta, timezone

from dotenv import load_dotenv
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from passlib.context import CryptContext
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.user import User

load_dotenv()

# no projeto de verdade essa chave nunca ficaria escrita aqui, mas é só pro trabalho da ETEC
SECRET_KEY = os.getenv("SECRET_KEY", "chave-super-secreta-etec-2026")
ALGORITHM = "HS256"
EXPIRE_MINUTES = 60

password_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")


def hash_password(password: str) -> str:
    return password_context.hash(password)


def check_password(typed_password: str, saved_password: str) -> bool:
    return password_context.verify(typed_password, saved_password)


def create_token(data: dict) -> str:
    # copio o dicionário pra não alterar o original sem querer
    token_data = data.copy()
    expires_at = datetime.now(timezone.utc) + timedelta(minutes=EXPIRE_MINUTES)
    token_data.update({"exp": expires_at})
    return jwt.encode(token_data, SECRET_KEY, algorithm=ALGORITHM)


def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db),
) -> User:
    # esse erro é reaproveitado nos dois "if" de baixo pra não repetir código
    login_error = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Token inválido ou expirado, faz login de novo",
        headers={"WWW-Authenticate": "Bearer"},
    )

    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username = payload.get("sub")
        if username is None:
            raise login_error
    except JWTError:
        raise login_error

    user = db.query(User).filter(User.username == username).first()
    if user is None:
        raise login_error

    return user
