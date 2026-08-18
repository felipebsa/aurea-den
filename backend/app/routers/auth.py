from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

from app.core.seguranca import criar_token, criptografar_senha, senha_esta_correta
from app.database import pegar_banco
from app.models.usuario import Usuario
from app.schemas.usuario import Token, UsuarioCriar

router = APIRouter(prefix="/auth", tags=["Autenticação"])


@router.post("/registrar", response_model=Token)
def registrar(dados: UsuarioCriar, banco: Session = Depends(pegar_banco)):
    usuario_existente = banco.query(Usuario).filter(
        Usuario.nome_usuario == dados.nome_usuario
    ).first()

    if usuario_existente:
        raise HTTPException(status_code=400, detail="Já tem um usuário com esse nome")

    novo_usuario = Usuario(
        nome_usuario=dados.nome_usuario,
        senha_criptografada=criptografar_senha(dados.senha),
    )
    banco.add(novo_usuario)
    banco.commit()
    banco.refresh(novo_usuario)

    # já devolve o token pra a pessoa entrar logada logo depois de criar a conta
    token = criar_token({"sub": novo_usuario.nome_usuario})
    return {"access_token": token, "token_type": "bearer"}


@router.post("/login", response_model=Token)
def login(form: OAuth2PasswordRequestForm = Depends(), banco: Session = Depends(pegar_banco)):
    usuario = banco.query(Usuario).filter(Usuario.nome_usuario == form.username).first()

    if not usuario or not senha_esta_correta(form.password, usuario.senha_criptografada):
        raise HTTPException(status_code=401, detail="Usuário ou senha errados")

    token = criar_token({"sub": usuario.nome_usuario})
    return {"access_token": token, "token_type": "bearer"}
