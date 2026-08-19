from pydantic import BaseModel, Field


class MovieCreate(BaseModel):
    title: str
    description: str
    cover_url: str
    rating: float = Field(ge=0, le=10)  # nota vai de 0 a 10, tipo o IMDB


class MovieResponse(MovieCreate):
    id: int

    class Config:
        from_attributes = True
