// controla o botão único de ordenar por nota: um clique roda entre 3 estados —
// padrão (seta reta, sem ordenar) -> menor pra maior nota (seta pra baixo) ->
// maior pra menor nota (seta pra cima) -> volta pro padrão. Reordena os cards
// que já estão na tela, sem precisar chamar a API de novo.

const ESTADOS_ORDENACAO = ["nenhuma", "asc", "desc"];

const ICONES_ORDENACAO = {
  nenhuma:
    '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><line x1="4" y1="12" x2="20" y2="12"></line></svg>',
  asc:
    '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><polyline points="6 13 12 19 18 13"></polyline></svg>',
  desc:
    '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="19" x2="12" y2="5"></line><polyline points="6 11 12 5 18 11"></polyline></svg>',
};

const ROTULOS_ORDENACAO = {
  nenhuma: "Ordenar por nota (padrão, sem ordenação)",
  asc: "Ordenado da menor pra maior nota — clique pra inverter",
  desc: "Ordenado da maior pra menor nota — clique pra voltar ao padrão",
};

let ordemAtual = "nenhuma";

document.addEventListener("DOMContentLoaded", () => {
  const botao = document.getElementById("botao-ordenar-nota");
  if (!botao) return; // página sem controle de ordenação, tudo bem

  atualizarIconeOrdenacao(botao);

  botao.addEventListener("click", () => {
    const indiceAtual = ESTADOS_ORDENACAO.indexOf(ordemAtual);
    ordemAtual = ESTADOS_ORDENACAO[(indiceAtual + 1) % ESTADOS_ORDENACAO.length];

    atualizarIconeOrdenacao(botao);
    aplicarOrdenacao();
  });
});

function atualizarIconeOrdenacao(botao) {
  botao.innerHTML = ICONES_ORDENACAO[ordemAtual];
  botao.title = ROTULOS_ORDENACAO[ordemAtual];
  botao.classList.toggle("botao-ordenar-ativo", ordemAtual !== "nenhuma");
}

// exposta fora do listener pelo mesmo motivo do busca.js: páginas com filtro
// (genres.js) re-renderizam a grade e precisam reaplicar a ordenação depois
function aplicarOrdenacao() {
  const grade = document.getElementById("grade-filmes");
  if (!grade || ordemAtual === "nenhuma") return;

  const cards = Array.from(grade.querySelectorAll(".card-filme"));

  cards.sort((a, b) => {
    const notaA = parseFloat(a.querySelector(".nota-card").textContent.replace("Nota ", ""));
    const notaB = parseFloat(b.querySelector(".nota-card").textContent.replace("Nota ", ""));
    return ordemAtual === "desc" ? notaB - notaA : notaA - notaB;
  });

  cards.forEach((card) => grade.appendChild(card));
}
