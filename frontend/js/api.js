// aqui fica o endereço da nossa API (o backend em FastAPI)
// enquanto tô testando na minha máquina uso o localhost, depois troco pra URL do Railway
const URL_API = "http://127.0.0.1:8000";

// pega a lista de filmes lá do banco
async function buscarFilmes() {
  const resposta = await fetch(`${URL_API}/filmes/`);
  if (!resposta.ok) {
    throw new Error("Deu ruim pra buscar os filmes");
  }
  return resposta.json();
}

// manda um filme novo pra API (só funciona se tiver logado, por isso o token)
async function cadastrarFilme(filme) {
  const token = localStorage.getItem("token_aurea_den");

  const resposta = await fetch(`${URL_API}/filmes/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(filme),
  });

  if (!resposta.ok) {
    const erro = await resposta.json();
    throw new Error(erro.detail || "Não deu pra cadastrar o filme");
  }

  return resposta.json();
}

// cria a conta do usuário e já devolve o token de login
async function registrarUsuario(nomeUsuario, senha) {
  const resposta = await fetch(`${URL_API}/auth/registrar`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ nome_usuario: nomeUsuario, senha: senha }),
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
