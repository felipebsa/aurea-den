// script só da página inicial: cuida do banner grande e da grade de filmes
// (cadastrar/editar/apagar filme agora fica na página Dev Tools, só pra ADM)

document.addEventListener("DOMContentLoaded", () => {
  const grade = document.getElementById("grade-filmes");
  renderizarGradeFilmes(grade);
  montarBanner();
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

    // se o filme tiver um banner cadastrado, uso ele de fundo;
    // senão fica só o degradê roxo padrão do CSS
    if (destaque.banner_url) {
      const banner = document.getElementById("banner-destaque");
      banner.style.backgroundImage = `linear-gradient(90deg, rgba(18,8,31,0.92) 35%, rgba(18,8,31,0.55)), url("${destaque.banner_url}")`;
      banner.style.backgroundSize = "cover";
      banner.style.backgroundPosition = "center";
    }
  } catch (erro) {
    console.error("não deu pra montar o banner:", erro);
  }
}
