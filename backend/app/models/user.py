import enum

from sqlalchemy import Column, Integer, String
from sqlalchemy import Enum as SqlEnum

from app.database import Base


class UserRole(str, enum.Enum):
    # ADM = consegue mexer no Dev Tools (criar/editar/apagar filme)
    # CLIENT = só navega no site normal, sem acesso ao Dev Tools
    ADM = "ADM"
    CLIENT = "CLIENT"


class User(Base):
    # essa tabela guarda quem pode logar no site
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    role = Column(SqlEnum(UserRole, name="user_role"), nullable=False, default=UserRole.CLIENT)
