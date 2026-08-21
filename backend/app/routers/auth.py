from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

from app.core.security import check_password, create_token, get_current_user, hash_password
from app.database import get_db
from app.models.user import User, UserRole
from app.schemas.user import Token, UserCreate, UserResponse

router = APIRouter(prefix="/auth", tags=["Autenticação"])

LIMITE_CONTAS_ADM = 6  # máximo de administrador que o site aceita ter ao mesmo tempo


@router.post("/register", response_model=Token)
def register(data: UserCreate, db: Session = Depends(get_db)):
    existing_user = db.query(User).filter(User.username == data.username).first()

    if existing_user:
        raise HTTPException(status_code=400, detail="Já tem um usuário com esse nome")

    if data.role == "ADM":
        total_adms = db.query(User).filter(User.role == UserRole.ADM).count()
        if total_adms >= LIMITE_CONTAS_ADM:
            raise HTTPException(
                status_code=400,
                detail=f"Já tem o máximo de {LIMITE_CONTAS_ADM} contas ADM cadastradas",
            )

    new_user = User(
        username=data.username,
        hashed_password=hash_password(data.password),
        role=data.role,  # vem do drop do front (ADM ou CLIENT)
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    # já devolve o token pra a pessoa entrar logada logo depois de criar a conta
    token = create_token({"sub": new_user.username})
    return {
        "access_token": token,
        "token_type": "bearer",
        "role": new_user.role,
        "username": new_user.username,
    }


@router.post("/login", response_model=Token)
def login(form: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = db.query(User).filter(User.username == form.username).first()

    if not user or not check_password(form.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Usuário ou senha errados")

    token = create_token({"sub": user.username})
    return {
        "access_token": token,
        "token_type": "bearer",
        "role": user.role,
        "username": user.username,
    }


@router.get("/me", response_model=UserResponse)
def me(current_user: User = Depends(get_current_user)):
    # o front chama isso quando reabre o site com um token salvo, pra saber se
    # mostra o item "Dev Tools" na navbar sem precisar decodificar o JWT sozinho
    return current_user
