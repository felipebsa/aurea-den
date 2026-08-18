# Áurea Den

Site de catálogo de filmes feito pra ETEC.

## Estrutura

- `backend/` — API em FastAPI com autenticação JWT (PostgreSQL)
- `frontend/` — site multi-page em HTML + JS puro (CSS ainda vou fazer)

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

- **Backend → Railway**: sobe a pasta `backend/`, adiciona um serviço PostgreSQL
  no mesmo projeto (o Railway seta a `DATABASE_URL` sozinho) e define a variável
  `CHAVE_SECRETA`. O `Procfile` já diz pra ele como rodar.
- **Frontend → Netlify**: sobe a pasta `frontend/` (o `netlify.toml` já tá configurado
  pra publicar ela como site estático).
