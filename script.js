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
const ESCALA_VISUAL_PLAYER = 1.14;
const ALTURA_MINIMA_VOO_GOKU = 96;
const ENERGIA_MAXIMA_VOO_GOKU = 300;
let chefeTimer = null;
let chefeTimerAtivo = false;
let chefeTimerAlvo = null;
let poderNeymarCooldown = 0;
let genkiDamaCooldown = 0;
let poderRobloxCooldown = 0;
let proximoPoderRoblox = "celular";
const botaoSom = document.getElementById("botaoSom");
const activePlayerLabel = document.getElementById("activePlayerLabel");
const deviceMode = document.getElementById("deviceMode");

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

const controlesMobile = { left: "a", jump: "w", right: "d", down: "s" };

document.addEventListener("keydown", event => {
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

const personagensDisponiveis = {
  joao: { nome: "Joao", camisa: "#e63946", calca: "#1d3557", cabelo: "#3b1f0f", avatar: "humano", numero: "" },
  luquinhas: { nome: "Luquinhas", camisa: "#457bff", calca: "#191919", cabelo: "#111111", avatar: "humano", numero: "" },
  cr7: { nome: "CR7", camisa: "#f7f3de", calca: "#d90429", cabelo: "#24130c", avatar: "humano", numero: "7" },
  messi: { nome: "Messi", camisa: "#74c0fc", calca: "#ffffff", cabelo: "#5c2e12", avatar: "humano", numero: "10" },
  yoshi: { nome: "Yoshi", camisa: "#36c96b", calca: "#f7f3de", cabelo: "#36c96b", avatar: "yoshi", numero: "" },
  lobo: { nome: "Lobo", camisa: "#6c757d", calca: "#2b2d42", cabelo: "#495057", avatar: "lobo", numero: "" },
  miaw: { nome: "Miaw", camisa: "#ffd43b", calca: "#fff3bf", cabelo: "#ffd43b", avatar: "miaw", numero: "" },
  neymar: { nome: "Neymar", camisa: "#ffe066", calca: "#2457c5", cabelo: "#f7c948", avatar: "neymar", numero: "10" },
  goku: { nome: "Goku", camisa: "#ff7b00", calca: "#0b5ed7", cabelo: "#111111", avatar: "goku", numero: "" },
  meninoRoblox: { nome: "Menino Roblox", camisa: "#e03131", calca: "#1971c2", cabelo: "#5c2e12", avatar: "meninoRoblox", numero: "R" }
};

function selecionarPersonagem(id) {
  const escolhido = personagensDisponiveis[id] || personagensDisponiveis.joao;
  personagemAtual = id;
  musicaTimer = 0;
  notaMusica = 0;
  joao.nome = escolhido.nome;
  joao.corCamisa = escolhido.camisa;
  joao.corCalca = escolhido.calca;
  joao.cabelo = escolhido.cabelo;
  joao.avatar = escolhido.avatar;
  joao.numero = escolhido.numero;
  sincronizarMusicaGoku(true);
  sincronizarMusicaNeymar(true);

  if (activePlayerLabel) {
    activePlayerLabel.innerText = "Personagem: " + escolhido.nome;
  }
}

selecionarPersonagem("joao");

const fases = [
  {
    nome: "Fase 1 - Menino do Roblox",
    fundo: ["#77c8ff", "#9ee493"],
    tema: "floresta",
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
      criarVilao("meninoRoblox", 416, 428, 1.65, 360, 650)
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
      criarVilao("cavaleiro", 614, 244, 1.8, 570, 700)
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
      criarVilao("cavaleiro", 612, 438, 2.5, 520, 820)
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
    nome: "Fase 6 - Castelo da Princesa",
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
    princesa: { x: 796, y: 180 },
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
  }
];

// Reforcos nas cinco primeiras fases para elevar a dificuldade inicial.
fases[0].inimigos.push(criarVilao("cavaleiro", 730, 436, 2.4, 680, 860));
fases[1].inimigos.push(criarVilao("meninoRoblox", 502, 428, 2.1, 470, 690));
fases[2].inimigos.push(criarVilao("soldado", 456, 438, 3.0, 430, 610));
fases[3].inimigos.push(criarVilao("meninoRoblox", 612, 428, 2.3, 570, 810));
fases[4].inimigos.push(criarVilao("lobo", 748, 448, 3.6, 690, 880));

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
    grande: false,
    poderTempo: 0,
    nuvem: false,
    superSayajin: false,
    energiaVoo: ENERGIA_MAXIMA_VOO_GOKU,
    agachado: false,
    alturaNormal: 58,
    alturaAgachado: 38
  };
}

function criarVilao(tipo, x, y, vel, min, max) {
  const medidas = {
    cavaleiro: { w: 48, h: 50 },
    messi: { w: 42, h: 58 },
    lobo: { w: 58, h: 38 },
    meninoRoblox: { w: 46, h: 58 }
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
    morto: false
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
  return 0.92 + faseAtual * 0.07 + (faseAtual >= 5 ? 0.12 : 0) + (faseAtual >= 9 ? 0.08 : 0);
}

function ehChefeVilao(vilao) {
  return vilao.tipo === "chefe" || vilao.tipo === "rei" || vilao.tipo === "cellbesta" || vilao.tipo === "bossSupremo";
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
    chefeTimer = 1200;
    mostrarAviso("Derrote " + (alvo.nome || "o chefe") + " em 20 segundos!");
  }

  if (!chefeTimerAlvo || chefeTimerAlvo.morto) {
    resetarTimerChefe();
    return;
  }

  chefeTimer--;

  if (chefeTimer <= 0) {
    gameOver = true;
    pausado = false;
    tocarSom("dano");
    tremor = 30;
    mensagem.innerText = "Game over! O vilao venceu.";
  }
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
  if (fase) resetarPlataformasMoveis(fase);
  meteoros.length = 0;
  poderes.length = 0;
  poderNeymarCooldown = 0;
  genkiDamaCooldown = 0;
  poderRobloxCooldown = 0;
  proximoPoderRoblox = "celular";

  joao.x = 52;
  joao.y = 422;
  joao.velX = 0;
  joao.velY = 0;
  joao.invencivel = 80;
  joao.montado = false;
  joao.grande = false;
  joao.poderTempo = 0;
  joao.nuvem = false;
  joao.superSayajin = false;
  joao.energiaVoo = ENERGIA_MAXIMA_VOO_GOKU;
  joao.agachado = false;
  joao.h = joao.alturaNormal;

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

  fase.plataformas.forEach(plataforma => {
    if (!plataforma.movel) return;
    if (plataforma.baseX === undefined) plataforma.baseX = plataforma.x;

    plataforma.prevX = plataforma.x;
    plataforma.x += plataforma.vel * AJUSTE_VELOCIDADE_JOGAVEL;

    if (plataforma.x <= plataforma.min || plataforma.x + plataforma.w >= plataforma.max) {
      plataforma.vel *= -1;
      plataforma.x = Math.max(plataforma.min, Math.min(plataforma.x, plataforma.max - plataforma.w));
    }

    plataforma.dx = plataforma.x - plataforma.prevX;
  });
}

function moverPersonagem(p, esquerda, direita, pulo) {
  p.prevY = p.y;
  p.velX = 0;
  p.andando = false;
  if (p.avatar !== "goku") p.nuvem = false;
  const querAbaixar = teclaAtiva(["s", "ArrowDown"]);

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
    resetarPersonagens();
  }

  if (p.invencivel > 0) p.invencivel--;
  if (p.poderTempo > 0) {
    p.poderTempo--;
    if (p.poderTempo <= 0) p.grande = false;
  }
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

function desenharBoneco(p) {
  const passo = p.andando && p.noChao ? Math.floor(frame / 7) % 2 : 0;
  const piscando = p.invencivel > 0 && Math.floor(frame / 5) % 2 === 0;
  if (piscando) return;

  if (p.avatar === "yoshi") {
    ctx.save();
    ctx.translate(p.x + p.w / 2, p.y + p.h);
    ctx.scale(ESCALA_VISUAL_PLAYER, ESCALA_VISUAL_PLAYER);
    desenharSpriteYoshi(-31, -54, p.direcao, true);
    ctx.restore();
    desenharEtiqueta(p.nome, p.x + p.w / 2, p.y - 10);
    return;
  }

  if (p.avatar === "lobo") {
    ctx.save();
    ctx.translate(p.x + p.w / 2, p.y + p.h);
    ctx.scale(ESCALA_VISUAL_PLAYER, ESCALA_VISUAL_PLAYER);
    desenharSpriteLobo({ x: -29, y: -40, w: 58, h: 38, direcao: p.direcao });
    ctx.restore();
    desenharEtiqueta(p.nome, p.x + p.w / 2, p.y - 10);
    return;
  }

  if (p.avatar === "miaw") {
    ctx.save();
    ctx.translate(p.x + p.w / 2, p.y + p.h);
    ctx.scale(ESCALA_VISUAL_PLAYER, ESCALA_VISUAL_PLAYER);
    desenharMiawEletrico({ x: -24, y: -56, salvo: false, player: true }, p.direcao);
    ctx.restore();
    desenharEtiqueta(p.nome, p.x + p.w / 2, p.y - 10);
    return;
  }

  if (p.avatar === "neymar") {
    desenharNeymarMuletas(p);
    desenharEtiqueta(p.nome + " + muleta power", p.x + p.w / 2, p.y - 10);
    return;
  }

  if (p.avatar === "goku") {
    desenharGokuNuvemDourada(p);
    desenharEtiqueta(p.nuvem ? "Super Goku na nuvem" : "Goku", p.x + p.w / 2, p.y - 10);
    return;
  }

  if (p.avatar === "meninoRoblox") {
    ctx.save();
    ctx.translate(p.x + p.w / 2, p.y + p.h);
    ctx.scale(ESCALA_VISUAL_PLAYER, ESCALA_VISUAL_PLAYER);
    desenharMeninoRoblox({ x: -23, y: -58, w: 46, h: 58, direcao: p.direcao, morto: false });
    ctx.restore();
    return;
  }

  const baseY = p.montado ? p.y - 18 : p.y;
  const escala = (p.grande ? 1.18 : 1) * ESCALA_VISUAL_PLAYER;
  const offsetX = p.grande ? -3 : 0;
  const offsetY = p.grande ? -10 : 0;

  if (p.montado) {
    desenharYoshiMontaria(p);
  }

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

  desenharEtiqueta(p.montado ? p.nome + " + Yoshi" : p.nome, p.x + p.w / 2, baseY - 8);
}

function desenharNeymarMuletas(p) {
  const passo = p.andando && p.noChao ? Math.floor(frame / 6) % 2 : 0;
  const piscando = p.invencivel > 0 && Math.floor(frame / 5) % 2 === 0;
  if (piscando) return;

  const baseY = p.montado ? p.y - 18 : p.y;
  if (p.montado) desenharYoshiMontaria(p);

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

function desenharNuvemGokuSolta(fase) {
  if (joao.avatar !== "goku" || joao.nuvem) return;
  const nuvem = nuvemGokuDaFase(fase);
  const bob = Math.sin(frame / 12) * 2;
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
  const x = yoshi.x;
  const y = yoshi.y + bob;
  desenharSpriteYoshi(x, y, 1, yoshi.salvo);
}

function desenharYoshiMontaria(jogador) {
  const x = jogador.x - 12;
  const y = jogador.y + 22;
  desenharSpriteYoshi(x, y, jogador.direcao, true);
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

  if (i.tipo === "bossSupremo") {
    i.clones.forEach(clone => desenharBossSupremo(clone, true));
    desenharBossSupremo(i, false);
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

  desenharSoldado(i);
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
    desenharEtiqueta("COPIA", i.x + i.w / 2, i.y - 8);
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

function desenharPrincesa(princesa) {
  const bob = Math.sin(frame / 16) * 2;
  const x = princesa.x;
  const y = princesa.y + bob;

  ctx.fillStyle = "rgba(0, 0, 0, 0.3)";
  ctx.fillRect(x - 2, y + 58, 48, 6);

  ctx.fillStyle = "#f7c948";
  ctx.fillRect(x + 10, y, 24, 8);
  ctx.fillRect(x + 13, y - 6, 5, 8);
  ctx.fillRect(x + 23, y - 10, 5, 12);
  ctx.fillRect(x + 32, y - 6, 5, 8);

  ctx.fillStyle = "#f1c27d";
  ctx.fillRect(x + 12, y + 8, 22, 20);
  ctx.fillStyle = "#ffd6a5";
  ctx.fillRect(x + 16, y + 12, 14, 8);
  ctx.fillStyle = "#7a3f13";
  ctx.fillRect(x + 8, y + 6, 8, 24);
  ctx.fillRect(x + 30, y + 6, 8, 24);

  ctx.fillStyle = "#111111";
  ctx.fillRect(x + 18, y + 17, 3, 3);
  ctx.fillRect(x + 28, y + 17, 3, 3);
  ctx.fillRect(x + 21, y + 24, 8, 2);

  ctx.fillStyle = "#ff8fab";
  ctx.fillRect(x + 8, y + 30, 30, 30);
  ctx.fillStyle = "#ffc2d1";
  ctx.fillRect(x + 14, y + 33, 18, 24);
  ctx.fillStyle = "#f7c948";
  ctx.fillRect(x + 20, y + 36, 6, 16);

  desenharEtiqueta("Princesa", x + 23, y - 14);
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

  if (chefeTimerAtivo && chefeTimer !== null) {
    const segundos = Math.max(0, Math.ceil(chefeTimer / 60));
    ctx.fillStyle = segundos <= 2 ? "#ef476f" : "#ff6b00";
    ctx.font = "18px monospace";
    ctx.fillText("CHEFE: " + segundos + "s", 590, 68);
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

  fase.plataformas.forEach(desenharPlataforma);
  desenharTachas(fase);
  desenharPortal(fase.portal);
  if (fase.princesa) desenharPrincesa(fase.princesa);
  if (fase.cr7) desenharCR7Aliado(fase.cr7);
  if (fase.miaw) desenharMiawEletrico(fase.miaw);
  desenharNuvemGokuSolta(fase);
  desenharYoshi(fase.yoshi);

  fase.moedas.forEach(m => {
    if (!m.coletada) desenharMoeda(m);
  });

  fase.cogumelos.forEach(c => {
    if (!c.coletado) desenharCogumelo(c);
  });

  fase.inimigos.forEach(desenharVilao);
  desenharMeteoros();
  desenharPoderes();
}

function atualizarInimigos() {
  const fase = fases[faseAtual];
  const multiplicador = dificuldadeFinal();

  fase.inimigos.forEach((i, indice) => {
    if (i.morto) return;
    if (i.invencivel > 0) i.invencivel--;

    if (i.tipo === "bossSupremo") atualizarClonesBossSupremo(i);

    const ajusteVilao = i.tipo === "messi" ? AJUSTE_MESSI_JOGAVEL : i.tipo === "meninoRoblox" ? 1.35 : 1;
    i.x += i.vel * multiplicador * AJUSTE_VELOCIDADE_JOGAVEL * ajusteVilao;

    if (i.x <= i.min || i.x >= i.max) {
      i.vel *= -1;
    }

    i.direcao = i.vel >= 0 ? 1 : -1;
    tentarDisparoVilao(i, indice);

    tratarColisaoVilao(joao, i);
  });
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
    mostrarAviso("O Boss Supremo criou uma copia!");
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
      mostrarAviso("Era uma copia! Procure o Boss verdadeiro.");
    }
  }
}

function tentarDisparoVilao(vilao, indice) {
  const intervalo = Math.max(60, 136 - faseAtual * 5);
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
  poderes.push({
    dono: "neymar",
    x: joao.x + joao.w / 2 + joao.direcao * 18,
    y: joao.y + 28,
    w: 18,
    h: 10,
    vx: joao.direcao * 8.2,
    vy: -0.25,
    cor: "#ffe066",
    vida: 80
  });
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

function atualizarPoderes() {
  for (let p = poderes.length - 1; p >= 0; p--) {
    const poder = poderes[p];
    poder.x += poder.vx;
    poder.y += poder.vy;
    poder.vida--;

    if (poder.dono === "vilao" && joao.invencivel <= 0 && colisao(joao, poder)) {
      mostrarAviso((poder.nome || "Poder do vilao") + " acertou!");
      tocarSom("dano");
      tremor = 18;
      criarParticulas(joao.x + joao.w / 2, joao.y + joao.h / 2, poder.cor, 22);
      resetarPersonagens();
      return;
    }

    if (poder.dono === "neymar" || poder.dono === "goku" || poder.dono === "robloxPlayer") {
      const alvo = fases[faseAtual].inimigos.find(i => !i.morto && colisao(i, poder));
      if (alvo) {
        const dano = poder.dono === "goku" ? 2 : 1;
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
        const corImpacto = poder.dono === "goku" ? "#74c0fc" : poder.dono === "robloxPlayer" ? "#e03131" : "#ffe066";
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
    resetarPersonagens();
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
  resetarPersonagens();
}

function coletarMoedas() {
  const fase = fases[faseAtual];

  fase.moedas.forEach(m => {
    const moedaBox = { x: m.x - 12, y: m.y - 12, w: 24, h: 24 };

    if (!m.coletada && colisao(joao, moedaBox)) {
      m.coletada = true;
      moedas++;
      tocarSom("moeda");
      criarParticulas(m.x, m.y, "#ffd43b", 12);
    }
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
  const yoshiBox = { x: fase.yoshi.x - 4, y: fase.yoshi.y, w: 70, h: 58 };
  const candidatos = [joao];

  candidatos.forEach(p => {
    if (fase.yoshi.salvo || !colisao(p, yoshiBox)) return;

    const podeMontar = p.avatar === "humano" || p.avatar === "neymar";
    if (podeMontar && !fase.yoshi.montadoPor && !p.montado) {
      p.montado = true;
      fase.yoshi.montadoPor = p.nome;
    }

    fase.yoshi.salvo = true;
    yoshis++;
    tocarSom("yoshi");
    criarParticulas(fase.yoshi.x + 30, fase.yoshi.y + 28, "#51d88a", 24);
    mostrarAviso(podeMontar ? p.nome + " montou no Yoshi!" : p.nome + " resgatou o Yoshi!");
  });
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
  if (joao.avatar !== "goku" || joao.nuvem) return;

  const nuvem = nuvemGokuDaFase(fase);
  const box = { x: nuvem.x, y: nuvem.y, w: nuvem.w, h: nuvem.h };

  if (colisao(joao, box)) {
    joao.nuvem = true;
    joao.superSayajin = true;
    joao.invencivel = Math.max(joao.invencivel, 120);
    tocarSom("vitoria");
    criarParticulas(nuvem.x + nuvem.w / 2, nuvem.y + 16, "#ffd43b", 44);
    mostrarAviso("Goku subiu na nuvem e virou Super Sayajin!");
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

function verificarPortal() {
  const fase = fases[faseAtual];

  if (colisao(joao, fase.portal)) {
    const chefeVivo = fase.inimigos.some(i => ehChefeVilao(i) && !i.morto);

    if (chefeVivo) {
      mostrarAviso("Derrote o rei antes de abrir o portal!");
      return;
    }

    faseAtual++;

    if (faseAtual >= fases.length) {
      venceu = true;
      tocarSom("vitoria");
      mensagem.innerText = "Vitoria! " + joao.nome + " salvou o reino.";
    } else {
      mensagem.innerText = fases[faseAtual].nome;
      bannerFase = 160;
      resetarTimerChefe();
      tocarSom("portal");
      criarParticulas(fase.portal.x + 28, fase.portal.y + 30, "#c77dff", 26);
      resetarPersonagens();
      mostrarAviso("Nova fase desbloqueada!");
    }
  }
}

function telaVitoria() {
  ctx.fillStyle = "#101318";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  desenharTorres();
  desenharYoshi({ x: 454, y: 318, salvo: false });

  ctx.fillStyle = "#f7c948";
  ctx.font = "48px monospace";
  ctx.fillText("VOCE VENCEU!", 296, 174);

  ctx.fillStyle = "#f7f3de";
  ctx.font = "22px monospace";
  ctx.fillText(joao.nome + " derrotou os viloes extremos.", 246, 234);
  ctx.fillText("Moedas coletadas: " + moedas, 326, 278);
  ctx.fillText("Yoshis resgatados: " + yoshis + "/" + fases.length, 332, 314);
  ctx.fillText("Clique em Reiniciar para jogar de novo.", 248, 392);
}

function telaGameOver() {
  desenharFundo(fases[faseAtual]);
  fases[faseAtual].plataformas.forEach(desenharPlataforma);
  desenharPainelCentral("GAME OVER", [
    "O vilao nao foi derrotado em 20 segundos",
    "Pressione ENTER ou clique em Reiniciar",
    "Neymar dispara poder pela muleta automaticamente"
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
    "Os dois jogadores precisam entrar no portal"
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
    resetarPlataformasMoveis(fase);
    fase.moedas.forEach(m => {
      m.coletada = false;
    });
    fase.cogumelos.forEach(c => {
      c.coletado = false;
    });
    if (fase.cr7) fase.cr7.salvo = false;
    if (fase.miaw) fase.miaw.salvo = false;
    fase.inimigos.forEach(i => {
      i.morto = false;
      if (ehChefeVilao(i)) {
        i.vida = i.vidaMax;
        i.invencivel = 0;
      }
      if (i.tipo === "bossSupremo") {
        i.clones = [];
        i.ultimoClone = null;
      }
    });
    fase.yoshi.salvo = false;
    fase.yoshi.montadoPor = null;
  });

  resetarPersonagens();
  mensagem.innerText = fases[faseAtual].nome;
}

function pixelRect(x, y, w, h) {
  ctx.fillRect(Math.round(x), Math.round(y), Math.round(w), Math.round(h));
}

function loop() {
  frame++;

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

  atualizarPlataformasMoveis();
  moverPersonagem(joao, ["a", "ArrowLeft"], ["d", "ArrowRight"], ["w", "ArrowUp"]);

  atualizarPoderNeymar();
  atualizarPoderGoku();
  atualizarPoderRoblox();
  atualizarInimigos();
  lancarPlacaInjusticaGlobal();
  atualizarPoderes();
  atualizarTimerChefe();
  if (gameOver) {
    requestAnimationFrame(loop);
    return;
  }
  atualizarMeteoros();
  tocarLava(joao);
  tocarTachas(joao);
  coletarMoedas();
  comerCogumelos();
  salvarYoshi();
  coletarAliadosEspeciais();
  montarNuvemGoku();
  verificarPortal();
  if (venceu) {
    requestAnimationFrame(loop);
    return;
  }
  atualizarParticulas();

  ctx.save();
  if (tremor > 0) {
    tremor--;
    ctx.translate((Math.random() - 0.5) * 8, (Math.random() - 0.5) * 8);
  }
  desenharFase();
  desenharBoneco(joao);
  desenharParticulas();
  desenharHUD(fases[faseAtual]);
  desenharBannerFase();
  ctx.restore();

  requestAnimationFrame(loop);
}

mensagem.innerText = fases[faseAtual].nome;
resetarPersonagens();
loop();
