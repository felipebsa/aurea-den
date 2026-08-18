// função que eu reaproveito nas páginas que mostram filme em card
// (home, listas, lançamentos, gêneros)
function montarCardFilme(filme) {
  const card = document.createElement("div");
  card.className = "card-filme";

  card.innerHTML = `
    <img src="${filme.capa_url}" alt="Capa do filme ${filme.titulo}" />
    <div class="info-card">
      <p class="titulo-card">${filme.titulo}</p>
      <p class="nota-card">⭐ ${filme.nota}</p>
    </div>
  `;

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
