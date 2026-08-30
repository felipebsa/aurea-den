# Áurea Den

Catálogo de filmes feito como trabalho de ETEC pela equipe **Devs Den**.

## Sobre o projeto

Site de catálogo de filmes com sistema de contas (cliente comum e administrador),
painel de administração pra cadastrar/editar/apagar filme, busca por nome,
filtro por gênero (múltiplo) e ordenação por nota, carrossel de destaque com
os filmes mais bem avaliados, tema claro/escuro e página de créditos da equipe.

## Funcionalidades

- Cadastro/login com dois tipos de conta: **ADM** e **CLIENT** (máximo de 6
  contas ADM cadastradas ao mesmo tempo)
- Painel **Dev Tools** (só pra ADM) — CRUD completo de filme: criar, editar
  e apagar, tudo por modal
- Cada filme pode ter **vários gêneros ao mesmo tempo** (Ação, Drama, Ficção,
  Terror, Comédia, Aventura, Espadachim, Romance, Melhor amigo, Anime,
  Outros), marcados por checkbox no cadastro
- Filtro por gênero **multi-select** — dá pra combinar mais de um gênero de
  uma vez, e o botão "Todos" limpa a seleção
- Busca por nome em tempo real, filtrando os filmes que já estão na tela
- Ordenação por nota com um botão só, que cicla entre padrão / menor→maior /
  maior→menor a cada clique
- Tema claro/escuro, alternado por um botão no header e salvo entre visitas
- Carrossel de destaque na home com os 5 filmes de maior nota, com autoplay
  e navegação manual (setas + bolinhas)
- Modal de detalhes do filme
- Capa e banner separados por filme (o banner é usado no carrossel)
- Página de Créditos, com foto, função e GitHub de cada integrante da equipe
- Rodapé fixo em todas as páginas

## Estrutura

```
backend/
  requirements.txt
  Procfile
  .env.example
  app/
    main.py
    database.py
    models/       (user.py, movie.py)
    schemas/      (user.py, movie.py)
    core/         (security.py)
    routers/      (auth.py, movies.py)

frontend/
  index.html
  genres.html
  lists.html
  releases.html
  credits.html
  dev-tools.html
  css/style.css
  js/     (api.js, auth.js, home.js, render-movies.js, genres.js,
            busca.js, ordenacao.js, tema.js, dev-tools.js, lists.js,
            releases.js)
  img/    (logo, fotos da página de créditos)
```

## Tecnologias

- **Back-end**: FastAPI, SQLAlchemy, PostgreSQL, JWT (python-jose), hash de
  senha com bcrypt (via passlib)
- **Front-end**: HTML + CSS + JavaScript puro, sem framework nenhum;
  `localStorage` guarda a sessão (token, usuário e role) e a preferência de
  tema entre as páginas

## Como o gênero múltiplo funciona por baixo dos panos

`MovieGenre` é um enum fixo (os valores possíveis de gênero) e cada filme tem
uma lista deles, guardada numa tabelinha à parte (`movie_genres`, ligando
`movie_id` a um valor do enum) — não é um campo só no filme, porque um filme
pode ter vários gêneros ao mesmo tempo. Pra adicionar um gênero novo na
lista, os lugares que precisam mudar são:

1. `backend/app/models/movie.py` — adiciona o valor no enum `MovieGenre`
2. `frontend/js/dev-tools.js` — adiciona o rótulo em português na função
   `rotuloGenero`
3. `frontend/dev-tools.html` — adiciona o checkbox no formulário de cadastro
4. `frontend/genres.html` — adiciona o botão de filtro na página de Gênero

Não precisa mexer em `schemas/movie.py` nem em `routers/movies.py`: eles já
trabalham com "lista de gêneros" de forma genérica, sem saber quais valores
existem.

## Rodando o backend local

```
cd backend
cp .env.example .env      # ajusta a DATABASE_URL com o teu postgres local
pip install -r requirements.txt
uvicorn app.main:app --reload
```

A API sobe em `http://127.0.0.1:8000` (documentação automática em `/docs`).

### Variáveis de ambiente (`.env`)

```
DATABASE_URL=postgresql://usuario:senha@localhost:5432/aurea_den
SECRET_KEY=troque-por-uma-chave-aleatoria-forte
```

## Rodando o frontend local

É só abrir o `frontend/index.html` no navegador (ou usar a extensão Live
Server). Lembra que o `js/api.js` tá apontando pra `http://127.0.0.1:8000` —
depois de subir o backend no Railway, troca essa URL lá.

## Banco de dados

As tabelas são criadas automaticamente na primeira subida
(`Base.metadata.create_all`) — inclusive `movie_genres`, já que é uma tabela
nova, não precisa de migration nenhuma pra ela aparecer. Se você já tinha um
banco criado *antes* dos campos `role` e `banner_url` existirem (ou antes do
gênero virar lista), vai precisar apagar as tabelas (e os tipos enum, se for
Postgres) pra elas serem recriadas certas:

```sql
DROP TABLE IF EXISTS movie_genres;
DROP TABLE IF EXISTS movies;
DROP TABLE IF EXISTS users;
DROP TYPE IF EXISTS user_role;
DROP TYPE IF EXISTS movie_genre;
```

## Deploy

- **Backend → Railway**, direto do repositório GitHub. Precisa do
  `requirements.txt` e do `Procfile` (já estão em `backend/`), de um serviço
  de **PostgreSQL** adicionado ao mesmo projeto (o Railway injeta a
  `DATABASE_URL` sozinho) e da variável `SECRET_KEY` definida manualmente em
  *Variables* — sem ela, a API usa o valor padrão que só serve pra teste
  local.
- **Frontend → Netlify**, direto do repositório GitHub. *Build command*
  vazio (não tem build) e *Publish directory* apontando pra pasta
  `frontend`.

Antes de publicar o front, não esquece de trocar a `URL_API` em
`frontend/js/api.js` pra apontar pro domínio que o Railway gerou.

## Equipe — Devs Den

[github.com/etecvav26-1C2-03](https://github.com/etecvav26-1C2-03)

| Nome | Função | GitHub |
|---|---|---|
| Felipe Barbosa Santos | Back-end, JavaScript e Liderança do projeto | [felipebsa](https://github.com/felipebsa) |
| Guilherme Miguel Rodrigues Pereira Lakonski | Rodapé e Seção de Créditos | [LAKONSKI](https://github.com/LAKONSKI) |
| Richard Murilo Araújo Freire | Navbar e Header | [richard426278](https://github.com/richard426278) |
| Gabriel Fernandes Barbarini | CSS | [FeLaLost](https://github.com/FeLaLost) |
| Cauã | Testes | [CauanSouzaa](https://github.com/CauanSouzaa) |
| Eduardo | Conteúdo — cadastro de filmes | [Eduardo-Bargueiras](https://github.com/Eduardo-Bargueiras) |

Mais detalhes de cada parte na página `/credits.html` do site.
