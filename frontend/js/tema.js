// alterna entre tema escuro (padrão do site) e tema claro, só trocando o
// atributo data-tema no <html> — as cores em si vêm todas de variáveis no
// :root (ver topo do style.css), então não precisa reescrever nada de layout.
// A preferência fica salva no localStorage, e cada página já tem um scriptzinho
// no <head> que aplica ela antes de desenhar a tela (evita o "flash" do tema
// errado por uma fração de segundo).

const ICONE_LUA =
  '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79Z"></path></svg>';

const ICONE_SOL =
  '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"></circle><line x1="12" y1="2" x2="12" y2="4"></line><line x1="12" y1="20" x2="12" y2="22"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="2" y1="12" x2="4" y2="12"></line><line x1="20" y1="12" x2="22" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>';

document.addEventListener("DOMContentLoaded", () => {
  const botao = document.getElementById("botao-tema");
  if (!botao) return;

  atualizarIconeTema(botao);

  botao.addEventListener("click", () => {
    const estaClaroAgora = document.documentElement.getAttribute("data-tema") === "claro";

    if (estaClaroAgora) {
      document.documentElement.removeAttribute("data-tema");
      localStorage.setItem("tema_aurea_den", "escuro");
    } else {
      document.documentElement.setAttribute("data-tema", "claro");
      localStorage.setItem("tema_aurea_den", "claro");
    }

    atualizarIconeTema(botao);
  });
});

function atualizarIconeTema(botao) {
  const estaClaro = document.documentElement.getAttribute("data-tema") === "claro";
  // no tema claro mostra a lua (clica pra voltar ao escuro); no escuro mostra o sol
  botao.innerHTML = estaClaro ? ICONE_LUA : ICONE_SOL;
  botao.title = estaClaro ? "Mudar pro tema escuro" : "Mudar pro tema claro";
}
