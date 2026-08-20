from enum import Enum

from pydantic import BaseModel


class UserRole(str, Enum):
    ADM = "ADM"
    CLIENT = "CLIENT"


class UserCreate(BaseModel):
    # é isso que a gente espera receber no corpo do /auth/register
    # role vem do drop do front ("qual é a sua role?"), se não mandar nada vira CLIENT
    username: str
    password: str
    role: UserRole = UserRole.CLIENT


class UserResponse(BaseModel):
    # usado no /auth/me, pra devolver os dados do usuário logado sem a senha
    id: int
    username: str
    role: UserRole

    class Config:
        from_attributes = True


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    role: UserRole  # o front guarda isso pra saber se mostra o "Dev Tools" na navbar
    username: str
