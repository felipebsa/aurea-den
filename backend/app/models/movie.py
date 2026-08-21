import enum

from sqlalchemy import Column, Float, Integer, String
from sqlalchemy import Enum as SqlEnum

from app.database import Base


class MovieGenre(str, enum.Enum):
    # os valores batem com o data-genero dos botões de filtro no genres.html
    ACAO = "acao"
    DRAMA = "drama"
    FICCAO = "ficcao"
    TERROR = "terror"
    OUTROS = "outros"


class Movie(Base):
    # cada linha dessa tabela é um filme que vai aparecer no site
    __tablename__ = "movies"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    description = Column(String, nullable=False)
    cover_url = Column(String, nullable=False)
    banner_url = Column(String, nullable=True)  # imagem grande/destaque, além da capa (opcional)
    genre = Column(SqlEnum(MovieGenre, name="movie_genre"), nullable=False, default=MovieGenre.OUTROS)
    rating = Column(Float, nullable=False)
