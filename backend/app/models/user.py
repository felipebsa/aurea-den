from sqlalchemy import Column, Integer, String

from app.database import Base


class User(Base):
    # essa tabela guarda quem pode logar no site pra cadastrar filme
    # (não é o usuário que assiste o filme, é tipo um admin do site)
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
