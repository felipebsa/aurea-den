from typing import List

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.security import require_admin
from app.database import get_db
from app.models.movie import Movie
from app.models.user import User
from app.schemas.movie import MovieCreate, MovieResponse, MovieUpdate

router = APIRouter(prefix="/movies", tags=["Filmes"])


@router.post("/", response_model=MovieResponse)
def create_movie(
    data: MovieCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin),  # só ADM cria filme
):
    new_movie = Movie(**data.model_dump())
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
    for field, value in data.model_dump(exclude_unset=True).items():
        setattr(movie, field, value)

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
