// aqui fica o endereço da nossa API (o backend em FastAPI)
// enquanto tô testando na minha máquina uso o localhost, depois troco pra URL do Railway
const URL_API = "https://aurea-den-production.up.railway.app";

// monta o header de autorização usando o token guardado no localStorage
function cabecalhoAutorizado() {
  const token = localStorage.getItem("token_aurea_den");
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}

// pega a lista de filmes lá do banco
async function buscarFilmes() {
  const resposta = await fetch(`${URL_API}/movies/`);
  if (!resposta.ok) {
    throw new Error("Deu ruim pra buscar os filmes");
  }
  return resposta.json();
}

// manda um filme novo pra API (só ADM consegue, por causa do token)
async function cadastrarFilme(filme) {
  const resposta = await fetch(`${URL_API}/movies/`, {
    method: "POST",
    headers: cabecalhoAutorizado(),
    body: JSON.stringify(filme),
  });

  if (!resposta.ok) {
    const erro = await resposta.json();
    throw new Error(erro.detail || "Não deu pra cadastrar o filme");
  }

  return resposta.json();
}

// edita um filme que já existe (manda só os campos que mudaram)
async function atualizarFilme(idFilme, dadosParciais) {
  const resposta = await fetch(`${URL_API}/movies/${idFilme}`, {
    method: "PUT",
    headers: cabecalhoAutorizado(),
    body: JSON.stringify(dadosParciais),
  });

  if (!resposta.ok) {
    const erro = await resposta.json();
    throw new Error(erro.detail || "Não deu pra editar o filme");
  }

  return resposta.json();
}

// apaga um filme (só ADM)
async function apagarFilme(idFilme) {
  const resposta = await fetch(`${URL_API}/movies/${idFilme}`, {
    method: "DELETE",
    headers: cabecalhoAutorizado(),
  });

  if (!resposta.ok) {
    const erro = await resposta.json();
    throw new Error(erro.detail || "Não deu pra apagar o filme");
  }

  return resposta.json();
}

// cria a conta do usuário (com a role escolhida no drop) e já devolve o token de login
async function registrarUsuario(nomeUsuario, senha, role) {
  const resposta = await fetch(`${URL_API}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username: nomeUsuario, password: senha, role: role }),
  });

  if (!resposta.ok) {
    const erro = await resposta.json();
    throw new Error(erro.detail || "Não deu pra criar a conta");
  }

  return resposta.json();
}

// faz login (essa rota é diferente das outras, ela pede um formulário e não um json)
async function fazerLogin(nomeUsuario, senha) {
  const dadosForm = new URLSearchParams();
  dadosForm.append("username", nomeUsuario);
  dadosForm.append("password", senha);

  const resposta = await fetch(`${URL_API}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: dadosForm,
  });

  if (!resposta.ok) {
    const erro = await resposta.json();
    throw new Error(erro.detail || "Usuário ou senha errados");
  }

  return resposta.json();
}
