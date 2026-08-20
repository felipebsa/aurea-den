// script da página Dev Tools: só ADM entra aqui.
// tem a lista de todos os filmes e o modal (mesmo pra criar e pra editar) que
// abre ao clicar no "+ Novo filme" ou no lápis de cada linha.

document.addEventListener("DOMContentLoaded", () => {
  protegerPaginaAdm();
  carregarListaDev();
  cuidarModalFilmeDev();
});

// se quem tá logado não for ADM (ou nem tiver logado), manda de volta pra home
function protegerPaginaAdm() {
  const role = localStorage.getItem("role_aurea_den");
  if (role !== "ADM") {
    alert("Essa área é só pra administrador.");
    location.href = "index.html";
  }
}

async function carregarListaDev() {
  const lista = document.getElementById("lista-dev-filmes");
  lista.innerHTML = "<p>Carregando filmes...</p>";

  try {
    const filmes = await buscarFilmes();

    if (filmes.length === 0) {
      lista.innerHTML = "<p>Ainda não tem filme cadastrado. Clica em \"+ Novo filme\" pra começar.</p>";
      return;
    }

    lista.innerHTML = "";
    filmes.forEach((filme) => lista.appendChild(montarLinhaFilmeDev(filme)));
  } catch (erro) {
    lista.innerHTML = "<p>Não consegui carregar os filmes agora.</p>";
    console.error(erro);
  }
}

// monta uma linha da lista com capa pequena, título, nota e os botões de editar/apagar
function montarLinhaFilmeDev(filme) {
  const linha = document.createElement("div");
  linha.className = "linha-filme-dev";

  linha.innerHTML = `
    <img src="${filme.cover_url}" alt="Capa de ${filme.title}" />
    <div class="info-linha-dev">
      <p class="titulo-linha-dev">${filme.title}</p>
      <p class="nota-linha-dev">⭐ ${filme.rating}</p>
    </div>
    <div class="acoes-linha-dev">
      <button class="botao-editar-dev" title="Editar filme">✎</button>
      <button class="botao-excluir-dev" title="Apagar filme">🗑</button>
    </div>
  `;

  linha.querySelector(".botao-editar-dev").addEventListener("click", () => abrirModalFilmeDev(filme));
  linha.querySelector(".botao-excluir-dev").addEventListener("click", () => confirmarExclusao(filme));

  return linha;
}

async function confirmarExclusao(filme) {
  const confirmou = confirm(`Apagar o filme "${filme.title}"? Essa ação não tem volta.`);
  if (!confirmou) return;

  try {
    await apagarFilme(filme.id);
    carregarListaDev();
  } catch (erro) {
    alert(erro.message);
  }
}

// cuida do modal que serve tanto pra criar quanto pra editar filme
function cuidarModalFilmeDev() {
  const modal = document.getElementById("modal-filme-dev");
  const botaoAdd = document.getElementById("botao-add-filme-dev");
  const form = document.getElementById("form-filme-dev");

  botaoAdd.addEventListener("click", () => abrirModalFilmeDev(null));

  document.getElementById("fechar-modal-filme-dev").addEventListener("click", () => {
    modal.classList.add("escondido");
  });

  modal.addEventListener("click", (evento) => {
    if (evento.target === modal) {
      modal.classList.add("escondido");
    }
  });

  form.addEventListener("submit", async (evento) => {
    evento.preventDefault();
    const erroTexto = document.getElementById("form-filme-dev-erro");
    erroTexto.textContent = "";

    // se tiver um id no campo escondido, é edição; se não, é filme novo
    const id = document.getElementById("filme-dev-id").value;
    const bannerDigitado = document.getElementById("filme-dev-banner").value.trim();

    const dadosFilme = {
      title: document.getElementById("filme-dev-titulo").value,
      cover_url: document.getElementById("filme-dev-capa").value,
      banner_url: bannerDigitado ? bannerDigitado : null,
      description: document.getElementById("filme-dev-descricao").value,
      rating: parseFloat(document.getElementById("filme-dev-nota").value),
    };

    try {
      if (id) {
        await atualizarFilme(id, dadosFilme);
      } else {
        await cadastrarFilme(dadosFilme);
      }
      modal.classList.add("escondido");
      carregarListaDev();
    } catch (erro) {
      erroTexto.textContent = erro.message;
    }
  });
}

// abre o modal já preenchido (edição) ou vazio (criação de filme novo)
function abrirModalFilmeDev(filme) {
  const modal = document.getElementById("modal-filme-dev");
  const titulo = document.getElementById("titulo-modal-filme-dev");
  const botaoSalvar = document.getElementById("botao-salvar-filme-dev");

  document.getElementById("filme-dev-id").value = filme ? filme.id : "";
  document.getElementById("filme-dev-titulo").value = filme ? filme.title : "";
  document.getElementById("filme-dev-capa").value = filme ? filme.cover_url : "";
  document.getElementById("filme-dev-banner").value = filme && filme.banner_url ? filme.banner_url : "";
  document.getElementById("filme-dev-descricao").value = filme ? filme.description : "";
  document.getElementById("filme-dev-nota").value = filme ? filme.rating : "";

  titulo.textContent = filme ? "Editar filme" : "Cadastrar filme";
  botaoSalvar.textContent = filme ? "Salvar alterações" : "Adicionar";

  document.getElementById("form-filme-dev-erro").textContent = "";
  modal.classList.remove("escondido");
}
