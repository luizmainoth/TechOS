const API_URL = "http://localhost:8080/atletas";

const form = document.getElementById("form-os");
const formTitulo = document.getElementById("form-titulo");
const btnSalvar = document.getElementById("btn-salvar");
const btnCancelar = document.getElementById("btn-cancelar");
const listaEl = document.getElementById("lista-os");
const vazioEl = document.getElementById("vazio");
const contadorEl = document.getElementById("contador");
const mensagemEl = document.getElementById("mensagem");

const inputPesquisa = document.getElementById("input-pesquisa");
const cpfInput = document.getElementById("cpf-cliente");
const nomeInput = document.getElementById("nome-cliente");
const dataEntradaInput = document.getElementById("data-entrada");

let todasOS = [];

document.addEventListener("DOMContentLoaded", () => {
  carregarOS();
  // Limita o calendário para não aceitar datas futuras
  if (dataEntradaInput) {
    const dataHoje = new Date().toISOString().split("T")[0]; 
    dataEntradaInput.setAttribute("max", dataHoje);
  }
});

form.addEventListener("submit", salvarOuAtualizar);
btnCancelar.addEventListener("click", cancelarEdicao);
if(inputPesquisa) inputPesquisa.addEventListener("input", filtrarOS);
if(cpfInput) cpfInput.addEventListener("input", formatarCPF);
if(nomeInput) nomeInput.addEventListener("input", bloquearNumeros);

// --- FUNÇÕES DE CARREGAMENTO E LISTAGEM (BANCO DE DADOS) ---
async function carregarOS() {
  try {
    const resposta = await fetch(API_URL);
    if (!resposta.ok) throw new Error("Falha API");

    todasOS = await resposta.json();
    renderizarLista(todasOS);
  } catch (erro) {
    mostrarMensagem("SYS_ERROR: FALHA NA CONEXÃO COM O SERVIDOR (SPRING BOOT DESLIGADO?).", "erro");
  }
}

function renderizarLista(lista) {
  listaEl.innerHTML = "";
  contadorEl.textContent = lista.length;

  if (lista.length === 0) {
    vazioEl.hidden = false;
    return;
  }

  vazioEl.hidden = true;

  // Dicionário Hacker: Traduz o que vem do banco para a interface
  const tradutorOperacoes = {
    "Livre": "MONTAGEM",
    "Costas": "LIMPEZA",
    "Peito": "FORMATAÇÃO",
    "Borboleta": "UPGRADE",
    "Medley": "REPARO"
  };

  lista.forEach((os) => {
    const tr = document.createElement("tr");

    // Usa o tradutor. Se o banco mandar algo estranho, exibe o que veio ou "—"
    const operacaoTraduzida = tradutorOperacoes[os.estilo] || os.estilo || "—";

    tr.innerHTML = `
      <td><span style="color: var(--neon-cyan)">${os.matricula || "-"}</span></td>
      <td><strong>${os.nome}</strong></td>
      <td><span class="os-tag">${operacaoTraduzida}</span></td>
      <td>${os.idade ?? "-"} D</td>
      <td style="color: var(--text-muted)">${os.cpf ?? "-"}</td>
      <td style="color: var(--neon-green)">R$ ${Number(os.mensalidade ?? 0).toFixed(2)}</td>
      <td>${os.tempoProva ?? "-"} D</td>
      <td>
        <button type="button" class="btn-mini edit-btn" data-id="${os.id}">[EDT]</button>
        <button type="button" class="btn-mini del del-btn" data-id="${os.id}">[DEL]</button>
      </td>
    `;

    tr.querySelector(".edit-btn").addEventListener("click", () => preencherFormularioParaEdicao(os));
    tr.querySelector(".del-btn").addEventListener("click", () => excluirOS(os.id, os.nome));

    listaEl.appendChild(tr);
  });
}

// --- FUNÇÕES DE SALVAR, EDITAR E EXCLUIR (CRUD) ---
async function salvarOuAtualizar(evento) {
  evento.preventDefault();

  const id = document.getElementById("os-id").value;
  const valorDataEntrada = document.getElementById("data-entrada").value;
  const diasNaOficina = calcularDias(valorDataEntrada);

  // Mapeamento invisível para a API de Atletas aceitar os dados
  const dados = {
    nome: document.getElementById("nome-cliente").value,
    idade: diasNaOficina, 
    cpf: document.getElementById("cpf-cliente").value,
    matricula: document.getElementById("codigo-os").value,
    estilo: document.getElementById("tipo-servico").value,
    mensalidade: Number(document.getElementById("valor-servico").value),
    tempoProva: Number(document.getElementById("prazo-entrega").value),
  };

  if (!validarDados(dados, valorDataEntrada)) {
    return;
  }

  try {
    let resposta;
    if (id) {
      resposta = await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dados),
      });
    } else {
      resposta = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dados),
      });
    }

    if (!resposta.ok) throw new Error("Erro ao salvar");

    mostrarMensagem(id ? "SYS_MSG: REGISTRO ATUALIZADO." : "SYS_MSG: NOVA O.S. INICIALIZADA.", "sucesso");
    cancelarEdicao();
    carregarOS();
    if(inputPesquisa) inputPesquisa.value = ""; 
  } catch (erro) {
    mostrarMensagem("SYS_ERROR: NÃO FOI POSSÍVEL GRAVAR NO BD.", "erro");
  }
}

function preencherFormularioParaEdicao(os) {
  document.getElementById("os-id").value = os.id;
  document.getElementById("nome-cliente").value = os.nome ?? "";
  document.getElementById("data-entrada").value = ""; // Limpo, pois o BD retorna os dias e não a data em si
  document.getElementById("cpf-cliente").value = os.cpf ?? "";
  document.getElementById("codigo-os").value = os.matricula ?? "";
  document.getElementById("tipo-servico").value = os.estilo ?? "";
  document.getElementById("valor-servico").value = os.mensalidade ?? "";
  document.getElementById("prazo-entrega").value = os.tempoProva ?? "";

  formTitulo.textContent = "> EDITAR_OS";
  btnSalvar.textContent = "UPDATE()";
  btnCancelar.hidden = false;

  window.scrollTo({ top: 0, behavior: "smooth" });
}

function cancelarEdicao() {
  form.reset();
  document.getElementById("os-id").value = "";
  formTitulo.textContent = "> INICIALIZAR_NOVA_OS";
  btnSalvar.textContent = "EXECUTE()";
  btnCancelar.hidden = true;
}

async function excluirOS(id, nome) {
  if (!confirm(`[ATENÇÃO] PURGAR REGISTRO DE "${nome}"?`)) return;

  try {
    const resposta = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
    if (!resposta.ok) throw new Error("Erro ao excluir");

    mostrarMensagem("SYS_MSG: REGISTRO PURGADO.", "sucesso");
    carregarOS();
  } catch (erro) {
    mostrarMensagem("SYS_ERROR: FALHA AO EXCLUIR.", "erro");
  }
}

// --- FUNÇÕES DE VALIDAÇÃO E FILTROS ---
function validarDados(dados, dataEntrada) {
  const cpfApenasNumeros = dados.cpf.replace(/\D/g, '');
  const dataDigitada = new Date(dataEntrada);
  const dataDeHoje = new Date();

  if (dados.nome.trim().length < 3) {
    mostrarMensagem("SYS_WARN: NOME REQUER MIN. 3 CARACTERES.", "erro");
    return false;
  }
  if (dataDigitada > dataDeHoje) {
    mostrarMensagem("SYS_WARN: DATA DE ENTRADA INVÁLIDA (FUTURO).", "erro");
    return false;
  }
  if (cpfApenasNumeros.length !== 11) {
    mostrarMensagem("SYS_WARN: CPF REQUER 11 DÍGITOS.", "erro");
    return false;
  }
  if (dados.mensalidade < 0) {
    mostrarMensagem("SYS_WARN: VALOR FINANCEIRO NEGATIVO BLOQUEADO.", "erro");
    return false;
  }
  if (dados.tempoProva < 0) {
    mostrarMensagem("SYS_WARN: PRAZO NEGATIVO BLOQUEADO.", "erro");
    return false;
  }
  return true;
}

function formatarCPF(evento) {
  let valor = evento.target.value.replace(/\D/g, "");
  valor = valor.replace(/(\d{3})(\d)/, "$1.$2");
  valor = valor.replace(/(\d{3})(\d)/, "$1.$2");
  valor = valor.replace(/(\d{3})(\d{1,2})$/, "$1-$2");
  evento.target.value = valor;
}

function bloquearNumeros(evento) {
  evento.target.value = evento.target.value.replace(/\d/g, "");
}

function calcularDias(dataEntrada) {
  if (!dataEntrada) return 0;
  const hoje = new Date();
  const entrada = new Date(dataEntrada);
  const diffTime = Math.abs(hoje - entrada);
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
}

function filtrarOS(evento) {
  const termo = evento.target.value.toLowerCase();
  const osFiltradas = todasOS.filter(os => {
    return (os.nome && os.nome.toLowerCase().includes(termo)) ||
           (os.cpf && os.cpf.includes(termo)) ||
           (os.matricula && os.matricula.toLowerCase().includes(termo)) ||
           (os.estilo && os.estilo.toLowerCase().includes(termo));
  });
  renderizarLista(osFiltradas);
}

function mostrarMensagem(texto, tipo) {
  mensagemEl.textContent = texto;
  mensagemEl.className = `mensagem ${tipo}`;
  mensagemEl.hidden = false;
  setTimeout(() => { mensagemEl.hidden = true; }, 4000);
}