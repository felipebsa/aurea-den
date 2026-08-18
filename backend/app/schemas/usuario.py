from pydantic import BaseModel


class UsuarioCriar(BaseModel):
    # é isso que a gente espera receber no corpo do /auth/registrar
    nome_usuario: str
    senha: str


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
