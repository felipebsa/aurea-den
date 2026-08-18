from sqlalchemy import Column, Integer, String

from app.database import Base


class Usuario(Base):
    # essa tabela guarda quem pode logar no site pra cadastrar filme
    # (não é o usuário que assiste o filme, é tipo um admin do site)
    __tablename__ = "usuarios"

    id = Column(Integer, primary_key=True, index=True)
    nome_usuario = Column(String, unique=True, index=True, nullable=False)
    senha_criptografada = Column(String, nullable=False)
