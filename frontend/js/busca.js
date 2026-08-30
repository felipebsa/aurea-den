// liga o campo #campo-busca (que já existia no header de toda página, mas não
// fazia nada) pra filtrar os cards de filme que já estão na tela, sem precisar
// chamar a API de novo — o mesmo espírito do filtro de gênero.

document.addEventListener("DOMContentLoaded", () => {
  const campoBusca = document.getElementById("campo-busca");
  if (!campoBusca) return;

  campoBusca.addEventListener("input", aplicarBusca);
});

// separada em função própria (e sem "const"/escopo de bloco) de propósito: páginas
// como genres.js re-renderizam a grade quando um filtro muda, e precisam chamar
// essa função de novo depois, senão a busca digitada "some" no próximo filtro
function aplicarBusca() {
  const campoBusca = document.getElementById("campo-busca");
  const grade = document.getElementById("grade-filmes");
  if (!campoBusca || !grade) return;

  const termo = campoBusca.value.trim().toLowerCase();

  grade.querySelectorAll(".card-filme").forEach((card) => {
    const tituloElemento = card.querySelector(".titulo-card");
    if (!tituloElemento) return;

    const titulo = tituloElemento.textContent.toLowerCase();
    const bateComABusca = titulo.includes(termo);
    card.classList.toggle("card-escondido-busca", !bateComABusca);
  });
}
