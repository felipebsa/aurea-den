from typing import Optional

from pydantic import BaseModel, Field

from app.models.movie import MovieGenre


class MovieCreate(BaseModel):
    title: str
    description: str
    cover_url: str
    banner_url: Optional[str] = None
    genre: MovieGenre = MovieGenre.OUTROS
    rating: float = Field(ge=0, le=10)  # nota vai de 0 a 10, tipo o IMDB


class MovieUpdate(BaseModel):
    # tudo opcional aqui: na edição a pessoa pode querer mudar só um campo,
    # tipo só a nota ou só o gênero, sem precisar reenviar o filme inteiro
    title: Optional[str] = None
    description: Optional[str] = None
    cover_url: Optional[str] = None
    banner_url: Optional[str] = None
    genre: Optional[MovieGenre] = None
    rating: Optional[float] = Field(default=None, ge=0, le=10)


class MovieResponse(MovieCreate):
    id: int

    class Config:
        from_attributes = True
