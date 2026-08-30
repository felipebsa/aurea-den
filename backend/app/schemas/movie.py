from typing import List, Optional

from pydantic import BaseModel, Field

from app.models.movie import MovieGenre


class MovieCreate(BaseModel):
    title: str
    description: str
    cover_url: str
    banner_url: Optional[str] = None
    genres: List[MovieGenre] = [MovieGenre.OUTROS]  # pelo menos um gênero, o form garante isso
    rating: float = Field(ge=0, le=10)  # nota vai de 0 a 10, tipo o IMDB


class MovieUpdate(BaseModel):
    # tudo opcional aqui: na edição a pessoa pode querer mudar só um campo,
    # tipo só a nota, sem precisar reenviar o filme inteiro
    title: Optional[str] = None
    description: Optional[str] = None
    cover_url: Optional[str] = None
    banner_url: Optional[str] = None
    genres: Optional[List[MovieGenre]] = None  # None = não mexe nos gêneros
    rating: Optional[float] = Field(default=None, ge=0, le=10)


class MovieResponse(BaseModel):
    id: int
    title: str
    description: str
    cover_url: str
    banner_url: Optional[str] = None
    genres: List[MovieGenre]
    rating: float

    class Config:
        from_attributes = True
