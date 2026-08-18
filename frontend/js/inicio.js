// script só da página inicial: cuida do banner grande e da grade de filmes

document.addEventListener("DOMContentLoaded", () => {
  const grade = document.getElementById("grade-filmes");
  renderizarGradeFilmes(grade);
  montarBanner();
  cuidarFormularioDeFilme();
});

// pega o primeiro filme da lista só pra preencher o banner de destaque
async function montarBanner() {
  try {
    const filmes = await buscarFilmes();
    if (filmes.length === 0) return;

    const destaque = filmes[0];
    document.getElementById("banner-tag").textContent = "EM DESTAQUE";
    document.getElementById("banner-titulo").textContent = destaque.titulo;
    document.getElementById("banner-descricao").textContent = destaque.descricao;
  } catch (erro) {
    console.error("não deu pra montar o banner:", erro);
  }
}

// mostra o formulário de cadastro de filme só pra quem já tá logado
function cuidarFormularioDeFilme() {
  const secaoAddFilme = document.getElementById("secao-add-filme");
  const estaLogado = localStorage.getItem("token_aurea_den");

  if (estaLogado) {
    secaoAddFilme.classList.remove("escondido");
  }

  const form = document.getElementById("form-filme");
  form.addEventListener("submit", async (evento) => {
    evento.preventDefault();
    const erroTexto = document.getElementById("form-filme-erro");

    const filmeNovo = {
      titulo: document.getElementById("filme-titulo").value,
      capa_url: document.getElementById("filme-capa").value,
      descricao: document.getElementById("filme-descricao").value,
      nota: parseFloat(document.getElementById("filme-nota").value),
    };

    try {
      await cadastrarFilme(filmeNovo);
      location.reload(); // recarrega pra já aparecer o filme novo na grade
    } catch (erro) {
      erroTexto.textContent = erro.message;
    }
  });
}
