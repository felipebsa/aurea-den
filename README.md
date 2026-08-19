# Áurea Den

Site de catálogo de filmes feito pra ETEC.

## Estrutura

- `backend/` — API em FastAPI com autenticação JWT (PostgreSQL)
- `frontend/` — site multi-page em HTML + JS puro + CSS

## Rodando o backend local

```
cd backend
cp .env.example .env      # ajusta a DATABASE_URL com o teu postgres local
pip install -r requirements.txt
uvicorn app.main:app --reload
```

A API sobe em `http://127.0.0.1:8000` (documentação automática em `/docs`).

## Rodando o frontend local

É só abrir o `frontend/index.html` no navegador (ou usar a extensão Live Server).
Lembra que o `js/api.js` tá apontando pra `http://127.0.0.1:8000` - depois de
subir o backend no Railway, troca essa URL lá.

## Deploy

Feito direto pela interface do Railway (backend + banco Postgres) e do Netlify
(frontend), ligando cada plataforma no repositório do GitHub - sem arquivo de
configuração extra no projeto.

Não esquece de definir a variável `SECRET_KEY` no Railway (senão ele usa o
valor padrão que só serve pra testar local).
