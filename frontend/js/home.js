// script só da página inicial: cuida do banner grande, da grade de filmes
// e do modal de cadastrar filme (que só aparece pra quem tá logado)

document.addEventListener("DOMContentLoaded", () => {
  const grade = document.getElementById("grade-filmes");
  renderizarGradeFilmes(grade);
  montarBanner();
  cuidarModalDeFilme();
});

// pega o primeiro filme da lista só pra preencher o banner de destaque
async function montarBanner() {
  try {
    const filmes = await buscarFilmes();
    if (filmes.length === 0) return;

    const destaque = filmes[0];
    document.getElementById("banner-tag").textContent = "EM DESTAQUE";
    document.getElementById("banner-titulo").textContent = destaque.title;
    document.getElementById("banner-descricao").textContent = destaque.description;
  } catch (erro) {
    console.error("não deu pra montar o banner:", erro);
  }
}

// mostra o botão "+" e cuida do modal de cadastro de filme, só pra quem já tá logado
function cuidarModalDeFilme() {
  const botaoAdd = document.getElementById("botao-add-filme");
  const modalAdd = document.getElementById("modal-add-filme");
  const estaLogado = localStorage.getItem("token_aurea_den");

  if (estaLogado) {
    botaoAdd.classList.remove("escondido");
  }

  botaoAdd.addEventListener("click", () => {
    modalAdd.classList.remove("escondido");
  });

  document.getElementById("fechar-modal-add").addEventListener("click", () => {
    modalAdd.classList.add("escondido");
  });

  modalAdd.addEventListener("click", (evento) => {
    if (evento.target === modalAdd) {
      modalAdd.classList.add("escondido");
    }
  });

  const form = document.getElementById("form-filme");
  form.addEventListener("submit", async (evento) => {
    evento.preventDefault();
    const erroTexto = document.getElementById("form-filme-erro");

    const filmeNovo = {
      title: document.getElementById("filme-titulo").value,
      cover_url: document.getElementById("filme-capa").value,
      description: document.getElementById("filme-descricao").value,
      rating: parseFloat(document.getElementById("filme-nota").value),
    };

    try {
      await cadastrarFilme(filmeNovo);
      location.reload(); // recarrega pra já aparecer o filme novo na grade
    } catch (erro) {
      erroTexto.textContent = erro.message;
    }
  });
}
