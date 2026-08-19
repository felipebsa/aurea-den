import os

from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker

# carrega o .env pra pegar a URL do banco (localmente, no Railway ele já injeta sozinho)
load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://postgres:senha@localhost:5432/aurea_den")

# o Railway manda a url como "postgres://" e o SQLAlchemy só aceita "postgresql://",
# então troco isso aqui pra não dar erro na hora de conectar
if DATABASE_URL.startswith("postgres://"):
    DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql://", 1)

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


def get_db():
    # isso aqui abre uma conexão, empresta ela pra rota usar, e fecha depois que termina
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
