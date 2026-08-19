// esse arquivo cuida do modal de login/cadastro que aparece em todas as páginas

const modal = document.getElementById("modal-auth");
const botaoConta = document.getElementById("botao-conta");
const botaoFecharModal = document.getElementById("fechar-modal");

const areaLogin = document.getElementById("area-login");
const areaCadastro = document.getElementById("area-cadastro");
const linkIrCadastro = document.getElementById("ir-para-cadastro");
const linkIrLogin = document.getElementById("ir-para-login");

const formLogin = document.getElementById("form-login");
const formCadastro = document.getElementById("form-cadastro");

// abre o modal quando clica no ícone de usuário
botaoConta.addEventListener("click", () => {
  modal.classList.remove("escondido");
});

botaoFecharModal.addEventListener("click", () => {
  modal.classList.add("escondido");
});

// troca entre a telinha de login e a de cadastro dentro do mesmo modal
linkIrCadastro.addEventListener("click", (evento) => {
  evento.preventDefault();
  areaLogin.classList.add("escondido");
  areaCadastro.classList.remove("escondido");
});

linkIrLogin.addEventListener("click", (evento) => {
  evento.preventDefault();
  areaCadastro.classList.add("escondido");
  areaLogin.classList.remove("escondido");
});

formLogin.addEventListener("submit", async (evento) => {
  evento.preventDefault();
  const usuario = document.getElementById("login-usuario").value;
  const senha = document.getElementById("login-senha").value;
  const mensagemErro = document.getElementById("login-erro");

  try {
    const dados = await fazerLogin(usuario, senha);
    // guardo o token no localStorage pra continuar logado quando trocar de página
    localStorage.setItem("token_aurea_den", dados.access_token);
    localStorage.setItem("usuario_aurea_den", usuario);
    location.reload();
  } catch (erro) {
    mensagemErro.textContent = erro.message;
  }
});

formCadastro.addEventListener("submit", async (evento) => {
  evento.preventDefault();
  const usuario = document.getElementById("cadastro-usuario").value;
  const senha = document.getElementById("cadastro-senha").value;
  const mensagemErro = document.getElementById("cadastro-erro");

  try {
    const dados = await registrarUsuario(usuario, senha);
    localStorage.setItem("token_aurea_den", dados.access_token);
    localStorage.setItem("usuario_aurea_den", usuario);
    location.reload();
  } catch (erro) {
    mensagemErro.textContent = erro.message;
  }
});

// se já tiver logado, troca o botão de "entrar" pra mostrar o nome do usuário
function atualizarBotaoConta() {
  const usuarioLogado = localStorage.getItem("usuario_aurea_den");
  if (usuarioLogado) {
    botaoConta.textContent = usuarioLogado[0].toUpperCase();
    botaoConta.title = `Logado como ${usuarioLogado} (clica pra sair)`;
    botaoConta.onclick = () => {
      localStorage.removeItem("token_aurea_den");
      localStorage.removeItem("usuario_aurea_den");
      location.reload();
    };
  }
}

atualizarBotaoConta();
