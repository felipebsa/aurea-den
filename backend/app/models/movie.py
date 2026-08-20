from sqlalchemy import Column, Float, Integer, String

from app.database import Base


class Movie(Base):
    # cada linha dessa tabela é um filme que vai aparecer no site
    __tablename__ = "movies"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    description = Column(String, nullable=False)
    cover_url = Column(String, nullable=False)
    banner_url = Column(String, nullable=True)  # imagem grande/destaque, além da capa (opcional)
    rating = Column(Float, nullable=False)
