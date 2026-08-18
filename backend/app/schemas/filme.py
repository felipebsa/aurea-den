from pydantic import BaseModel, Field


class FilmeCriar(BaseModel):
    titulo: str
    descricao: str
    capa_url: str
    nota: float = Field(ge=0, le=10)  # nota vai de 0 a 10, tipo o IMDB


class FilmeResposta(FilmeCriar):
    id: int

    class Config:
        from_attributes = True
