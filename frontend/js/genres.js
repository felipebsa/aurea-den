// script da página de Gênero: busca os filmes uma vez e filtra no navegador
// mesmo, sem precisar chamar a API de novo a cada clique no botão.
// Multi-select: dá pra marcar vários gêneros ao mesmo tempo (o filme aparece
// se tiver PELO MENOS UM dos gêneros marcados).

let todosOsFilmesGenero = [];
let generosSelecionados = new Set();

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
    generosSelecionados.size === 0
      ? todosOsFilmesGenero
      : todosOsFilmesGenero.filter((filme) =>
          filme.genres.some((genero) => generosSelecionados.has(genero))
        );

  grade.innerHTML = "";

  if (filmesFiltrados.length === 0) {
    grade.innerHTML = "<p>Nenhum filme encontrado com esse filtro.</p>";
    return;
  }

  filmesFiltrados.forEach((filme) => grade.appendChild(montarCardFilme(filme)));

  // a grade foi recriada do zero agora, então a busca por nome e a ordenação
  // por nota (que atuam em cima dos cards) precisam ser reaplicadas
  if (typeof aplicarOrdenacao === "function") aplicarOrdenacao();
  if (typeof aplicarBusca === "function") aplicarBusca();
}

function cuidarBotoesGenero(grade) {
  const botoes = document.querySelectorAll(".botao-genero");

  botoes.forEach((botao) => {
    botao.addEventListener("click", () => {
      const genero = botao.dataset.genero;

      if (genero === "todos") {
        // "Todos" reseta a seleção — funciona como um "limpar filtro"
        generosSelecionados.clear();
      } else if (generosSelecionados.has(genero)) {
        generosSelecionados.delete(genero);
      } else {
        generosSelecionados.add(genero);
      }

      atualizarDestaqueBotoesGenero(botoes);
      renderizarFiltrado(grade);
    });
  });
}

// "Todos" fica em destaque só quando nenhum gênero específico está selecionado;
// os outros ficam em destaque cada um por si, já que dá pra marcar vários
function atualizarDestaqueBotoesGenero(botoes) {
  botoes.forEach((botao) => {
    const genero = botao.dataset.genero;
    const ativo = genero === "todos" ? generosSelecionados.size === 0 : generosSelecionados.has(genero);
    botao.classList.toggle("botao-genero-ativo", ativo);
  });
}
