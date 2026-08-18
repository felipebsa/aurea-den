from sqlalchemy import Column, Float, Integer, String

from app.database import Base


class Filme(Base):
    # cada linha dessa tabela é um filme que vai aparecer no site
    __tablename__ = "filmes"

    id = Column(Integer, primary_key=True, index=True)
    titulo = Column(String, nullable=False)
    descricao = Column(String, nullable=False)
    capa_url = Column(String, nullable=False)
    nota = Column(Float, nullable=False)
