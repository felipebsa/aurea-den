// função que eu reaproveito nas páginas que mostram filme em card
// (home, listas, lançamentos, gêneros)
function montarCardFilme(filme) {
  const card = document.createElement("div");
  card.className = "card-filme";

  card.innerHTML = `
    <div class="capa-card">
      <img src="${filme.cover_url}" alt="Capa do filme ${filme.title}" />
      <button class="botao-play" aria-label="Ver detalhes de ${filme.title}">▶</button>
    </div>
    <div class="info-card">
      <p class="titulo-card">${filme.title}</p>
      <p class="nota-card">⭐ ${filme.rating}</p>
    </div>
  `;

  // tanto a capa quanto o botão de play abrem o modal de detalhes
  card.querySelector("img").addEventListener("click", () => abrirDetalhesFilme(filme));
  card.querySelector(".botao-play").addEventListener("click", () => abrirDetalhesFilme(filme));

  return card;
}

async function renderizarGradeFilmes(elementoGrade) {
  try {
    const filmes = await buscarFilmes();

    if (filmes.length === 0) {
      elementoGrade.innerHTML = "<p>Ainda não tem filme cadastrado.</p>";
      return;
    }

    filmes.forEach((filme) => {
      elementoGrade.appendChild(montarCardFilme(filme));
    });
  } catch (erro) {
    elementoGrade.innerHTML = "<p>Não consegui carregar os filmes agora.</p>";
    console.error(erro);
  }
}

// abre o modal com os detalhes do filme (nem toda página tem esse modal, tipo a "sobre")
function abrirDetalhesFilme(filme) {
  const modal = document.getElementById("modal-detalhes");
  if (!modal) return;

  document.getElementById("detalhes-capa").src = filme.cover_url;
  document.getElementById("detalhes-capa").alt = `Capa do filme ${filme.title}`;
  document.getElementById("detalhes-titulo").textContent = filme.title;
  document.getElementById("detalhes-nota").textContent = `⭐ ${filme.rating}`;
  document.getElementById("detalhes-descricao").textContent = filme.description;

  modal.classList.remove("escondido");
}

// fecha o modal de detalhes (botão de fechar ou clicando fora da caixa)
document.addEventListener("DOMContentLoaded", () => {
  const modalDetalhes = document.getElementById("modal-detalhes");
  if (!modalDetalhes) return;

  document.getElementById("fechar-modal-detalhes").addEventListener("click", () => {
    modalDetalhes.classList.add("escondido");
  });

  modalDetalhes.addEventListener("click", (evento) => {
    if (evento.target === modalDetalhes) {
      modalDetalhes.classList.add("escondido");
    }
  });
});
