from typing import List

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.security import require_admin
from app.database import get_db
from app.models.movie import Movie, MovieGenre, MovieGenreEntry
from app.models.user import User
from app.schemas.movie import MovieCreate, MovieResponse, MovieUpdate

router = APIRouter(prefix="/movies", tags=["Filmes"])


def montar_entradas_de_genero(generos: List[MovieGenre]) -> List[MovieGenreEntry]:
    # transforma a lista de valores (ex: [MovieGenre.ACAO, MovieGenre.COMEDIA])
    # numa lista de linhas prontas pra salvar na tabela movie_genres
    return [MovieGenreEntry(genre=genero) for genero in generos]


@router.post("/", response_model=MovieResponse)
def create_movie(
    data: MovieCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin),  # só ADM cria filme
):
    dados = data.model_dump(exclude={"genres"})
    new_movie = Movie(**dados)
    new_movie.genre_entries = montar_entradas_de_genero(data.genres)

    db.add(new_movie)
    db.commit()
    db.refresh(new_movie)
    return new_movie


@router.get("/", response_model=List[MovieResponse])
def list_movies(db: Session = Depends(get_db)):
    # essa rota é pública, qualquer um pode ver os filmes sem estar logado
    return db.query(Movie).all()


@router.get("/{movie_id}", response_model=MovieResponse)
def get_movie(movie_id: int, db: Session = Depends(get_db)):
    movie = db.query(Movie).filter(Movie.id == movie_id).first()
    if not movie:
        raise HTTPException(status_code=404, detail="Não achei nenhum filme com esse id")
    return movie


@router.put("/{movie_id}", response_model=MovieResponse)
def update_movie(
    movie_id: int,
    data: MovieUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin),  # só ADM edita
):
    movie = db.query(Movie).filter(Movie.id == movie_id).first()
    if not movie:
        raise HTTPException(status_code=404, detail="Não achei nenhum filme com esse id")

    # exclude_unset garante que só mexe nos campos que vieram no corpo da requisição
    dados = data.model_dump(exclude_unset=True, exclude={"genres"})
    for field, value in dados.items():
        setattr(movie, field, value)

    # genres é tratado separado: só mexe se a chave "genres" veio na requisição.
    # Trocar a lista inteira (em vez de editar item a item) faz o SQLAlchemy
    # apagar as linhas antigas e criar as novas sozinho, por causa do
    # cascade="all, delete-orphan" lá no relationship do model
    if data.genres is not None:
        movie.genre_entries = montar_entradas_de_genero(data.genres)

    db.commit()
    db.refresh(movie)
    return movie


@router.delete("/{movie_id}")
def delete_movie(
    movie_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin),  # só ADM apaga
):
    movie = db.query(Movie).filter(Movie.id == movie_id).first()
    if not movie:
        raise HTTPException(status_code=404, detail="Não achei nenhum filme com esse id")

    db.delete(movie)
    db.commit()
    return {"message": f"Filme '{movie.title}' apagado"}
