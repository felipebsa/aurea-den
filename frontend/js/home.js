// script só da página inicial: cuida do carrossel de destaque (os 5 filmes com
// mais estrelas) e da grade de filmes normal ali embaixo

const INTERVALO_AUTOPLAY_MS = 6000;

let filmesDestaque = [];
let indiceAtual = 0;
let temporizadorAutoplay = null;

document.addEventListener("DOMContentLoaded", () => {
  const grade = document.getElementById("grade-filmes");
  renderizarGradeFilmes(grade);
  montarCarrosselDestaque();
});

async function montarCarrosselDestaque() {
  try {
    const filmes = await buscarFilmes();

    // pego os 5 filmes com maior nota pra virar o carrossel (sem mexer na lista original)
    filmesDestaque = [...filmes].sort((a, b) => b.rating - a.rating).slice(0, 5);

    if (filmesDestaque.length === 0) {
      document.getElementById("banner-tag").textContent = "";
      document.getElementById("banner-titulo").textContent = "Ainda não tem filme cadastrado";
      document.getElementById("banner-descricao").textContent = "";
      return;
    }

    montarBolinhas();
    renderizarSlide(0);
    cuidarSetasCarrossel();
    cuidarBotaoAssistir();
    iniciarAutoplay();
  } catch (erro) {
    console.error("não deu pra montar o carrossel:", erro);
  }
}

// troca o conteúdo do banner pro filme daquele índice do carrossel
function renderizarSlide(indice) {
  indiceAtual = indice;
  const filme = filmesDestaque[indiceAtual];
  const banner = document.getElementById("banner-destaque");

  document.getElementById("banner-tag").textContent = `TOP ${indiceAtual + 1} EM DESTAQUE`;
  document.getElementById("banner-titulo").textContent = filme.title;
  document.getElementById("banner-descricao").textContent = filme.description;

  // se o filme tiver um banner cadastrado (no Dev Tools), uso ele de fundo;
  // senão volta pro degradê roxo padrão que já tá no CSS
  if (filme.banner_url) {
    banner.style.backgroundImage = `linear-gradient(90deg, rgba(18,8,31,0.92) 35%, rgba(18,8,31,0.55)), url("${filme.banner_url}")`;
    banner.style.backgroundSize = "cover";
    banner.style.backgroundPosition = "center";
  } else {
    banner.style.backgroundImage = "";
  }

  atualizarBolinhaAtiva();
}

// cria uma bolinha pra cada filme do top 5, clicável pra pular direto pro slide
function montarBolinhas() {
  const container = document.getElementById("banner-bolinhas");
  container.innerHTML = "";

  filmesDestaque.forEach((_, indice) => {
    const bolinha = document.createElement("span");
    bolinha.addEventListener("click", () => {
      renderizarSlide(indice);
      reiniciarAutoplay();
    });
    container.appendChild(bolinha);
  });
}

function atualizarBolinhaAtiva() {
  const bolinhas = document.querySelectorAll("#banner-bolinhas span");
  bolinhas.forEach((bolinha, indice) => {
    bolinha.classList.toggle("bolinha-ativa", indice === indiceAtual);
  });
}

function cuidarSetasCarrossel() {
  document.getElementById("banner-anterior").addEventListener("click", () => {
    const novoIndice = (indiceAtual - 1 + filmesDestaque.length) % filmesDestaque.length;
    renderizarSlide(novoIndice);
    reiniciarAutoplay();
  });

  document.getElementById("banner-proximo").addEventListener("click", () => {
    const novoIndice = (indiceAtual + 1) % filmesDestaque.length;
    renderizarSlide(novoIndice);
    reiniciarAutoplay();
  });
}

// o botão "Assistir" abre o modal de detalhes do filme que tá em exibição no carrossel
function cuidarBotaoAssistir() {
  document.getElementById("banner-assistir").addEventListener("click", () => {
    const filme = filmesDestaque[indiceAtual];
    if (typeof abrirDetalhesFilme === "function") {
      abrirDetalhesFilme(filme);
    }
  });
}

function iniciarAutoplay() {
  if (filmesDestaque.length <= 1) return; // não faz sentido girar sozinho com 1 filme só
  temporizadorAutoplay = setInterval(() => {
    const novoIndice = (indiceAtual + 1) % filmesDestaque.length;
    renderizarSlide(novoIndice);
  }, INTERVALO_AUTOPLAY_MS);
}

// reinicia a contagem do autoplay sempre que a pessoa mexe manualmente no carrossel
function reiniciarAutoplay() {
  clearInterval(temporizadorAutoplay);
  iniciarAutoplay();
}
