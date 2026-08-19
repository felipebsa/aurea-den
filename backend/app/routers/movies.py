from typing import List

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.security import get_current_user
from app.database import get_db
from app.models.movie import Movie
from app.models.user import User
from app.schemas.movie import MovieCreate, MovieResponse

router = APIRouter(prefix="/movies", tags=["Filmes"])


@router.post("/", response_model=MovieResponse)
def create_movie(
    data: MovieCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),  # só entra aqui quem tem token válido
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
