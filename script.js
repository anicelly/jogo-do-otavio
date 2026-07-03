const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
const mensagem = document.getElementById("mensagem");
ctx.imageSmoothingEnabled = false;

const spriteBossSupremo = new Image();
spriteBossSupremo.src = "assets/mihawk-pixel-art.png";

const musicaGokuArquivo = new Audio("assets/goku-theme.mp3");
musicaGokuArquivo.loop = true;
musicaGokuArquivo.preload = "auto";
musicaGokuArquivo.volume = 0.58;

const musicaNeymarArquivo = new Audio("assets/neymar-theme.mp3");
musicaNeymarArquivo.loop = true;
musicaNeymarArquivo.preload = "auto";
musicaNeymarArquivo.volume = 0.58;

const keys = {};
let faseAtual = 0;
let moedas = 0;
let pontosDestruicao = 0;
let comboDestruicao = 0;
let comboDestruicaoTempo = 0;
let faseBonusTimer = 480;
let faseBonusConcluida = false;
let pausadoAntesLoja = false;
let multiplayerAtivo = false;
let personagem2Atual = "luquinhas";
let comboCombate = 0;
let comboCombateTempo = 0;
let nivelRpg = 1;
let experienciaRpg = 0;
let hitStopFrames = 0;
let flashImpacto = 0;
let modoVersus = false;
let vidaVersusP1 = 100;
let vidaVersusP2 = 100;
let cameraImpacto = 0;
let recordeFase = 0;
let carteira = carregarCarteira();
let moedasLoja = carteira.moedas;
let diamantes = carteira.diamantes;
let inventarioLoja = carteira.inventario;
nivelRpg = carteira.progresso.nivel;
experienciaRpg = carteira.progresso.experiencia;
recordeFase = carteira.progresso.recordeFase;
let yoshis = 0;
let venceu = false;
let gameOver = false;
let jogoIniciado = false;
let pausado = false;
let frame = 0;
let aviso = "";
let avisoTempo = 0;
let tremor = 0;
let bannerFase = 160;
let somLigado = true;
let audioCtx = null;
let musicaTimer = 0;
let notaMusica = 0;
let personagemAtual = "joao";
const particulas = [];
const meteoros = [];
const poderes = [];
const AJUSTE_VELOCIDADE_JOGAVEL = 0.78;
const AJUSTE_MESSI_JOGAVEL = 0.65;
const AJUSTE_METEORO_JOGAVEL = 0.62;
const AJUSTE_PODER_VILAO_JOGAVEL = 0.7;
const ESCALA_VISUAL_PLAYER = 1.28;
const MODO_HARD_GLOBAL = true;
const ALTURA_MINIMA_VOO_GOKU = 96;
const ENERGIA_MAXIMA_VOO_GOKU = 300;
let chefeTimer = null;
let chefeTimerAtivo = false;
let chefeTimerAlvo = null;
let poderNeymarCooldown = 0;
let proximoPoderNeymar = "muletaPower";
let genkiDamaCooldown = 0;
let poderRobloxCooldown = 0;
let proximoPoderRoblox = "celular";
let poderCR7Cooldown = 0;
let poderHarryCooldown = 0;
let buffonTempo = 0;
let proximoPoderCR7 = "bicicletaCR7";
let poderChavesCooldown = 0;
let poderChavesSucoCooldown = 90;
let proximoPoderChaves = "sanduichePresunto";
let poderEsqueletoCooldown = 0;
let segundoCorteEsqueleto = 0;
let poderSilvioCooldown = 0;
let proximoPoderSilvio = "jequiti";
const botaoSom = document.getElementById("botaoSom");
const activePlayerLabel = document.getElementById("activePlayerLabel");
const deviceMode = document.getElementById("deviceMode");
const loja = document.getElementById("loja");
const saldoLoja = document.getElementById("saldoLoja");
const avisoLoja = document.getElementById("avisoLoja");
const botaoMultiplayer = document.getElementById("botaoMultiplayer");
const player2Character = document.getElementById("player2Character");
const missionObjective = document.getElementById("missionObjective");
const missionHint = document.getElementById("missionHint");
const missionProgress = document.getElementById("missionProgress");
const missionCombo = document.getElementById("missionCombo");
const missionRewards = document.getElementById("missionRewards");
const partyP1 = document.getElementById("partyP1");
const partyP2 = document.getElementById("partyP2");
const partyMode = document.getElementById("partyMode");
const levelLabel = document.getElementById("levelLabel");
const xpLabel = document.getElementById("xpLabel");
const xpFill = document.getElementById("xpFill");
const botaoVersus = document.getElementById("botaoVersus");
const fighterName = document.getElementById("fighterName");
const fighterPower = document.getElementById("fighterPower");
const fighterStrength = document.getElementById("fighterStrength");
const fighterSpeed = document.getElementById("fighterSpeed");
const fighterSpecial = document.getElementById("fighterSpecial");
const fighterAvatar = document.getElementById("fighterAvatar");

function carregarCarteira() {
  const padrao = { moedas: 0, diamantes: 0, inventario: { vidas: 0, segundosExtras: 0 }, progresso: { nivel: 1, experiencia: 0, recordeFase: 0 } };
  try {
    const salva = JSON.parse(localStorage.getItem("reinoPixelCarteira") || "null");
    if (!salva) return padrao;
    return {
      moedas: Number.isFinite(salva.moedas) ? Math.max(0, salva.moedas) : 0,
      diamantes: Number.isFinite(salva.diamantes) ? Math.max(0, salva.diamantes) : 0,
      inventario: {
        vidas: Number.isFinite(salva.inventario?.vidas) ? Math.max(0, salva.inventario.vidas) : 0,
        segundosExtras: Number.isFinite(salva.inventario?.segundosExtras) ? Math.max(0, salva.inventario.segundosExtras) : 0
      },
      progresso: {
        nivel: Number.isFinite(salva.progresso?.nivel) ? Math.max(1, salva.progresso.nivel) : 1,
        experiencia: Number.isFinite(salva.progresso?.experiencia) ? Math.max(0, salva.progresso.experiencia) : 0,
        recordeFase: Number.isFinite(salva.progresso?.recordeFase) ? Math.max(0, salva.progresso.recordeFase) : 0
      }
    };
  } catch {
    return padrao;
  }
}

function salvarCarteira() {
  try {
    localStorage.setItem("reinoPixelCarteira", JSON.stringify({ moedas: moedasLoja, diamantes, inventario: inventarioLoja, progresso: { nivel: nivelRpg, experiencia: experienciaRpg, recordeFase } }));
  } catch {
    // O jogo continua normalmente quando o navegador bloqueia armazenamento local.
  }
}

function atualizarPainelLoja() {
  if (!saldoLoja) return;
  saldoLoja.textContent = moedasLoja + " moedas • " + diamantes + " diamantes • " + inventarioLoja.vidas + " vidas • " + inventarioLoja.segundosExtras + "s guardados";
}

function alternarLoja() {
  const abrindo = loja.hidden;
  loja.hidden = !abrindo;
  if (abrindo) {
    pausadoAntesLoja = pausado;
    pausado = true;
    atualizarPainelLoja();
    avisoLoja.textContent = "Compre melhorias permanentes com os prêmios das fases.";
    loja.scrollIntoView({ behavior: "smooth", block: "nearest" });
  } else {
    pausado = pausadoAntesLoja;
  }
}

function comprarItemLoja(item) {
  const compras = {
    vida: { moedas: 30, aplicar: () => inventarioLoja.vidas++ },
    tempo: { moedas: 20, aplicar: () => inventarioLoja.segundosExtras += 10 },
    kit: { diamantes: 3, aplicar: () => { inventarioLoja.vidas++; inventarioLoja.segundosExtras += 15; } }
  };
  const compra = compras[item];
  if (!compra) return;
  if ((compra.moedas || 0) > moedasLoja || (compra.diamantes || 0) > diamantes) {
    avisoLoja.textContent = "Saldo insuficiente. Destrua objetos e colete prêmios.";
    return;
  }
  moedasLoja -= compra.moedas || 0;
  diamantes -= compra.diamantes || 0;
  compra.aplicar();
  salvarCarteira();
  atualizarPainelLoja();
  avisoLoja.textContent = "Compra concluída e salva no inventário!";
  tocarSom("moeda");
}

function registrarComboCombate() {
  comboCombate = comboCombateTempo > 0 ? comboCombate + 1 : 1;
  comboCombateTempo = 150;
  if (comboCombate >= 5 && comboCombate % 5 === 0) {
    moedas += 2;
    moedasLoja += 2;
    salvarCarteira();
    criarParticulas(joao.x + joao.w / 2, joao.y, "#ffd43b", 24);
    mostrarAviso("RUSH x" + comboCombate + "! +2 moedas de estilo!");
  }
}

function ganharExperiencia(quantidade) {
  experienciaRpg += quantidade;
  const necessario = nivelRpg * 100;
  if (experienciaRpg >= necessario) {
    experienciaRpg -= necessario;
    nivelRpg++;
    moedas += 10;
    moedasLoja += 10;
    salvarCarteira();
    mostrarAviso("SUBIU PARA O NÍVEL " + nivelRpg + "! +10 moedas!");
    tocarSom("vitoria");
  }
  salvarCarteira();
}

function atualizarPainelMissao() {
  if (!missionObjective || frame % 10 !== 0) return;
  const fase = fases[faseAtual];
  if (modoVersus) {
    missionObjective.textContent = "Duelo local: reduza a vida rival a zero";
    missionHint.textContent = "Ataques alternam SOCO → CHUTE → ESPECIAL";
    missionProgress.textContent = vidaVersusP1 + " HP × " + vidaVersusP2 + " HP";
  } else if (fase.bonus) {
    const total = fase.destrutiveis.length;
    const destruidos = fase.destrutiveis.filter(objeto => objeto.quebrado).length;
    missionObjective.textContent = "Destrua o carro e o barril";
    missionHint.textContent = "Ataque rápido: carro 12 golpes · barril 6 golpes · 8 segundos";
    missionProgress.textContent = destruidos + "/" + total + " objetos";
  } else if (fase.labirinto) {
    const coletadas = fase.moedas.filter(moeda => moeda.coletada).length;
    missionObjective.textContent = "Encontre a saida do labirinto verdadeiro";
    missionHint.textContent = "Evite Pacs, ilusoes e areia movedica";
    missionProgress.textContent = coletadas + "/" + fase.moedas.length + " moedas";
  } else {
    const chefes = fase.inimigos.filter(ehChefeVilao);
    const derrotados = fase.inimigos.filter(inimigo => inimigo.morto).length;
    const chefesVivos = chefes.filter(chefe => !chefe.morto).length;
    missionObjective.textContent = chefesVivos > 0 ? "Derrote os chefões e alcance o troféu" : "Caminho livre: entre no portal";
    missionHint.textContent = fase.tipoArmadilha ? "Armadilha desta fase: " + fase.tipoArmadilha.nome : "Explore e colete os prêmios";
    missionProgress.textContent = derrotados + "/" + fase.inimigos.length + " vilões";
  }
  missionCombo.textContent = comboCombate > 1 ? "RUSH x" + comboCombate : (multiplayerAtivo ? "COOP" : "NORMAL");
  missionRewards.textContent = moedasLoja + " ◉ · " + diamantes + " ◆";
  if (partyP1) partyP1.textContent = joao.nome;
  if (partyP2) partyP2.textContent = jogador2.nome.replace(/^P2\s+/, "");
  if (partyMode) partyMode.textContent = multiplayerAtivo ? "Membro ativo" : "Aguardando coop";
  if (levelLabel) levelLabel.textContent = "NÍVEL " + nivelRpg;
  if (xpLabel) xpLabel.textContent = experienciaRpg + " / " + (nivelRpg * 100) + " XP";
  if (xpFill) xpFill.style.width = Math.min(100, experienciaRpg / (nivelRpg * 100) * 100) + "%";
}

function alternarMultiplayer() {
  if (modoVersus) {
    multiplayerAtivo = true;
    mostrarAviso("O modo VERSUS exige dois jogadores.");
    return;
  }
  multiplayerAtivo = !multiplayerAtivo;
  botaoMultiplayer.textContent = "2 jogadores: " + (multiplayerAtivo ? "sim" : "não");
  botaoMultiplayer.classList.toggle("is-active", multiplayerAtivo);
  resetarPersonagens();
  mostrarAviso(multiplayerAtivo ? "COOP ATIVO: se um cair, os dois perdem!" : "Modo para um jogador ativo.");
}

function alternarModoVersus() {
  modoVersus = !modoVersus;
  multiplayerAtivo = modoVersus || multiplayerAtivo;
  botaoVersus.textContent = "Modo: " + (modoVersus ? "VERSUS" : "campanha");
  botaoVersus.classList.toggle("is-active", modoVersus);
  botaoMultiplayer.textContent = "2 jogadores: " + (multiplayerAtivo ? "sim" : "não");
  botaoMultiplayer.classList.toggle("is-active", multiplayerAtivo);
  vidaVersusP1 = 100;
  vidaVersusP2 = 100;
  gameOver = false;
  venceu = false;
  jogoIniciado = true;
  resetarPersonagens();
  mostrarAviso(modoVersus ? "VERSUS! P1 contra P2!" : "Campanha restaurada.");
}

function detectarDispositivo() {
  const largura = Math.min(window.innerWidth, window.screen.width || window.innerWidth);
  const toque = navigator.maxTouchPoints > 0 || window.matchMedia("(pointer: coarse)").matches;

  if (toque && largura <= 767) return "mobile";
  if (toque && largura <= 1180) return "tablet";
  return "desktop";
}

function aplicarModoDispositivo() {
  const modo = detectarDispositivo();
  document.body.classList.toggle("has-touch", modo !== "desktop");
  document.body.classList.toggle("device-mobile", modo === "mobile");
  document.body.classList.toggle("device-tablet", modo === "tablet");
  document.body.classList.toggle("device-desktop", modo === "desktop");

  if (deviceMode) {
    const nome = modo === "mobile" ? "Celular" : modo === "tablet" ? "Tablet" : "Desktop";
    deviceMode.innerHTML = "<strong>Modo</strong> " + nome;
  }
}

aplicarModoDispositivo();
window.addEventListener("resize", aplicarModoDispositivo);

const controlesMobile = { left: "a", jump: "w", right: "d", down: "s", attack: "x" };

document.addEventListener("keydown", event => {
  if (["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Enter"].includes(event.key) && jogoIniciado) {
    event.preventDefault();
  }
  iniciarAudio();
  if (gameOver && (event.key === "Enter" || event.key === " ")) {
    reiniciarJogo();
    return;
  }
  if (event.key === "Enter" || event.key === " ") {
    jogoIniciado = true;
  }
  if (event.key.toLowerCase() === "p" && jogoIniciado && !venceu && !gameOver) {
    pausado = !pausado;
  }
  keys[event.key.toLowerCase()] = true;
  keys[event.key] = true;
});

document.addEventListener("keyup", event => {
  keys[event.key.toLowerCase()] = false;
  keys[event.key] = false;
});

document.addEventListener("pointerdown", iniciarAudio, { once: false });

function soltarControlesMobile() {
  Object.values(controlesMobile).forEach(key => {
    keys[key] = false;
    if (key.length === 1) keys[key.toLowerCase()] = false;
  });
  document.querySelectorAll(".touch-btn").forEach(botao => botao.classList.remove("is-pressed"));
}

document.querySelectorAll(".player-choice").forEach(botao => {
  botao.addEventListener("click", () => {
    soltarControlesMobile();
    selecionarPersonagem(botao.dataset.character);
    document.querySelectorAll(".player-choice").forEach(b => b.classList.toggle("is-selected", b === botao));
  });
});

document.querySelectorAll(".touch-btn").forEach(botao => {
  const action = botao.dataset.action;

  const obterKey = () => controlesMobile[action];

  const pressionar = event => {
    event.preventDefault();
    iniciarAudio();
    jogoIniciado = true;
    const key = obterKey();
    keys[key] = true;
    if (key.length === 1) keys[key.toLowerCase()] = true;
    botao.classList.add("is-pressed");
  };

  const soltar = event => {
    event.preventDefault();
    const key = obterKey();
    keys[key] = false;
    if (key.length === 1) keys[key.toLowerCase()] = false;
    botao.classList.remove("is-pressed");
  };

  botao.addEventListener("pointerdown", pressionar);
  botao.addEventListener("pointerup", soltar);
  botao.addEventListener("pointerleave", soltar);
  botao.addEventListener("pointercancel", soltar);
});

const joao = criarJogador("Joao", 52, "#e63946", "#1d3557", "#3b1f0f");
const luquinhas = criarJogador("Luquinhas", 112, "#457bff", "#191919", "#111111");
const jogador2 = criarJogador("Jogador 2", 106, "#457bff", "#191919", "#111111");
jogador2.avatar = "humano";

const personagensDisponiveis = {
  joao: { nome: "Joao", camisa: "#e63946", calca: "#1d3557", cabelo: "#3b1f0f", avatar: "humano", numero: "" },
  luquinhas: { nome: "Luquinhas", camisa: "#457bff", calca: "#191919", cabelo: "#111111", avatar: "humano", numero: "" },
  cr7: { nome: "CR7", camisa: "#f7f3de", calca: "#d90429", cabelo: "#24130c", avatar: "humano", numero: "7" },
  messi: { nome: "Messi", camisa: "#74c0fc", calca: "#ffffff", cabelo: "#5c2e12", avatar: "humano", numero: "10" },
  yoshi: { nome: "Yoshi", camisa: "#36c96b", calca: "#f7f3de", cabelo: "#36c96b", avatar: "yoshi", numero: "" },
  harry: { nome: "Harry Potter", camisa: "#5c2e12", calca: "#111827", cabelo: "#111111", avatar: "harry", numero: "HP" },
  rangerVermelho: { nome: "Power Ranger Vermelho", camisa: "#d90429", calca: "#f7f3de", cabelo: "#d90429", avatar: "rangerVermelho", numero: "R" },
  ancelotti: { nome: "Carlo Ancelotti", camisa: "#1d3557", calca: "#111827", cabelo: "#d0d7de", avatar: "ancelotti", numero: "CA" },
  neymar: { nome: "Neymar", camisa: "#ffe066", calca: "#2457c5", cabelo: "#f7c948", avatar: "neymar", numero: "10" },
  goku: { nome: "Goku", camisa: "#ff7b00", calca: "#0b5ed7", cabelo: "#111111", avatar: "goku", numero: "" },
  meninoRoblox: { nome: "Menino Roblox", camisa: "#e03131", calca: "#1971c2", cabelo: "#5c2e12", avatar: "meninoRoblox", numero: "R" },
  chaves: { nome: "Chaves", camisa: "#d8c9a7", calca: "#2f6f9f", cabelo: "#5c3b1e", avatar: "chaves", numero: "" },
  esqueleto: { nome: "Esqueleto", camisa: "#f7f3de", calca: "#d0d7de", cabelo: "#111111", avatar: "esqueleto", numero: "" },
  silvioSantos: { nome: "Silvio Santos", camisa: "#1d3557", calca: "#111827", cabelo: "#d0d7de", avatar: "silvioSantos", numero: "" }
};

const perfisLutadores = {
  joao: ["Impacto do Reino e força equilibrada", 8, 7, 9], luquinhas: ["Raio Azul Supremo e alta velocidade", 7, 9, 9],
  cr7: ["Bicicletas, Buffon e SIUUU", 9, 8, 9], yoshi: ["Chama verde, esferas e salto", 8, 9, 9],
  messi: ["Drible e Bola de Ouro explosiva", 9, 9, 10], harry: ["Pomo, Expelliarmus, Patrono e vassoura", 8, 9, 10],
  rangerVermelho: ["Espada de energia vermelha", 9, 8, 9], ancelotti: ["Lança Endrick em cima do banco", 8, 6, 10], neymar: ["Muleta, fogo e Bruna", 8, 9, 9],
  goku: ["Voo e Genki Dama", 10, 8, 10], meninoRoblox: ["Celular e placa", 7, 8, 8],
  chaves: ["Barril, sanduíche e tamarindo", 8, 6, 9], esqueleto: ["Cortes duplos", 9, 7, 8],
  silvioSantos: ["Jequiti e microfone", 7, 7, 10]
};

function atualizarFichaLutador(id) {
  const escolhido = personagensDisponiveis[id];
  const perfil = perfisLutadores[id] || perfisLutadores.joao;
  if (fighterName) fighterName.textContent = escolhido.nome;
  if (fighterPower) fighterPower.textContent = perfil[0];
  if (fighterStrength) fighterStrength.textContent = perfil[1];
  if (fighterSpeed) fighterSpeed.textContent = perfil[2];
  if (fighterSpecial) fighterSpecial.textContent = perfil[3];
  if (fighterAvatar) {
    fighterAvatar.textContent = escolhido.numero || escolhido.nome.slice(0, 2).toUpperCase();
    fighterAvatar.style.background = "linear-gradient(145deg," + escolhido.camisa + "," + escolhido.calca + ")";
  }
}

function selecionarPersonagem2(id) {
  const idValido = personagensDisponiveis[id] ? id : "luquinhas";
  const escolhido = personagensDisponiveis[idValido];
  personagem2Atual = idValido;
  jogador2.nome = "P2 " + escolhido.nome;
  jogador2.personagemId = idValido;
  jogador2.corCamisa = escolhido.camisa;
  jogador2.corCalca = escolhido.calca;
  jogador2.cabelo = escolhido.cabelo;
  jogador2.avatar = escolhido.avatar;
  jogador2.numero = escolhido.numero;
  jogador2.grande = false;
  jogador2.nuvem = false;
  jogador2.superSayajin = false;
  jogador2.montado = false;
  jogador2.montaria = null;
  jogador2.superMario = false;
  if (player2Character && player2Character.value !== idValido) player2Character.value = idValido;
  if (multiplayerAtivo) {
    resetarPersonagens();
    mostrarAviso("Jogador 2 escolheu " + escolhido.nome + "!");
  }
}

function selecionarPersonagem(id) {
  const idValido = personagensDisponiveis[id] ? id : "joao";
  const escolhido = personagensDisponiveis[idValido];
  personagemAtual = idValido;
  musicaTimer = 0;
  notaMusica = 0;
  joao.nome = escolhido.nome;
  joao.personagemId = idValido;
  joao.corCamisa = escolhido.camisa;
  joao.corCalca = escolhido.calca;
  joao.cabelo = escolhido.cabelo;
  joao.avatar = escolhido.avatar;
  joao.numero = escolhido.numero;
  joao.nuvem = false;
  joao.superSayajin = false;
  joao.energiaVoo = ENERGIA_MAXIMA_VOO_GOKU;
  joao.grande = false;
  joao.poderTempo = 0;
  joao.montado = false;
  joao.montaria = null;
  joao.superMario = false;
  poderNeymarCooldown = 0;
  proximoPoderNeymar = "muletaPower";
  poderHarryCooldown = 0;
  poderChavesCooldown = 0;
  poderChavesSucoCooldown = 90;
  proximoPoderChaves = "sanduichePresunto";
  poderEsqueletoCooldown = 0;
  segundoCorteEsqueleto = 0;
  poderCR7Cooldown = 0;
  buffonTempo = 0;
  proximoPoderCR7 = "bicicletaCR7";
  poderSilvioCooldown = 0;
  proximoPoderSilvio = "jequiti";
  sincronizarMusicaGoku(true);
  sincronizarMusicaNeymar(true);
  atualizarFichaLutador(idValido);

  if (activePlayerLabel) {
    activePlayerLabel.innerText = "Personagem: " + escolhido.nome;
  }
}

selecionarPersonagem("joao");
selecionarPersonagem2("luquinhas");

if (player2Character) {
  player2Character.addEventListener("change", event => selecionarPersonagem2(event.target.value));
}

const fases = [
  {
    nome: "Fase 1 - Programa de Auditório",
    fundo: ["#77c8ff", "#9ee493"],
    tema: "auditorio",
    plataformas: [
      { x: 0, y: 486, w: 960, h: 54, tipo: "grama" },
      { x: 178, y: 386, w: 176, h: 24, tipo: "grama" },
      { x: 502, y: 322, w: 190, h: 24, tipo: "grama" },
      { x: 744, y: 410, w: 132, h: 24, tipo: "grama" }
    ],
    portal: { x: 858, y: 426, w: 58, h: 60 },
    yoshi: { x: 612, y: 280, salvo: false },
    moedas: [
      { x: 238, y: 342, coletada: false },
      { x: 552, y: 278, coletada: false },
      { x: 820, y: 370, coletada: false }
    ],
    cogumelos: [
      { x: 314, y: 354, coletado: false }
    ],
    inimigos: [
      criarVilao("meninoRoblox", 416, 428, 1.65, 360, 650),
      criarSilvioBoss(720, 420)
    ]
  },
  {
    nome: "Fase 2 - Mina da Armadura",
    fundo: ["#36416d", "#1b1f38"],
    tema: "caverna",
    plataformas: [
      { x: 0, y: 486, w: 960, h: 54, tipo: "pedra" },
      { x: 88, y: 402, w: 142, h: 24, tipo: "pedra" },
      { x: 312, y: 348, w: 152, h: 24, tipo: "pedra" },
      { x: 558, y: 292, w: 178, h: 24, tipo: "pedra" },
      { x: 772, y: 236, w: 118, h: 24, tipo: "pedra" }
    ],
    portal: { x: 816, y: 176, w: 58, h: 60 },
    yoshi: { x: 146, y: 358, salvo: false },
    moedas: [
      { x: 138, y: 360, coletada: false },
      { x: 382, y: 306, coletada: false },
      { x: 632, y: 250, coletada: false },
      { x: 822, y: 196, coletada: false }
    ],
    cogumelos: [
      { x: 430, y: 316, coletado: false }
    ],
    inimigos: [
      criarVilao("soldado", 252, 438, 2.8, 214, 446),
      criarVilao("cavaleiro", 614, 244, 1.8, 570, 700),
      criarVilao("chaves", 746, 426, 1.7, 690, 874)
    ]
  },
  {
    nome: "Fase 3 - Castelo dos Dois Viloes",
    fundo: ["#32364f", "#151621"],
    tema: "castelo",
    plataformas: [
      { x: 0, y: 486, w: 960, h: 54, tipo: "castelo" },
      { x: 84, y: 408, w: 138, h: 24, tipo: "castelo" },
      { x: 278, y: 356, w: 144, h: 24, tipo: "castelo" },
      { x: 482, y: 304, w: 150, h: 24, tipo: "castelo" },
      { x: 690, y: 252, w: 156, h: 24, tipo: "castelo" }
    ],
    portal: { x: 824, y: 192, w: 58, h: 60 },
    yoshi: { x: 524, y: 260, salvo: false },
    moedas: [
      { x: 122, y: 366, coletada: false },
      { x: 330, y: 314, coletada: false },
      { x: 538, y: 262, coletada: false },
      { x: 748, y: 210, coletada: false },
      { x: 888, y: 442, coletada: false }
    ],
    cogumelos: [
      { x: 370, y: 324, coletado: false }
    ],
    inimigos: [
      criarVilao("soldado", 216, 438, 3.2, 160, 394),
      criarVilao("cavaleiro", 612, 438, 2.5, 520, 820),
      criarVilao("esqueleto", 754, 428, 2.0, 660, 864)
    ]
  },
  {
    nome: "Fase 4 - Ponte da Lua",
    fundo: ["#25324d", "#141821"],
    tema: "castelo",
    plataformas: [
      { x: 0, y: 486, w: 230, h: 54, tipo: "castelo" },
      { x: 294, y: 486, w: 194, h: 54, tipo: "castelo" },
      { x: 556, y: 486, w: 404, h: 54, tipo: "castelo" },
      { x: 116, y: 386, w: 134, h: 24, tipo: "castelo" },
      { x: 334, y: 330, w: 136, h: 24, tipo: "castelo" },
      { x: 564, y: 278, w: 146, h: 24, tipo: "castelo" },
      { x: 756, y: 350, w: 118, h: 24, tipo: "castelo" }
    ],
    portal: { x: 816, y: 290, w: 58, h: 60 },
    yoshi: { x: 584, y: 234, salvo: false },
    moedas: [
      { x: 164, y: 346, coletada: false },
      { x: 390, y: 290, coletada: false },
      { x: 622, y: 238, coletada: false },
      { x: 816, y: 310, coletada: false },
      { x: 642, y: 442, coletada: false }
    ],
    cogumelos: [
      { x: 808, y: 318, coletado: false }
    ],
    inimigos: [
      criarVilao("soldado", 334, 444, 3.5, 298, 450),
      criarVilao("cavaleiro", 640, 436, 2.9, 574, 824),
      criarVilao("soldado", 784, 308, 2.4, 760, 850)
    ]
  },
  {
    nome: "Fase 5 - Fortaleza Final",
    fundo: ["#201f2f", "#08090f"],
    tema: "castelo",
    plataformas: [
      { x: 0, y: 486, w: 960, h: 54, tipo: "castelo" },
      { x: 74, y: 404, w: 120, h: 24, tipo: "castelo" },
      { x: 248, y: 346, w: 126, h: 24, tipo: "castelo" },
      { x: 424, y: 288, w: 132, h: 24, tipo: "castelo" },
      { x: 606, y: 230, w: 136, h: 24, tipo: "castelo" },
      { x: 794, y: 318, w: 112, h: 24, tipo: "castelo" }
    ],
    portal: { x: 824, y: 258, w: 58, h: 60 },
    yoshi: { x: 632, y: 186, salvo: false },
    moedas: [
      { x: 114, y: 364, coletada: false },
      { x: 292, y: 306, coletada: false },
      { x: 468, y: 248, coletada: false },
      { x: 654, y: 190, coletada: false },
      { x: 838, y: 278, coletada: false },
      { x: 500, y: 442, coletada: false }
    ],
    cogumelos: [
      { x: 296, y: 314, coletado: false },
      { x: 844, y: 286, coletado: false }
    ],
    inimigos: [
      criarVilao("cavaleiro", 266, 296, 2.2, 250, 334),
      criarVilao("soldado", 454, 438, 3.7, 400, 586),
      criarVilao("cavaleiro", 696, 436, 3.1, 612, 864),
      criarVilao("soldado", 814, 276, 2.6, 796, 884)
    ]
  },
  {
    nome: "Fase 6 - Supercopa",
    fundo: ["#2a1014", "#070407"],
    tema: "vulcao",
    plataformas: [
      { x: 0, y: 486, w: 148, h: 54, tipo: "castelo" },
      { x: 210, y: 486, w: 142, h: 54, tipo: "castelo" },
      { x: 414, y: 486, w: 156, h: 54, tipo: "castelo" },
      { x: 640, y: 486, w: 320, h: 54, tipo: "castelo" },
      { x: 102, y: 396, w: 92, h: 22, tipo: "castelo" },
      { x: 292, y: 344, w: 96, h: 22, tipo: "castelo" },
      { x: 496, y: 292, w: 88, h: 22, tipo: "castelo" },
      { x: 704, y: 240, w: 136, h: 22, tipo: "castelo" }
    ],
    portal: { x: 850, y: 180, w: 58, h: 60 },
    yoshi: { x: 308, y: 300, salvo: false },
    moedas: [
      { x: 132, y: 354, coletada: false },
      { x: 332, y: 304, coletada: false },
      { x: 534, y: 252, coletada: false },
      { x: 748, y: 200, coletada: false },
      { x: 486, y: 442, coletada: false },
      { x: 722, y: 442, coletada: false }
    ],
    cogumelos: [
      { x: 742, y: 208, coletado: false }
    ],
    inimigos: [
      criarVilao("soldado", 118, 354, 4.6, 96, 194),
      criarVilao("soldado", 246, 438, 5.1, 214, 338),
      criarVilao("cavaleiro", 450, 438, 4.4, 420, 554),
      criarVilao("soldado", 528, 250, 4.2, 500, 584),
      criarVilao("cavaleiro", 690, 436, 4.7, 644, 828),
      criarVilao("soldado", 786, 198, 3.8, 710, 840),
      criarVilao("messi", 354, 286, 4.0, 300, 392),
      criarChefeFinal(656, 416, "Rei Vulcao Furioso", 7)
    ]
  },
  {
    nome: "Fase 7 - Classico Pixel",
    fundo: ["#4cc9f0", "#1b8f4d"],
    tema: "estadio",
    plataformas: [
      { x: 0, y: 486, w: 960, h: 54, tipo: "grama" },
      { x: 118, y: 408, w: 108, h: 22, tipo: "grama" },
      { x: 342, y: 354, w: 106, h: 22, tipo: "grama" },
      { x: 584, y: 300, w: 104, h: 22, tipo: "grama" },
      { x: 800, y: 390, w: 88, h: 22, tipo: "grama" }
    ],
    portal: { x: 836, y: 330, w: 58, h: 60 },
    yoshi: { x: 138, y: 364, salvo: false },
    cr7: { x: 626, y: 244, salvo: false },
    moedas: [
      { x: 164, y: 366, coletada: false },
      { x: 380, y: 312, coletada: false },
      { x: 618, y: 258, coletada: false },
      { x: 830, y: 350, coletada: false },
      { x: 722, y: 442, coletada: false }
    ],
    cogumelos: [
      { x: 418, y: 322, coletado: false }
    ],
    inimigos: [
      criarVilao("messi", 520, 428, 4.5, 430, 720),
      criarVilao("soldado", 262, 444, 4.7, 220, 390),
      criarVilao("cavaleiro", 704, 436, 4.0, 610, 830),
      criarVilao("messi", 388, 296, 3.8, 350, 448),
      criarVilao("soldado", 828, 348, 3.6, 802, 888)
    ]
  },
  {
    nome: "Fase 8 - Floresta do Lobo e Miaw",
    fundo: ["#153b2f", "#0b1512"],
    tema: "floresta-noite",
    plataformas: [
      { x: 0, y: 486, w: 960, h: 54, tipo: "grama" },
      { x: 86, y: 398, w: 106, h: 22, tipo: "grama" },
      { x: 298, y: 338, w: 102, h: 22, tipo: "grama" },
      { x: 524, y: 286, w: 98, h: 22, tipo: "grama" },
      { x: 748, y: 232, w: 106, h: 22, tipo: "grama" }
    ],
    portal: { x: 824, y: 172, w: 58, h: 60 },
    yoshi: { x: 110, y: 354, salvo: false },
    miaw: { x: 548, y: 240, salvo: false },
    moedas: [
      { x: 132, y: 356, coletada: false },
      { x: 330, y: 296, coletada: false },
      { x: 552, y: 244, coletada: false },
      { x: 780, y: 190, coletada: false },
      { x: 900, y: 442, coletada: false }
    ],
    cogumelos: [
      { x: 794, y: 200, coletado: false }
    ],
    inimigos: [
      criarVilao("lobo", 334, 448, 4.9, 250, 478),
      criarVilao("lobo", 632, 448, 5.3, 560, 842),
      criarVilao("messi", 746, 174, 3.9, 730, 856),
      criarVilao("lobo", 392, 286, 4.0, 304, 400),
      criarVilao("soldado", 552, 244, 3.7, 526, 620)
    ]
  },
  {
    nome: "Fase 9 - Reino Impossivel",
    fundo: ["#191528", "#050509"],
    tema: "vulcao",
    plataformas: [
      { x: 0, y: 486, w: 118, h: 54, tipo: "castelo" },
      { x: 182, y: 486, w: 96, h: 54, tipo: "castelo" },
      { x: 340, y: 486, w: 92, h: 54, tipo: "castelo" },
      { x: 502, y: 486, w: 94, h: 54, tipo: "castelo" },
      { x: 680, y: 486, w: 280, h: 54, tipo: "castelo" },
      { x: 116, y: 404, w: 68, h: 20, tipo: "castelo" },
      { x: 282, y: 348, w: 64, h: 20, tipo: "castelo" },
      { x: 448, y: 292, w: 62, h: 20, tipo: "castelo" },
      { x: 614, y: 236, w: 64, h: 20, tipo: "castelo" },
      { x: 792, y: 298, w: 74, h: 20, tipo: "castelo" }
    ],
    portal: { x: 846, y: 238, w: 58, h: 60 },
    yoshi: { x: 92, y: 360, salvo: false },
    miaw: { x: 458, y: 246, salvo: false },
    moedas: [
      { x: 142, y: 364, coletada: false },
      { x: 302, y: 308, coletada: false },
      { x: 466, y: 252, coletada: false },
      { x: 636, y: 196, coletada: false },
      { x: 824, y: 258, coletada: false },
      { x: 730, y: 442, coletada: false }
    ],
    cogumelos: [
      { x: 634, y: 204, coletado: false }
    ],
    inimigos: [
      criarVilao("lobo", 208, 448, 5.8, 184, 272),
      criarVilao("messi", 356, 428, 5.0, 342, 428),
      criarVilao("cavaleiro", 520, 436, 5.5, 504, 590),
      criarVilao("lobo", 724, 448, 6.0, 684, 842),
      criarVilao("soldado", 148, 362, 4.4, 118, 184),
      criarVilao("messi", 632, 178, 4.2, 616, 678),
      criarChefeFinal(754, 416, "Rei Supremo Impossivel", 12, "rei"),
      criarCellBesta(676, 392)
    ]
  },
  {
    nome: "Fase 10 - Nivel Hard: Piso de Tachas",
    fundo: ["#1a1038", "#05030a"],
    tema: "vulcao",
    plataformas: [
      { x: 0, y: 486, w: 118, h: 54, tipo: "castelo" },
      { x: 768, y: 486, w: 192, h: 54, tipo: "castelo" },
      { x: 142, y: 408, w: 92, h: 20, tipo: "castelo", movel: true, min: 100, max: 294, vel: 1.45 },
      { x: 340, y: 346, w: 86, h: 20, tipo: "castelo", movel: true, min: 284, max: 502, vel: -1.65 },
      { x: 556, y: 286, w: 84, h: 20, tipo: "castelo", movel: true, min: 488, max: 696, vel: 1.75 },
      { x: 744, y: 232, w: 92, h: 20, tipo: "castelo", movel: true, min: 694, max: 850, vel: -1.55 }
    ],
    tachas: [
      { x: 118, y: 500, w: 650, h: 40 }
    ],
    portal: { x: 832, y: 172, w: 58, h: 60 },
    yoshi: { x: 92, y: 432, salvo: false },
    moedas: [
      { x: 174, y: 366, coletada: false },
      { x: 374, y: 304, coletada: false },
      { x: 588, y: 244, coletada: false },
      { x: 780, y: 190, coletada: false }
    ],
    cogumelos: [],
    inimigos: [
      criarVilao("soldado", 88, 444, 5.6, 20, 112),
      criarVilao("messi", 360, 288, 4.9, 304, 426),
      criarVilao("lobo", 804, 448, 6.4, 774, 920),
      criarChefeFinal(766, 416, "Guardiao das Tachas", 9, "rei")
    ]
  },
  {
    nome: "Fase 11 - Nivel Hard: Blocos Nervosos",
    fundo: ["#18191f", "#030405"],
    tema: "castelo",
    plataformas: [
      { x: 0, y: 486, w: 92, h: 54, tipo: "castelo" },
      { x: 828, y: 486, w: 132, h: 54, tipo: "castelo" },
      { x: 118, y: 420, w: 74, h: 20, tipo: "castelo", movel: true, min: 72, max: 284, vel: 1.85 },
      { x: 308, y: 358, w: 70, h: 20, tipo: "castelo", movel: true, min: 248, max: 474, vel: -2.05 },
      { x: 522, y: 298, w: 68, h: 20, tipo: "castelo", movel: true, min: 456, max: 674, vel: 2.15 },
      { x: 710, y: 238, w: 72, h: 20, tipo: "castelo", movel: true, min: 646, max: 854, vel: -1.95 }
    ],
    tachas: [
      { x: 92, y: 500, w: 736, h: 40 }
    ],
    portal: { x: 846, y: 426, w: 58, h: 60 },
    yoshi: { x: 38, y: 432, salvo: false },
    cr7: { x: 528, y: 242, salvo: false },
    moedas: [
      { x: 140, y: 378, coletada: false },
      { x: 338, y: 316, coletada: false },
      { x: 548, y: 256, coletada: false },
      { x: 736, y: 196, coletada: false }
    ],
    cogumelos: [],
    inimigos: [
      criarVilao("cavaleiro", 836, 436, 6.2, 830, 920),
      criarVilao("soldado", 330, 316, 5.3, 286, 386),
      criarVilao("messi", 724, 180, 5.0, 674, 782),
      criarCellBesta(716, 392)
    ]
  },
  {
    nome: "Fase 12 - Nivel Hard: Sem Chao",
    fundo: ["#260512", "#050005"],
    tema: "vulcao",
    plataformas: [
      { x: 0, y: 486, w: 76, h: 54, tipo: "castelo" },
      { x: 858, y: 486, w: 102, h: 54, tipo: "castelo" },
      { x: 112, y: 424, w: 62, h: 18, tipo: "castelo", movel: true, min: 78, max: 278, vel: 2.2 },
      { x: 304, y: 366, w: 58, h: 18, tipo: "castelo", movel: true, min: 248, max: 464, vel: -2.35 },
      { x: 510, y: 306, w: 58, h: 18, tipo: "castelo", movel: true, min: 448, max: 650, vel: 2.25 },
      { x: 696, y: 246, w: 62, h: 18, tipo: "castelo", movel: true, min: 636, max: 824, vel: -2.15 }
    ],
    tachas: [
      { x: 76, y: 496, w: 782, h: 44 }
    ],
    portal: { x: 870, y: 426, w: 58, h: 60 },
    yoshi: { x: 20, y: 432, salvo: false },
    miaw: { x: 510, y: 258, salvo: false },
    moedas: [
      { x: 132, y: 384, coletada: false },
      { x: 326, y: 326, coletada: false },
      { x: 532, y: 266, coletada: false },
      { x: 720, y: 206, coletada: false }
    ],
    cogumelos: [],
    inimigos: [
      criarVilao("lobo", 872, 448, 6.8, 862, 932),
      criarVilao("messi", 318, 308, 5.7, 284, 366),
      criarVilao("cavaleiro", 708, 188, 5.5, 662, 762),
      criarChefeFinal(760, 416, "Rei Hard Final", 14, "rei"),
      criarCellBesta(642, 392),
      criarBossSupremo(706, 384)
    ]
  },
  {
    nome: "Fase 13 - Castelo Medieval: Muralhas de Ferro",
    fundo: ["#343a40", "#101216"],
    tema: "castelo",
    plataformas: [
      { x: 0, y: 486, w: 960, h: 54, tipo: "castelo" },
      { x: 92, y: 402, w: 128, h: 22, tipo: "castelo" },
      { x: 278, y: 342, w: 124, h: 22, tipo: "castelo" },
      { x: 468, y: 282, w: 126, h: 22, tipo: "castelo" },
      { x: 654, y: 342, w: 122, h: 22, tipo: "castelo" },
      { x: 806, y: 266, w: 116, h: 22, tipo: "castelo" }
    ],
    portal: { x: 844, y: 206, w: 58, h: 60 },
    yoshi: { x: 102, y: 346, salvo: false },
    moedas: [
      { x: 146, y: 360, coletada: false }, { x: 328, y: 300, coletada: false },
      { x: 516, y: 240, coletada: false }, { x: 706, y: 300, coletada: false },
      { x: 858, y: 224, coletada: false }
    ],
    cogumelos: [{ x: 370, y: 310, coletado: false }],
    inimigos: [
      criarVilao("esqueleto", 236, 428, 3.0, 184, 366),
      criarVilao("cavaleiro", 438, 436, 4.2, 398, 574),
      criarVilao("esqueleto", 640, 428, 3.5, 600, 770),
      criarVilao("cavaleiro", 790, 436, 4.6, 754, 914)
    ]
  },
  {
    nome: "Fase 14 - Torre Medieval do Mandibu",
    fundo: ["#241f2e", "#07070b"],
    tema: "castelo",
    plataformas: [
      { x: 0, y: 486, w: 960, h: 54, tipo: "castelo" },
      { x: 84, y: 394, w: 118, h: 22, tipo: "castelo" },
      { x: 256, y: 330, w: 112, h: 22, tipo: "castelo" },
      { x: 426, y: 268, w: 112, h: 22, tipo: "castelo" },
      { x: 596, y: 330, w: 112, h: 22, tipo: "castelo" },
      { x: 766, y: 394, w: 138, h: 22, tipo: "castelo" }
    ],
    portal: { x: 846, y: 334, w: 58, h: 60 },
    yoshi: { x: 96, y: 338, salvo: false },
    moedas: [
      { x: 132, y: 352, coletada: false }, { x: 302, y: 288, coletada: false },
      { x: 476, y: 226, coletada: false }, { x: 646, y: 288, coletada: false },
      { x: 824, y: 352, coletada: false }
    ],
    cogumelos: [{ x: 480, y: 236, coletado: false }],
    inimigos: [
      criarVilao("esqueleto", 224, 428, 3.4, 184, 350),
      criarVilao("cavaleiro", 466, 436, 4.4, 410, 574),
      criarVilao("esqueleto", 650, 428, 3.8, 600, 748),
      criarMandibu(746, 398)
    ]
  }
];

fases.unshift({
  nome: "Fase 1 - Fortaleza Sombria",
  fundo: ["#30364a", "#10131b"],
  tema: "castelo",
  plataformas: [
    { x: 0, y: 486, w: 960, h: 54, tipo: "castelo" },
    { x: 104, y: 400, w: 132, h: 22, tipo: "castelo" },
    { x: 302, y: 338, w: 126, h: 22, tipo: "castelo" },
    { x: 502, y: 280, w: 126, h: 22, tipo: "castelo" },
    { x: 696, y: 344, w: 126, h: 22, tipo: "castelo" },
    { x: 826, y: 260, w: 104, h: 22, tipo: "castelo" }
  ],
  portal: { x: 850, y: 200, w: 58, h: 60 },
  yoshi: { x: 124, y: 344, salvo: false },
  moedas: [
    { x: 158, y: 358, coletada: false }, { x: 350, y: 296, coletada: false },
    { x: 550, y: 238, coletada: false }, { x: 746, y: 302, coletada: false },
    { x: 870, y: 218, coletada: false }
  ],
  cogumelos: [{ x: 386, y: 306, coletado: false }],
  inimigos: [
    criarVilao("soldado", 252, 444, 3.2, 214, 386),
    criarVilao("esqueleto", 442, 428, 2.8, 408, 570),
    criarVilao("cavaleiro", 632, 436, 3.8, 590, 784),
    criarVilao("soldado", 738, 302, 3.1, 700, 806)
  ]
});

fases.push({
  nome: "Fase Especial - Labirinto das Moedas",
  fundo: ["#151b32", "#070a13"],
  tema: "labirinto",
  labirinto: true,
  plataformas: [{ x: 0, y: 486, w: 960, h: 54, tipo: "castelo" }],
  paredesLabirinto: [
    { x: 128, y: 404, w: 34, h: 82 }, { x: 248, y: 392, w: 34, h: 94 },
    { x: 368, y: 404, w: 34, h: 82 }, { x: 488, y: 398, w: 34, h: 88 },
    { x: 608, y: 404, w: 34, h: 82 }, { x: 728, y: 392, w: 34, h: 94 },
    { x: 830, y: 410, w: 34, h: 76 }
  ],
  ilusoesLabirinto: [
    { x: 202, y: 420, w: 34, h: 66, destinoX: 54, destinoY: 420 },
    { x: 548, y: 420, w: 34, h: 66, destinoX: 286, destinoY: 420 },
    { x: 782, y: 420, w: 34, h: 66, destinoX: 430, destinoY: 420 }
  ],
  areiasMovedicas: [
    { x: 164, y: 466, w: 80, h: 20 },
    { x: 404, y: 466, w: 82, h: 20 },
    { x: 642, y: 466, w: 84, h: 20 }
  ],
  pacmans: [
    { x: 188, y: 410, w: 34, h: 34, velocidade: 1.05, cor: "#ffd43b" },
    { x: 516, y: 300, w: 34, h: 34, velocidade: 1.18, cor: "#ff6b6b" },
    { x: 752, y: 390, w: 34, h: 34, velocidade: 1.28, cor: "#74c0fc" }
  ],
  portal: { x: 886, y: 426, w: 58, h: 60 },
  yoshi: { x: -200, y: 432, salvo: false },
  moedas: [
    { x: 110, y: 442, coletada: false }, { x: 210, y: 442, coletada: false },
    { x: 250, y: 330, coletada: false }, { x: 350, y: 442, coletada: false },
    { x: 390, y: 320, coletada: false }, { x: 490, y: 442, coletada: false },
    { x: 530, y: 320, coletada: false }, { x: 625, y: 442, coletada: false },
    { x: 665, y: 300, coletada: false }, { x: 760, y: 442, coletada: false },
    { x: 790, y: 315, coletada: false }, { x: 870, y: 380, coletada: false }
  ],
  cogumelos: [],
  inimigos: []
});

const campeonatos = [
  { nome: "Copa do Rei", cor: "#f7c948" },
  { nome: "La Liga", cor: "#ff6b6b" },
  { nome: "Champions League", cor: "#74c0fc" },
  { nome: "Eurocopa", cor: "#51d88a" },
  { nome: "Nations League", cor: "#c77dff" },
  { nome: "Supercopa", cor: "#ffd166" },
  { nome: "Libertadores", cor: "#d0d7de" },
  { nome: "Mundial de Clubes", cor: "#4cc9f0" },
  { nome: "Premier League", cor: "#b197fc" },
  { nome: "Serie A", cor: "#4dabf7" },
  { nome: "Sauditão", cor: "#69db7c" },
  { nome: "Copa do Mundo", cor: "#ffd43b" },
  { nome: "Copa Medieval", cor: "#adb5bd" },
  { nome: "Trono de Mandibu", cor: "#c77dff" }
];

const tiposArmadilha = [
  { tipo: "mina", nome: "Mina explosiva", cor: "#343a40" },
  { tipo: "ratoeira", nome: "Ratoeira escondida", cor: "#adb5bd" },
  { tipo: "mola", nome: "Mola surpresa", cor: "#ffd43b" },
  { tipo: "veneno", nome: "Poça venenosa", cor: "#69db7c" },
  { tipo: "fogo", nome: "Chama escondida", cor: "#ff6b00" },
  { tipo: "armadilhaAco", nome: "Armadilha de aço", cor: "#ced4da" },
  { tipo: "areia", nome: "Areia movediça", cor: "#d4a373" },
  { tipo: "espinhos", nome: "Espinhos ocultos", cor: "#adb5bd" },
  { tipo: "portalFalso", nome: "Portal falso", cor: "#c77dff" },
  { tipo: "bomba", nome: "Bomba-relógio", cor: "#ef476f" },
  { tipo: "fantasma", nome: "Fantasma do piso", cor: "#e9ecef" },
  { tipo: "buraco", nome: "Buraco falso", cor: "#111111" }
];

fases.forEach((fase, indice) => {
  fase.bonusTempoChefe = 0;
  const campeonato = fase.bonus
    ? { nome: "Desafio de Demolição", cor: "#ff922b" }
    : fase.labirinto
      ? { nome: "Coroa do Labirinto", cor: "#c77dff" }
      : indice === 0
        ? { nome: "Fortaleza Sombria", cor: "#adb5bd" }
        : campeonatos[indice - 1];
  fase.campeonato = campeonato;
  fase.nome = fase.bonus
    ? "Fase 1 - Bônus: Destrua o Carro"
    : fase.labirinto
      ? "Fase " + (indice + 1) + " - Labirinto das Moedas"
    : indice === 1
      ? "Fase 2 - Programa de Auditório: Silvio Santos"
      : "Fase " + (indice + 1) + " - " + campeonato.nome;
  fase.trofeu = {
    x: fase.portal.x + fase.portal.w / 2 - 18,
    y: fase.portal.y - 54,
    nome: campeonato.nome,
    cor: campeonato.cor
  };
  const plataformaInicial = fase.plataformas.reduce((maior, plataforma) => plataforma.w > maior.w ? plataforma : maior, fase.plataformas[0]);
  fase.mufasa = {
    x: plataformaInicial.x + Math.max(8, Math.min(plataformaInicial.w - 72, Math.round(plataformaInicial.w * 0.18))),
    y: plataformaInicial.y - 56,
    w: 68,
    h: 56,
    salvo: false,
    montadoPor: null
  };
  if (indice === 1) fase.premio50 = { x: 730, y: 414, w: 104, h: 52, ativo: false, coletado: false };
  fase.tipoArmadilha = tiposArmadilha[Math.max(0, indice - 1) % tiposArmadilha.length];
  const plataformasFixas = fase.plataformas.filter(plataforma => !plataforma.movel && plataforma.w >= 48);
  fase.armadilhas = plataformasFixas.slice(0, 3).map((plataforma, armadilhaIndice) => ({
    x: Math.round(plataforma.x + plataforma.w * (armadilhaIndice % 2 === 0 ? 0.58 : 0.36) - 14),
    y: plataforma.y - 10,
    w: 28,
    h: 10,
    revelada: false,
    ativada: false,
    ...fase.tipoArmadilha
  }));
  fase.premiosDiamante = [{
    x: Math.max(48, fase.portal.x - 52),
    y: Math.max(70, fase.portal.y - 30),
    w: 24,
    h: 28,
    coletado: false
  }];
  const plataformasObjetos = plataformasFixas.slice().sort((a, b) => b.w - a.w);
  const plataformaBarril = plataformasObjetos[0] || fase.plataformas[0];
  const plataformaCarro = plataformasObjetos[1] || plataformaBarril;
  const plataformaBarrilExtra = plataformasObjetos[2] || plataformaBarril;
  fase.destrutiveis = [
    {
      tipo: "barrilQuebravel",
      x: Math.round(plataformaBarril.x + plataformaBarril.w * 0.28),
      y: plataformaBarril.y - 42,
      w: 36,
      h: 42,
      vida: 2,
      vidaMax: 2,
      quebrado: false
    },
    {
      tipo: "carroQuebravel",
      x: Math.max(4, Math.min(canvas.width - 82, Math.round(plataformaCarro.x + plataformaCarro.w / 2 - 40))),
      y: plataformaCarro.y - 42,
      w: 80,
      h: 42,
      vida: 4,
      vidaMax: 4,
      quebrado: false
    },
    {
      tipo: "barrilQuebravel",
      x: Math.max(4, Math.min(canvas.width - 40, Math.round(plataformaBarrilExtra.x + plataformaBarrilExtra.w * 0.7))),
      y: plataformaBarrilExtra.y - 42,
      w: 36,
      h: 42,
      vida: 2,
      vidaMax: 2,
      quebrado: false
    }
  ];
  if (fase.bonus) {
    fase.armadilhas = [];
    fase.premiosDiamante = [];
    fase.mufasa = null;
    fase.destrutiveis = [
      { tipo: "barrilQuebravel", x: 730, y: 418, w: 58, h: 68, vida: 6, vidaMax: 6, quebrado: false },
      { tipo: "carroQuebravel", x: 310, y: 388, w: 340, h: 98, vida: 12, vidaMax: 12, quebrado: false }
    ];
  } else if (fase.labirinto) {
    fase.armadilhas = [];
    fase.destrutiveis = [];
    fase.mufasa = null;
  } else {
    fase.inimigos.forEach(inimigo => {
      inimigo.vel *= 1.1;
      if (ehChefeVilao(inimigo)) {
        const resistenciaExtra = 1 + Math.floor(indice / 4);
        inimigo.vida += resistenciaExtra;
        inimigo.vidaMax += resistenciaExtra;
      }
    });
  }
});

// Reforcos nas cinco primeiras fases para elevar a dificuldade inicial.
fases[1].inimigos.push(criarVilao("cavaleiro", 730, 436, 2.4, 680, 860));
fases[2].inimigos.push(criarVilao("meninoRoblox", 502, 428, 2.1, 470, 690));
fases[3].inimigos.push(criarVilao("soldado", 456, 438, 3.0, 430, 610));
fases[4].inimigos.push(criarVilao("meninoRoblox", 612, 428, 2.3, 570, 810));
fases[5].inimigos.push(criarVilao("lobo", 748, 448, 3.6, 690, 880));

// Elenco atual: remove criaturas descontinuadas e suas montarias de todas as fases.
fases.forEach(fase => {
  fase.mufasa = null;
  fase.miaw = null;
  fase.inimigos = fase.inimigos.filter(inimigo => inimigo.tipo !== "lobo");
});

function criarJogador(nome, x, corCamisa, corCalca, cabelo) {
  return {
    nome,
    x,
    y: 422,
    w: 34,
    h: 58,
    corCamisa,
    corCalca,
    cabelo,
    velX: 0,
    velY: 0,
    noChao: false,
    andando: false,
    direcao: 1,
    invencivel: 0,
    montado: false,
    montaria: null,
    grande: false,
    poderTempo: 0,
    nuvem: false,
    superSayajin: false,
    energiaVoo: ENERGIA_MAXIMA_VOO_GOKU,
    agachado: false,
    ataqueTempo: 0,
    ataqueCooldown: 0,
    alturaNormal: 58,
    alturaAgachado: 38
  };
}

function criarVilao(tipo, x, y, vel, min, max) {
  const medidas = {
    cavaleiro: { w: 48, h: 50 },
    messi: { w: 42, h: 58 },
    lobo: { w: 58, h: 38 },
    meninoRoblox: { w: 46, h: 58 },
    esqueleto: { w: 48, h: 58 },
    chaves: { w: 44, h: 60 }
  };
  const medida = medidas[tipo] || { w: 42, h: 42 };

  return {
    tipo,
    x,
    y,
    w: medida.w,
    h: medida.h,
    vel,
    min,
    max,
    direcao: vel >= 0 ? 1 : -1,
    morto: false,
    ataqueOffset: tipo === "esqueleto" ? Math.floor(x) % 120 : 0,
    golpeAcertado: -1,
    ataqueChaves: 0,
    cooldownAtaqueChaves: 0,
    cooldownSucoChaves: 90
  };
}

function criarSilvioBoss(x, y) {
  return {
    tipo: "silvioBoss",
    nome: "Silvio Santos",
    x,
    y,
    w: 48,
    h: 66,
    vel: 2.1,
    min: 640,
    max: 874,
    direcao: -1,
    vida: 7,
    vidaMax: 7,
    invencivel: 0,
    morto: false,
    cooldownPoder: 45,
    proximoPoder: "jequiti"
  };
}

function criarChefeFinal(x, y, nome = "Rei Vulcao", vida = 5, tipo = "chefe") {
  return {
    tipo,
    nome,
    x,
    y,
    w: 74,
    h: 70,
    vel: tipo === "rei" ? 3.4 : 2.2,
    min: 620,
    max: 878,
    direcao: 1,
    vida,
    vidaMax: vida,
    invencivel: 0,
    morto: false
  };
}

function criarCellBesta(x, y) {
  return {
    tipo: "cellbesta",
    nome: "Cell + Besta Ben 10",
    x,
    y,
    w: 104,
    h: 94,
    vel: 4.1,
    min: 644,
    max: 856,
    direcao: 1,
    vida: 9,
    vidaMax: 9,
    invencivel: 0,
    morto: false
  };
}

function criarBossSupremo(x, y) {
  return {
    tipo: "bossSupremo",
    nome: "Boss Supremo",
    x,
    y,
    w: 84,
    h: 96,
    vel: 2.4,
    min: 620,
    max: 866,
    direcao: 1,
    vida: 12,
    vidaMax: 12,
    invencivel: 0,
    morto: false,
    clones: [],
    ultimoClone: null
  };
}

function criarMandibu(x, y) {
  return {
    tipo: "mandibu",
    nome: "Mandibu",
    x,
    y,
    w: 78,
    h: 88,
    vel: 2.8,
    min: 690,
    max: 884,
    direcao: -1,
    vida: 10,
    vidaMax: 10,
    invencivel: 0,
    morto: false,
    tempoAtivo: 0,
    tempoMinimoDerrota: 3600
  };
}

function colisao(a, b) {
  return (
    a.x < b.x + b.w &&
    a.x + a.w > b.x &&
    a.y < b.y + b.h &&
    a.y + a.h > b.y
  );
}

function mostrarAviso(texto) {
  aviso = texto;
  avisoTempo = 140;
}

function dificuldadeFinal() {
  const progressao = 1.16 + faseAtual * 0.065 + (faseAtual >= 5 ? 0.12 : 0) + (faseAtual >= 9 ? 0.08 : 0);
  return Math.min(2.15, progressao);
}

function ehChefeVilao(vilao) {
  return vilao.tipo === "chefe" || vilao.tipo === "rei" || vilao.tipo === "cellbesta" || vilao.tipo === "bossSupremo" || vilao.tipo === "silvioBoss" || vilao.tipo === "mandibu";
}

function mandibuProtegido(vilao) {
  return vilao.tipo === "mandibu" && vilao.tempoAtivo < vilao.tempoMinimoDerrota;
}

function chefesVivosDaFase() {
  return fases[faseAtual].inimigos.filter(i => ehChefeVilao(i) && !i.morto);
}

function resetarTimerChefe() {
  chefeTimer = null;
  chefeTimerAtivo = false;
  chefeTimerAlvo = null;
}

function atualizarTimerChefe() {
  if (modoVersus) return;
  const chefesVivos = chefesVivosDaFase();

  if (chefesVivos.length === 0) {
    resetarTimerChefe();
    return;
  }

  if (!chefeTimerAtivo) {
    const alvo = chefesVivos.find(chefe => {
      const centroChefe = chefe.x + chefe.w / 2;
      const centroJogador = joao.x + joao.w / 2;
      const pertoDoChefe = Math.abs(centroChefe - centroJogador) < 260;
      return pertoDoChefe || chefe.vida < chefe.vidaMax;
    });

    if (!alvo) return;

    chefeTimerAlvo = alvo;
    chefeTimerAtivo = true;
    const bonusFase = fases[faseAtual].bonusTempoChefe || 0;
    const extraInventario = Math.min(30, inventarioLoja.segundosExtras);
    inventarioLoja.segundosExtras -= extraInventario;
    if (extraInventario > 0) salvarCarteira();
    const segundosBase = chefesVivos.some(chefe => chefe.tipo === "mandibu") ? 75 : faseAtual >= 9 ? 38 : faseAtual >= 5 ? 40 : 42;
    chefeTimer = segundosBase * 60 + (bonusFase + extraInventario) * 60;
    mostrarAviso("MODO HARD: derrote os chefões em " + (segundosBase + bonusFase + extraInventario) + " segundos!");
  }

  chefeTimerAlvo = chefesVivos[0];

  chefeTimer--;

  if (chefeTimer <= 0) {
    if (inventarioLoja.vidas > 0) {
      inventarioLoja.vidas--;
      chefeTimer = 1200;
      salvarCarteira();
      resetarPersonagens();
      mostrarAviso("VIDA EXTRA! Você ganhou mais 20 segundos.");
      return;
    }
    gameOver = true;
    pausado = false;
    tocarSom("dano");
    tremor = 30;
    mensagem.innerText = "Game over! O vilao venceu.";
  }
}

function atualizarTimerFaseBonus() {
  if (modoVersus) return;
  const fase = fases[faseAtual];
  if (!fase.bonus || faseBonusConcluida) return;
  const restantes = fase.destrutiveis.filter(objeto => !objeto.quebrado);
  if (restantes.length === 0) {
    faseBonusConcluida = true;
    pontosDestruicao += 2500;
    mostrarAviso("DEMOLIÇÃO COMPLETA! Portal liberado e +2500 pontos!");
    tocarSom("vitoria");
    return;
  }
  faseBonusTimer--;
  if (faseBonusTimer > 0) return;
  if (inventarioLoja.vidas > 0) {
    inventarioLoja.vidas--;
    faseBonusTimer = 1200;
    salvarCarteira();
    mostrarAviso("VIDA EXTRA! Mais 20 segundos para demolir!");
    return;
  }
  gameOver = true;
  mensagem.innerText = "Tempo esgotado na fase bônus.";
  tocarSom("dano");
}

function iniciarAudio() {
  if (!somLigado) return;
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  if (audioCtx.state === "suspended") {
    audioCtx.resume();
  }
}

function alternarSom() {
  somLigado = !somLigado;
  if (botaoSom) botaoSom.innerText = somLigado ? "Som: ligado" : "Som: desligado";
  if (somLigado) {
    iniciarAudio();
    tocarSom("portal");
  }
  sincronizarMusicaGoku(false);
  sincronizarMusicaNeymar(false);
}

function sincronizarMusicaGoku(reiniciarAoSair = false) {
  const deveTocar = somLigado && joao.avatar === "goku" && !venceu && !gameOver;

  if (deveTocar) {
    if (musicaGokuArquivo.paused) {
      musicaGokuArquivo.play().catch(() => {
        // O navegador libera o audio na proxima interacao do jogador.
      });
    }
    return;
  }

  musicaGokuArquivo.pause();
  if (reiniciarAoSair) musicaGokuArquivo.currentTime = 0;
}

function sincronizarMusicaNeymar(reiniciarAoSair = false) {
  const deveTocar = somLigado && joao.avatar === "neymar" && !venceu && !gameOver;

  if (deveTocar) {
    if (musicaNeymarArquivo.paused) {
      musicaNeymarArquivo.play().catch(() => {
        // O navegador libera o audio na proxima interacao do jogador.
      });
    }
    return;
  }

  musicaNeymarArquivo.pause();
  if (reiniciarAoSair) musicaNeymarArquivo.currentTime = 0;
}

function tocarTom(freq, duracao, tipo, volume, atraso = 0) {
  if (!somLigado) return;
  iniciarAudio();
  if (!audioCtx) return;

  const agora = audioCtx.currentTime + atraso;
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.type = tipo;
  osc.frequency.setValueAtTime(freq, agora);
  gain.gain.setValueAtTime(0, agora);
  gain.gain.linearRampToValueAtTime(volume, agora + 0.012);
  gain.gain.exponentialRampToValueAtTime(0.001, agora + duracao);
  osc.connect(gain);
  gain.connect(audioCtx.destination);
  osc.start(agora);
  osc.stop(agora + duracao + 0.03);
}

function tocarSom(nome) {
  const sons = {
    pulo: () => {
      tocarTom(330, 0.08, "square", 0.045);
      tocarTom(510, 0.12, "square", 0.035, 0.05);
    },
    moeda: () => {
      tocarTom(880, 0.08, "triangle", 0.05);
      tocarTom(1320, 0.1, "triangle", 0.045, 0.07);
    },
    yoshi: () => {
      tocarTom(520, 0.11, "sine", 0.05);
      tocarTom(690, 0.11, "sine", 0.05, 0.09);
      tocarTom(920, 0.16, "triangle", 0.04, 0.18);
    },
    gol: () => {
      [392, 523, 659, 784, 1046].forEach((nota, i) => tocarTom(nota, 0.1, "square", 0.046, i * 0.055));
    },
    miaw: () => {
      tocarTom(880, 0.06, "triangle", 0.045);
      tocarTom(1320, 0.08, "sine", 0.04, 0.055);
      tocarTom(660, 0.12, "square", 0.025, 0.13);
    },
    cogumelo: () => {
      [392, 494, 587, 784, 988].forEach((nota, i) => tocarTom(nota, 0.09, "square", 0.042, i * 0.055));
    },
    dano: () => {
      tocarTom(150, 0.14, "sawtooth", 0.075);
      tocarTom(90, 0.2, "square", 0.055, 0.08);
    },
    pisao: () => {
      tocarTom(220, 0.08, "square", 0.055);
      tocarTom(440, 0.12, "triangle", 0.045, 0.06);
    },
    soco: () => { tocarTom(185, .07, "square", .065); tocarTom(110, .08, "triangle", .05, .03); },
    chute: () => { tocarTom(145, .1, "sawtooth", .07); tocarTom(290, .09, "square", .045, .04); },
    especial: () => { [110,220,440,880].forEach((nota,i) => tocarTom(nota,.13,"sawtooth",.055,i*.035)); },
    esfera: () => {
      tocarTom(330, 0.1, "sawtooth", 0.055);
      tocarTom(660, 0.14, "triangle", 0.05, 0.04);
      tocarTom(990, 0.18, "sine", 0.04, 0.09);
    },
    portal: () => {
      tocarTom(392, 0.1, "sine", 0.045);
      tocarTom(523, 0.1, "sine", 0.045, 0.08);
      tocarTom(784, 0.18, "triangle", 0.04, 0.16);
    },
    vitoria: () => {
      [523, 659, 784, 1046].forEach((nota, i) => tocarTom(nota, 0.2, "triangle", 0.055, i * 0.11));
    }
  };

  if (sons[nome]) sons[nome]();
}

function tocarMusica() {
  if (!somLigado || venceu || gameOver) {
    sincronizarMusicaGoku(false);
    sincronizarMusicaNeymar(false);
    return;
  }

  if (joao.avatar === "goku") {
    sincronizarMusicaGoku(false);
    return;
  }

  if (joao.avatar === "neymar") {
    sincronizarMusicaNeymar(false);
    return;
  }

  musicaTimer--;
  if (musicaTimer > 0) return;

  const temVilaoVivo = jogoIniciado && fases[faseAtual].inimigos.some(i => !i.morto);
  if (temVilaoVivo) {
    const melodiaVilao = [196, 208, 196, 247, 233, 196, 185, 196, 294, 277, 247, 233, 196, 175, 165, 147];
    const baixoVilao = [98, 98, 123, 98, 87, 98, 73, 82];
    const sireneVilao = [392, 370, 349, 330];
    tocarTom(melodiaVilao[notaMusica % melodiaVilao.length], 0.15, "square", 0.068);
    tocarTom(baixoVilao[Math.floor(notaMusica / 2) % baixoVilao.length], 0.2, "sawtooth", 0.048);
    if (notaMusica % 4 === 0) {
      tocarTom(sireneVilao[Math.floor(notaMusica / 4) % sireneVilao.length], 0.1, "square", 0.036, 0.04);
    }
    if (notaMusica % 8 === 0) {
      tocarTom(73, 0.16, "triangle", 0.055, 0.02);
    }
    notaMusica++;
    musicaTimer = 12;
    return;
  }

  const melodia = [392, 392, 523, 659, 587, 523, 440, 523, 349, 349, 440, 587, 523, 440, 392, 330];
  const harmonia = [196, 247, 262, 247, 220, 262, 294, 247];
  const baixo = [98, 147, 131, 147, 110, 165, 147, 123];
  tocarTom(melodia[notaMusica % melodia.length], 0.12, "square", 0.032);
  if (notaMusica % 2 === 1) {
    tocarTom(harmonia[Math.floor(notaMusica / 2) % harmonia.length], 0.11, "triangle", 0.014);
  }
  if (notaMusica % 2 === 0) {
    tocarTom(baixo[Math.floor(notaMusica / 2) % baixo.length], 0.16, "triangle", 0.021);
  }
  notaMusica++;
  musicaTimer = 18;
}

function criarParticulas(x, y, cor, quantidade = 10) {
  for (let i = 0; i < quantidade; i++) {
    particulas.push({
      x,
      y,
      vx: (Math.random() - 0.5) * 5,
      vy: -Math.random() * 4 - 1,
      vida: 28 + Math.random() * 18,
      cor
    });
  }
}

function atualizarParticulas() {
  for (let i = particulas.length - 1; i >= 0; i--) {
    const p = particulas[i];
    p.x += p.vx;
    p.y += p.vy;
    p.vy += 0.22;
    p.vida--;
    if (p.vida <= 0) particulas.splice(i, 1);
  }
}

function desenharParticulas() {
  particulas.forEach(p => {
    ctx.fillStyle = p.cor;
    ctx.fillRect(p.x, p.y, 4, 4);
  });
}

function resetarPersonagens() {
  const fase = fases[faseAtual];
  if (fase && fase.yoshi) fase.yoshi.montadoPor = null;
  if (fase && fase.mufasa) fase.mufasa.montadoPor = null;
  if (fase) resetarPlataformasMoveis(fase);
  meteoros.length = 0;
  poderes.length = 0;
  poderNeymarCooldown = 0;
  proximoPoderNeymar = "muletaPower";
  genkiDamaCooldown = 0;
  poderRobloxCooldown = 0;
  proximoPoderRoblox = "celular";
  poderCR7Cooldown = 0;
  poderHarryCooldown = 0;
  buffonTempo = 0;
  proximoPoderCR7 = "bicicletaCR7";
  poderChavesCooldown = 0;
  poderChavesSucoCooldown = 90;
  proximoPoderChaves = "sanduichePresunto";
  poderEsqueletoCooldown = 0;
  segundoCorteEsqueleto = 0;
  poderSilvioCooldown = 0;
  proximoPoderSilvio = "jequiti";

  joao.x = modoVersus ? 280 : fase?.bonus ? 842 : 52;
  joao.y = 422;
  joao.velX = 0;
  joao.velY = 0;
  joao.invencivel = 80;
  joao.montado = false;
  joao.montaria = null;
  joao.superMario = false;
  joao.grande = false;
  joao.poderTempo = 0;
  joao.nuvem = false;
  joao.superSayajin = false;
  joao.energiaVoo = ENERGIA_MAXIMA_VOO_GOKU;
  joao.agachado = false;
  joao.ataqueTempo = 0;
  joao.ataqueCooldown = 0;
  joao.direcao = modoVersus ? 1 : fase?.bonus ? -1 : 1;
  joao.comboGolpe = -1;
  joao.h = joao.alturaNormal;

  jogador2.x = modoVersus ? 646 : fase?.bonus ? 800 : 102;
  jogador2.y = 422;
  jogador2.velX = 0;
  jogador2.velY = 0;
  jogador2.invencivel = 80;
  jogador2.direcao = -1;
  jogador2.noChao = false;
  jogador2.agachado = false;
  jogador2.ataqueTempo = 0;
  jogador2.ataqueCooldown = 0;
  jogador2.comboGolpe = -1;
  jogador2.montado = false;
  jogador2.montaria = null;
  jogador2.superMario = false;
  jogador2.h = jogador2.alturaNormal;

}

function jogadoresAtivos() {
  return multiplayerAtivo ? [joao, jogador2] : [joao];
}

function derrotarJogadores(motivo = "A dupla foi derrotada!") {
  if (!multiplayerAtivo) {
    resetarPersonagens();
    return;
  }
  gameOver = true;
  pausado = false;
  mensagem.innerText = motivo + " Se um morre, os dois morrem.";
  tocarSom("dano");
  tremor = 30;
}

function resetarPlataformasMoveis(fase) {
  fase.plataformas.forEach(plataforma => {
    if (!plataforma.movel) return;
    if (plataforma.baseX === undefined) plataforma.baseX = plataforma.x;
    plataforma.x = plataforma.baseX;
    plataforma.prevX = plataforma.x;
    plataforma.dx = 0;
  });
}

function teclaAtiva(tecla) {
  if (Array.isArray(tecla)) return tecla.some(t => keys[t]);
  return keys[tecla];
}

function atualizarPlataformasMoveis() {
  const fase = fases[faseAtual];
  const ritmoHard = MODO_HARD_GLOBAL ? Math.min(1.28, 1.12 + faseAtual * 0.015) : 1;

  fase.plataformas.forEach(plataforma => {
    if (!plataforma.movel) return;
    if (plataforma.baseX === undefined) plataforma.baseX = plataforma.x;

    plataforma.prevX = plataforma.x;
    plataforma.x += plataforma.vel * AJUSTE_VELOCIDADE_JOGAVEL * ritmoHard;

    if (plataforma.x <= plataforma.min || plataforma.x + plataforma.w >= plataforma.max) {
      plataforma.vel *= -1;
      plataforma.x = Math.max(plataforma.min, Math.min(plataforma.x, plataforma.max - plataforma.w));
    }

    plataforma.dx = plataforma.x - plataforma.prevX;
  });
}

function moverPersonagem(p, esquerda, direita, pulo, baixo = ["s", "ArrowDown"]) {
  p.prevX = p.x;
  p.prevY = p.y;
  p.velX = 0;
  p.andando = false;
  if (p.avatar !== "goku" && p.avatar !== "harry") p.nuvem = false;
  const querAbaixar = teclaAtiva(baixo);

  if (querAbaixar && !p.agachado && !p.montado && !p.nuvem) {
    p.y += p.h - p.alturaAgachado;
    p.h = p.alturaAgachado;
    p.agachado = true;
  }

  if ((!querAbaixar || p.montado || p.nuvem) && p.agachado) {
    p.y -= p.alturaNormal - p.h;
    p.h = p.alturaNormal;
    p.agachado = false;
  }

  const bonusRoblox = p.avatar === "meninoRoblox" ? 1.18 : 1;
  const velocidadeBase = ((p.nuvem ? 5.5 : p.montado ? 5.35 : 4.35) + (p.grande ? 0.45 : 0)) * bonusRoblox;
  const velocidade = p.agachado ? velocidadeBase * 0.58 : velocidadeBase;
  const forcaPulo = (p.nuvem ? -9.2 : p.montado ? -15.2 : -13.2) - (p.grande ? 0.8 : 0);
  const gravidade = p.nuvem ? 0.28 : p.montado ? 0.58 : 0.64;

  if (teclaAtiva(esquerda)) {
    p.velX = -velocidade;
    p.andando = true;
    p.direcao = -1;
  }

  if (teclaAtiva(direita)) {
    p.velX = velocidade;
    p.andando = true;
    p.direcao = 1;
  }

  if (p.nuvem && teclaAtiva(pulo) && p.energiaVoo > 0) {
    p.velY = Math.max(p.velY - 0.9, -6.8);
    p.energiaVoo--;
    p.noChao = false;
  } else if (teclaAtiva(pulo) && p.noChao) {
    p.velY = forcaPulo;
    p.noChao = false;
    tocarSom("pulo");
  }

  p.velY += gravidade;
  p.x += p.velX;
  p.y += p.velY;
  p.noChao = false;

  if (p.nuvem && !teclaAtiva(pulo)) {
    p.energiaVoo = Math.min(ENERGIA_MAXIMA_VOO_GOKU, p.energiaVoo + 2);
  }

  if (p.nuvem && p.y < ALTURA_MINIMA_VOO_GOKU) {
    p.y = ALTURA_MINIMA_VOO_GOKU;
    p.velY = Math.max(0, p.velY);
  }

  fases[faseAtual].plataformas.forEach(plataforma => {
    const estavaAcima = p.y + p.h - p.velY <= plataforma.y + 4;

    if (colisao(p, plataforma) && p.velY >= 0 && estavaAcima) {
      p.y = plataforma.y - p.h;
      p.velY = 0;
      p.noChao = true;
      if (plataforma.movel) p.x += plataforma.dx || 0;
    }
  });

  if (p.x < 0) p.x = 0;
  if (p.x + p.w > canvas.width) p.x = canvas.width - p.w;

  if (p.y > canvas.height + 60) {
    mostrarAviso("Cuidado com os buracos!");
    derrotarJogadores("Um jogador caiu!");
  }

  if (p.invencivel > 0) p.invencivel--;
  if (p.poderTempo > 0) {
    p.poderTempo--;
    if (p.poderTempo <= 0) p.grande = false;
  }
}

function atualizarDesafioLabirinto() {
  const fase = fases[faseAtual];
  if (!fase.labirinto) return;
  jogadoresAtivos().forEach(jogador => {
    if (jogador.labirintoCooldown > 0) jogador.labirintoCooldown--;
    const parede = fase.paredesLabirinto.find(item => colisao(jogador, item));
    if (parede) {
      jogador.x = jogador.prevX;
      jogador.velX = 0;
    }

    const areia = (fase.areiasMovedicas || []).find(item => colisao(jogador, item));
    if (areia) {
      jogador.x = jogador.prevX + (jogador.x - jogador.prevX) * 0.28;
      jogador.velY = Math.min(3.8, jogador.velY + 0.45);
      if (frame % 70 === 0) mostrarAviso("AREIA MOVEDICA! Pule para escapar.");
    }

    const ilusao = (fase.ilusoesLabirinto || []).find(item => colisao(jogador, item));
    if (ilusao && jogador.labirintoCooldown <= 0) {
      jogador.x = ilusao.destinoX;
      jogador.y = ilusao.destinoY;
      jogador.velX = 0;
      jogador.velY = 0;
      jogador.labirintoCooldown = 120;
      flashImpacto = 10;
      tocarSom("portal");
      mostrarAviso("ILUSAO! Voce voltou para outro corredor.");
    }
  });
  atualizarPacmansLabirinto(fase);
  if (multiplayerAtivo && joao.invencivel <= 0 && jogador2.invencivel <= 0 && colisao(joao, jogador2)) {
    derrotarJogadores("Os jogadores se trombaram no labirinto!");
  }
}

function atualizarPacmansLabirinto(fase) {
  (fase.pacmans || []).forEach(pac => {
    if (pac.baseX === undefined) {
      pac.baseX = pac.x;
      pac.baseY = pac.y;
    }
    const alvo = jogadoresAtivos().reduce((maisPerto, jogador) => {
      const distancia = Math.hypot(jogador.x - pac.x, jogador.y - pac.y);
      return !maisPerto || distancia < maisPerto.distancia ? { jogador, distancia } : maisPerto;
    }, null)?.jogador;
    if (!alvo) return;

    const dx = alvo.x + alvo.w / 2 - (pac.x + pac.w / 2);
    const dy = alvo.y + alvo.h / 2 - (pac.y + pac.h / 2);
    const distancia = Math.max(1, Math.hypot(dx, dy));
    pac.x += dx / distancia * pac.velocidade;
    pac.y += dy / distancia * pac.velocidade * 0.65;
    pac.x = Math.max(8, Math.min(canvas.width - pac.w - 8, pac.x));
    pac.y = Math.max(190, Math.min(448, pac.y));

    const atingido = jogadoresAtivos().find(jogador => jogador.invencivel <= 0 && colisao(jogador, pac));
    if (atingido) {
      criarParticulas(pac.x + 17, pac.y + 17, pac.cor, 28);
      tocarSom("dano");
      derrotarJogadores("Um Pac encontrou o jogador no labirinto!");
    }
  });
}

function desenharFundo(fase) {
  const grad = ctx.createLinearGradient(0, 0, 0, canvas.height);
  grad.addColorStop(0, fase.fundo[0]);
  grad.addColorStop(1, fase.fundo[1]);
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  if (fase.tema === "floresta") {
    desenharSol(806, 72);
    desenharNuvem(82, 78, 1);
    desenharNuvem(510, 96, 0.82);
    desenharArvores();
  }

  if (fase.tema === "caverna") {
    desenharCristais();
    desenharPedrasFundo();
  }

  if (fase.tema === "castelo") {
    desenharLua(806, 72);
    desenharTorres();
  }

  if (fase.tema === "vulcao") {
    desenharCeuVulcao();
    desenharVulcoes();
    desenharMarDeFogo();
  }

  if (fase.tema === "estadio") {
    desenharEstadio();
  }

  if (fase.tema === "floresta-noite") {
    desenharLua(812, 66);
    desenharArvoresNoturnas();
  }

  if (fase.tema === "auditorio") {
    desenharProgramaAuditorio();
  }

  if (fase.tema === "garagemBonus") {
    ctx.fillStyle = "#83c5ff";
    ctx.fillRect(0, 0, canvas.width, 230);
    ctx.fillStyle = "#495b83";
    for (let x = 0; x < canvas.width; x += 74) {
      const altura = 88 + (x * 7) % 96;
      ctx.fillRect(x, 230 - altura, 62, altura);
      ctx.fillStyle = "#ffd166";
      for (let janelaY = 230 - altura + 14; janelaY < 214; janelaY += 22) {
        for (let janelaX = x + 9; janelaX < x + 54; janelaX += 18) ctx.fillRect(janelaX, janelaY, 8, 10);
      }
      ctx.fillStyle = "#495b83";
    }
    ctx.fillStyle = "#176b87";
    ctx.fillRect(0, 230, canvas.width, 104);
    ctx.fillStyle = "#8ecae6";
    for (let onda = 0; onda < canvas.width; onda += 48) ctx.fillRect(onda, 250 + (onda % 3) * 12, 30, 4);
    ctx.fillStyle = "#b08968";
    ctx.fillRect(0, 334, canvas.width, 152);
    ctx.strokeStyle = "#7f5539";
    ctx.lineWidth = 2;
    for (let x = 0; x < canvas.width; x += 64) {
      ctx.beginPath(); ctx.moveTo(x, 334); ctx.lineTo(x - 54, 486); ctx.stroke();
    }
    for (let y = 360; y < 486; y += 34) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(canvas.width, y); ctx.stroke(); }
    ctx.fillStyle = "#7bdff2";
    ctx.font = "bold 25px monospace";
    ctx.fillText("DEMOLIÇÃO À BEIRA-MAR", 318, 116);
    ctx.fillStyle = "#f7f3de";
    ctx.font = "bold 16px monospace";
    ctx.fillText("8 SEGUNDOS • CARRO + BARRIL", 368, 150);
  }

  if (fase.tema === "labirinto") {
    ctx.fillStyle = "#0b1022";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "rgba(199,125,255,.08)";
    for (let y = 40; y < 480; y += 48) {
      for (let x = (y / 48) % 2 * 24; x < 960; x += 48) ctx.fillRect(x, y, 26, 22);
    }
    ctx.fillStyle = "#c77dff";
    ctx.font = "bold 24px monospace";
    ctx.fillText("LABIRINTO DAS MOEDAS", 338, 146);
    ctx.fillStyle = "#f7f3de";
    ctx.font = "15px monospace";
    ctx.fillText("ILUSOES • AREIA MOVEDICA • PACS PERSEGUIDORES", 268, 176);
  }
}

function desenharParedesLabirinto(fase) {
  (fase.paredesLabirinto || []).forEach((parede, indice) => {
    ctx.fillStyle = indice % 2 === 0 ? "#4c2a85" : "#31558f";
    ctx.fillRect(parede.x, parede.y, parede.w, parede.h);
    ctx.fillStyle = "rgba(255,255,255,.16)";
    for (let y = parede.y + 8; y < parede.y + parede.h; y += 22) ctx.fillRect(parede.x + 5, y, parede.w - 10, 5);
    ctx.strokeStyle = "#c77dff";
    ctx.strokeRect(parede.x, parede.y, parede.w, parede.h);
  });
}

function desenharPerigosLabirinto(fase) {
  (fase.areiasMovedicas || []).forEach(areia => {
    ctx.fillStyle = "#a66a2c";
    ctx.fillRect(areia.x, areia.y, areia.w, areia.h);
    ctx.fillStyle = "#d4a373";
    for (let x = areia.x + 5; x < areia.x + areia.w; x += 14) {
      ctx.fillRect(x, areia.y + 5 + Math.sin((frame + x) / 8) * 3, 9, 4);
    }
  });

  (fase.ilusoesLabirinto || []).forEach((ilusao, indice) => {
    ctx.fillStyle = "rgba(199,125,255," + (0.18 + Math.sin(frame / 10 + indice) * 0.08) + ")";
    ctx.fillRect(ilusao.x, ilusao.y, ilusao.w, ilusao.h);
    ctx.strokeStyle = "#c77dff";
    ctx.strokeRect(ilusao.x, ilusao.y, ilusao.w, ilusao.h);
    ctx.fillStyle = "#f7f3de";
    ctx.font = "bold 10px monospace";
    ctx.fillText("?", ilusao.x + 14, ilusao.y + 34);
  });

  (fase.pacmans || []).forEach(pac => {
    const boca = Math.abs(Math.sin(frame / 5)) * 0.65;
    const direcao = joao.x >= pac.x ? 0 : Math.PI;
    ctx.fillStyle = pac.cor;
    ctx.beginPath();
    ctx.moveTo(pac.x + 17, pac.y + 17);
    ctx.arc(pac.x + 17, pac.y + 17, 17, direcao + boca, direcao + Math.PI * 2 - boca);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = "#111111";
    ctx.fillRect(pac.x + 15, pac.y + 6, 4, 4);
  });
}

function desenharAmbienteVivo(fase) {
  ctx.save();
  if (fase.tema === "auditorio" || fase.tema === "estadio") {
    for (let i = 0; i < 7; i++) {
      const x = (i * 151 + frame * (i % 2 ? .35 : -.25)) % 1040 - 40;
      ctx.fillStyle = i % 2 ? "rgba(255,212,59,.2)" : "rgba(116,192,252,.18)";
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x + 55, 310); ctx.lineTo(x + 105, 310); ctx.closePath(); ctx.fill();
    }
  } else if (fase.tema === "floresta" || fase.tema === "floresta-noite") {
    for (let i = 0; i < 18; i++) {
      const x = (i * 67 + frame * .45) % 1000 - 20;
      const y = 80 + ((i * 91 + frame * .7) % 330);
      ctx.fillStyle = i % 3 ? "rgba(81,216,138,.45)" : "rgba(247,201,72,.38)";
      ctx.fillRect(x, y, 5, 3);
    }
  } else {
    for (let i = 0; i < 12; i++) {
      const x = (i * 83 + frame * .18) % 980;
      const y = 120 + (i * 47 % 300) + Math.sin(frame / 20 + i) * 8;
      ctx.fillStyle = "rgba(255,255,255,.13)";
      ctx.fillRect(x, y, 3, 3);
    }
  }
  ctx.restore();
}

function desenharProgramaAuditorio() {
  ctx.fillStyle = "#6a040f";
  ctx.fillRect(0, 0, 130, 430);
  ctx.fillRect(830, 0, 130, 430);
  ctx.fillStyle = "#d00000";
  for (let x = 18; x < 130; x += 34) ctx.fillRect(x, 0, 14, 430);
  for (let x = 844; x < 960; x += 34) ctx.fillRect(x, 0, 14, 430);
  ctx.fillStyle = "#ffd43b";
  ctx.fillRect(210, 54, 540, 8);
  ctx.fillRect(210, 154, 540, 8);
  ctx.fillStyle = "rgba(255,255,255,0.16)";
  for (let y = 185; y < 360; y += 44) {
    for (let x = 150; x < 830; x += 54) {
      ctx.fillRect(x, y, 28, 22);
      ctx.fillStyle = (x + y) % 3 === 0 ? "#74c0fc" : "#ff8fab";
      ctx.fillRect(x + 8, y - 12, 12, 12);
      ctx.fillStyle = "rgba(255,255,255,0.16)";
    }
  }
  ctx.fillStyle = "#f7f3de";
  ctx.font = "bold 34px monospace";
  ctx.fillText("PROGRAMA DE AUDITÓRIO", 272, 118);
}

function desenharSol(x, y) {
  ctx.fillStyle = "#ffe66d";
  ctx.fillRect(x - 20, y - 20, 40, 40);
  ctx.fillStyle = "#ffd166";
  ctx.fillRect(x - 28, y - 4, 56, 8);
  ctx.fillRect(x - 4, y - 28, 8, 56);
}

function desenharLua(x, y) {
  ctx.fillStyle = "#f7f3de";
  ctx.fillRect(x - 20, y - 20, 40, 40);
  ctx.fillStyle = "#32364f";
  ctx.fillRect(x - 4, y - 24, 30, 42);
}

function desenharNuvem(x, y, escala) {
  ctx.fillStyle = "rgba(255, 255, 255, 0.86)";
  pixelRect(x, y, 64 * escala, 18 * escala);
  pixelRect(x + 22 * escala, y - 16 * escala, 58 * escala, 20 * escala);
  pixelRect(x + 68 * escala, y, 42 * escala, 18 * escala);
}

function desenharArvores() {
  for (let x = -30; x < canvas.width; x += 122) {
    ctx.fillStyle = "#5f3f2d";
    ctx.fillRect(x + 38, 374, 20, 112);
    ctx.fillStyle = "#1b8a5a";
    ctx.fillRect(x + 8, 330, 80, 42);
    ctx.fillRect(x + 20, 302, 58, 42);
    ctx.fillStyle = "#0f6b47";
    ctx.fillRect(x + 18, 364, 68, 16);
  }
}

function desenharCristais() {
  for (let x = 72; x < canvas.width; x += 180) {
    ctx.fillStyle = "rgba(92, 225, 230, 0.28)";
    ctx.fillRect(x, 82, 18, 74);
    ctx.fillStyle = "rgba(255, 255, 255, 0.18)";
    ctx.fillRect(x + 5, 92, 4, 46);
  }
}

function desenharPedrasFundo() {
  ctx.fillStyle = "rgba(0, 0, 0, 0.16)";
  for (let x = 34; x < canvas.width; x += 148) {
    ctx.fillRect(x, 420, 70, 18);
    ctx.fillRect(x + 28, 398, 38, 18);
  }
}

function desenharTorres() {
  ctx.fillStyle = "rgba(0, 0, 0, 0.22)";
  for (let x = 32; x < canvas.width; x += 180) {
    ctx.fillRect(x, 184, 72, 302);
    ctx.fillRect(x - 12, 160, 24, 24);
    ctx.fillRect(x + 24, 142, 24, 42);
    ctx.fillRect(x + 60, 160, 24, 24);
    ctx.fillStyle = "rgba(247, 201, 72, 0.42)";
    ctx.fillRect(x + 28, 230, 16, 24);
    ctx.fillStyle = "rgba(0, 0, 0, 0.22)";
  }
}

function desenharCeuVulcao() {
  ctx.fillStyle = "rgba(255, 94, 20, 0.16)";
  for (let x = 34; x < canvas.width; x += 118) {
    const y = 54 + Math.sin((frame + x) / 22) * 12;
    ctx.fillRect(x, y, 42, 10);
    ctx.fillRect(x + 22, y - 12, 70, 12);
  }

  ctx.fillStyle = "rgba(0, 0, 0, 0.26)";
  ctx.fillRect(0, 366, canvas.width, 120);
}

function desenharVulcoes() {
  const vulcoes = [
    { x: 54, y: 486, w: 178, h: 192 },
    { x: 316, y: 486, w: 210, h: 232 },
    { x: 710, y: 486, w: 190, h: 214 }
  ];

  vulcoes.forEach((v, idx) => {
    ctx.fillStyle = "#32151a";
    ctx.beginPath();
    ctx.moveTo(v.x, v.y);
    ctx.lineTo(v.x + v.w / 2, v.y - v.h);
    ctx.lineTo(v.x + v.w, v.y);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = "#5f1f1d";
    ctx.fillRect(v.x + v.w / 2 - 24, v.y - v.h + 34, 48, v.h - 34);

    const fogo = 10 + Math.sin(frame / 8 + idx) * 5;
    ctx.fillStyle = "#ff5400";
    ctx.fillRect(v.x + v.w / 2 - 22, v.y - v.h + 18, 44, fogo + 10);
    ctx.fillStyle = "#ffd166";
    ctx.fillRect(v.x + v.w / 2 - 10, v.y - v.h + 12, 20, fogo);
  });
}

function desenharMarDeFogo() {
  ctx.fillStyle = "#5a0b0b";
  ctx.fillRect(0, 486, canvas.width, 54);

  for (let x = -20; x < canvas.width; x += 42) {
    const onda = Math.sin((frame + x) / 9) * 7;
    ctx.fillStyle = "#ff3d00";
    ctx.fillRect(x, 492 + onda, 38, 22);
    ctx.fillStyle = "#ffd166";
    ctx.fillRect(x + 8, 500 + onda, 18, 8);
  }
}

function desenharEstadio() {
  ctx.fillStyle = "rgba(255, 255, 255, 0.86)";
  ctx.fillRect(0, 108, canvas.width, 36);
  ctx.fillStyle = "#1d3557";
  ctx.fillRect(0, 144, canvas.width, 76);
  ctx.fillStyle = "#e63946";
  for (let x = 0; x < canvas.width; x += 64) {
    ctx.fillRect(x, 150, 34, 18);
    ctx.fillStyle = "#f7c948";
    ctx.fillRect(x + 12, 184, 38, 18);
    ctx.fillStyle = "#e63946";
  }
  ctx.fillStyle = "rgba(255, 255, 255, 0.65)";
  ctx.fillRect(92, 62, 56, 26);
  ctx.fillRect(812, 62, 56, 26);
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(468, 430, 24, 56);
  ctx.fillRect(0, 454, canvas.width, 4);
}

function desenharArvoresNoturnas() {
  ctx.fillStyle = "rgba(255, 255, 255, 0.7)";
  for (let i = 0; i < 28; i++) {
    const x = (i * 73 + 31) % canvas.width;
    const y = 42 + (i * 29) % 210;
    ctx.fillRect(x, y, 3, 3);
  }

  for (let x = -40; x < canvas.width; x += 112) {
    ctx.fillStyle = "#3d2b1f";
    ctx.fillRect(x + 42, 352, 18, 134);
    ctx.fillStyle = "#0f5132";
    ctx.fillRect(x + 8, 314, 86, 44);
    ctx.fillRect(x + 20, 286, 62, 42);
    ctx.fillStyle = "#0a3d2a";
    ctx.fillRect(x + 18, 350, 70, 18);
  }
}

function desenharPlataforma(p) {
  const cores = {
    grama: ["#43aa4f", "#2d7a32", "#7bd86a"],
    pedra: ["#7f8fa6", "#4b5568", "#b0bec5"],
    castelo: ["#6d6875", "#3d405b", "#a9a3b5"]
  };

  const paleta = cores[p.tipo] || cores.grama;
  ctx.fillStyle = p.movel ? "#c77dff" : paleta[0];
  ctx.fillRect(p.x, p.y, p.w, p.h);
  ctx.fillStyle = p.movel ? "#f7f3de" : paleta[2];
  ctx.fillRect(p.x, p.y, p.w, 5);
  ctx.fillStyle = p.movel ? "#6a00f4" : paleta[1];
  ctx.fillRect(p.x, p.y + p.h - 7, p.w, 7);

  for (let x = p.x + 10; x < p.x + p.w - 8; x += 28) {
    ctx.fillStyle = "rgba(0, 0, 0, 0.18)";
    ctx.fillRect(x, p.y + 8, 12, 5);
  }

  if (p.movel) {
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(p.x + 8, p.y + 8, 12, 4);
    ctx.fillRect(p.x + p.w - 20, p.y + 8, 12, 4);
  }
}

function desenharTachas(fase) {
  if (!fase.tachas) return;

  fase.tachas.forEach(tacha => {
    ctx.fillStyle = "#1f2933";
    ctx.fillRect(tacha.x, tacha.y + 16, tacha.w, tacha.h - 16);

    for (let x = tacha.x; x < tacha.x + tacha.w; x += 24) {
      ctx.fillStyle = "#d0d7de";
      ctx.beginPath();
      ctx.moveTo(x, tacha.y + 18);
      ctx.lineTo(x + 12, tacha.y);
      ctx.lineTo(x + 24, tacha.y + 18);
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = "#ff0054";
      ctx.fillRect(x + 10, tacha.y + 8, 4, 8);
    }
  });
}

function desenharCampoMinado(fase) {
  fase.plataformas.forEach(plataforma => {
    for (let x = plataforma.x; x < plataforma.x + plataforma.w; x += 32) {
      ctx.fillStyle = Math.floor((x - plataforma.x) / 32) % 2 === 0 ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.12)";
      ctx.fillRect(x, plataforma.y, Math.min(32, plataforma.x + plataforma.w - x), 10);
      ctx.strokeStyle = "rgba(255,255,255,0.16)";
      ctx.strokeRect(x, plataforma.y, Math.min(32, plataforma.x + plataforma.w - x), 10);
    }
  });

  (fase.armadilhas || []).forEach(armadilha => {
    if (!armadilha.revelada) return;
    if (armadilha.tipo === "ratoeira" || armadilha.tipo === "armadilhaAco") {
      ctx.fillStyle = "#495057";
      ctx.fillRect(armadilha.x, armadilha.y + 5, armadilha.w, 5);
      ctx.fillStyle = "#e9ecef";
      for (let dente = 0; dente < 5; dente++) {
        ctx.beginPath();
        ctx.moveTo(armadilha.x + dente * 6, armadilha.y + 5);
        ctx.lineTo(armadilha.x + 3 + dente * 6, armadilha.y - 4);
        ctx.lineTo(armadilha.x + 6 + dente * 6, armadilha.y + 5);
        ctx.fill();
      }
      ctx.fillStyle = "#ef476f";
      ctx.fillRect(armadilha.x + 10, armadilha.y + 5, 8, 5);
      return;
    }
    ctx.fillStyle = armadilha.cor;
    ctx.fillRect(armadilha.x, armadilha.y, armadilha.w, armadilha.h);
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 10px monospace";
    ctx.fillText("!", armadilha.x + 11, armadilha.y + 9);
  });
}

function desenharDestrutiveis(fase) {
  (fase.destrutiveis || []).forEach(objeto => {
    if (objeto.quebrado) return;
    if (objeto.tipo === "barrilQuebravel") {
      ctx.fillStyle = "#5c2f12";
      ctx.fillRect(objeto.x, objeto.y, objeto.w, objeto.h);
      ctx.fillStyle = "#9c551f";
      ctx.fillRect(objeto.x + 5, objeto.y + 3, objeto.w - 10, objeto.h - 6);
      ctx.fillStyle = "#20252c";
      ctx.fillRect(objeto.x, objeto.y + 7, objeto.w, 5);
      ctx.fillRect(objeto.x, objeto.y + objeto.h - 12, objeto.w, 5);
    } else {
      const dano = 1 - objeto.vida / objeto.vidaMax;
      const topoX = objeto.x + objeto.w * 0.22;
      const topoW = objeto.w * 0.56;
      ctx.fillStyle = "#3f7651";
      ctx.fillRect(objeto.x, objeto.y + objeto.h * 0.34 + dano * 5, objeto.w, objeto.h * 0.48 - dano * 4);
      ctx.fillStyle = "#79a66f";
      ctx.fillRect(topoX, objeto.y + dano * 3, topoW, objeto.h * 0.4 - dano * 3);
      ctx.fillStyle = "#b9d9d0";
      ctx.fillRect(objeto.x + objeto.w * 0.29, objeto.y + 7, objeto.w * 0.18, objeto.h * 0.23);
      ctx.fillRect(objeto.x + objeto.w * 0.52, objeto.y + 7, objeto.w * 0.16, objeto.h * 0.23);
      ctx.fillStyle = "#343a40";
      ctx.fillRect(objeto.x + objeto.w * 0.34, objeto.y + objeto.h * 0.46, objeto.w * 0.32, objeto.h * 0.2);
      ctx.fillStyle = "#8f9aa8";
      for (let grade = 0; grade < 6; grade++) ctx.fillRect(objeto.x + objeto.w * (0.365 + grade * 0.047), objeto.y + objeto.h * 0.49, 3, objeto.h * 0.14);
      ctx.fillStyle = "#d8f3dc";
      ctx.fillRect(objeto.x + objeto.w * 0.08, objeto.y + objeto.h * 0.46, objeto.w * 0.18, objeto.h * 0.13);
      ctx.fillRect(objeto.x + objeto.w * 0.74, objeto.y + objeto.h * 0.46, objeto.w * 0.18, objeto.h * 0.13);
      ctx.fillStyle = "#111111";
      ctx.fillRect(objeto.x + objeto.w * 0.12, objeto.y + objeto.h * 0.72, objeto.w * 0.2, objeto.h * 0.24);
      ctx.fillRect(objeto.x + objeto.w * 0.68, objeto.y + objeto.h * 0.72, objeto.w * 0.2, objeto.h * 0.24);
      ctx.fillStyle = "#14213d";
      ctx.fillRect(objeto.x + objeto.w * 0.43, objeto.y + objeto.h * 0.67, objeto.w * 0.14, objeto.h * 0.14);
      ctx.fillStyle = "#ffffff";
      ctx.font = "bold " + Math.max(7, Math.round(objeto.h * 0.08)) + "px monospace";
      ctx.fillText("OTAVIO", objeto.x + objeto.w * 0.445, objeto.y + objeto.h * 0.77);
      if (objeto.vida < objeto.vidaMax) {
        ctx.strokeStyle = "#fff3bf";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(objeto.x + 34, objeto.y + 5);
        ctx.lineTo(objeto.x + 28, objeto.y + 13);
        ctx.lineTo(objeto.x + 39, objeto.y + 19);
        ctx.stroke();
        ctx.fillStyle = "rgba(55, 58, 64, 0.72)";
        ctx.fillRect(objeto.x + 51, objeto.y - 4 - dano * 7, 9, 9);
      }
    }
    ctx.fillStyle = "rgba(0,0,0,0.7)";
    ctx.fillRect(objeto.x, objeto.y - 8, objeto.w, 5);
    ctx.fillStyle = "#51d88a";
    ctx.fillRect(objeto.x, objeto.y - 8, objeto.w * (objeto.vida / objeto.vidaMax), 5);
  });
}

function desenharBoneco(p) {
  const passo = p.andando && p.noChao ? Math.floor(frame / 7) % 2 : 0;
  const piscando = p.invencivel > 0 && Math.floor(frame / 5) % 2 === 0;
  if (piscando) return;
  const deslocamentoMontaria = p.montado ? -30 : p.nuvem && p.avatar === "harry" ? -18 : 0;
  if (personagemAtual === "cr7" && buffonTempo > 0) desenharBuffonGuardiao(p);
  if (p.montado) desenharMontariaDoJogador(p);
  if (p.avatar === "harry" && p.nuvem) desenharVassouraMontada(p);
  if (p.ataqueTempo > 0) desenharEfeitoGolpe(p, deslocamentoMontaria);
  if (p.superMario) {
    desenharSuperMario(p, deslocamentoMontaria);
    return;
  }

  if (p.avatar === "rangerVermelho") {
    desenharRangerVermelho({ ...p, y: p.y + deslocamentoMontaria });
    return;
  }

  if (p.avatar === "harry") {
    desenharHarryPotter({ ...p, y: p.y + deslocamentoMontaria });
    return;
  }

  if (p.avatar === "ancelotti") {
    desenharCarloAncelotti({ ...p, y: p.y + deslocamentoMontaria });
    return;
  }

  if (p.avatar === "yoshi") {
    ctx.save();
    ctx.translate(p.x + p.w / 2, p.y + p.h + deslocamentoMontaria);
    ctx.scale(p.direcao * ESCALA_VISUAL_PLAYER, ESCALA_VISUAL_PLAYER);
    desenharSpriteYoshi(-31, -54, 1, true);
    ctx.restore();
    desenharEtiqueta(nomeJogadorMontado(p), p.x + p.w / 2, p.y + deslocamentoMontaria - 10);
    return;
  }

  if (p.avatar === "lobo") {
    ctx.save();
    ctx.translate(p.x + p.w / 2, p.y + p.h + deslocamentoMontaria);
    ctx.scale(ESCALA_VISUAL_PLAYER, ESCALA_VISUAL_PLAYER);
    desenharSpriteLobo({ x: -29, y: -40, w: 58, h: 38, direcao: p.direcao });
    ctx.restore();
    desenharEtiqueta(nomeJogadorMontado(p), p.x + p.w / 2, p.y + deslocamentoMontaria - 10);
    return;
  }

  if (p.avatar === "miaw") {
    ctx.save();
    ctx.translate(p.x + p.w / 2, p.y + p.h + deslocamentoMontaria);
    ctx.scale(ESCALA_VISUAL_PLAYER, ESCALA_VISUAL_PLAYER);
    desenharMiawEletrico({ x: -24, y: -56, salvo: false, player: true }, p.direcao);
    ctx.restore();
    desenharEtiqueta(nomeJogadorMontado(p), p.x + p.w / 2, p.y + deslocamentoMontaria - 10);
    return;
  }

  if (p.avatar === "neymar") {
    desenharNeymarMuletas(p);
    desenharEtiqueta(p.nome + " • MULETA • FOGO • BRUNA", p.x + p.w / 2, p.y - 10);
    return;
  }

  if (p.avatar === "goku") {
    desenharGokuNuvemDourada(p.montado ? { ...p, y: p.y + deslocamentoMontaria } : p);
    desenharEtiqueta(p.nuvem ? "Super Goku na nuvem" : nomeJogadorMontado(p), p.x + p.w / 2, p.y + deslocamentoMontaria - 10);
    return;
  }

  if (p.avatar === "meninoRoblox") {
    ctx.save();
    ctx.translate(p.x + p.w / 2, p.y + p.h + deslocamentoMontaria);
    ctx.scale(ESCALA_VISUAL_PLAYER, ESCALA_VISUAL_PLAYER);
    desenharMeninoRoblox({ x: -23, y: -58, w: 46, h: 58, direcao: p.direcao, morto: false });
    ctx.restore();
    return;
  }

  if (p.avatar === "chaves") {
    desenharChavesPixel({ ...p, y: p.y + deslocamentoMontaria, ataqueOffset: 0 });
    return;
  }

  if (p.avatar === "esqueleto") {
    desenharEsqueletoEspadachim({ ...p, y: p.y + deslocamentoMontaria, ataqueOffset: 0 });
    return;
  }

  if (p.avatar === "silvioSantos") {
    desenharSilvioSantos({ ...p, y: p.y + deslocamentoMontaria });
    return;
  }

  const baseY = (p.montado ? p.y - 18 : p.y) + (!p.andando && p.noChao ? Math.sin(frame / 10) * 1.5 : 0);
  const escala = (p.grande ? 1.18 : 1) * ESCALA_VISUAL_PLAYER;
  const offsetX = p.grande ? -3 : 0;
  const offsetY = p.grande ? -10 : 0;

  ctx.save();

  if (p.direcao === -1) {
    ctx.translate(p.x + p.w, baseY);
    ctx.scale(-1, 1);
  } else {
    ctx.translate(p.x, baseY);
  }
  ctx.translate(offsetX, offsetY);
  ctx.scale(escala, escala);

  ctx.fillStyle = "rgba(0, 0, 0, 0.26)";
  if (!p.montado) ctx.fillRect(3, 55, 30, 5);

  if (p.grande) {
    ctx.fillStyle = "rgba(247, 201, 72, 0.32)";
    ctx.fillRect(3, 0, 30, 60);
  }

  ctx.fillStyle = "#f1c27d";
  ctx.fillRect(6, 4, 22, 20);
  ctx.fillStyle = "#ffde9f";
  ctx.fillRect(10, 7, 16, 10);
  ctx.fillStyle = p.cabelo;
  ctx.fillRect(4, 0, 26, 7);
  ctx.fillRect(4, 7, 7, 7);

  ctx.fillStyle = "#111111";
  ctx.fillRect(12, 12, 4, 4);
  ctx.fillRect(22, 12, 4, 4);
  ctx.fillRect(15, 18, 8, 2);

  ctx.fillStyle = p.corCamisa;
  ctx.fillRect(6, 25, 22, 21);
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(9, 27, 6, 17);
  ctx.fillStyle = "rgba(0, 0, 0, 0.24)";
  ctx.fillRect(23, 28, 5, 16);
  if (p.numero) {
    ctx.fillStyle = "#111111";
    ctx.font = "9px monospace";
    ctx.fillText(p.numero, 14, 39);
  }

  ctx.fillStyle = "#f1c27d";
  ctx.fillRect(0, 27, 7, 15);
  ctx.fillRect(28, 27, 7, 15);

  ctx.fillStyle = p.corCalca;
  if (passo === 0) {
    ctx.fillRect(7, 46, 9, 12);
    ctx.fillRect(20, 46, 9, 12);
  } else {
    ctx.fillRect(4, 46, 9, 12);
    ctx.fillRect(23, 46, 9, 12);
  }

  ctx.fillStyle = "#050505";
  ctx.fillRect(5, 55, 12, 4);
  ctx.fillRect(20, 55, 12, 4);
  ctx.restore();

  desenharEtiqueta(nomeJogadorMontado(p), p.x + p.w / 2, baseY - 8);
}

function desenharRangerVermelho(p) {
  ctx.save();
  ctx.translate(p.direcao < 0 ? p.x + p.w : p.x, p.y);
  if (p.direcao < 0) ctx.scale(-1, 1);
  ctx.fillStyle = "rgba(0,0,0,.3)"; ctx.fillRect(1, 56, 38, 5);
  ctx.fillStyle = "#d90429"; ctx.fillRect(6, 3, 28, 22); ctx.fillRect(5, 26, 30, 26);
  ctx.fillStyle = "#ffffff"; ctx.fillRect(9, 9, 22, 7); ctx.fillRect(12, 29, 16, 5);
  ctx.fillStyle = "#111111"; ctx.fillRect(11, 12, 18, 7);
  ctx.fillStyle = "#f7c948"; ctx.fillRect(17, 35, 7, 7);
  ctx.fillStyle = "#f7f3de"; ctx.fillRect(6, 50, 12, 9); ctx.fillRect(23, 50, 12, 9);
  if (p.ataqueTempo > 0) {
    ctx.fillStyle = "#d0d7de"; ctx.fillRect(34, 10, 6, 42);
    ctx.fillStyle = "#ef233c"; ctx.fillRect(40, 2, 5, 32);
  }
  ctx.restore();
  desenharEtiqueta(nomeJogadorMontado(p), p.x + p.w / 2, p.y - 10);
}

function desenharHarryPotter(p) {
  ctx.save();
  ctx.translate(p.direcao < 0 ? p.x + p.w : p.x, p.y);
  if (p.direcao < 0) ctx.scale(-1, 1);
  ctx.fillStyle = "rgba(0,0,0,.3)"; ctx.fillRect(1, 56, 38, 5);
  ctx.fillStyle = "#f1b48b"; ctx.fillRect(8, 5, 23, 20);
  ctx.fillStyle = "#111111"; ctx.fillRect(5, 0, 29, 8); ctx.fillRect(5, 7, 7, 8);
  ctx.strokeStyle = "#111111"; ctx.lineWidth = 2;
  ctx.strokeRect(10, 11, 7, 7); ctx.strokeRect(22, 11, 7, 7); ctx.fillRect(17, 14, 5, 2);
  ctx.fillStyle = "#5c2e12"; ctx.fillRect(5, 26, 30, 28);
  ctx.fillStyle = "#f7c948"; ctx.fillRect(8, 28, 5, 25); ctx.fillRect(22, 28, 5, 25);
  ctx.fillStyle = "#7f1d1d"; ctx.fillRect(13, 30, 9, 4);
  ctx.fillStyle = "#111827"; ctx.fillRect(7, 52, 12, 8); ctx.fillRect(22, 52, 12, 8);
  ctx.restore();
  desenharEtiqueta(p.nuvem ? "Harry Potter + Vassoura" : nomeJogadorMontado(p), p.x + p.w / 2, p.y - 10);
}

function desenharCarloAncelotti(p) {
  ctx.save();
  ctx.translate(p.direcao < 0 ? p.x + p.w : p.x, p.y);
  if (p.direcao < 0) ctx.scale(-1, 1);
  ctx.fillStyle = "rgba(0,0,0,.3)"; ctx.fillRect(1, 56, 38, 5);
  ctx.fillStyle = "#f1b48b"; ctx.fillRect(8, 5, 24, 20);
  ctx.fillStyle = "#d0d7de"; ctx.fillRect(5, 0, 29, 8); ctx.fillRect(5, 7, 7, 8);
  ctx.fillStyle = "#111111"; ctx.fillRect(11, 12, 7, 3); ctx.fillRect(23, 10, 8, 4); ctx.fillRect(16, 20, 11, 2);
  ctx.fillStyle = "#1d3557"; ctx.fillRect(5, 26, 30, 28);
  ctx.fillStyle = "#f7f3de"; ctx.fillRect(15, 27, 10, 24);
  ctx.fillStyle = "#111111"; ctx.fillRect(18, 29, 4, 20); ctx.fillRect(7, 52, 12, 8); ctx.fillRect(22, 52, 12, 8);
  ctx.restore();
  desenharEtiqueta(nomeJogadorMontado(p), p.x + p.w / 2, p.y - 10);
}

function desenharJogador2() {
  desenharBoneco(jogador2);
  return;
  const p = jogador2;
  if (p.invencivel > 0 && Math.floor(frame / 5) % 2 === 0) return;
  const deslocamentoMontaria = p.montado ? -30 : 0;
  if (p.montado) desenharMontariaDoJogador(p);
  if (p.ataqueTempo > 0) desenharEfeitoGolpe(p, 0);
  if (p.superMario) {
    desenharSuperMario(p, deslocamentoMontaria);
    return;
  }
  ctx.save();
  ctx.translate(p.x + p.w / 2, 0);
  ctx.scale(p.direcao, 1);
  ctx.fillStyle = "#111111";
  ctx.fillRect(-11, p.y, 22, 8);
  ctx.fillStyle = "#f1b48b";
  ctx.fillRect(-10, p.y + 8, 20, 16);
  ctx.fillStyle = "#457bff";
  ctx.fillRect(-14, p.y + 24, 28, 23);
  ctx.fillStyle = "#f1b48b";
  ctx.fillRect(-20, p.y + 27, 7, 19);
  ctx.fillRect(13, p.y + 27, 7, 19);
  ctx.fillStyle = "#191919";
  ctx.fillRect(-12, p.y + 47, 9, 11);
  ctx.fillRect(3, p.y + 47, 9, 11);
  ctx.restore();
  desenharEtiqueta("P2", p.x + p.w / 2, p.y - 9);
}

function desenharSuperMario(p, deslocamentoMontaria = 0) {
  const y = p.y + deslocamentoMontaria;
  ctx.save();
  ctx.translate(p.direcao < 0 ? p.x + p.w : p.x, y);
  if (p.direcao < 0) ctx.scale(-1, 1);
  ctx.fillStyle = "#d90429";
  ctx.fillRect(4, 0, 28, 8);
  ctx.fillRect(0, 7, 35, 7);
  ctx.fillStyle = "#f1b48b";
  ctx.fillRect(7, 14, 23, 17);
  ctx.fillStyle = "#5c2e12";
  ctx.fillRect(4, 14, 7, 12);
  ctx.fillRect(20, 25, 13, 5);
  ctx.fillStyle = "#111111";
  ctx.fillRect(25, 18, 4, 4);
  ctx.fillRect(20, 25, 10, 3);
  ctx.fillStyle = "#d90429";
  ctx.fillRect(4, 31, 27, 13);
  ctx.fillStyle = "#1971c2";
  ctx.fillRect(8, 39, 20, 18);
  ctx.fillRect(3, 43, 8, 14);
  ctx.fillRect(25, 43, 8, 14);
  ctx.fillStyle = "#ffd43b";
  ctx.fillRect(10, 40, 4, 4);
  ctx.fillRect(23, 40, 4, 4);
  ctx.fillStyle = "#5c2e12";
  ctx.fillRect(3, 55, 13, 5);
  ctx.fillRect(22, 55, 13, 5);
  ctx.restore();
  desenharEtiqueta("SUPER MARIO + YOSHI", p.x + p.w / 2, y - 10);
}

function desenharEfeitoGolpe(p, deslocamentoMontaria) {
  const frenteX = p.direcao > 0 ? p.x + p.w : p.x - 42;
  const y = p.y + deslocamentoMontaria + 17;
  const especial = p.tipoGolpeAtual === "ESPECIAL";
  const chute = p.tipoGolpeAtual === "CHUTE";
  ctx.fillStyle = especial ? "rgba(239,71,111,.4)" : chute ? "rgba(0,174,239,.34)" : "rgba(255,212,59,0.32)";
  ctx.fillRect(frenteX, y - 8, 42, 34);
  ctx.strokeStyle = especial ? "#ef476f" : chute ? "#00aeef" : "#ffd43b";
  ctx.lineWidth = especial ? 7 : 4;
  ctx.beginPath();
  ctx.moveTo(frenteX + (p.direcao > 0 ? 0 : 42), y + 18);
  ctx.lineTo(frenteX + (p.direcao > 0 ? 34 : 8), y);
  ctx.stroke();
  if (especial) {
    ctx.beginPath();
    ctx.arc(frenteX + 21, y + 8, 24, 0, Math.PI * 2);
    ctx.stroke();
  }
}

function desenharBuffonGuardiao(p) {
  const x = Math.max(4, Math.min(canvas.width - 38, p.x - p.direcao * 52));
  const y = p.y + 8;
  ctx.fillStyle = "rgba(116,192,252,0.2)";
  ctx.fillRect(x - 7, y - 7, 48, 62);
  ctx.fillStyle = "#f1b48b";
  ctx.fillRect(x + 8, y, 20, 17);
  ctx.fillStyle = "#111111";
  ctx.fillRect(x + 6, y - 4, 24, 7);
  ctx.fillStyle = "#212529";
  ctx.fillRect(x + 5, y + 18, 27, 27);
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(x + 15, y + 21, 7, 18);
  ctx.fillStyle = "#74c0fc";
  ctx.fillRect(x - 3, y + 20, 9, 8);
  ctx.fillRect(x + 31, y + 20, 9, 8);
  ctx.fillStyle = "#111111";
  ctx.fillRect(x + 7, y + 44, 9, 10);
  ctx.fillRect(x + 23, y + 44, 9, 10);
  desenharEtiqueta("BUFFON", x + 18, y - 10);
}

function nomeJogadorMontado(p) {
  if (!p.montado) return p.nome;
  return p.nome + (p.montaria === "mufasa" ? " + Mufasa" : " + Yoshi");
}

function desenharSilvioSantos(p) {
  ctx.save();
  ctx.translate(p.direcao < 0 ? p.x + p.w : p.x, p.y);
  if (p.direcao < 0) ctx.scale(-1, 1);
  ctx.fillStyle = "rgba(0, 0, 0, 0.28)";
  ctx.fillRect(0, 56, 38, 5);
  ctx.fillStyle = "#f1b48b";
  ctx.fillRect(7, 5, 24, 20);
  ctx.fillStyle = "#d0d7de";
  ctx.fillRect(5, 0, 27, 8);
  ctx.fillRect(5, 7, 6, 8);
  ctx.fillStyle = "#111111";
  ctx.fillRect(12, 13, 4, 4);
  ctx.fillRect(24, 13, 4, 4);
  ctx.fillRect(15, 20, 11, 3);
  ctx.fillStyle = "#1d3557";
  ctx.fillRect(5, 26, 28, 27);
  ctx.fillStyle = "#f7f3de";
  ctx.fillRect(15, 27, 9, 22);
  ctx.fillStyle = "#e63946";
  ctx.fillRect(18, 29, 4, 18);
  ctx.fillStyle = "#111827";
  ctx.fillRect(7, 51, 10, 8);
  ctx.fillRect(23, 51, 10, 8);
  ctx.fillStyle = "#f1b48b";
  ctx.fillRect(31, 29, 7, 15);
  ctx.fillStyle = "#20252c";
  ctx.fillRect(36, 25, 5, 22);
  ctx.fillStyle = "#adb5bd";
  ctx.fillRect(34, 21, 9, 8);
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(37, 23, 3, 3);
  ctx.restore();
  desenharEtiqueta(nomeJogadorMontado(p), p.x + p.w / 2, p.y - 10);
}

function desenharNeymarMuletas(p) {
  const passo = p.andando && p.noChao ? Math.floor(frame / 6) % 2 : 0;
  const piscando = p.invencivel > 0 && Math.floor(frame / 5) % 2 === 0;
  if (piscando) return;

  const baseY = p.montado ? p.y - 30 : p.y;

  ctx.save();
  if (p.direcao === -1) {
    ctx.translate(p.x + p.w, baseY);
    ctx.scale(-1, 1);
  } else {
    ctx.translate(p.x, baseY);
  }

  ctx.fillStyle = "rgba(0, 0, 0, 0.28)";
  if (!p.montado) ctx.fillRect(0, 56, 38, 5);

  ctx.fillStyle = "#f1c27d";
  ctx.fillRect(7, 4, 22, 20);
  ctx.fillStyle = "#f7c948";
  ctx.fillRect(5, 0, 26, 8);
  ctx.fillRect(10, -4, 16, 5);
  ctx.fillStyle = "#111111";
  ctx.fillRect(12, 12, 4, 4);
  ctx.fillRect(23, 12, 4, 4);
  ctx.fillRect(15, 19, 9, 2);

  ctx.fillStyle = "#ffe066";
  ctx.fillRect(6, 25, 24, 20);
  ctx.fillStyle = "#2457c5";
  ctx.fillRect(14, 28, 9, 14);
  ctx.fillStyle = "#111111";
  ctx.font = "9px monospace";
  ctx.fillText("10", 12, 39);

  ctx.fillStyle = "#2457c5";
  if (passo === 0) {
    ctx.fillRect(8, 45, 8, 13);
    ctx.fillRect(22, 46, 8, 10);
  } else {
    ctx.fillRect(6, 46, 8, 10);
    ctx.fillRect(24, 45, 8, 13);
  }
  ctx.fillStyle = "#050505";
  ctx.fillRect(5, 56, 12, 4);
  ctx.fillRect(21, 56, 12, 4);

  ctx.strokeStyle = "#d0d7de";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(1, 24);
  ctx.lineTo(9, 60);
  ctx.moveTo(34, 24);
  ctx.lineTo(28, 60);
  ctx.stroke();
  ctx.fillStyle = "#ffe066";
  ctx.fillRect(34, 22, 8, 8);
  ctx.fillRect(40, 24, 12, 4);
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(48, 23, 6, 6);

  ctx.restore();
}

function desenharGokuNuvemDourada(p) {
  const baseY = p.y + (p.agachado ? 10 : 0);
  const bob = Math.sin(frame / 10) * 2;

  ctx.save();
  if (p.direcao === -1) {
    ctx.translate(p.x + p.w, baseY);
    ctx.scale(-1, 1);
  } else {
    ctx.translate(p.x, baseY);
  }

  if (p.nuvem) {
    desenharNuvemDouradaPixel(-8, 34 + bob);
  } else {
    ctx.fillStyle = "rgba(0, 0, 0, 0.24)";
    ctx.fillRect(0, 56, 34, 5);
  }

  const corpoY = p.agachado ? 10 : 0;
  ctx.fillStyle = "#f1c27d";
  ctx.fillRect(8, 4 + corpoY, 22, 19);
  ctx.fillStyle = p.superSayajin ? "#ffd43b" : "#111111";
  ctx.fillRect(4, -2 + corpoY, 9, 12);
  ctx.fillRect(12, -7 + corpoY, 8, 13);
  ctx.fillRect(21, -3 + corpoY, 10, 12);
  ctx.fillStyle = "#050505";
  ctx.fillRect(13, 11 + corpoY, 4, 4);
  ctx.fillRect(23, 11 + corpoY, 4, 4);

  ctx.fillStyle = "#ff7b00";
  ctx.fillRect(7, 25 + corpoY, 24, p.agachado ? 14 : 20);
  ctx.fillStyle = "#0b5ed7";
  ctx.fillRect(11, 28 + corpoY, 16, 5);
  ctx.fillRect(8, 43 + corpoY, 8, 12);
  ctx.fillRect(22, 43 + corpoY, 8, 12);
  ctx.fillStyle = "#0b1f4d";
  ctx.fillRect(6, 54 + corpoY, 11, 4);
  ctx.fillRect(21, 54 + corpoY, 11, 4);

  ctx.restore();
}

function nuvemGokuDaFase(fase) {
  return {
    x: Math.min(172, fase.portal.x - 180),
    y: 414,
    w: 66,
    h: 34
  };
}

function desenharNuvemDouradaPixel(x, y) {
  ctx.fillStyle = "rgba(0, 0, 0, 0.24)";
  ctx.fillRect(x + 4, y + 28, 52, 6);
  ctx.fillStyle = "#f7c948";
  ctx.fillRect(x, y + 16, 52, 16);
  ctx.fillRect(x + 8, y + 8, 38, 18);
  ctx.fillRect(x + 26, y + 4, 30, 16);
  ctx.fillStyle = "#ffe066";
  ctx.fillRect(x + 6, y + 11, 30, 10);
  ctx.fillRect(x + 30, y + 8, 20, 9);
}

function desenharVassouraPixel(x, y) {
  ctx.save();
  ctx.translate(x, y);
  ctx.fillStyle = "#8b5a2b";
  ctx.fillRect(4, 10, 54, 6);
  ctx.fillStyle = "#d4a373";
  ctx.fillRect(0, 5, 18, 16);
  ctx.fillStyle = "#b7791f";
  for (let i = 0; i < 5; i++) ctx.fillRect(-6 + i * 4, 2 + i % 2 * 4, 18, 3);
  ctx.fillStyle = "#f7c948";
  ctx.fillRect(36, 7, 7, 12);
  ctx.restore();
}

function desenharVassouraMontada(jogador) {
  ctx.save();
  if (jogador.direcao < 0) {
    ctx.translate(jogador.x + jogador.w, jogador.y);
    ctx.scale(-1, 1);
    desenharVassouraPixel(-10, jogador.h - 4);
  } else {
    desenharVassouraPixel(jogador.x - 10, jogador.y + jogador.h - 4);
  }
  ctx.restore();
}

function desenharNuvemGokuSolta(fase) {
  if ((joao.avatar !== "goku" && joao.avatar !== "harry") || joao.nuvem) return;
  const nuvem = nuvemGokuDaFase(fase);
  const bob = Math.sin(frame / 12) * 2;
  if (joao.avatar === "harry") {
    desenharVassouraPixel(nuvem.x, nuvem.y + bob + 18);
    desenharEtiqueta("Vassoura", nuvem.x + nuvem.w / 2, nuvem.y - 6);
    return;
  }
  desenharNuvemDouradaPixel(nuvem.x, nuvem.y + bob);
  desenharEtiqueta("Nuvem", nuvem.x + nuvem.w / 2, nuvem.y - 6);
}

function desenharEtiqueta(texto, x, y) {
  ctx.font = "12px monospace";
  const largura = ctx.measureText(texto).width + 10;
  ctx.fillStyle = "rgba(0, 0, 0, 0.48)";
  ctx.fillRect(x - largura / 2, y - 12, largura, 16);
  ctx.fillStyle = "#ffffff";
  ctx.fillText(texto, x - largura / 2 + 5, y);
}

function desenharYoshi(yoshi) {
  if (yoshi.montadoPor) return;

  const bob = Math.sin(frame / 12) * 3;
  ctx.save();
  ctx.translate(yoshi.x - 12, yoshi.y - 18 + bob);
  ctx.scale(1.35, 1.35);
  desenharSpriteYoshi(0, 0, 1, yoshi.salvo);
  ctx.restore();
  desenharEtiqueta("Yoshi Gigante", yoshi.x + 30, yoshi.y - 28 + bob);
}

function desenharMufasa(mufasa, direcao = 1, montado = false) {
  if (mufasa.montadoPor && !montado) return;
  const bob = montado ? 0 : Math.sin(frame / 13) * 2;
  let x = mufasa.x;
  const y = mufasa.y + bob;

  ctx.save();
  if (direcao < 0) {
    ctx.translate(x + 68, y);
    ctx.scale(-1, 1);
    x = 0;
  }
  ctx.fillStyle = "rgba(0, 0, 0, 0.28)";
  ctx.fillRect(x - 2, y + 50, 70, 6);
  ctx.fillStyle = "#b5651d";
  ctx.fillRect(x + 6, y + 22, 44, 28);
  ctx.fillRect(x + 38, y + 11, 25, 25);
  ctx.fillRect(x + 58, y + 20, 10, 8);
  ctx.fillStyle = "#6f3b17";
  ctx.fillRect(x + 32, y + 7, 28, 31);
  ctx.fillRect(x + 43, y + 2, 8, 9);
  ctx.fillRect(x + 55, y + 5, 8, 10);
  ctx.fillStyle = "#d88a3d";
  ctx.fillRect(x + 40, y + 13, 20, 18);
  ctx.fillStyle = "#111111";
  ctx.fillRect(x + 52, y + 18, 4, 4);
  ctx.fillRect(x + 60, y + 25, 5, 3);
  ctx.fillStyle = "#8b4513";
  ctx.fillRect(x + 5, y + 47, 12, 8);
  ctx.fillRect(x + 38, y + 47, 12, 8);
  ctx.fillRect(x - 2, y + 24, 10, 7);
  ctx.fillStyle = "#f7c948";
  ctx.fillRect(x + 18, y + 18, 22, 7);
  ctx.restore();
  if (!montado) desenharEtiqueta("Mufasa", mufasa.x + 34, mufasa.y - 8);
}

function desenharYoshiMontaria(jogador) {
  ctx.save();
  ctx.translate(jogador.x + jogador.w / 2, jogador.y + jogador.h + 12);
  ctx.scale(jogador.direcao * 1.35, 1.35);
  desenharSpriteYoshi(-31, -54, 1, true);
  ctx.restore();
}

function desenharMontariaDoJogador(jogador) {
  if (jogador.montaria === "mufasa") {
    desenharMufasa({ x: jogador.x - 17, y: jogador.y + 19, w: 68, h: 56, montadoPor: jogador.nome }, jogador.direcao, true);
    return;
  }
  desenharYoshiMontaria(jogador);
}

function desenharSpriteYoshi(x, y, direcao = 1, montado = false) {
  ctx.save();
  if (direcao < 0) {
    ctx.translate(x + 66, y);
    ctx.scale(-1, 1);
    x = 0;
  }

  ctx.fillStyle = "rgba(0, 0, 0, 0.25)";
  ctx.fillRect(x - 8, y + 49, 68, 6);

  ctx.fillStyle = "#36c96b";
  ctx.fillRect(x + 4, y + 22, 36, 28);
  ctx.fillRect(x + 24, y + 7, 30, 26);
  ctx.fillRect(x + 50, y + 18, 12, 10);
  ctx.fillRect(x - 2, y + 30, 12, 14);

  ctx.fillStyle = "#f7f3de";
  ctx.fillRect(x + 28, y + 14, 16, 16);
  ctx.fillRect(x + 12, y + 30, 20, 16);

  ctx.fillStyle = "#ffffff";
  ctx.fillRect(x + 28, y + 1, 11, 12);
  ctx.fillRect(x + 42, y + 1, 11, 12);

  ctx.fillStyle = "#111111";
  ctx.fillRect(x + 33, y + 5, 3, 5);
  ctx.fillRect(x + 47, y + 5, 3, 5);

  ctx.fillStyle = "#ef476f";
  ctx.fillRect(x + 4, y + 16, 13, 12);

  ctx.fillStyle = "#8b4513";
  ctx.fillRect(x + 12, y + 21, 24, 8);
  ctx.fillStyle = "#f7c948";
  ctx.fillRect(x + 18, y + 23, 8, 4);

  ctx.fillStyle = "#f7f3de";
  ctx.fillRect(x + 2, y + 45, 14, 8);
  ctx.fillRect(x + 32, y + 45, 16, 8);

  ctx.fillStyle = "#111111";
  ctx.fillRect(x + 2, y + 52, 16, 4);
  ctx.fillRect(x + 32, y + 52, 18, 4);

  ctx.strokeStyle = "rgba(0, 0, 0, 0.45)";
  ctx.strokeRect(x + 4, y + 22, 36, 28);
  ctx.strokeRect(x + 24, y + 7, 30, 26);

  if (!montado) desenharEtiqueta("Yoshi", x + 30, y - 8);
  ctx.restore();
}

function desenharMoeda(m) {
  const brilho = Math.floor(frame / 8) % 4;
  ctx.fillStyle = "#b77900";
  ctx.fillRect(m.x - 10, m.y - 10, 20, 20);
  ctx.fillStyle = "#ffd43b";
  ctx.fillRect(m.x - 8, m.y - 12, 16, 24);
  ctx.fillStyle = "#fff3a3";
  ctx.fillRect(m.x - 2 + brilho, m.y - 8, 3, 16);
}

function desenharPremio50(premio) {
  if (!premio.ativo || premio.coletado) return;
  const bob = Math.sin(frame / 8) * 5;
  const pulso = 10 + Math.sin(frame / 6) * 6;
  ctx.fillStyle = "rgba(81,216,138,0.22)";
  ctx.fillRect(premio.x - pulso, premio.y + bob - pulso, premio.w + pulso * 2, premio.h + pulso * 2);
  ctx.fillStyle = "#69db7c";
  ctx.fillRect(premio.x, premio.y + bob, premio.w, premio.h);
  ctx.strokeStyle = "#ffffff";
  ctx.lineWidth = 3;
  ctx.strokeRect(premio.x + 3, premio.y + bob + 3, premio.w - 6, premio.h - 6);
  ctx.fillStyle = "#073b1d";
  ctx.font = "bold 25px monospace";
  ctx.fillText("R$ 50", premio.x + 13, premio.y + bob + 35);
  desenharEtiqueta("PEGUE O DINHEIRO!", premio.x + premio.w / 2, premio.y + bob - 18);
}

function desenharDiamante(diamante) {
  if (diamante.coletado) return;
  const bob = Math.sin(frame / 9) * 3;
  const x = diamante.x;
  const y = diamante.y + bob;
  ctx.fillStyle = "rgba(116,192,252,0.28)";
  ctx.fillRect(x - 6, y - 6, diamante.w + 12, diamante.h + 12);
  ctx.fillStyle = "#74c0fc";
  ctx.beginPath();
  ctx.moveTo(x + diamante.w / 2, y);
  ctx.lineTo(x + diamante.w, y + 10);
  ctx.lineTo(x + diamante.w / 2, y + diamante.h);
  ctx.lineTo(x, y + 10);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(x + 10, y + 5, 5, 10);
}

function desenharCogumelo(c) {
  const bob = Math.sin(frame / 10) * 2;
  const x = c.x;
  const y = c.y + bob;

  ctx.fillStyle = "rgba(0, 0, 0, 0.24)";
  ctx.fillRect(x - 14, y + 18, 34, 5);

  ctx.fillStyle = "#9d0208";
  ctx.fillRect(x - 16, y - 4, 36, 18);
  ctx.fillRect(x - 10, y - 12, 24, 10);
  ctx.fillStyle = "#e85d04";
  ctx.fillRect(x - 12, y - 8, 8, 8);
  ctx.fillRect(x + 4, y - 10, 8, 8);
  ctx.fillRect(x + 10, y + 2, 8, 8);

  ctx.fillStyle = "#fff3bf";
  ctx.fillRect(x - 8, y + 10, 20, 14);
  ctx.fillStyle = "#111111";
  ctx.fillRect(x - 3, y + 15, 3, 4);
  ctx.fillRect(x + 6, y + 15, 3, 4);

  ctx.strokeStyle = "rgba(0, 0, 0, 0.42)";
  ctx.strokeRect(x - 16, y - 4, 36, 18);
  ctx.strokeRect(x - 8, y + 10, 20, 14);
}

function desenharVilao(i) {
  if (i.morto) return;

  if (i.tipo === "mandibu") {
    desenharMandibu(i);
    return;
  }

  if (i.tipo === "bossSupremo") {
    i.clones.forEach(clone => desenharBossSupremo(clone, true));
    desenharBossSupremo(i, false);
    return;
  }

  if (i.tipo === "silvioBoss") {
    desenharSilvioSantos(i);
    const barraW = 72;
    ctx.fillStyle = "rgba(0,0,0,0.72)";
    ctx.fillRect(i.x - 10, i.y - 25, barraW, 10);
    ctx.fillStyle = "#ffd43b";
    ctx.fillRect(i.x - 8, i.y - 23, (barraW - 4) * (i.vida / i.vidaMax), 6);
    return;
  }

  if (i.tipo === "meninoRoblox") {
    desenharMeninoRoblox(i);
    return;
  }

  if (i.tipo === "cellbesta") {
    desenharCellMontadoNaBesta(i);
    return;
  }

  if (i.tipo === "chefe" || i.tipo === "rei") {
    desenharChefeFinal(i);
    return;
  }

  if (i.tipo === "messi") {
    desenharMessiVilao(i);
    return;
  }

  if (i.tipo === "lobo") {
    desenharSpriteLobo(i);
    return;
  }

  if (i.tipo === "cavaleiro") {
    desenharCavaleiro(i);
    return;
  }

  if (i.tipo === "esqueleto") {
    desenharEsqueletoEspadachim(i);
    return;
  }

  if (i.tipo === "chaves") {
    desenharChavesPixel(i);
    return;
  }

  desenharSoldado(i);
}

function desenharMandibu(i) {
  prepararVilao(i);
  ctx.fillStyle = "rgba(0,0,0,.38)";
  ctx.fillRect(4, 82, 74, 7);
  ctx.fillStyle = "#2b2118";
  ctx.fillRect(10, 18, 56, 62);
  ctx.fillStyle = "#6c757d";
  ctx.fillRect(5, 30, 68, 43);
  ctx.fillStyle = "#ced4da";
  ctx.fillRect(12, 34, 54, 7);
  ctx.fillRect(17, 50, 44, 7);
  ctx.fillStyle = "#7f1d1d";
  ctx.fillRect(15, 5, 48, 19);
  ctx.fillStyle = "#f7c948";
  ctx.fillRect(20, 0, 8, 10);
  ctx.fillRect(36, -5, 8, 15);
  ctx.fillRect(53, 0, 8, 10);
  ctx.fillStyle = "#ef476f";
  ctx.fillRect(22, 24, 6, 6);
  ctx.fillRect(50, 24, 6, 6);
  ctx.fillStyle = "#d0d7de";
  ctx.fillRect(68, 20, 7, 62);
  ctx.fillStyle = "#f8f9fa";
  ctx.fillRect(75, 8, 5, 34);
  ctx.fillStyle = "#111827";
  ctx.fillRect(15, 72, 17, 14);
  ctx.fillRect(48, 72, 17, 14);
  ctx.restore();

  const protegido = mandibuProtegido(i);
  const segundos = Math.max(0, Math.ceil((i.tempoMinimoDerrota - i.tempoAtivo) / 60));
  ctx.fillStyle = "rgba(0,0,0,.75)";
  ctx.fillRect(i.x - 8, i.y - 34, 96, 12);
  ctx.fillStyle = protegido ? "#74c0fc" : "#ef476f";
  ctx.fillRect(i.x - 6, i.y - 32, 92 * (protegido ? (i.tempoAtivo / i.tempoMinimoDerrota) : (i.vida / i.vidaMax)), 8);
  desenharEtiqueta(protegido ? "Mandibu: escudo " + segundos + "s" : "Mandibu: VULNERAVEL", i.x + i.w / 2, i.y - 40);
  if (protegido) {
    ctx.strokeStyle = "rgba(116,192,252,.65)";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(i.x + i.w / 2, i.y + i.h / 2, 54 + Math.sin(frame / 8) * 3, 0, Math.PI * 2);
    ctx.stroke();
  }
}

function desenharChavesPixel(i) {
  ctx.save();
  ctx.translate(i.direcao < 0 ? i.x + i.w : i.x, i.y);
  if (i.direcao < 0) ctx.scale(-1, 1);

  ctx.fillStyle = "rgba(0, 0, 0, 0.26)";
  ctx.fillRect(2, 56, 44, 5);
  ctx.fillStyle = "#5c3b1e";
  ctx.fillRect(9, 0, 27, 8);
  ctx.fillRect(5, 7, 36, 7);
  ctx.fillStyle = "#f1b48b";
  ctx.fillRect(10, 13, 27, 19);
  ctx.fillStyle = "#111111";
  ctx.fillRect(15, 19, 4, 4);
  ctx.fillRect(29, 19, 4, 4);
  ctx.fillRect(21, 27, 9, 3);
  ctx.fillStyle = "#d8c9a7";
  ctx.fillRect(8, 33, 30, 18);
  ctx.fillStyle = "#8b5a2b";
  ctx.fillRect(8, 42, 30, 9);
  ctx.fillStyle = "#d90429";
  ctx.fillRect(19, 33, 7, 18);
  ctx.fillStyle = "#f1b48b";
  ctx.fillRect(2, 35, 7, 15);
  ctx.fillRect(38, 35, 7, 15);
  ctx.fillStyle = "#2f6f9f";
  ctx.fillRect(11, 51, 10, 8);
  ctx.fillRect(28, 51, 10, 8);
  ctx.restore();
  desenharEtiqueta("Chaves", i.x + i.w / 2, i.y - 10);
}

function desenharEsqueletoEspadachim(i) {
  const ciclo = (frame + i.ataqueOffset) % 120;
  const golpe = ciclo < 14 ? 1 : ciclo >= 22 && ciclo < 36 ? 2 : 0;
  const alcance = golpe ? 34 : 12;

  ctx.save();
  ctx.translate(i.direcao < 0 ? i.x + i.w : i.x, i.y);
  if (i.direcao < 0) ctx.scale(-1, 1);

  ctx.fillStyle = "rgba(0, 0, 0, 0.28)";
  ctx.fillRect(2, 54, 48, 5);
  ctx.fillStyle = "#f7f3de";
  ctx.fillRect(12, 2, 27, 22);
  ctx.fillRect(8, 8, 35, 11);
  ctx.fillStyle = "#111111";
  ctx.fillRect(16, 9, 6, 6);
  ctx.fillRect(30, 9, 6, 6);
  ctx.fillRect(21, 18, 12, 4);
  ctx.fillStyle = "#ef233c";
  ctx.fillRect(17, 10, 4, 4);
  ctx.fillRect(31, 10, 4, 4);

  ctx.fillStyle = "#d0d7de";
  ctx.fillRect(21, 24, 10, 21);
  ctx.fillRect(9, 28, 8, 19);
  ctx.fillRect(35, 28, 8, 19);
  ctx.fillRect(13, 45, 8, 12);
  ctx.fillRect(31, 45, 8, 12);
  ctx.fillStyle = "#c2410c";
  ctx.fillRect(31, 25, 14, 21);
  ctx.fillStyle = "#f97316";
  ctx.fillRect(35, 29, 7, 13);

  ctx.save();
  ctx.translate(9, 34);
  ctx.rotate(golpe === 1 ? -1.15 : golpe === 2 ? -0.25 : 0.55);
  ctx.fillStyle = "#c2410c";
  ctx.fillRect(-2, -2, 14, 6);
  ctx.fillStyle = "#e9ecef";
  ctx.fillRect(9, -1, 31 + alcance, 4);
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(12, -1, 27 + alcance, 1);
  ctx.restore();
  ctx.restore();

  desenharEtiqueta(golpe ? "ESPADADA " + golpe + "/2" : "Esqueleto", i.x + i.w / 2, i.y - 10);
}

function desenharBossSupremo(i, copia = false) {
  ctx.save();
  ctx.globalAlpha = copia ? 0.58 : 1;

  if (i.direcao < 0) {
    ctx.translate(i.x + i.w, i.y);
    ctx.scale(-1, 1);
  } else {
    ctx.translate(i.x, i.y);
  }

  if (spriteBossSupremo.complete && spriteBossSupremo.naturalWidth > 0) {
    ctx.drawImage(spriteBossSupremo, 0, 0, i.w, i.h);
  } else {
    ctx.fillStyle = copia ? "#7b2cbf" : "#c9184a";
    ctx.fillRect(0, 0, i.w, i.h);
    ctx.fillStyle = "#f7c948";
    ctx.fillRect(20, 18, i.w - 40, i.h - 36);
  }
  ctx.restore();

  if (copia) {
    desenharEtiqueta("ILUSAO", i.x + i.w / 2, i.y - 8);
    return;
  }

  const barraW = 96;
  ctx.fillStyle = "rgba(0, 0, 0, 0.76)";
  ctx.fillRect(i.x - 6, i.y - 24, barraW, 11);
  ctx.fillStyle = "#c9184a";
  ctx.fillRect(i.x - 4, i.y - 22, (barraW - 4) * (i.vida / i.vidaMax), 7);
  ctx.strokeStyle = "#f7f3de";
  ctx.strokeRect(i.x - 6, i.y - 24, barraW, 11);
  desenharEtiqueta(i.nome, i.x + i.w / 2, i.y - 30);
}

function desenharMeninoRoblox(i) {
  prepararVilao(i);

  ctx.fillStyle = "rgba(0, 0, 0, 0.3)";
  ctx.fillRect(2, 54, 42, 6);

  ctx.fillStyle = "#f1c27d";
  ctx.fillRect(10, 5, 24, 20);
  ctx.fillStyle = "#5c2e12";
  ctx.fillRect(7, 0, 30, 8);
  ctx.fillRect(7, 7, 7, 8);

  ctx.fillStyle = "#111111";
  ctx.fillRect(15, 13, 4, 4);
  ctx.fillRect(27, 13, 4, 4);
  ctx.fillRect(18, 20, 10, 2);

  ctx.fillStyle = "#e03131";
  ctx.fillRect(7, 26, 30, 20);
  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 8px monospace";
  ctx.fillText("R", 20, 39);

  ctx.fillStyle = "#1971c2";
  ctx.fillRect(9, 46, 11, 12);
  ctx.fillRect(26, 46, 11, 12);
  ctx.fillStyle = "#050505";
  ctx.fillRect(6, 55, 15, 4);
  ctx.fillRect(25, 55, 15, 4);

  ctx.fillStyle = "#20252c";
  ctx.fillRect(35, 25, 10, 18);
  ctx.fillStyle = "#74c0fc";
  ctx.fillRect(37, 28, 6, 10);
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(39, 29, 2, 2);

  ctx.restore();
  desenharEtiqueta("Menino do Roblox", i.x + i.w / 2, i.y - 8);
}

function prepararVilao(i) {
  ctx.save();
  if (i.direcao < 0) {
    ctx.translate(i.x + i.w, i.y);
    ctx.scale(-1, 1);
  } else {
    ctx.translate(i.x, i.y);
  }
}

function desenharSoldado(i) {
  prepararVilao(i);

  ctx.fillStyle = "rgba(0, 0, 0, 0.28)";
  ctx.fillRect(2, 39, 40, 5);

  ctx.fillStyle = "#495057";
  ctx.fillRect(10, 8, 22, 16);
  ctx.fillStyle = "#20252c";
  ctx.fillRect(8, 20, 28, 18);
  ctx.fillStyle = "#9aa4b2";
  ctx.fillRect(12, 23, 20, 4);
  ctx.fillRect(14, 28, 16, 4);

  ctx.fillStyle = "#e03131";
  ctx.fillRect(14, 14, 4, 4);
  ctx.fillRect(25, 14, 4, 4);

  ctx.fillStyle = "#d0d7de";
  ctx.fillRect(31, 12, 6, 30);
  ctx.fillStyle = "#f8f9fa";
  ctx.fillRect(37, 7, 4, 18);

  ctx.fillStyle = "#1f2933";
  ctx.fillRect(8, 36, 10, 8);
  ctx.fillRect(25, 36, 10, 8);

  ctx.restore();
}

function desenharCavaleiro(i) {
  prepararVilao(i);

  ctx.fillStyle = "rgba(0, 0, 0, 0.32)";
  ctx.fillRect(4, 47, 44, 5);

  ctx.fillStyle = "#2f3640";
  ctx.fillRect(11, 10, 26, 18);
  ctx.fillStyle = "#778ca3";
  ctx.fillRect(8, 24, 32, 20);
  ctx.fillStyle = "#c8d6e5";
  ctx.fillRect(12, 27, 24, 5);
  ctx.fillRect(16, 35, 16, 5);

  ctx.fillStyle = "#ef476f";
  ctx.fillRect(15, 16, 4, 4);
  ctx.fillRect(28, 16, 4, 4);

  ctx.fillStyle = "#1e272e";
  ctx.fillRect(2, 26, 10, 20);
  ctx.fillStyle = "#d63031";
  ctx.fillRect(4, 29, 6, 12);

  ctx.fillStyle = "#d0d7de";
  ctx.fillRect(39, 13, 6, 38);
  ctx.fillStyle = "#f8f9fa";
  ctx.fillRect(45, 4, 4, 24);

  ctx.fillStyle = "#20252c";
  ctx.fillRect(10, 43, 12, 8);
  ctx.fillRect(28, 43, 12, 8);

  ctx.restore();
}

function desenharMessiVilao(i) {
  prepararVilao(i);

  ctx.fillStyle = "rgba(0, 0, 0, 0.28)";
  ctx.fillRect(3, 55, 38, 5);

  ctx.fillStyle = "#f1c27d";
  ctx.fillRect(8, 4, 22, 20);
  ctx.fillStyle = "#5c2e12";
  ctx.fillRect(6, 0, 26, 8);
  ctx.fillRect(6, 20, 8, 8);
  ctx.fillRect(24, 20, 8, 8);

  ctx.fillStyle = "#111111";
  ctx.fillRect(13, 12, 4, 4);
  ctx.fillRect(23, 12, 4, 4);
  ctx.fillRect(15, 19, 10, 2);

  ctx.fillStyle = "#74c0fc";
  ctx.fillRect(6, 26, 26, 20);
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(14, 26, 5, 20);
  ctx.fillRect(24, 26, 5, 20);
  ctx.fillStyle = "#111111";
  ctx.font = "9px monospace";
  ctx.fillText("10", 12, 40);

  ctx.fillStyle = "#ffffff";
  ctx.fillRect(7, 46, 9, 12);
  ctx.fillRect(22, 46, 9, 12);
  ctx.fillStyle = "#050505";
  ctx.fillRect(4, 56, 13, 4);
  ctx.fillRect(21, 56, 13, 4);

  ctx.restore();
  desenharEtiqueta("Messi Vilao", i.x + i.w / 2, i.y - 8);
}

function desenharCR7Aliado(cr7) {
  if (cr7.salvo) return;
  const x = cr7.x;
  const y = cr7.y + Math.sin(frame / 12) * 2;

  ctx.fillStyle = "rgba(0, 0, 0, 0.28)";
  ctx.fillRect(x + 2, y + 56, 38, 5);
  ctx.fillStyle = "#f1c27d";
  ctx.fillRect(x + 8, y + 4, 22, 20);
  ctx.fillStyle = "#24130c";
  ctx.fillRect(x + 6, y, 26, 7);
  ctx.fillStyle = "#111111";
  ctx.fillRect(x + 13, y + 12, 4, 4);
  ctx.fillRect(x + 23, y + 12, 4, 4);
  ctx.fillRect(x + 15, y + 19, 10, 2);
  ctx.fillStyle = "#f7f3de";
  ctx.fillRect(x + 6, y + 26, 26, 20);
  ctx.fillStyle = "#d90429";
  ctx.fillRect(x + 13, y + 29, 12, 14);
  ctx.fillStyle = "#111111";
  ctx.font = "9px monospace";
  ctx.fillText("7", x + 16, y + 40);
  ctx.fillStyle = "#d90429";
  ctx.fillRect(x + 7, y + 46, 9, 12);
  ctx.fillRect(x + 22, y + 46, 9, 12);
  ctx.fillStyle = "#050505";
  ctx.fillRect(x + 4, y + 56, 13, 4);
  ctx.fillRect(x + 21, y + 56, 13, 4);
  desenharEtiqueta("CR7", x + 20, y - 8);
}

function desenharSpriteLobo(lobo) {
  ctx.save();
  let x = lobo.x;
  const y = lobo.y;
  if (lobo.direcao < 0) {
    ctx.translate(x + lobo.w, y);
    ctx.scale(-1, 1);
    x = 0;
  }

  ctx.fillStyle = "rgba(0, 0, 0, 0.28)";
  ctx.fillRect(x + 3, y + 34, 54, 6);
  ctx.fillStyle = "#495057";
  ctx.fillRect(x + 8, y + 14, 34, 22);
  ctx.fillRect(x + 36, y + 8, 18, 18);
  ctx.fillRect(x + 2, y + 20, 12, 10);
  ctx.fillStyle = "#6c757d";
  ctx.fillRect(x + 12, y + 10, 24, 8);
  ctx.fillRect(x + 42, y + 2, 6, 9);
  ctx.fillRect(x + 50, y + 2, 6, 9);
  ctx.fillStyle = "#f8f9fa";
  ctx.fillRect(x + 43, y + 18, 14, 6);
  ctx.fillStyle = "#ef476f";
  ctx.fillRect(x + 46, y + 13, 4, 4);
  ctx.fillStyle = "#111111";
  ctx.fillRect(x + 51, y + 15, 4, 4);
  ctx.fillRect(x + 10, y + 32, 9, 8);
  ctx.fillRect(x + 33, y + 32, 9, 8);
  ctx.restore();
  if (lobo.tipo === "lobo") desenharEtiqueta("Lobo", lobo.x + lobo.w / 2, lobo.y - 8);
}

function desenharMiawEletrico(miaw, direcao = 1) {
  if (miaw.salvo) return;
  ctx.save();
  let x = miaw.x;
  const y = miaw.y + Math.sin(frame / 10) * 2;
  if (direcao < 0) {
    ctx.translate(x + 48, y);
    ctx.scale(-1, 1);
    x = 0;
  }

  ctx.fillStyle = "rgba(0, 0, 0, 0.24)";
  ctx.fillRect(x - 2, y + 48, 46, 5);
  ctx.fillStyle = "#ffd43b";
  ctx.fillRect(x + 6, y + 18, 28, 28);
  ctx.fillRect(x + 24, y + 8, 20, 20);
  ctx.fillStyle = "#111111";
  ctx.fillRect(x + 28, y + 14, 4, 4);
  ctx.fillRect(x + 38, y + 14, 4, 4);
  ctx.fillStyle = "#ff6b6b";
  ctx.fillRect(x + 10, y + 28, 7, 7);
  ctx.fillRect(x + 34, y + 22, 7, 7);
  ctx.fillStyle = "#3d2b1f";
  ctx.fillRect(x + 8, y + 8, 8, 12);
  ctx.fillRect(x + 34, y, 8, 12);
  ctx.fillStyle = "#fff3bf";
  ctx.fillRect(x + 10, y + 42, 10, 8);
  ctx.fillRect(x + 30, y + 42, 10, 8);
  ctx.fillStyle = "#f7c948";
  ctx.fillRect(x - 8, y + 16, 14, 5);
  ctx.fillRect(x - 4, y + 10, 6, 15);
  ctx.restore();
  if (!miaw.player) desenharEtiqueta("Miaw", miaw.x + 22, miaw.y - 8);
}

function desenharChefeFinal(i) {
  if (i.invencivel > 0 && Math.floor(frame / 4) % 2 === 0) return;

  prepararVilao(i);

  ctx.fillStyle = "rgba(0, 0, 0, 0.38)";
  ctx.fillRect(5, 64, 70, 7);

  ctx.fillStyle = "#1b1b22";
  ctx.fillRect(12, 16, 48, 44);
  ctx.fillStyle = "#3d405b";
  ctx.fillRect(7, 28, 60, 34);
  ctx.fillStyle = "#adb5bd";
  ctx.fillRect(14, 32, 46, 7);
  ctx.fillRect(18, 44, 38, 7);

  ctx.fillStyle = "#7f1d1d";
  ctx.fillRect(12, 4, 48, 18);
  ctx.fillStyle = "#f7c948";
  ctx.fillRect(18, -2, 8, 10);
  ctx.fillRect(33, -6, 8, 14);
  ctx.fillRect(50, -2, 8, 10);

  ctx.fillStyle = "#ff2e00";
  ctx.fillRect(22, 20, 6, 6);
  ctx.fillRect(46, 20, 6, 6);

  ctx.fillStyle = "#d0d7de";
  ctx.fillRect(61, 20, 7, 48);
  ctx.fillStyle = "#ff6b00";
  ctx.fillRect(68, 10, 6, 26);
  ctx.fillStyle = "#ffd166";
  ctx.fillRect(70, 12, 3, 20);

  ctx.fillStyle = "#111827";
  ctx.fillRect(16, 58, 16, 12);
  ctx.fillRect(44, 58, 16, 12);
  ctx.restore();

  const barraW = 86;
  ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
  ctx.fillRect(i.x - 6, i.y - 22, barraW, 10);
  ctx.fillStyle = "#ef476f";
  ctx.fillRect(i.x - 4, i.y - 20, (barraW - 4) * (i.vida / i.vidaMax), 6);
  ctx.strokeStyle = "rgba(255, 255, 255, 0.34)";
  ctx.strokeRect(i.x - 6, i.y - 22, barraW, 10);
  desenharEtiqueta(i.nome || "Rei Vulcao", i.x + i.w / 2, i.y - 28);
}

function desenharCellMontadoNaBesta(i) {
  if (i.invencivel > 0 && Math.floor(frame / 4) % 2 === 0) return;

  ctx.save();
  if (i.direcao < 0) {
    ctx.translate(i.x + i.w, i.y);
    ctx.scale(-1, 1);
  } else {
    ctx.translate(i.x, i.y);
  }

  ctx.fillStyle = "rgba(0, 0, 0, 0.42)";
  ctx.fillRect(6, 84, 96, 8);

  // Besta alienigena verde em pixel art, usada como montaria do Cell.
  ctx.fillStyle = "#2d9f43";
  ctx.fillRect(8, 48, 70, 34);
  ctx.fillRect(60, 34, 34, 34);
  ctx.fillStyle = "#54d66d";
  ctx.fillRect(14, 40, 52, 16);
  ctx.fillRect(66, 28, 22, 14);
  ctx.fillStyle = "#0b1f12";
  ctx.fillRect(74, 42, 6, 6);
  ctx.fillStyle = "#e9ff70";
  ctx.fillRect(82, 42, 8, 5);
  ctx.fillStyle = "#1f7a34";
  ctx.fillRect(4, 60, 14, 10);
  ctx.fillRect(72, 64, 18, 10);
  ctx.fillStyle = "#14251a";
  ctx.fillRect(16, 78, 12, 12);
  ctx.fillRect(54, 78, 12, 12);
  ctx.fillRect(80, 70, 10, 14);
  ctx.fillStyle = "#f7f3de";
  ctx.fillRect(90, 52, 6, 4);
  ctx.fillRect(92, 59, 6, 4);

  // Cell pixelado montado em cima.
  ctx.fillStyle = "#101820";
  ctx.fillRect(34, 22, 26, 28);
  ctx.fillStyle = "#75d66f";
  ctx.fillRect(30, 10, 34, 18);
  ctx.fillRect(26, 24, 10, 24);
  ctx.fillRect(58, 24, 10, 24);
  ctx.fillStyle = "#d7ff8f";
  ctx.fillRect(36, 16, 22, 8);
  ctx.fillStyle = "#111111";
  ctx.fillRect(40, 18, 4, 4);
  ctx.fillRect(52, 18, 4, 4);
  ctx.fillStyle = "#7b2cbf";
  ctx.fillRect(36, 50, 9, 20);
  ctx.fillRect(50, 50, 9, 20);
  ctx.fillStyle = "#0b1f12";
  ctx.fillRect(24, 0, 10, 18);
  ctx.fillRect(60, 0, 10, 18);
  ctx.fillStyle = "#ff0054";
  ctx.fillRect(44, 29, 8, 5);

  ctx.restore();

  const barraW = 112;
  ctx.fillStyle = "rgba(0, 0, 0, 0.72)";
  ctx.fillRect(i.x - 4, i.y - 24, barraW, 10);
  ctx.fillStyle = "#7fff00";
  ctx.fillRect(i.x - 2, i.y - 22, (barraW - 4) * (i.vida / i.vidaMax), 6);
  ctx.strokeStyle = "rgba(255, 255, 255, 0.34)";
  ctx.strokeRect(i.x - 4, i.y - 24, barraW, 10);
  desenharEtiqueta("Cell na Besta", i.x + i.w / 2, i.y - 30);
}

function desenharTrofeu(trofeu) {
  const bob = Math.sin(frame / 16) * 2;
  const x = trofeu.x;
  const y = trofeu.y + bob;

  ctx.fillStyle = "rgba(255, 212, 59, 0.2)";
  ctx.fillRect(x - 8, y - 8, 52, 62);
  ctx.fillStyle = trofeu.cor;
  ctx.fillRect(x + 5, y, 26, 8);
  ctx.fillRect(x + 8, y + 8, 20, 24);
  ctx.fillRect(x + 13, y + 32, 10, 10);
  ctx.fillRect(x + 5, y + 42, 26, 7);
  ctx.strokeStyle = trofeu.cor;
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.arc(x + 5, y + 13, 10, Math.PI / 2, Math.PI * 1.5);
  ctx.arc(x + 31, y + 13, 10, -Math.PI / 2, Math.PI / 2);
  ctx.stroke();
  ctx.fillStyle = "#fff3bf";
  ctx.fillRect(x + 14, y + 5, 8, 18);
  desenharEtiqueta(trofeu.nome, x + 18, y - 14);
}

function desenharPortal(portal) {
  const pulso = Math.floor(frame / 10) % 2;
  ctx.fillStyle = "#2d0a57";
  ctx.fillRect(portal.x, portal.y, portal.w, portal.h);
  ctx.fillStyle = pulso ? "#c77dff" : "#9d4edd";
  ctx.fillRect(portal.x + 8, portal.y + 8, portal.w - 16, portal.h - 8);
  ctx.fillStyle = "#f7f3de";
  ctx.fillRect(portal.x + 18, portal.y + 18, portal.w - 36, portal.h - 26);
  desenharEtiqueta("Portal", portal.x + portal.w / 2, portal.y - 8);
}

function desenharMeteoros() {
  meteoros.forEach(meteoro => {
    ctx.fillStyle = "rgba(255, 61, 0, 0.28)";
    ctx.fillRect(meteoro.x - 10, meteoro.y - 18, meteoro.w + 20, meteoro.h + 26);
    ctx.fillStyle = "#ff3d00";
    ctx.fillRect(meteoro.x, meteoro.y, meteoro.w, meteoro.h);
    ctx.fillStyle = "#ffd166";
    ctx.fillRect(meteoro.x + 5, meteoro.y + 5, meteoro.w - 10, meteoro.h - 10);
  });
}

function desenharHUD(fase) {
  if (modoVersus) {
    ctx.fillStyle = "rgba(8,10,16,.88)";
    ctx.fillRect(18, 16, 924, 82);
    ctx.fillStyle = "#f7f3de";
    ctx.font = "bold 17px monospace";
    ctx.fillText("P1 " + joao.nome, 32, 40);
    ctx.textAlign = "right";
    ctx.fillText(jogador2.nome + " P2", 928, 40);
    ctx.textAlign = "left";
    ctx.fillStyle = "#2b2d42";
    ctx.fillRect(32, 53, 360, 23); ctx.fillRect(568, 53, 360, 23);
    ctx.fillStyle = vidaVersusP1 <= 25 ? "#ef476f" : "#51d88a";
    ctx.fillRect(35, 56, 354 * (vidaVersusP1 / 100), 17);
    ctx.fillStyle = vidaVersusP2 <= 25 ? "#ef476f" : "#74c0fc";
    const larguraP2 = 354 * (vidaVersusP2 / 100);
    ctx.fillRect(925 - larguraP2, 56, larguraP2, 17);
    ctx.fillStyle = "#ffd43b";
    ctx.font = "bold 28px monospace";
    ctx.fillText("VS", 462, 69);
    return;
  }
  const mortos = fase.inimigos.filter(i => i.morto).length;
  const total = fase.inimigos.length;

  ctx.fillStyle = "rgba(12, 15, 20, 0.78)";
  ctx.fillRect(16, 14, 470, 92);
  ctx.strokeStyle = "rgba(255, 255, 255, 0.24)";
  ctx.strokeRect(16, 14, 470, 92);

  ctx.fillStyle = "#f7f3de";
  ctx.font = "18px monospace";
  ctx.fillText(fase.nome, 30, 40);

  ctx.fillStyle = "#ffd43b";
  ctx.fillText("Moedas: " + moedas, 30, 68);
  ctx.fillStyle = "#51d88a";
  ctx.fillText("Yoshis: " + yoshis + "/" + fases.length, 174, 68);
  ctx.fillStyle = "#f7f3de";
  ctx.fillText("Viloes: " + mortos + "/" + total, 314, 68);

  ctx.fillStyle = "#9fb3c8";
  ctx.font = "13px monospace";
  ctx.fillText("Fase " + (faseAtual + 1) + "/" + fases.length + "  |  Goku voa na nuvem e solta Genki Dama", 30, 92);
  ctx.fillStyle = "#74c0fc";
  ctx.font = "15px monospace";
  ctx.fillText("Carteira: " + moedasLoja + " moedas | " + diamantes + " diamantes", 650, 40);
  ctx.fillStyle = comboDestruicao > 1 ? "#ff922b" : "#f7f3de";
  ctx.font = "bold 15px monospace";
  ctx.fillText("DEMOLIÇÃO: " + pontosDestruicao + " pts" + (comboDestruicao > 1 ? "  COMBO x" + comboDestruicao : ""), 650, 92);

  if (chefeTimerAtivo && chefeTimer !== null) {
    const segundos = Math.max(0, Math.ceil(chefeTimer / 60));
    ctx.fillStyle = segundos <= 2 ? "#ef476f" : "#ff6b00";
    ctx.font = "18px monospace";
    ctx.fillText("CHEFÕES: " + segundos + "s", 570, 68);
  }

  if (fase.bonusTempoChefe > 0) {
    ctx.fillStyle = "#51d88a";
    ctx.font = "bold 14px monospace";
    ctx.fillText("CARRO: +" + fase.bonusTempoChefe + "s", 740, 68);
  }

  if (fase.bonus) {
    const segundosBonus = Math.max(0, Math.ceil(faseBonusTimer / 60));
    ctx.fillStyle = segundosBonus <= 10 ? "#ef476f" : "#ffd43b";
    ctx.font = "bold 24px monospace";
    ctx.fillText("BÔNUS: " + segundosBonus + "s", 500, 68);
  }

  if (joao.avatar === "goku" && joao.nuvem) {
    const energia = Math.round((joao.energiaVoo / ENERGIA_MAXIMA_VOO_GOKU) * 100);
    ctx.fillStyle = energia <= 20 ? "#ef476f" : "#74c0fc";
    ctx.font = "15px monospace";
    ctx.fillText("VOO: " + energia + "%", 746, 68);
  }

  ctx.fillStyle = "rgba(255, 255, 255, 0.16)";
  ctx.fillRect(502, 22, 216, 12);
  ctx.fillStyle = "#51d88a";
  ctx.fillRect(502, 22, 216 * ((faseAtual + 1) / fases.length), 12);
  ctx.strokeStyle = "rgba(0, 0, 0, 0.32)";
  ctx.strokeRect(502, 22, 216, 12);

  if (avisoTempo > 0) {
    avisoTempo--;
    ctx.fillStyle = "rgba(0, 0, 0, 0.62)";
    ctx.fillRect(312, 104, 336, 44);
    ctx.strokeStyle = "rgba(255, 255, 255, 0.26)";
    ctx.strokeRect(312, 104, 336, 44);
    ctx.fillStyle = "#ffffff";
    ctx.font = "18px monospace";
    ctx.fillText(aviso, 334, 132);
  }
}

function desenharFase() {
  const fase = fases[faseAtual];
  desenharFundo(fase);
  desenharAmbienteVivo(fase);

  fase.plataformas.forEach(desenharPlataforma);
  desenharParedesLabirinto(fase);
  desenharPerigosLabirinto(fase);
  desenharCampoMinado(fase);
  desenharDestrutiveis(fase);
  desenharTachas(fase);
  desenharPortal(fase.portal);
  if (fase.trofeu) desenharTrofeu(fase.trofeu);
  if (fase.mufasa) desenharMufasa(fase.mufasa);
  if (fase.cr7) desenharCR7Aliado(fase.cr7);
  if (fase.miaw) desenharMiawEletrico(fase.miaw);
  desenharNuvemGokuSolta(fase);
  desenharYoshi(fase.yoshi);

  fase.moedas.forEach(m => {
    if (!m.coletada) desenharMoeda(m);
  });
  (fase.premiosDiamante || []).forEach(desenharDiamante);
  if (fase.premio50) desenharPremio50(fase.premio50);

  fase.cogumelos.forEach(c => {
    if (!c.coletado) desenharCogumelo(c);
  });

  fase.inimigos.forEach(desenharVilao);
  desenharMeteoros();
  desenharPoderes();
}

function desenharAcabamentoArcade() {
  ctx.save();
  ctx.fillStyle = "rgba(4,6,12,.035)";
  for (let y = 0; y < canvas.height; y += 4) ctx.fillRect(0, y, canvas.width, 2);
  const vinheta = ctx.createRadialGradient(canvas.width / 2, canvas.height / 2, 170, canvas.width / 2, canvas.height / 2, 590);
  vinheta.addColorStop(0, "rgba(0,0,0,0)");
  vinheta.addColorStop(1, "rgba(0,0,0,.38)");
  ctx.fillStyle = vinheta;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.strokeStyle = "rgba(255,255,255,.28)";
  ctx.lineWidth = 3;
  ctx.strokeRect(7, 7, canvas.width - 14, canvas.height - 14);
  if (flashImpacto > 0) {
    ctx.fillStyle = "rgba(255,255,255," + Math.min(.3, flashImpacto * .035) + ")";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    flashImpacto--;
  }
  ctx.restore();
}

function atualizarInimigos() {
  const fase = fases[faseAtual];
  const multiplicador = dificuldadeFinal();

  fase.inimigos.forEach((i, indice) => {
    if (i.morto) return;
    if (i.tipo === "mandibu") i.tempoAtivo++;
    if (i.invencivel > 0) i.invencivel--;

    if (i.tipo === "bossSupremo") atualizarClonesBossSupremo(i);

    if (i.tipo === "esqueleto") {
      atualizarEspadadasEsqueleto(i);
      tratarColisaoVilao(joao, i);
      return;
    }

    if (i.tipo === "chaves") {
      atualizarAtaquesChaves(i);
      tratarColisaoVilao(joao, i);
      return;
    }

    if (i.tipo === "silvioBoss") {
      atualizarPoderSilvioBoss(i);
      tratarColisaoVilao(joao, i);
      return;
    }

    const enfurecido = ehChefeVilao(i) && i.vida <= i.vidaMax / 2;
    if (enfurecido && !i.enfurecido) {
      i.enfurecido = true;
      mostrarAviso((i.nome || "CHEFE") + " ENTROU NA FASE 2!");
      flashImpacto = 8;
      tremor = 20;
    }

    const ajusteVilao = i.tipo === "messi" ? AJUSTE_MESSI_JOGAVEL : i.tipo === "meninoRoblox" ? 1.35 : 1;
    i.x += i.vel * multiplicador * AJUSTE_VELOCIDADE_JOGAVEL * ajusteVilao * (enfurecido ? 1.35 : 1);

    if (i.x <= i.min || i.x >= i.max) {
      i.vel *= -1;
    }

    i.direcao = i.vel >= 0 ? 1 : -1;
    tentarDisparoVilao(i, indice);

    tratarColisaoVilao(joao, i);
  });
}

function atualizarPoderSilvioBoss(silvio) {
  const enfurecido = silvio.vida <= silvio.vidaMax / 2;
  if (enfurecido && !silvio.enfurecido) {
    silvio.enfurecido = true;
    mostrarAviso("SILVIO ENTROU NA FASE 2: RITMO ACELERADO!");
    tremor = 20;
  }
  silvio.x += silvio.vel * dificuldadeFinal() * AJUSTE_VELOCIDADE_JOGAVEL * (enfurecido ? 1.35 : 1);
  if (silvio.x <= silvio.min || silvio.x >= silvio.max) silvio.vel *= -1;
  silvio.direcao = joao.x + joao.w / 2 >= silvio.x + silvio.w / 2 ? 1 : -1;
  if (silvio.cooldownPoder > 0) silvio.cooldownPoder--;
  if (silvio.cooldownPoder > 0) return;

  const microfone = silvio.proximoPoder === "microfoneSilvio";
  poderes.push({
    dono: "vilao",
    tipo: microfone ? "microfoneSilvio" : "jequiti",
    nome: microfone ? "microfone do Silvio Santos" : "Jequiti do Silvio Santos",
    x: silvio.x + silvio.w / 2 + silvio.direcao * 18,
    y: silvio.y + 25,
    w: microfone ? 30 : 18,
    h: microfone ? 12 : 28,
    vx: silvio.direcao * (microfone ? 7 : 5.6),
    vy: 0,
    cor: microfone ? "#adb5bd" : "#ff8fab",
    vida: 130
  });
  silvio.proximoPoder = microfone ? "jequiti" : "microfoneSilvio";
  silvio.cooldownPoder = enfurecido ? 55 : 90;
  mostrarAviso(microfone ? "Silvio lançou o microfone!" : "Silvio lançou Jequiti!");
  tocarSom("gol");
}

function atualizarAtaquesChaves(chaves) {
  chaves.x += chaves.vel * dificuldadeFinal() * AJUSTE_VELOCIDADE_JOGAVEL;
  if (chaves.x <= chaves.min || chaves.x >= chaves.max) chaves.vel *= -1;
  chaves.direcao = joao.x + joao.w / 2 >= chaves.x + chaves.w / 2 ? 1 : -1;

  if (chaves.cooldownAtaqueChaves > 0) chaves.cooldownAtaqueChaves--;
  if (chaves.cooldownSucoChaves > 0) chaves.cooldownSucoChaves--;

  if (chaves.cooldownAtaqueChaves <= 0) {
    const soltaBarril = chaves.ataqueChaves % 2 === 1;
    chaves.ataqueChaves++;
    chaves.cooldownAtaqueChaves = 180;
    poderes.push({
      dono: "vilao",
      tipo: soltaBarril ? "barrilChaves" : "sanduichePresunto",
      nome: soltaBarril ? "barril do Chaves" : "sanduíche de presunto",
      x: chaves.x + chaves.w / 2 + chaves.direcao * 20,
      y: soltaBarril ? chaves.y + 21 : chaves.y + 27,
      w: soltaBarril ? 34 : 30,
      h: soltaBarril ? 36 : 16,
      vx: chaves.direcao * (soltaBarril ? 4.6 : 6.8),
      vy: 0,
      cor: soltaBarril ? "#8b4513" : "#f4a261",
      vida: 150
    });
    mostrarAviso(soltaBarril ? "Chaves soltou o barril onde ele vive!" : "Chaves lançou sanduíche de presunto!");
    tocarSom(soltaBarril ? "pisao" : "gol");
  }

  if (chaves.cooldownSucoChaves <= 0) {
    chaves.cooldownSucoChaves = 180;
    poderes.push({
      dono: "vilao",
      tipo: "sucoTamarindo",
      nome: "vômito de suco de tamarindo",
      x: chaves.x + chaves.w / 2 + chaves.direcao * 18,
      y: chaves.y + chaves.h - 14,
      w: 40,
      h: 13,
      vx: chaves.direcao * 5.3,
      vy: 0,
      cor: "#9c6644",
      vida: 105
    });
    mostrarAviso("Chaves vomitou suco de tamarindo!");
    tocarSom("dano");
  }
}

function atualizarEspadadasEsqueleto(esqueleto) {
  const ciclo = (frame + esqueleto.ataqueOffset) % 120;
  const golpe = ciclo < 14 ? 1 : ciclo >= 22 && ciclo < 36 ? 2 : 0;

  if (!golpe) {
    esqueleto.x += esqueleto.vel * dificuldadeFinal() * AJUSTE_VELOCIDADE_JOGAVEL;
    if (esqueleto.x <= esqueleto.min || esqueleto.x >= esqueleto.max) esqueleto.vel *= -1;
    esqueleto.direcao = esqueleto.vel >= 0 ? 1 : -1;
    return;
  }

  esqueleto.direcao = joao.x + joao.w / 2 >= esqueleto.x + esqueleto.w / 2 ? 1 : -1;
  const idGolpe = Math.floor((frame + esqueleto.ataqueOffset) / 120) * 2 + golpe;
  const espada = {
    x: esqueleto.direcao > 0 ? esqueleto.x + esqueleto.w - 4 : esqueleto.x - 50,
    y: esqueleto.y + 12,
    w: 54,
    h: 38
  };

  if (esqueleto.golpeAcertado !== idGolpe && joao.invencivel <= 0 && colisao(joao, espada)) {
    esqueleto.golpeAcertado = idGolpe;
    mostrarAviso("O esqueleto acertou a espadada " + golpe + " de 2!");
    tocarSom("dano");
    tremor = 22;
    criarParticulas(joao.x + joao.w / 2, joao.y + joao.h / 2, "#e9ecef", 28);
    resetarPersonagens();
  }
}

function atualizarClonesBossSupremo(boss) {
  if (boss.ultimoClone === null) boss.ultimoClone = frame;

  if (frame - boss.ultimoClone >= 180 && boss.clones.length < 4) {
    const lado = boss.clones.length % 2 === 0 ? -1 : 1;
    const x = Math.max(80, Math.min(canvas.width - boss.w - 40, boss.x + lado * (130 + boss.clones.length * 34)));
    boss.clones.push({
      x,
      y: boss.y,
      w: boss.w,
      h: boss.h,
      vel: lado * (1.4 + boss.clones.length * 0.18),
      min: 54,
      max: canvas.width - 54,
      direcao: lado,
      ativo: true
    });
    boss.ultimoClone = frame;
    tocarSom("portal");
    criarParticulas(x + boss.w / 2, boss.y + boss.h / 2, "#c77dff", 30);
    mostrarAviso("O Boss Supremo criou uma ilusao!");
  }

  for (let c = boss.clones.length - 1; c >= 0; c--) {
    const clone = boss.clones[c];
    clone.x += clone.vel * AJUSTE_VELOCIDADE_JOGAVEL;

    if (clone.x <= clone.min || clone.x + clone.w >= clone.max) {
      clone.vel *= -1;
      clone.direcao = clone.vel >= 0 ? 1 : -1;
    }

    if (colisao(joao, clone)) {
      boss.clones.splice(c, 1);
      joao.velY = -7;
      criarParticulas(clone.x + clone.w / 2, clone.y + clone.h / 2, "#9d4edd", 24);
      tocarSom("pisao");
      mostrarAviso("Era uma ilusao! Procure o Boss verdadeiro.");
    }
  }
}

function tentarDisparoVilao(vilao, indice) {
  const intervalo = MODO_HARD_GLOBAL
    ? Math.max(54, 118 - faseAtual * 4)
    : Math.max(60, 136 - faseAtual * 5);
  if ((frame + indice * 17) % intervalo !== 0) return;

  const centroVilaoX = vilao.x + vilao.w / 2;
  const centroVilaoY = vilao.y + Math.max(12, vilao.h / 2);
  const centroJoaoX = joao.x + joao.w / 2;
  const centroJoaoY = joao.y + joao.h / 2;
  const dx = centroJoaoX - centroVilaoX;
  const dy = centroJoaoY - centroVilaoY;
  const distancia = Math.max(1, Math.hypot(dx, dy));
  const ehMessi = vilao.tipo === "messi";
  const ehMeninoRoblox = vilao.tipo === "meninoRoblox";
  const ajusteFaseOito = faseAtual === 7 ? 0.93 : 1;
  const ataqueRoblox = Math.floor(frame / intervalo) % 2 === 0 ? "celular" : "placaInjustica";
  const velocidade =
    (2.7 + faseAtual * 0.14 + (ehChefeVilao(vilao) ? 0.85 : 0)) *
    AJUSTE_VELOCIDADE_JOGAVEL *
    AJUSTE_PODER_VILAO_JOGAVEL *
    ajusteFaseOito *
    (ehMessi ? AJUSTE_MESSI_JOGAVEL : 1) *
    (ehMeninoRoblox ? 1.35 : 1) *
    (ehMeninoRoblox && ataqueRoblox === "placaInjustica" ? 0.42 : 1);

  const tipoPoder = ehMessi ? "bolaOuro" : ehMeninoRoblox ? ataqueRoblox : "poderVilao";
  const larguraPoder = tipoPoder === "placaInjustica" ? 150 : tipoPoder === "celular" ? 18 : ehChefeVilao(vilao) ? 18 : 14;
  const alturaPoder = tipoPoder === "placaInjustica" ? 48 : tipoPoder === "celular" ? 28 : ehChefeVilao(vilao) ? 18 : 14;

  poderes.push({
    dono: "vilao",
    tipo: tipoPoder,
    nome: ehMessi ? "bola de ouro do Messi" : tipoPoder === "celular" ? "celular do menino" : tipoPoder === "placaInjustica" ? "placa QUEREMOS INJUSTICA" : "poder do vilao",
    x: centroVilaoX,
    y: centroVilaoY - alturaPoder / 2,
    w: larguraPoder,
    h: alturaPoder,
    vx: (dx / distancia) * velocidade,
    vy: tipoPoder === "placaInjustica" ? 0 : (dy / distancia) * velocidade,
    cor: ehMessi ? "#ffd43b" : ehMeninoRoblox ? "#f7f3de" : ehChefeVilao(vilao) ? "#ff0054" : "#c77dff",
    vida: 160
  });
}

function lancarPlacaInjusticaGlobal() {
  const fase = fases[faseAtual];
  if (fase.bonus || fase.labirinto) return;
  const intervalo = faseAtual < 5 ? 360 : 480;
  if (frame % intervalo !== 0) return;

  const vemDaDireita = Math.floor(frame / intervalo) % 2 === 0;
  poderes.push({
    dono: "vilao",
    tipo: "placaInjustica",
    nome: "placa QUEREMOS INJUSTICA",
    x: vemDaDireita ? canvas.width + 8 : -158,
    y: 180 + (faseAtual * 53) % 230,
    w: 150,
    h: 48,
    vx: vemDaDireita ? -2.25 : 2.25,
    vy: 0,
    cor: "#f7f3de",
    vida: 560
  });
}

function dispararPoderNeymar() {
  if (joao.avatar !== "neymar" || poderNeymarCooldown > 0 || gameOver || venceu) return;

  poderNeymarCooldown = 34;
  const tipo = proximoPoderNeymar;
  const configuracoes = {
    muletaPower: { nome: "Muleta Power", w: 24, h: 12, velocidade: 8.4, cor: "#ffe066", dano: 1 },
    bolaFogoNeymar: { nome: "Bola de Fogo", w: 26, h: 26, velocidade: 7.4, cor: "#ff6b00", dano: 2 },
    brunaMarquezine: { nome: "Poder Bruna Marquezine", w: 28, h: 38, velocidade: 6.8, cor: "#ff8fab", dano: 2 }
  };
  const config = configuracoes[tipo];
  poderes.push({
    dono: "neymar",
    tipo,
    nome: config.nome,
    x: joao.x + joao.w / 2 + joao.direcao * 18,
    y: joao.y + (tipo === "brunaMarquezine" ? 12 : 26),
    w: config.w,
    h: config.h,
    vx: joao.direcao * config.velocidade,
    vy: -0.25,
    cor: config.cor,
    vida: 90,
    dano: config.dano
  });
  const ciclo = ["muletaPower", "bolaFogoNeymar", "brunaMarquezine"];
  proximoPoderNeymar = ciclo[(ciclo.indexOf(tipo) + 1) % ciclo.length];
  mostrarAviso("NEYMAR: " + config.nome + "!");
  tocarSom("gol");
}

function dispararGenkiDama() {
  if (joao.avatar !== "goku" || !joao.nuvem || genkiDamaCooldown > 0 || gameOver || venceu) return;

  genkiDamaCooldown = 58;
  poderes.push({
    dono: "goku",
    tipo: "genkiDama",
    nome: "Genki Dama",
    x: joao.x + joao.w / 2 + joao.direcao * 18,
    y: joao.y + 10,
    w: 26,
    h: 26,
    vx: joao.direcao * 6.4,
    vy: -0.08,
    cor: "#74c0fc",
    vida: 95
  });
  tocarSom("portal");
}

function atualizarPoderNeymar() {
  if (poderNeymarCooldown > 0) poderNeymarCooldown--;
  if (joao.avatar === "neymar" && jogoIniciado && !pausado && !gameOver && frame % 36 === 0) {
    dispararPoderNeymar();
  }
}

function atualizarPoderGoku() {
  if (genkiDamaCooldown > 0) genkiDamaCooldown--;
  if (joao.avatar === "goku" && joao.nuvem && jogoIniciado && !pausado && !gameOver && frame % 62 === 0) {
    dispararGenkiDama();
  }
}

function dispararPoderRoblox() {
  if (joao.avatar !== "meninoRoblox" || poderRobloxCooldown > 0 || gameOver || venceu) return;

  const placa = proximoPoderRoblox === "placaInjustica";
  poderRobloxCooldown = placa ? 78 : 44;
  poderes.push({
    dono: "robloxPlayer",
    tipo: proximoPoderRoblox,
    nome: placa ? "Placa QUEREMOS INJUSTICA" : "Celular Roblox",
    x: joao.x + joao.w / 2 + joao.direcao * 18,
    y: placa ? joao.y + 2 : joao.y + 18,
    w: placa ? 150 : 18,
    h: placa ? 48 : 28,
    vx: joao.direcao * (placa ? 4.4 : 8.2),
    vy: 0,
    cor: placa ? "#f7f3de" : "#74c0fc",
    vida: placa ? 150 : 95
  });
  proximoPoderRoblox = placa ? "celular" : "placaInjustica";
  tocarSom(placa ? "portal" : "gol");
}

function atualizarPoderRoblox() {
  if (poderRobloxCooldown > 0) poderRobloxCooldown--;
  if (joao.avatar === "meninoRoblox" && jogoIniciado && !pausado && !gameOver && frame % 48 === 0) {
    dispararPoderRoblox();
  }
}

function dispararPoderCR7() {
  if (personagemAtual !== "cr7" || poderCR7Cooldown > 0 || gameOver || venceu) return;

  const jogaBuffon = proximoPoderCR7 === "buffonCR7";
  poderCR7Cooldown = 46;
  joao.grande = true;
  joao.poderTempo = Math.max(joao.poderTempo, 110);
  buffonTempo = 180;
  poderes.push({
    dono: "cr7",
    tipo: jogaBuffon ? "buffonCR7" : "bicicletaCR7",
    nome: jogaBuffon ? "Buffon do CR7" : "Bicicletinha do CR7",
    x: joao.x + joao.w / 2 + joao.direcao * 20,
    y: joao.y + (jogaBuffon ? 5 : 16),
    w: jogaBuffon ? 30 : 44,
    h: jogaBuffon ? 48 : 30,
    vx: joao.direcao * (jogaBuffon ? 7.6 : 9.2),
    vy: -0.18,
    cor: jogaBuffon ? "#74c0fc" : "#f7f3de",
    vida: 105,
    dano: 2
  });
  proximoPoderCR7 = jogaBuffon ? "bicicletaCR7" : "buffonCR7";
  mostrarAviso(jogaBuffon ? "CR7 lançou um BUFFON!" : "CR7: SIUUUU! Bicicletinha lançada!");
  criarParticulas(joao.x + joao.w / 2, joao.y + 16, "#ffd43b", 26);
  tocarSom("gol");
}

function atualizarPoderCR7() {
  if (buffonTempo > 0) buffonTempo--;
  if (poderCR7Cooldown > 0) poderCR7Cooldown--;
  if (personagemAtual === "cr7" && jogoIniciado && !pausado && !gameOver && frame % 50 === 0) {
    dispararPoderCR7();
  }
}

function dispararPoderChaves(tipo) {
  const barril = tipo === "barrilChaves";
  poderes.push({
    dono: "chavesPlayer",
    tipo,
    nome: barril ? "Barril do Chaves" : "Sanduíche de presunto",
    x: joao.x + joao.w / 2 + joao.direcao * 18,
    y: barril ? joao.y + 20 : joao.y + 26,
    w: barril ? 34 : 30,
    h: barril ? 36 : 16,
    vx: joao.direcao * (barril ? 5.4 : 7.4),
    vy: 0,
    cor: barril ? "#8b4513" : "#f4a261",
    vida: 120,
    dano: barril ? 2 : 1
  });
  mostrarAviso(barril ? "Chaves soltou o barril!" : "Chaves lançou sanduíche de presunto!");
  tocarSom(barril ? "pisao" : "gol");
}

function vomitarSucoChaves() {
  poderes.push({
    dono: "chavesPlayer",
    tipo: "sucoTamarindo",
    nome: "Suco de tamarindo",
    x: joao.x + joao.w / 2 + joao.direcao * 18,
    y: joao.y + joao.h - 15,
    w: 40,
    h: 13,
    vx: joao.direcao * 5.8,
    vy: 0,
    cor: "#9c6644",
    vida: 95,
    dano: 1
  });
  mostrarAviso("Chaves vomitou suco de tamarindo!");
  tocarSom("dano");
}

function atualizarPoderChaves() {
  if (personagemAtual !== "chaves" || !jogoIniciado || pausado || gameOver || venceu) return;
  if (poderChavesCooldown > 0) poderChavesCooldown--;
  if (poderChavesSucoCooldown > 0) poderChavesSucoCooldown--;

  if (poderChavesCooldown <= 0) {
    dispararPoderChaves(proximoPoderChaves);
    proximoPoderChaves = proximoPoderChaves === "sanduichePresunto" ? "barrilChaves" : "sanduichePresunto";
    poderChavesCooldown = 180;
  }
  if (poderChavesSucoCooldown <= 0) {
    vomitarSucoChaves();
    poderChavesSucoCooldown = 180;
  }
}

function dispararCorteEsqueleto(numero) {
  poderes.push({
    dono: "esqueletoPlayer",
    tipo: "corteEsqueleto",
    nome: "Espadada " + numero + " do Esqueleto",
    x: joao.direcao > 0 ? joao.x + joao.w - 2 : joao.x - 54,
    y: joao.y + 10,
    w: 56,
    h: 40,
    vx: joao.direcao * 2.4,
    vy: 0,
    cor: "#e9ecef",
    vida: 12,
    dano: 1
  });
  mostrarAviso("Esqueleto: espadada " + numero + " de 2!");
  tocarSom("pisao");
}

function atualizarPoderEsqueleto() {
  if (personagemAtual !== "esqueleto" || !jogoIniciado || pausado || gameOver || venceu) return;
  if (poderEsqueletoCooldown > 0) poderEsqueletoCooldown--;
  if (segundoCorteEsqueleto > 0) {
    segundoCorteEsqueleto--;
    if (segundoCorteEsqueleto === 0) dispararCorteEsqueleto(2);
  }
  if (poderEsqueletoCooldown <= 0) {
    dispararCorteEsqueleto(1);
    segundoCorteEsqueleto = 22;
    poderEsqueletoCooldown = 120;
  }
}

function dispararPoderSilvio() {
  const microfone = proximoPoderSilvio === "microfoneSilvio";
  poderes.push({
    dono: "silvioPlayer",
    tipo: microfone ? "microfoneSilvio" : "jequiti",
    nome: microfone ? "Microfone do Silvio" : "Jequiti",
    x: joao.x + joao.w / 2 + joao.direcao * 18,
    y: joao.y + (microfone ? 24 : 16),
    w: microfone ? 30 : 18,
    h: microfone ? 12 : 28,
    vx: joao.direcao * (microfone ? 8 : 6.4),
    vy: 0,
    cor: microfone ? "#adb5bd" : "#ff8fab",
    vida: 110,
    dano: microfone ? 2 : 1
  });
  proximoPoderSilvio = microfone ? "jequiti" : "microfoneSilvio";
  poderSilvioCooldown = 54;
  mostrarAviso(microfone ? "Silvio lançou o microfone!" : "Silvio lançou Jequiti!");
  tocarSom("gol");
}

function atualizarPoderSilvio() {
  if (poderSilvioCooldown > 0) poderSilvioCooldown--;
  if (personagemAtual === "silvioSantos" && jogoIniciado && !pausado && !gameOver && poderSilvioCooldown <= 0) {
    dispararPoderSilvio();
  }
}

function atualizarGolpeJogador(jogador = joao, teclasAtaque = ["x", "X"]) {
  const fase = fases[faseAtual];
  if (jogador.ataqueCooldown > 0) jogador.ataqueCooldown--;
  if (jogador.ataqueTempo > 0) jogador.ataqueTempo--;
  if (comboDestruicaoTempo > 0) comboDestruicaoTempo--;
  else comboDestruicao = 0;
  if (!jogoIniciado || pausado || gameOver || venceu || jogador.ataqueCooldown > 0 || !teclaAtiva(teclasAtaque)) return;

  if (jogador.montado && jogador.montaria === "yoshi") {
    dispararEsferaDragao(jogador);
    return;
  }

  if (jogador.avatar === "harry") {
    dispararPoderHarry(jogador);
    return;
  }

  if (jogador.avatar === "rangerVermelho") {
    dispararPoderRangerVermelho(jogador);
    return;
  }

  if (jogador.avatar === "ancelotti") {
    dispararEndrickNoBanco(jogador);
    return;
  }

  if (["joao", "luquinhas", "yoshi", "messi"].includes(jogador.personagemId)) {
    dispararPoderHeroiBase(jogador);
    return;
  }

  jogador.comboGolpe = ((jogador.comboGolpe ?? -1) + 1) % 3;
  const golpes = [
    { nome: "SOCO", dano: 8, alcance: 52, cooldown: 17 },
    { nome: "CHUTE", dano: 11, alcance: 64, cooldown: 21 },
    { nome: "ESPECIAL", dano: 16, alcance: 76, cooldown: 29 }
  ];
  const golpe = golpes[jogador.comboGolpe];
  jogador.tipoGolpeAtual = golpe.nome;
  jogador.ataqueTempo = 12;
  jogador.ataqueCooldown = fase.bonus && !modoVersus ? 8 : golpe.cooldown;
  const alcance = {
    x: jogador.direcao > 0 ? jogador.x + jogador.w - 2 : jogador.x - golpe.alcance,
    y: jogador.y + 8,
    w: golpe.alcance,
    h: 46
  };

  if (modoVersus) {
    const rival = jogador === joao ? jogador2 : joao;
    if (rival.invencivel <= 0 && colisao(alcance, rival)) {
      if (jogador === joao) vidaVersusP2 = Math.max(0, vidaVersusP2 - golpe.dano);
      else vidaVersusP1 = Math.max(0, vidaVersusP1 - golpe.dano);
      rival.invencivel = 24;
      rival.velX = jogador.direcao * (3 + golpe.dano * .2);
      hitStopFrames = golpe.nome === "ESPECIAL" ? 6 : 3;
      flashImpacto = golpe.nome === "ESPECIAL" ? 10 : 5;
      tremor = golpe.nome === "ESPECIAL" ? 22 : 10;
      cameraImpacto = golpe.nome === "ESPECIAL" ? 10 : 5;
      criarParticulas(rival.x + rival.w / 2, rival.y + 24, golpe.nome === "ESPECIAL" ? "#ef476f" : "#ffd43b", 32);
      tocarSom(golpe.nome === "ESPECIAL" ? "especial" : golpe.nome === "CHUTE" ? "chute" : "soco");
      mostrarAviso(golpe.nome + "! " + (jogador === joao ? "P2" : "P1") + " perdeu " + golpe.dano + " de vida!");
      if (vidaVersusP1 <= 0 || vidaVersusP2 <= 0) {
        gameOver = true;
        mensagem.innerText = "K.O.! " + (vidaVersusP1 > 0 ? joao.nome : jogador2.nome) + " venceu!";
      }
    }
    return;
  }
  const inimigo = fase.inimigos.find(alvo => !alvo.morto && colisao(alcance, alvo));

  if (inimigo) {
    if (mandibuProtegido(inimigo)) {
      jogador.ataqueCooldown = 18;
      criarParticulas(inimigo.x + inimigo.w / 2, inimigo.y + 20, "#74c0fc", 20);
      tocarSom("pisao");
      mostrarAviso("A armadura do Mandibu ainda esta protegida!");
      return;
    }
    if (ehChefeVilao(inimigo)) {
      if (inimigo.invencivel <= 0) {
        inimigo.vida -= golpe.nome === "ESPECIAL" ? 2 : 1;
        inimigo.invencivel = 24;
        if (inimigo.vida <= 0) inimigo.morto = true;
      }
    } else {
      inimigo.morto = true;
    }
    criarParticulas(inimigo.x + inimigo.w / 2, inimigo.y + inimigo.h / 2, "#ffd43b", 26);
    mostrarAviso(inimigo.morto ? (inimigo.nome || "Vilão") + " foi nocauteado!" : "Golpe acertou! Vida: " + inimigo.vida + "/" + inimigo.vidaMax);
    tocarSom(inimigo.morto ? "vitoria" : "pisao");
    tremor = 12;
    hitStopFrames = inimigo.morto ? 5 : 3;
    flashImpacto = inimigo.morto ? 9 : 5;
    cameraImpacto = inimigo.morto ? 9 : 4;
    registrarComboCombate();
    ganharExperiencia(inimigo.morto ? 20 : 5);
  }

  const objeto = (fase.destrutiveis || []).find(item => !item.quebrado && colisao(alcance, item));
  if (objeto) {
    objeto.vida--;
    hitStopFrames = objeto.vida <= 1 ? 5 : 2;
    flashImpacto = objeto.vida <= 1 ? 8 : 4;
    cameraImpacto = objeto.vida <= 1 ? 8 : 3;
    comboDestruicao = comboDestruicaoTempo > 0 ? comboDestruicao + 1 : 1;
    comboDestruicaoTempo = 120;
    pontosDestruicao += 50 * comboDestruicao;
    criarParticulas(objeto.x + objeto.w / 2, objeto.y + objeto.h / 2, objeto.tipo === "carroQuebravel" ? "#d90429" : "#9c551f", 30);
    tocarSom("pisao");
    if (objeto.vida <= 0) {
      objeto.quebrado = true;
      ganharExperiencia(objeto.tipo === "carroQuebravel" ? 35 : 15);
      const premioMoedas = objeto.tipo === "carroQuebravel" ? 10 : 3;
      moedas += premioMoedas;
      moedasLoja += premioMoedas;
      if (objeto.tipo === "carroQuebravel") {
        diamantes++;
        const bonusSegundos = Math.min(25, 12 + faseAtual * 2);
        fase.bonusTempoChefe = bonusSegundos;
        if (chefeTimerAtivo && chefeTimer !== null) chefeTimer += bonusSegundos * 60;
      }
      pontosDestruicao += objeto.tipo === "carroQuebravel" ? 1000 : 250;
      salvarCarteira();
      mostrarAviso(objeto.tipo === "carroQuebravel" ? "CARRO DESTRUÍDO! +" + fase.bonusTempoChefe + "s contra o chefão!" : "Barril destruído: +250 pts e +3 moedas!");
    } else {
      mostrarAviso("COMBO x" + comboDestruicao + " | Resistência: " + objeto.vida + "/" + objeto.vidaMax);
    }
  }
}

function dispararEsferaDragao(jogador) {
  jogador.ataqueTempo = 10;
  jogador.ataqueCooldown = 24;
  const estrelas = 1 + Math.floor(Math.random() * 7);
  poderes.push({
    dono: "yoshiPlayer",
    tipo: "esferaDragao",
    nome: "Esfera do Dragao " + estrelas + " estrelas",
    estrelas,
    x: jogador.x + jogador.w / 2 + jogador.direcao * 30,
    y: jogador.y + 20,
    w: 30,
    h: 30,
    vx: jogador.direcao * 9.2,
    vy: -0.3,
    cor: "#ff8c00",
    vida: 125,
    dano: estrelas >= 6 ? 3 : estrelas >= 3 ? 2 : 1
  });
  tocarSom("esfera");
  criarParticulas(jogador.x + jogador.w / 2, jogador.y + 30, "#ffd43b", 18);
  mostrarAviso("Yoshi lancou uma esfera de " + estrelas + " estrelas!");
}

function dispararPomoDourado(jogador) {
  jogador.ataqueTempo = 10;
  jogador.ataqueCooldown = 26;
  poderes.push({
    dono: "harryPlayer", tipo: "pomoDourado", nome: "Pomo Dourado",
    x: jogador.x + jogador.w / 2 + jogador.direcao * 24, y: jogador.y + 16,
    w: 24, h: 18, vx: jogador.direcao * 9.8, vy: Math.sin(frame / 8) * 0.8,
    cor: "#ffd43b", vida: 140, dano: 2
  });
  tocarSom("esfera");
  mostrarAviso("Harry lancou o Pomo Dourado!");
}

function dispararExpelliarmus(jogador) {
  jogador.ataqueTempo = 12;
  jogador.ataqueCooldown = 24;
  poderes.push({
    dono: "harryPlayer", tipo: "expelliarmus", nome: "Expelliarmus",
    x: jogador.x + jogador.w / 2 + jogador.direcao * 24, y: jogador.y + 18,
    w: 48, h: 14, vx: jogador.direcao * 10.6, vy: 0,
    cor: "#ef476f", vida: 115, dano: 2
  });
  tocarSom("especial");
  mostrarAviso("Harry lancou Expelliarmus!");
}

function dispararPatrono(jogador) {
  jogador.ataqueTempo = 14;
  jogador.ataqueCooldown = 34;
  poderes.push({
    dono: "harryPlayer", tipo: "patrono", nome: "Expecto Patronum",
    x: jogador.x + jogador.w / 2 + jogador.direcao * 26, y: jogador.y + 6,
    w: 54, h: 38, vx: jogador.direcao * 8.5, vy: -0.15,
    cor: "#74c0fc", vida: 145, dano: 3
  });
  tocarSom("portal");
  mostrarAviso("Harry invocou o Patrono!");
}

function dispararPoderHarry(jogador = joao) {
  if (poderHarryCooldown > 0 || gameOver || venceu) return;
  const sorteio = Math.floor(Math.random() * 3);
  if (sorteio === 0) dispararPomoDourado(jogador);
  else if (sorteio === 1) dispararExpelliarmus(jogador);
  else dispararPatrono(jogador);
  poderHarryCooldown = 85 + Math.floor(Math.random() * 55);
}

function atualizarPoderHarry() {
  if (poderHarryCooldown > 0) poderHarryCooldown--;
  if (personagemAtual !== "harry" || !jogoIniciado || pausado || gameOver || venceu) return;
  if (poderHarryCooldown <= 0) dispararPoderHarry(joao);
}

function dispararPoderRangerVermelho(jogador) {
  jogador.ataqueTempo = 14;
  jogador.ataqueCooldown = 32;
  jogador.invencivel = Math.max(jogador.invencivel, 20);
  poderes.push({
    dono: "rangerPlayer", tipo: "espadaRanger", nome: "Espada de Energia do Ranger Vermelho",
    x: jogador.x + jogador.w / 2 + jogador.direcao * 28, y: jogador.y + 8,
    w: 58, h: 40, vx: jogador.direcao * 10.2, vy: 0,
    cor: "#ef233c", vida: 90, dano: 3
  });
  criarParticulas(jogador.x + jogador.w / 2, jogador.y + 26, "#ef233c", 30);
  tocarSom("especial");
  mostrarAviso("MORFAR! Ranger Vermelho: Espada de Energia!");
}

function dispararEndrickNoBanco(jogador) {
  jogador.ataqueTempo = 12;
  jogador.ataqueCooldown = 42;
  poderes.push({
    dono: "ancelottiPlayer", tipo: "endrickBanco", nome: "Endrick em cima do banco",
    x: jogador.x + jogador.w / 2 + jogador.direcao * 22, y: jogador.y + 10,
    w: 64, h: 46, vx: jogador.direcao * 7.6, vy: -0.4,
    cor: "#51d88a", vida: 130, dano: 3
  });
  tocarSom("gol");
  mostrarAviso("Ancelotti jogou o Endrick em cima do banco!");
}

function dispararPoderHeroiBase(jogador) {
  const configuracoes = {
    joao: { tipo: "impactoReino", nome: "Impacto do Reino", cor: "#ef476f", w: 64, h: 42, velocidade: 9.2, dano: 3 },
    luquinhas: { tipo: "raioAzul", nome: "Raio Azul Supremo", cor: "#4dabf7", w: 58, h: 24, velocidade: 10.4, dano: 3 },
    yoshi: { tipo: "chamaYoshi", nome: "Chama Verde do Yoshi", cor: "#51d88a", w: 46, h: 34, velocidade: 9.8, dano: 3 },
    messi: { tipo: "bolaOuroPlayer", nome: "Bola de Ouro do Messi", cor: "#ffd43b", w: 34, h: 34, velocidade: 10.2, dano: 4 }
  };
  const config = configuracoes[jogador.personagemId] || configuracoes.joao;
  jogador.ataqueTempo = 13;
  jogador.ataqueCooldown = 30;
  poderes.push({
    dono: "heroiPlayer", tipo: config.tipo, nome: config.nome,
    x: jogador.x + jogador.w / 2 + jogador.direcao * 24,
    y: jogador.y + 12,
    w: config.w, h: config.h,
    vx: jogador.direcao * config.velocidade, vy: 0,
    cor: config.cor, vida: 120, dano: config.dano
  });
  jogador.invencivel = Math.max(jogador.invencivel, 16);
  criarParticulas(jogador.x + jogador.w / 2, jogador.y + 24, config.cor, 24);
  tocarSom("especial");
  mostrarAviso(jogador.nome + " usou " + config.nome + "!");
}

function atualizarPoderes() {
  for (let p = poderes.length - 1; p >= 0; p--) {
    const poder = poderes[p];
    poder.x += poder.vx;
    poder.y += poder.vy;
    poder.vida--;

    if (poder.dono === "vilao" && personagemAtual === "cr7" && buffonTempo > 0) {
      const buffonBox = {
        x: Math.max(4, Math.min(canvas.width - 38, joao.x - joao.direcao * 52)) - 7,
        y: joao.y + 1,
        w: 48,
        h: 62
      };
      if (colisao(buffonBox, poder)) {
        criarParticulas(poder.x, poder.y, "#74c0fc", 20);
        mostrarAviso("BUFFON DEFENDEU!");
        tocarSom("pisao");
        poderes.splice(p, 1);
        continue;
      }
    }

    const jogadorAtingido = poder.dono === "vilao"
      ? jogadoresAtivos().find(jogador => jogador.invencivel <= 0 && colisao(jogador, poder))
      : null;
    if (jogadorAtingido) {
      mostrarAviso((poder.nome || "Poder do vilao") + " acertou!");
      tocarSom("dano");
      tremor = 18;
      criarParticulas(jogadorAtingido.x + jogadorAtingido.w / 2, jogadorAtingido.y + jogadorAtingido.h / 2, poder.cor, 22);
      derrotarJogadores("Um jogador foi atingido!");
      return;
    }

    if (poder.dono === "neymar" || poder.dono === "goku" || poder.dono === "robloxPlayer" || poder.dono === "cr7" || poder.dono === "chavesPlayer" || poder.dono === "esqueletoPlayer" || poder.dono === "silvioPlayer" || poder.dono === "yoshiPlayer" || poder.dono === "harryPlayer" || poder.dono === "rangerPlayer" || poder.dono === "ancelottiPlayer" || poder.dono === "heroiPlayer") {
      const faseAtualObj = fases[faseAtual];
      const objeto = (faseAtualObj.destrutiveis || []).find(item => !item.quebrado && colisao(item, poder));
      if (objeto) {
        const danoObjeto = Math.max(1, poder.dano || 1);
        objeto.vida -= danoObjeto;
        criarParticulas(poder.x + poder.w / 2, poder.y + poder.h / 2, poder.cor || "#ffd43b", 26);
        tocarSom("pisao");
        tremor = objeto.tipo === "carroQuebravel" ? 14 : 8;

        if (objeto.vida <= 0) {
          objeto.quebrado = true;
          const premioMoedas = objeto.tipo === "carroQuebravel" ? 10 : 3;
          moedas += premioMoedas;
          moedasLoja += premioMoedas;
          pontosDestruicao += objeto.tipo === "carroQuebravel" ? 1000 : 250;
          ganharExperiencia(objeto.tipo === "carroQuebravel" ? 35 : 15);
          if (objeto.tipo === "carroQuebravel") {
            diamantes++;
            const bonusSegundos = Math.min(25, 12 + faseAtual * 2);
            faseAtualObj.bonusTempoChefe = bonusSegundos;
            if (chefeTimerAtivo && chefeTimer !== null) chefeTimer += bonusSegundos * 60;
          }
          salvarCarteira();
          mostrarAviso((poder.nome || "Poder") + " destruiu " + (objeto.tipo === "carroQuebravel" ? "o carro!" : "o barril!"));
        } else {
          mostrarAviso((poder.nome || "Poder") + " acertou " + (objeto.tipo === "carroQuebravel" ? "o carro" : "o barril") + "! Resistencia: " + objeto.vida + "/" + objeto.vidaMax);
        }
        poderes.splice(p, 1);
        continue;
      }

      const alvo = faseAtualObj.inimigos.find(i => !i.morto && colisao(i, poder));
      if (alvo) {
        if (mandibuProtegido(alvo)) {
          criarParticulas(poder.x, poder.y, "#74c0fc", 22);
          tocarSom("pisao");
          mostrarAviso("O escudo do Mandibu bloqueou o poder!");
          poderes.splice(p, 1);
          continue;
        }
        const dano = poder.dano || (poder.dono === "goku" || poder.dono === "cr7" ? 2 : 1);
        if (ehChefeVilao(alvo)) {
          alvo.vida -= dano;
          alvo.invencivel = 18;
          if (alvo.vida <= 0) {
            alvo.morto = true;
            tocarSom("vitoria");
            mostrarAviso((poder.nome || "Poder") + " derrotou " + (alvo.nome || "o chefe") + "!");
          } else {
            mostrarAviso((poder.nome || "Poder") + " acertou! Vida: " + alvo.vida + "/" + alvo.vidaMax);
          }
        } else {
          alvo.morto = true;
          mostrarAviso((poder.nome || "Poder") + " derrubou um vilao!");
        }
        const corImpacto = poder.cor || (poder.dono === "goku" ? "#74c0fc" : poder.dono === "robloxPlayer" ? "#e03131" : poder.dono === "cr7" ? "#ffd43b" : "#ffe066");
        criarParticulas(poder.x, poder.y, corImpacto, 20);
        poderes.splice(p, 1);
        continue;
      }
    }

    if (
      poder.vida <= 0 ||
      poder.x < -40 ||
      poder.x > canvas.width + 40 ||
      poder.y < -60 ||
      poder.y > canvas.height + 60
    ) {
      poderes.splice(p, 1);
    }
  }
}

function desenharPoderes() {
  poderes.forEach(poder => {
    if (poder.tipo === "impactoReino") {
      ctx.save(); ctx.globalAlpha = .82;
      ctx.fillStyle = "rgba(239,71,111,.28)";
      ctx.beginPath(); ctx.arc(poder.x + 24, poder.y + 21, 30, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = "#ef476f"; ctx.lineWidth = 6;
      ctx.beginPath(); ctx.arc(poder.x + 24, poder.y + 21, 18, -.8, .8); ctx.stroke();
      ctx.strokeStyle = "#ffffff"; ctx.lineWidth = 2; ctx.stroke(); ctx.restore();
      return;
    }

    if (poder.tipo === "raioAzul") {
      ctx.fillStyle = "rgba(77,171,247,.3)"; ctx.fillRect(poder.x - 8, poder.y - 7, poder.w + 16, poder.h + 14);
      ctx.fillStyle = "#4dabf7";
      ctx.beginPath(); ctx.moveTo(poder.x, poder.y + 8); ctx.lineTo(poder.x + 22, poder.y);
      ctx.lineTo(poder.x + 16, poder.y + 10); ctx.lineTo(poder.x + poder.w, poder.y + 14);
      ctx.lineTo(poder.x + 28, poder.y + poder.h); ctx.closePath(); ctx.fill();
      return;
    }

    if (poder.tipo === "chamaYoshi") {
      ctx.fillStyle = "rgba(81,216,138,.25)";
      ctx.beginPath(); ctx.arc(poder.x + 20, poder.y + 17, 24, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = "#51d88a";
      ctx.beginPath(); ctx.moveTo(poder.x, poder.y + 17); ctx.lineTo(poder.x + 20, poder.y);
      ctx.lineTo(poder.x + poder.w, poder.y + 17); ctx.lineTo(poder.x + 20, poder.y + poder.h); ctx.closePath(); ctx.fill();
      ctx.fillStyle = "#f7c948"; ctx.fillRect(poder.x + 20, poder.y + 11, 14, 12);
      return;
    }

    if (poder.tipo === "bolaOuroPlayer") {
      ctx.fillStyle = "rgba(255,212,59,.28)";
      ctx.beginPath(); ctx.arc(poder.x + 17, poder.y + 17, 23, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = "#ffd43b";
      ctx.beginPath(); ctx.arc(poder.x + 17, poder.y + 17, 16, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = "#fff3bf"; ctx.lineWidth = 3; ctx.stroke();
      ctx.fillStyle = "#7f5539"; ctx.fillRect(poder.x + 13, poder.y + 13, 8, 8);
      return;
    }

    if (poder.tipo === "expelliarmus") {
      ctx.save();
      ctx.globalAlpha = 0.88;
      ctx.fillStyle = "rgba(239,71,111,.3)";
      ctx.fillRect(poder.x - 8, poder.y - 6, poder.w + 16, poder.h + 12);
      ctx.fillStyle = "#ef476f";
      ctx.fillRect(poder.x, poder.y + 4, poder.w, 6);
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(poder.x + 8, poder.y + 6, poder.w - 18, 2);
      ctx.restore();
      return;
    }

    if (poder.tipo === "patrono") {
      ctx.save();
      ctx.globalAlpha = 0.78;
      ctx.fillStyle = "rgba(116,192,252,.3)";
      ctx.fillRect(poder.x - 8, poder.y - 8, poder.w + 16, poder.h + 16);
      ctx.fillStyle = "#74c0fc";
      ctx.fillRect(poder.x + 10, poder.y + 10, 34, 20);
      ctx.fillRect(poder.x + 36, poder.y + 3, 14, 16);
      ctx.fillRect(poder.x + 40, poder.y - 4, 4, 10);
      ctx.fillRect(poder.x + 47, poder.y - 4, 4, 10);
      ctx.fillRect(poder.x + 12, poder.y + 28, 6, 10);
      ctx.fillRect(poder.x + 34, poder.y + 28, 6, 10);
      ctx.fillStyle = "#f7f3de";
      ctx.fillRect(poder.x + 43, poder.y + 9, 3, 3);
      ctx.restore();
      return;
    }

    if (poder.tipo === "pomoDourado") {
      ctx.fillStyle = "rgba(255,212,59,.28)";
      ctx.beginPath(); ctx.arc(poder.x + 12, poder.y + 9, 15, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = "#ffd43b";
      ctx.beginPath(); ctx.arc(poder.x + 12, poder.y + 9, 8, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = "#f7f3de";
      ctx.fillRect(poder.x - 5, poder.y + 3, 10, 4);
      ctx.fillRect(poder.x + 19, poder.y + 3, 10, 4);
      ctx.fillRect(poder.x - 2, poder.y, 5, 10);
      ctx.fillRect(poder.x + 21, poder.y, 5, 10);
      return;
    }

    if (poder.tipo === "espadaRanger") {
      ctx.save();
      ctx.globalAlpha = 0.82;
      ctx.fillStyle = "#ef233c";
      ctx.beginPath();
      ctx.moveTo(poder.x, poder.y + poder.h / 2);
      ctx.lineTo(poder.x + poder.w, poder.y);
      ctx.lineTo(poder.x + poder.w - 12, poder.y + poder.h / 2);
      ctx.lineTo(poder.x + poder.w, poder.y + poder.h);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = "#ffffff";
      ctx.lineWidth = 3;
      ctx.stroke();
      ctx.restore();
      return;
    }

    if (poder.tipo === "endrickBanco") {
      ctx.fillStyle = "#7f5539";
      ctx.fillRect(poder.x, poder.y + 32, poder.w, 8);
      ctx.fillRect(poder.x + 6, poder.y + 40, 7, 6);
      ctx.fillRect(poder.x + poder.w - 13, poder.y + 40, 7, 6);
      ctx.fillStyle = "#51d88a";
      ctx.fillRect(poder.x + 24, poder.y + 14, 20, 20);
      ctx.fillStyle = "#f1b48b";
      ctx.fillRect(poder.x + 26, poder.y, 16, 14);
      ctx.fillStyle = "#111111";
      ctx.fillRect(poder.x + 24, poder.y - 3, 20, 5);
      ctx.fillRect(poder.x + 26, poder.y + 30, 7, 6);
      ctx.fillRect(poder.x + 39, poder.y + 30, 7, 6);
      ctx.fillStyle = "#f7c948";
      ctx.font = "bold 8px monospace";
      ctx.fillText("ENDRICK", poder.x + 15, poder.y + 28);
      return;
    }

    if (poder.tipo === "esferaDragao") {
      ctx.save();
      const pulso = 1 + Math.sin(frame / 4) * 0.08;
      ctx.translate(poder.x + poder.w / 2, poder.y + poder.h / 2);
      ctx.scale(pulso, pulso);
      ctx.fillStyle = "rgba(255, 214, 59, 0.28)";
      ctx.beginPath();
      ctx.arc(0, 0, 20, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#ff8c00";
      ctx.beginPath();
      ctx.arc(0, 0, 14, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = "#ffd43b";
      ctx.lineWidth = 3;
      ctx.stroke();
      ctx.fillStyle = "#d90429";
      const total = Math.min(7, poder.estrelas || 1);
      for (let s = 0; s < total; s++) {
        const angulo = (Math.PI * 2 * s) / total - Math.PI / 2;
        ctx.fillRect(Math.cos(angulo) * 7 - 1.5, Math.sin(angulo) * 7 - 1.5, 3, 3);
      }
      ctx.restore();
      return;
    }

    if (poder.tipo === "buffonCR7") {
      ctx.fillStyle = "rgba(116,192,252,0.25)";
      ctx.fillRect(poder.x - 4, poder.y - 4, poder.w + 8, poder.h + 8);
      ctx.fillStyle = "#f1b48b";
      ctx.fillRect(poder.x + 7, poder.y, 16, 13);
      ctx.fillStyle = "#111111";
      ctx.fillRect(poder.x + 5, poder.y - 3, 20, 5);
      ctx.fillStyle = "#212529";
      ctx.fillRect(poder.x + 5, poder.y + 14, 20, 23);
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(poder.x + 12, poder.y + 17, 6, 15);
      ctx.fillStyle = "#74c0fc";
      ctx.fillRect(poder.x, poder.y + 17, 6, 8);
      ctx.fillRect(poder.x + 24, poder.y + 17, 6, 8);
      ctx.fillStyle = "#111111";
      ctx.fillRect(poder.x + 6, poder.y + 36, 7, 11);
      ctx.fillRect(poder.x + 18, poder.y + 36, 7, 11);
      return;
    }

    if (poder.tipo === "corteEsqueleto") {
      ctx.save();
      ctx.strokeStyle = "#ffffff";
      ctx.lineWidth = 5;
      ctx.beginPath();
      const esquerda = poder.vx < 0;
      ctx.arc(
        poder.x + poder.w / 2,
        poder.y + poder.h / 2,
        24,
        esquerda ? Math.PI * 0.55 : -Math.PI * 0.45,
        esquerda ? Math.PI * 1.45 : Math.PI * 0.45
      );
      ctx.stroke();
      ctx.strokeStyle = "#adb5bd";
      ctx.lineWidth = 2;
      ctx.strokeRect(poder.x, poder.y, poder.w, poder.h);
      ctx.restore();
      return;
    }

    if (poder.tipo === "sanduichePresunto") {
      ctx.fillStyle = "#e9c46a";
      ctx.fillRect(poder.x, poder.y, poder.w, poder.h);
      ctx.fillStyle = "#ef476f";
      ctx.fillRect(poder.x + 3, poder.y + 6, poder.w - 6, 5);
      ctx.fillStyle = "#fff3bf";
      ctx.fillRect(poder.x + 4, poder.y + 2, poder.w - 8, 4);
      ctx.strokeStyle = "#7f5539";
      ctx.strokeRect(poder.x, poder.y, poder.w, poder.h);
      return;
    }

    if (poder.tipo === "barrilChaves") {
      ctx.fillStyle = "#5c2f12";
      ctx.fillRect(poder.x, poder.y, poder.w, poder.h);
      ctx.fillStyle = "#9c551f";
      ctx.fillRect(poder.x + 5, poder.y + 3, poder.w - 10, poder.h - 6);
      ctx.fillStyle = "#2b2118";
      ctx.fillRect(poder.x, poder.y + 6, poder.w, 5);
      ctx.fillRect(poder.x, poder.y + poder.h - 11, poder.w, 5);
      ctx.fillStyle = "#d08c45";
      ctx.fillRect(poder.x + 10, poder.y + 13, poder.w - 20, 10);
      return;
    }

    if (poder.tipo === "sucoTamarindo") {
      ctx.fillStyle = "rgba(156, 102, 68, 0.28)";
      ctx.fillRect(poder.x - 5, poder.y - 4, poder.w + 10, poder.h + 8);
      ctx.fillStyle = "#9c6644";
      ctx.fillRect(poder.x, poder.y, poder.w, poder.h);
      ctx.fillStyle = "#d4a373";
      ctx.fillRect(poder.x + 5, poder.y + 2, poder.w - 12, 3);
      return;
    }

    if (poder.tipo === "jequiti") {
      ctx.fillStyle = "rgba(255,135,135,0.25)";
      ctx.fillRect(poder.x - 4, poder.y - 4, poder.w + 8, poder.h + 8);
      ctx.fillStyle = "#ff8fab";
      ctx.fillRect(poder.x + 2, poder.y + 7, poder.w - 4, poder.h - 7);
      ctx.fillStyle = "#ffd6e0";
      ctx.fillRect(poder.x + 5, poder.y + 10, poder.w - 10, 8);
      ctx.fillStyle = "#f7c948";
      ctx.fillRect(poder.x + 6, poder.y, poder.w - 12, 8);
      return;
    }

    if (poder.tipo === "microfoneSilvio") {
      ctx.save();
      ctx.translate(poder.x + poder.w / 2, poder.y + poder.h / 2);
      ctx.rotate(frame * 0.18);
      ctx.fillStyle = "#adb5bd";
      ctx.fillRect(-15, -5, 12, 10);
      ctx.fillStyle = "#20252c";
      ctx.fillRect(-3, -2, 20, 5);
      ctx.restore();
      return;
    }

    if (poder.tipo === "bicicletaCR7") {
      ctx.save();
      ctx.translate(poder.x + poder.w / 2, poder.y + poder.h / 2);
      ctx.rotate((frame * 0.22) * (poder.vx >= 0 ? 1 : -1));
      ctx.strokeStyle = "#f7f3de";
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.arc(-14, 7, 9, 0, Math.PI * 2);
      ctx.arc(14, 7, 9, 0, Math.PI * 2);
      ctx.moveTo(-14, 7);
      ctx.lineTo(-2, -7);
      ctx.lineTo(7, 7);
      ctx.lineTo(-14, 7);
      ctx.moveTo(-2, -7);
      ctx.lineTo(14, 7);
      ctx.stroke();
      ctx.fillStyle = "#ffd43b";
      ctx.fillRect(-5, -11, 13, 4);
      ctx.restore();
      return;
    }

    if (poder.tipo === "placaInjustica") {
      ctx.fillStyle = "rgba(0, 0, 0, 0.32)";
      ctx.fillRect(poder.x - 4, poder.y - 4, poder.w + 8, poder.h + 8);
      ctx.fillStyle = "#f7f3de";
      ctx.fillRect(poder.x, poder.y, poder.w, poder.h);
      ctx.strokeStyle = "#e03131";
      ctx.lineWidth = 4;
      ctx.strokeRect(poder.x + 2, poder.y + 2, poder.w - 4, poder.h - 4);
      ctx.fillStyle = "#111111";
      ctx.font = "bold 13px monospace";
      ctx.textAlign = "center";
      ctx.fillText("QUEREMOS", poder.x + poder.w / 2, poder.y + 20);
      ctx.fillText("INJUSTI\u00c7A", poder.x + poder.w / 2, poder.y + 37);
      ctx.textAlign = "left";
      return;
    }

    if (poder.tipo === "celular") {
      ctx.fillStyle = "rgba(0, 0, 0, 0.3)";
      ctx.fillRect(poder.x - 3, poder.y - 3, poder.w + 6, poder.h + 6);
      ctx.fillStyle = "#20252c";
      ctx.fillRect(poder.x, poder.y, poder.w, poder.h);
      ctx.fillStyle = "#74c0fc";
      ctx.fillRect(poder.x + 3, poder.y + 4, poder.w - 6, poder.h - 9);
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(poder.x + 7, poder.y + 6, 4, 4);
      return;
    }

    if (poder.tipo === "bolaOuro") {
      ctx.fillStyle = "rgba(255, 212, 59, 0.28)";
      ctx.fillRect(poder.x - 5, poder.y - 5, poder.w + 10, poder.h + 10);
      ctx.fillStyle = "#9f6800";
      ctx.fillRect(poder.x, poder.y, poder.w, poder.h);
      ctx.fillStyle = "#ffd43b";
      ctx.fillRect(poder.x + 2, poder.y + 2, poder.w - 4, poder.h - 4);
      ctx.fillStyle = "#fff3bf";
      ctx.fillRect(poder.x + 5, poder.y + 4, 5, 5);
      return;
    }

    if (poder.tipo === "genkiDama") {
      ctx.fillStyle = "rgba(116, 192, 252, 0.32)";
      ctx.fillRect(poder.x - 7, poder.y - 7, poder.w + 14, poder.h + 14);
      ctx.fillStyle = "#4dabf7";
      ctx.fillRect(poder.x, poder.y, poder.w, poder.h);
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(poder.x + 5, poder.y + 5, poder.w - 10, poder.h - 10);
      return;
    }

    if (poder.tipo === "muletaPower") {
      ctx.save();
      ctx.translate(poder.x + poder.w / 2, poder.y + poder.h / 2);
      ctx.rotate(frame * 0.22 * (poder.vx > 0 ? 1 : -1));
      ctx.strokeStyle = "#d0d7de";
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(-9, -11); ctx.lineTo(5, 11); ctx.lineTo(10, 11);
      ctx.moveTo(-12, -8); ctx.lineTo(-5, -13);
      ctx.stroke();
      ctx.restore();
      return;
    }

    if (poder.tipo === "bolaFogoNeymar") {
      ctx.fillStyle = "rgba(255,107,0,.3)";
      ctx.fillRect(poder.x - 7, poder.y - 7, poder.w + 14, poder.h + 14);
      ctx.fillStyle = "#e03131";
      ctx.fillRect(poder.x, poder.y, poder.w, poder.h);
      ctx.fillStyle = "#ff922b";
      ctx.fillRect(poder.x + 4, poder.y + 4, poder.w - 8, poder.h - 8);
      ctx.fillStyle = "#fff3bf";
      ctx.fillRect(poder.x + 9, poder.y + 8, 7, 7);
      return;
    }

    if (poder.tipo === "brunaMarquezine") {
      ctx.fillStyle = "rgba(255,143,171,.28)";
      ctx.fillRect(poder.x - 5, poder.y - 5, poder.w + 10, poder.h + 10);
      ctx.fillStyle = "#5c2e12";
      ctx.fillRect(poder.x + 5, poder.y, 18, 12);
      ctx.fillStyle = "#f1b48b";
      ctx.fillRect(poder.x + 7, poder.y + 8, 14, 11);
      ctx.fillStyle = "#ff8fab";
      ctx.fillRect(poder.x + 3, poder.y + 19, 22, 15);
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(poder.x + 8, poder.y + 22, 12, 4);
      return;
    }

    ctx.fillStyle = "rgba(255, 255, 255, 0.25)";
    ctx.fillRect(poder.x - 3, poder.y - 3, poder.w + 6, poder.h + 6);
    ctx.fillStyle = poder.cor;
    ctx.fillRect(poder.x, poder.y, poder.w, poder.h);
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(poder.x + 4, poder.y + 3, Math.max(3, poder.w - 8), 3);
  });
}

function criarMeteoro() {
  const intensidade = faseAtual >= 8 ? 1.45 : faseAtual >= 5 ? 1.1 : 1;
  meteoros.push({
    x: 90 + Math.random() * 780,
    y: -34,
    w: 22 + Math.random() * 12,
    h: 22 + Math.random() * 12,
    vx: (Math.random() - 0.5) * 2.6 * intensidade,
    vy: (4.8 + Math.random() * 2.6) * intensidade
  });
}

function atualizarMeteoros() {
  const fase = fases[faseAtual];
  if (faseAtual < 5 || fase.tema !== "vulcao") {
    meteoros.length = 0;
    return;
  }

  const intervalo = Math.max(42, 86 - faseAtual * 4);
  if (frame % intervalo === 0) criarMeteoro();

  for (let i = meteoros.length - 1; i >= 0; i--) {
    const meteoro = meteoros[i];
    meteoro.x += meteoro.vx * AJUSTE_VELOCIDADE_JOGAVEL * AJUSTE_METEORO_JOGAVEL;
    meteoro.y += meteoro.vy * AJUSTE_VELOCIDADE_JOGAVEL * AJUSTE_METEORO_JOGAVEL;
    meteoro.vy += 0.055;

    if (colisao(joao, meteoro)) {
      mostrarAviso("Meteoro de lava! Sem descanso depois da fase 6.");
      tocarSom("dano");
      tremor = 26;
      criarParticulas(joao.x + joao.w / 2, joao.y + joao.h / 2, "#ff6b00", 36);
      resetarPersonagens();
      return;
    }

    if (meteoro.y > canvas.height + 40) meteoros.splice(i, 1);
  }
}

function tratarColisaoVilao(jogador, vilao) {
  if (vilao.morto || jogador.invencivel > 0 || !colisao(jogador, vilao)) return;

  const veioDeCima = jogador.velY > 0 && jogador.prevY + jogador.h <= vilao.y + 14;

  const ehChefe = ehChefeVilao(vilao);

  if (mandibuProtegido(vilao)) {
    jogador.velY = -9;
    jogador.invencivel = 24;
    criarParticulas(vilao.x + vilao.w / 2, vilao.y + 18, "#74c0fc", 24);
    tocarSom("pisao");
    mostrarAviso("Mandibu ainda tem armadura: sobreviva ate 60 segundos!");
    return;
  }

  if (ehChefe && veioDeCima && vilao.invencivel <= 0) {
    vilao.vida--;
    vilao.invencivel = 42;
    jogador.invencivel = 24;
    jogador.velY = jogador.montado ? -14 : -11;
    jogador.noChao = false;
    tocarSom("pisao");
    tremor = 10;
    criarParticulas(vilao.x + vilao.w / 2, vilao.y + 12, "#ff6b00", 34);

    if (vilao.vida <= 0) {
      vilao.morto = true;
      tremor = 28;
      tocarSom("vitoria");
      criarParticulas(vilao.x + vilao.w / 2, vilao.y + vilao.h / 2, "#ffd166", 60);
      mostrarAviso((vilao.nome || "O rei") + " caiu!");
    } else {
      mostrarAviso("Chefe atingido! Vida: " + vilao.vida + "/" + vilao.vidaMax);
    }
    return;
  }

  if (ehChefe && jogador.grande && vilao.invencivel <= 0) {
    vilao.vida -= 2;
    vilao.invencivel = 50;
    jogador.invencivel = 55;
    tocarSom("pisao");
    tremor = 16;
    criarParticulas(vilao.x + vilao.w / 2, vilao.y + vilao.h / 2, "#ff8fab", 42);

    if (vilao.vida <= 0) {
      vilao.morto = true;
      tocarSom("vitoria");
      mostrarAviso("O cogumelo derrotou " + (vilao.nome || "o rei") + "!");
    } else {
      mostrarAviso("Golpe forte no chefe! Vida: " + vilao.vida + "/" + vilao.vidaMax);
    }
    return;
  }

  if (ehChefe) {
    mostrarAviso("Pule na cabeca de " + (vilao.nome || "o rei") + "!");
    tocarSom("dano");
    tremor = 22;
    criarParticulas(vilao.x + vilao.w / 2, vilao.y + vilao.h / 2, "#ef476f", 26);
    derrotarJogadores("Um jogador encostou no chefão!");
    return;
  }

  if (veioDeCima) {
    vilao.morto = true;
    jogador.velY = jogador.montado ? -12 : -9.5;
    jogador.noChao = false;
    tocarSom("pisao");
    criarParticulas(vilao.x + vilao.w / 2, vilao.y + 10, "#f7c948", 22);
    mostrarAviso("Vilao derrotado!");
    return;
  }

  if (jogador.grande) {
    vilao.morto = true;
    jogador.invencivel = 45;
    tocarSom("pisao");
    criarParticulas(vilao.x + vilao.w / 2, vilao.y + vilao.h / 2, "#ff8fab", 26);
    mostrarAviso("O cogumelo derrubou o vilao!");
    return;
  }

  mostrarAviso("Suba por cima para derrotar o vilao!");
  tocarSom("dano");
  tremor = 18;
  criarParticulas(vilao.x + vilao.w / 2, vilao.y + vilao.h / 2, "#ef476f", 18);
  derrotarJogadores("Um jogador foi atingido pelo vilão!");
}

function coletarMoedas() {
  const fase = fases[faseAtual];

  fase.moedas.forEach(m => {
    const moedaBox = { x: m.x - 12, y: m.y - 12, w: 24, h: 24 };

    const coletor = jogadoresAtivos().find(jogador => colisao(jogador, moedaBox));
    if (!m.coletada && coletor) {
      m.coletada = true;
      moedas++;
      moedasLoja++;
      salvarCarteira();
      tocarSom("moeda");
      criarParticulas(m.x, m.y, "#ffd43b", 12);
      ganharExperiencia(2);
      if (coletor === joao && personagemAtual === "neymar") {
        mostrarAviso("PARABÉNS, VC TRAIU MAIS UMA ESPOSA");
      }
    }
  });
}

function atualizarPremioSilvio() {
  const fase = fases[faseAtual];
  if (!fase.premio50) return;
  const silvio = fase.inimigos.find(inimigo => inimigo.tipo === "silvioBoss");
  if (silvio?.morto) fase.premio50.ativo = true;
  if (!fase.premio50.ativo || fase.premio50.coletado || !colisao(joao, fase.premio50)) return;

  fase.premio50.coletado = true;
  moedas += 50;
  moedasLoja += 50;
  salvarCarteira();
  tocarSom("moeda");
  criarParticulas(fase.premio50.x + 24, fase.premio50.y + 12, "#51d88a", 50);
  mostrarAviso("Silvio soltou R$ 50! Prêmio guardado na carteira.");
}

function coletarDiamantes() {
  const fase = fases[faseAtual];
  (fase.premiosDiamante || []).forEach(diamante => {
    if (diamante.coletado || !colisao(joao, diamante)) return;
    diamante.coletado = true;
    diamantes++;
    salvarCarteira();
    tocarSom("moeda");
    criarParticulas(diamante.x + 12, diamante.y + 14, "#74c0fc", 30);
    mostrarAviso("Diamante conquistado! Guarde para a futura loja.");
  });
}

function comerCogumelos() {
  const fase = fases[faseAtual];

  fase.cogumelos.forEach(c => {
    const box = { x: c.x - 18, y: c.y - 14, w: 40, h: 42 };
    const comedor = colisao(joao, box) ? joao : null;

    if (!c.coletado && comedor) {
      c.coletado = true;
      comedor.grande = true;
      comedor.poderTempo = 1200;
      comedor.invencivel = Math.max(comedor.invencivel, 80);
      tocarSom("cogumelo");
      criarParticulas(c.x, c.y, "#ff8fab", 28);
      mostrarAviso(comedor.nome + " comeu o cogumelo e cresceu!");
    }
  });
}

function salvarYoshi() {
  const fase = fases[faseAtual];
  const yoshiBox = { x: fase.yoshi.x - 16, y: fase.yoshi.y - 20, w: 94, h: 80 };
  const candidatos = multiplayerAtivo ? [joao, jogador2] : [joao];

  candidatos.forEach(p => {
    if (!colisao(p, yoshiBox)) return;

    if (!fase.yoshi.montadoPor && !p.montado && !p.nuvem) {
      p.montado = true;
      p.montaria = "yoshi";
      p.superMario = false;
      fase.yoshi.montadoPor = p.nome;
    }

    if (!fase.yoshi.salvo) {
      fase.yoshi.salvo = true;
      yoshis++;
    }
    tocarSom("yoshi");
    criarParticulas(fase.yoshi.x + 30, fase.yoshi.y + 28, "#51d88a", 24);
    mostrarAviso(p.montaria === "yoshi" ? p.nome + " montou no Yoshi Gigante! Use GOLPE para lançar esferas." : p.nome + " resgatou o Yoshi!");
  });
}

function montarMufasa() {
  const fase = fases[faseAtual];
  if (!fase.mufasa || joao.montado || joao.nuvem) return;
  const box = { x: fase.mufasa.x - 4, y: fase.mufasa.y, w: fase.mufasa.w + 8, h: fase.mufasa.h };
  if (!colisao(joao, box)) return;

  fase.mufasa.salvo = true;
  fase.mufasa.montadoPor = joao.nome;
  joao.montado = true;
  joao.montaria = "mufasa";
  joao.invencivel = Math.max(joao.invencivel, 90);
  tocarSom("yoshi");
  criarParticulas(fase.mufasa.x + 34, fase.mufasa.y + 28, "#d88a3d", 34);
  mostrarAviso(joao.nome + " subiu no Mufasa!");
}

function coletarAliadosEspeciais() {
  const fase = fases[faseAtual];

  if (fase.cr7 && !fase.cr7.salvo) {
    const box = { x: fase.cr7.x, y: fase.cr7.y, w: 44, h: 62 };
    if (colisao(joao, box)) {
      fase.cr7.salvo = true;
      joao.grande = true;
      joao.poderTempo = 1500;
      tocarSom("gol");
      criarParticulas(fase.cr7.x + 22, fase.cr7.y + 30, "#f7f3de", 34);
      mostrarAviso("CR7 entrou no time! Super impulso ativado.");
    }
  }

  if (fase.miaw && !fase.miaw.salvo) {
    const box = { x: fase.miaw.x, y: fase.miaw.y, w: 50, h: 54 };
    if (colisao(joao, box)) {
      fase.miaw.salvo = true;
      joao.invencivel = 160;
      tocarSom("miaw");
      criarParticulas(fase.miaw.x + 22, fase.miaw.y + 26, "#ffd43b", 42);
      mostrarAviso("Miaw eletrico: miau!");
    }
  }
}

function montarNuvemGoku() {
  const fase = fases[faseAtual];
  if ((joao.avatar !== "goku" && joao.avatar !== "harry") || joao.nuvem || joao.montado) return;

  const nuvem = nuvemGokuDaFase(fase);
  const box = { x: nuvem.x, y: nuvem.y, w: nuvem.w, h: nuvem.h };

  if (colisao(joao, box)) {
    joao.nuvem = true;
    joao.superSayajin = joao.avatar === "goku";
    joao.invencivel = Math.max(joao.invencivel, 120);
    tocarSom("vitoria");
    criarParticulas(nuvem.x + nuvem.w / 2, nuvem.y + 16, "#ffd43b", 44);
    mostrarAviso(joao.avatar === "harry" ? "Harry Potter subiu na vassoura e agora pode voar!" : "Goku subiu na nuvem e virou Super Sayajin!");
  }
}

function tocarLava(jogador) {
  const fase = fases[faseAtual];
  if (fase.tachas) return;
  if (fase.tema !== "vulcao") return;

  if (jogador.y + jogador.h > 488) {
    mostrarAviso(jogador.nome + " caiu no mar de fogo!");
    tocarSom("dano");
    tremor = 24;
    criarParticulas(jogador.x + jogador.w / 2, 500, "#ff3d00", 30);
    resetarPersonagens();
  }
}

function tocarTachas(jogador) {
  const fase = fases[faseAtual];
  if (!fase.tachas) return;

  const acertou = fase.tachas.some(tacha => colisao(jogador, tacha));
  if (!acertou) return;

  mostrarAviso(jogador.nome + " caiu no chao de tachas!");
  tocarSom("dano");
  tremor = 26;
  criarParticulas(jogador.x + jogador.w / 2, jogador.y + jogador.h, "#d0d7de", 30);
  resetarPersonagens();
}

function tocarArmadilhasOcultas(jogador) {
  const fase = fases[faseAtual];
  const armadilha = (fase.armadilhas || []).find(item => !item.ativada && colisao(jogador, item));
  if (!armadilha) return;

  armadilha.ativada = true;
  armadilha.revelada = true;
  criarParticulas(armadilha.x + armadilha.w / 2, armadilha.y, armadilha.cor, 32);
  tremor = 18;
  tocarSom(armadilha.tipo === "mola" ? "pulo" : "dano");
  mostrarAviso("ARMADILHA: " + armadilha.nome + "!");

  if (armadilha.tipo === "mola") {
    jogador.velY = -18;
    jogador.noChao = false;
    return;
  }
  if (armadilha.tipo === "gelo") {
    jogador.x = Math.max(0, Math.min(canvas.width - jogador.w, jogador.x + jogador.direcao * 110));
    jogador.invencivel = Math.max(jogador.invencivel, 30);
    return;
  }
  if (armadilha.tipo === "areia") {
    jogador.velX = 0;
    jogador.velY = 4;
    jogador.invencivel = Math.max(jogador.invencivel, 35);
    return;
  }
  if (armadilha.tipo === "portalFalso") {
    jogador.x = 52;
    jogador.y = 422;
    jogador.velX = 0;
    jogador.velY = 0;
    return;
  }
  if (armadilha.tipo === "fantasma") {
    jogador.direcao *= -1;
    jogador.x = Math.max(0, Math.min(canvas.width - jogador.w, jogador.x - jogador.direcao * 90));
    jogador.invencivel = Math.max(jogador.invencivel, 40);
    return;
  }

  resetarPersonagens();
}

function verificarPortal() {
  const fase = fases[faseAtual];

  if (colisao(joao, fase.portal)) {
    if (fase.bonus) {
      const pendentes = fase.destrutiveis.filter(objeto => !objeto.quebrado);
      if (pendentes.length > 0) {
        mostrarAviso("Destrua o carro e o barril para liberar a próxima fase!");
        return;
      }
      if (fases[faseAtual + 1]) {
        fases[faseAtual + 1].bonusTempoChefe += fase.bonusTempoChefe;
      }
    }
    if (fase.labirinto) {
      const restantes = fase.moedas.filter(moeda => !moeda.coletada).length;
      if (restantes > 0) {
        mostrarAviso("Ainda faltam " + restantes + " moedas no labirinto!");
        return;
      }
    }
    const chefeVivo = fase.inimigos.some(i => ehChefeVilao(i) && !i.morto);

    if (chefeVivo) {
      mostrarAviso("Derrote todos os chefões para conquistar o troféu!");
      return;
    }

    let textoBonus = "";
    if (!fase.bonus && !fase.bonusSobrevivenciaColetado && faseAtual >= 4) {
      const premioSobrevivencia = 8 + faseAtual * 2;
      moedas += premioSobrevivencia;
      moedasLoja += premioSobrevivencia;
      if (faseAtual % 3 === 0) diamantes++;
      fase.bonusSobrevivenciaColetado = true;
      salvarCarteira();
      textoBonus = " Bônus de sobrevivência: +" + premioSobrevivencia + " moedas" + (faseAtual % 3 === 0 ? " e +1 diamante!" : "!");
    }
    mostrarAviso("Troféu conquistado: " + fase.campeonato.nome + "!" + textoBonus);
    ganharExperiencia(30 + faseAtual * 5);
    recordeFase = Math.max(recordeFase, faseAtual + 1);
    salvarCarteira();

    faseAtual++;

    if (faseAtual >= fases.length) {
      venceu = true;
      tocarSom("vitoria");
      mensagem.innerText = "Vitória! " + joao.nome + " conquistou a Copa do Mundo.";
    } else {
      mensagem.innerText = fases[faseAtual].nome;
      bannerFase = 160;
      resetarTimerChefe();
      tocarSom("portal");
      criarParticulas(fase.portal.x + 28, fase.portal.y + 30, "#c77dff", 26);
      resetarPersonagens();
      mostrarAviso(textoBonus || "Nova fase desbloqueada!");
    }
  }
}

function telaVitoria() {
  ctx.fillStyle = "#101318";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  desenharTorres();
  desenharTrofeu({ x: 462, y: 292, nome: "COPA DO MUNDO", cor: "#ffd43b" });

  ctx.fillStyle = "#f7c948";
  ctx.font = "48px monospace";
  ctx.fillText("VOCE VENCEU!", 296, 174);

  ctx.fillStyle = "#f7f3de";
  ctx.font = "22px monospace";
  ctx.fillText(joao.nome + " é campeão do mundo!", 300, 234);
  ctx.fillText("Moedas coletadas: " + moedas, 326, 278);
  ctx.fillText("Yoshis resgatados: " + yoshis + "/" + fases.length, 332, 314);
  ctx.fillText("Clique em Reiniciar para jogar de novo.", 248, 392);
}

function telaGameOver() {
  desenharFundo(fases[faseAtual]);
  fases[faseAtual].plataformas.forEach(desenharPlataforma);
  if (modoVersus) {
    desenharPainelCentral("K.O.", [
      (vidaVersusP1 > 0 ? joao.nome : jogador2.nome) + " venceu o duelo!",
      "Clique em Reiniciar para a revanche",
      "Alterne o botão VERSUS para voltar à campanha"
    ], "#ffd43b");
    return;
  }
  desenharPainelCentral("GAME OVER", [
    "Os chefões não foram derrotados no tempo disponível",
    "Pressione ENTER ou clique em Reiniciar",
    "CR7 grita SIUUUU, cresce e lança bicicletas"
  ], "#ef476f");
}

function desenharPainelCentral(titulo, linhas, cor = "#f7c948") {
  ctx.fillStyle = "rgba(8, 10, 15, 0.84)";
  ctx.fillRect(168, 116, 624, 300);
  ctx.strokeStyle = "rgba(255, 255, 255, 0.28)";
  ctx.lineWidth = 2;
  ctx.strokeRect(168, 116, 624, 300);
  ctx.fillStyle = "rgba(247, 201, 72, 0.18)";
  ctx.fillRect(188, 136, 584, 6);

  ctx.fillStyle = cor;
  ctx.font = "44px monospace";
  const tituloW = ctx.measureText(titulo).width;
  ctx.fillText(titulo, 480 - tituloW / 2, 196);

  ctx.fillStyle = "#f7f3de";
  ctx.font = "20px monospace";
  linhas.forEach((linha, i) => {
    const largura = ctx.measureText(linha).width;
    ctx.fillText(linha, 480 - largura / 2, 250 + i * 34);
  });
}

function telaInicio() {
  desenharFundo(fases[0]);
  fases[0].plataformas.forEach(desenharPlataforma);
  desenharSpriteYoshi(452, 320, 1, true);
  desenharSoldado({ x: 250, y: 438, w: 42, h: 42, direcao: 1 });
  desenharCavaleiro({ x: 666, y: 430, w: 48, h: 50, direcao: -1 });
  desenharPainelCentral("REINO PIXEL", [
    "Escolha um personagem e encare fases extremas",
    "Coma cogumelos, salve aliados e pise nos inimigos",
    "Pressione ENTER, ESPACO ou toque nos botoes"
  ]);
}

function telaPausa() {
  desenharFase();
  desenharBoneco(joao);
  desenharParticulas();
  desenharHUD(fases[faseAtual]);
  ctx.fillStyle = "rgba(0, 0, 0, 0.54)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  desenharPainelCentral("PAUSADO", [
    "Pressione P para voltar ao jogo",
    "Derrote os chefões e entre no portal"
  ], "#51d88a");
}

function desenharBannerFase() {
  if (bannerFase <= 0) return;
  bannerFase--;
  const fase = fases[faseAtual];
  ctx.fillStyle = "rgba(0, 0, 0, 0.58)";
  ctx.fillRect(230, 206, 500, 92);
  ctx.strokeStyle = "rgba(255, 255, 255, 0.24)";
  ctx.strokeRect(230, 206, 500, 92);
  ctx.fillStyle = "#f7c948";
  ctx.font = "24px monospace";
  const titulo = "Fase " + (faseAtual + 1) + " de " + fases.length;
  ctx.fillText(titulo, 480 - ctx.measureText(titulo).width / 2, 242);
  ctx.fillStyle = "#f7f3de";
  ctx.font = "18px monospace";
  ctx.fillText(fase.nome, 480 - ctx.measureText(fase.nome).width / 2, 274);
}

function reiniciarJogo() {
  faseAtual = 0;
  moedas = 0;
  pontosDestruicao = 0;
  comboDestruicao = 0;
  comboDestruicaoTempo = 0;
  comboCombate = 0;
  comboCombateTempo = 0;
  faseBonusTimer = 480;
  faseBonusConcluida = false;
  vidaVersusP1 = 100;
  vidaVersusP2 = 100;
  yoshis = 0;
  venceu = false;
  gameOver = false;
  jogoIniciado = true;
  pausado = false;
  aviso = "";
  avisoTempo = 0;
  resetarTimerChefe();
  poderes.length = 0;
  bannerFase = 160;

  fases.forEach(fase => {
    fase.bonusTempoChefe = 0;
    fase.bonusSobrevivenciaColetado = false;
    resetarPlataformasMoveis(fase);
    fase.moedas.forEach(m => {
      m.coletada = false;
    });
    fase.cogumelos.forEach(c => {
      c.coletado = false;
    });
    (fase.armadilhas || []).forEach(armadilha => {
      armadilha.revelada = false;
      armadilha.ativada = false;
    });
    (fase.destrutiveis || []).forEach(objeto => {
      objeto.vida = objeto.vidaMax;
      objeto.quebrado = false;
    });
    (fase.premiosDiamante || []).forEach(diamante => {
      diamante.coletado = false;
    });
    if (fase.premio50) {
      fase.premio50.ativo = false;
      fase.premio50.coletado = false;
    }
    if (fase.cr7) fase.cr7.salvo = false;
    if (fase.miaw) fase.miaw.salvo = false;
    fase.inimigos.forEach(i => {
      i.morto = false;
      i.enfurecido = false;
      if (ehChefeVilao(i)) {
        i.vida = i.vidaMax;
        i.invencivel = 0;
      }
      if (i.tipo === "bossSupremo") {
        i.clones = [];
        i.ultimoClone = null;
      }
      if (i.tipo === "mandibu") i.tempoAtivo = 0;
      if (i.tipo === "chaves") {
        i.ataqueChaves = 0;
        i.cooldownAtaqueChaves = 0;
        i.cooldownSucoChaves = 90;
      }
      if (i.tipo === "silvioBoss") {
        i.cooldownPoder = 45;
        i.proximoPoder = "jequiti";
      }
    });
    fase.yoshi.salvo = false;
    fase.yoshi.montadoPor = null;
    if (fase.mufasa) {
      fase.mufasa.salvo = false;
      fase.mufasa.montadoPor = null;
    }
    (fase.pacmans || []).forEach(pac => {
      if (pac.baseX !== undefined) pac.x = pac.baseX;
      if (pac.baseY !== undefined) pac.y = pac.baseY;
    });
  });

  resetarPersonagens();
  mensagem.innerText = fases[faseAtual].nome;
}

function pixelRect(x, y, w, h) {
  ctx.fillRect(Math.round(x), Math.round(y), Math.round(w), Math.round(h));
}

function loop() {
  frame++;
  if (comboCombateTempo > 0) comboCombateTempo--;
  else comboCombate = 0;
  atualizarPainelMissao();

  if (!jogoIniciado) {
    telaInicio();
    requestAnimationFrame(loop);
    return;
  }

  if (pausado) {
    telaPausa();
    requestAnimationFrame(loop);
    return;
  }

  tocarMusica();

  if (venceu) {
    telaVitoria();
    requestAnimationFrame(loop);
    return;
  }

  if (gameOver) {
    telaGameOver();
    requestAnimationFrame(loop);
    return;
  }

  if (hitStopFrames > 0) {
    hitStopFrames--;
    requestAnimationFrame(loop);
    return;
  }

  atualizarPlataformasMoveis();
  const controlesP1 = multiplayerAtivo
    ? { esquerda: ["a"], direita: ["d"], pulo: ["w"], baixo: ["s"], ataque: ["x", "X"] }
    : { esquerda: ["a", "ArrowLeft"], direita: ["d", "ArrowRight"], pulo: ["w", "ArrowUp"], baixo: ["s", "ArrowDown"], ataque: ["x", "X"] };
  moverPersonagem(joao, controlesP1.esquerda, controlesP1.direita, controlesP1.pulo, controlesP1.baixo);
  if (multiplayerAtivo) moverPersonagem(jogador2, ["ArrowLeft"], ["ArrowRight"], ["ArrowUp"], ["ArrowDown"]);
  atualizarDesafioLabirinto();
  if (gameOver) {
    requestAnimationFrame(loop);
    return;
  }
  atualizarGolpeJogador(joao, controlesP1.ataque);
  if (multiplayerAtivo) atualizarGolpeJogador(jogador2, ["Enter"]);
  if (!modoVersus) {
    tocarArmadilhasOcultas(joao);
    if (multiplayerAtivo) tocarArmadilhasOcultas(jogador2);

    atualizarPoderNeymar();
  atualizarPoderGoku();
  atualizarPoderRoblox();
  atualizarPoderCR7();
  atualizarPoderHarry();
  atualizarPoderChaves();
  atualizarPoderEsqueleto();
  atualizarPoderSilvio();
  atualizarInimigos();
  if (multiplayerAtivo) fases[faseAtual].inimigos.forEach(inimigo => tratarColisaoVilao(jogador2, inimigo));
  lancarPlacaInjusticaGlobal();
  atualizarPoderes();
  atualizarTimerFaseBonus();
  if (gameOver) {
    requestAnimationFrame(loop);
    return;
  }
  atualizarTimerChefe();
  if (gameOver) {
    requestAnimationFrame(loop);
    return;
  }
  atualizarMeteoros();
  tocarLava(joao);
  tocarTachas(joao);
  if (multiplayerAtivo) {
    tocarLava(jogador2);
    tocarTachas(jogador2);
  }
  coletarMoedas();
  coletarDiamantes();
  atualizarPremioSilvio();
  comerCogumelos();
  salvarYoshi();
  montarMufasa();
  coletarAliadosEspeciais();
  montarNuvemGoku();
    verificarPortal();
  }
  if (venceu) {
    requestAnimationFrame(loop);
    return;
  }
  atualizarParticulas();

  ctx.save();
  if (cameraImpacto > 0) {
    const zoom = 1 + cameraImpacto * .006;
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.scale(zoom, zoom);
    ctx.translate(-canvas.width / 2, -canvas.height / 2);
    cameraImpacto--;
  }
  if (tremor > 0) {
    tremor--;
    ctx.translate((Math.random() - 0.5) * 8, (Math.random() - 0.5) * 8);
  }
  desenharFase();
  desenharBoneco(joao);
  if (multiplayerAtivo) desenharBoneco(jogador2);
  desenharParticulas();
  desenharHUD(fases[faseAtual]);
  desenharBannerFase();
  desenharAcabamentoArcade();
  ctx.restore();

  requestAnimationFrame(loop);
}

mensagem.innerText = fases[faseAtual].nome;
atualizarPainelLoja();
resetarPersonagens();
loop();
