// script da página de Gênero: busca os filmes uma vez e filtra no navegador
// mesmo, sem precisar chamar a API de novo a cada clique no botão

let todosOsFilmesGenero = [];
let filtroGeneroAtual = "todos";

document.addEventListener("DOMContentLoaded", async () => {
  const grade = document.getElementById("grade-filmes");
  await carregarFilmesGenero(grade);
  cuidarBotoesGenero(grade);
});

async function carregarFilmesGenero(grade) {
  grade.innerHTML = "<p>Carregando filmes...</p>";
  try {
    todosOsFilmesGenero = await buscarFilmes();
    renderizarFiltrado(grade);
  } catch (erro) {
    grade.innerHTML = "<p>Não consegui carregar os filmes agora.</p>";
    console.error(erro);
  }
}

function renderizarFiltrado(grade) {
  const filmesFiltrados =
    filtroGeneroAtual === "todos"
      ? todosOsFilmesGenero
      : todosOsFilmesGenero.filter((filme) => filme.genre === filtroGeneroAtual);

  grade.innerHTML = "";

  if (filmesFiltrados.length === 0) {
    grade.innerHTML = "<p>Nenhum filme desse gênero ainda.</p>";
    return;
  }

  filmesFiltrados.forEach((filme) => grade.appendChild(montarCardFilme(filme)));
}

function cuidarBotoesGenero(grade) {
  const botoes = document.querySelectorAll(".botao-genero");

  botoes.forEach((botao) => {
    botao.addEventListener("click", () => {
      filtroGeneroAtual = botao.dataset.genero;

      // tira o destaque de todos e coloca só no botão clicado
      botoes.forEach((b) => b.classList.remove("botao-genero-ativo"));
      botao.classList.add("botao-genero-ativo");

      renderizarFiltrado(grade);
    });
  });
}
