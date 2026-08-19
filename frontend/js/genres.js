document.addEventListener("DOMContentLoaded", () => {
  const grade = document.getElementById("grade-filmes");
  renderizarGradeFilmes(grade);

  // os botões de filtro ainda não filtram nada de verdade (ver comentário no html)
  const botoes = document.querySelectorAll(".botao-genero");
  botoes.forEach((botao) => {
    botao.addEventListener("click", () => {
      alert("Filtro por gênero ainda não implementado - falta esse campo no banco");
    });
  });
});
