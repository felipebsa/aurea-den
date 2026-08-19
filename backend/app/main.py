from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database import Base, engine
from app.routers import auth, movies

# cria as tabelas no banco automaticamente, se elas ainda não existirem
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Áurea Den - API")

# libera o front-end (que vai estar hospedado em outro lugar, tipo o Netlify) a acessar a API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(movies.router)


@app.get("/")
def root():
    return {"message": "API do Áurea Den no ar"}
