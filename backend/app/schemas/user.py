from pydantic import BaseModel


class UserCreate(BaseModel):
    # é isso que a gente espera receber no corpo do /auth/register
    username: str
    password: str


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
