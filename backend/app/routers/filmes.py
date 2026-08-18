from typing import List

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.seguranca import pegar_usuario_logado
from app.database import pegar_banco
from app.models.filme import Filme
from app.models.usuario import Usuario
from app.schemas.filme import FilmeCriar, FilmeResposta

router = APIRouter(prefix="/filmes", tags=["Filmes"])


@router.post("/", response_model=FilmeResposta)
def criar_filme(
    dados: FilmeCriar,
    banco: Session = Depends(pegar_banco),
    usuario_logado: Usuario = Depends(pegar_usuario_logado),  # só entra aqui quem tem token válido
):
    filme_novo = Filme(**dados.model_dump())
    banco.add(filme_novo)
    banco.commit()
    banco.refresh(filme_novo)
    return filme_novo


@router.get("/", response_model=List[FilmeResposta])
def listar_filmes(banco: Session = Depends(pegar_banco)):
    # essa rota é pública, qualquer um pode ver os filmes sem estar logado
    return banco.query(Filme).all()


@router.get("/{filme_id}", response_model=FilmeResposta)
def pegar_filme(filme_id: int, banco: Session = Depends(pegar_banco)):
    filme = banco.query(Filme).filter(Filme.id == filme_id).first()
    if not filme:
        raise HTTPException(status_code=404, detail="Não achei nenhum filme com esse id")
    return filme
