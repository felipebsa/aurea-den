import enum

from sqlalchemy import Column, Float, ForeignKey, Integer, String
from sqlalchemy import Enum as SqlEnum
from sqlalchemy.orm import relationship

from app.database import Base


class MovieGenre(str, enum.Enum):
    # os valores batem com o data-genero dos botões de filtro no genres.html
    ACAO = "acao"
    DRAMA = "drama"
    FICCAO = "ficcao"
    TERROR = "terror"
    COMEDIA = "comedia"
    AVENTURA = "aventura"
    ESPADACHIM = "espadachim"
    ROMANCE = "romance"
    MELHOR_AMIGO = "melhor_amigo"
    OUTROS = "outros"


class MovieGenreEntry(Base):
    # cada linha aqui é "esse filme tem esse gênero". Um filme pode ter várias
    # linhas -> vários gêneros ao mesmo tempo. É só isso, não é uma entidade
    # própria tipo Tag: os valores possíveis são sempre os do MovieGenre acima.
    __tablename__ = "movie_genres"

    movie_id = Column(Integer, ForeignKey("movies.id"), primary_key=True)
    genre = Column(SqlEnum(MovieGenre, name="movie_genre"), primary_key=True)


class Movie(Base):
    # cada linha dessa tabela é um filme que vai aparecer no site
    __tablename__ = "movies"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    description = Column(String, nullable=False)
    cover_url = Column(String, nullable=False)
    banner_url = Column(String, nullable=True)  # imagem grande/destaque, além da capa (opcional)
    rating = Column(Float, nullable=False)

    # lista de MovieGenreEntry (uma por gênero marcado). O cascade garante que,
    # se um filme for apagado, as linhas de gênero dele somem junto
    genre_entries = relationship("MovieGenreEntry", cascade="all, delete-orphan")

    @property
    def genres(self):
        # atalho pra pegar só a lista de valores de gênero (sem o objeto por trás),
        # é o que o schema de resposta (MovieResponse) usa
        return [entrada.genre for entrada in self.genre_entries]
