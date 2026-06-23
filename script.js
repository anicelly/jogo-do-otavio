const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
const mensagem = document.getElementById("mensagem");
ctx.imageSmoothingEnabled = false;

const keys = {};
let faseAtual = 0;
let moedas = 0;
let yoshis = 0;
let venceu = false;
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
let jogadorMobile = "joao";
const particulas = [];
const botaoSom = document.getElementById("botaoSom");
const activePlayerLabel = document.getElementById("activePlayerLabel");

const controlesMobile = {
  joao: { left: "a", jump: "w", right: "d" },
  luquinhas: { left: "ArrowLeft", jump: "ArrowUp", right: "ArrowRight" }
};

document.addEventListener("keydown", event => {
  iniciarAudio();
  if (event.key === "Enter" || event.key === " ") {
    jogoIniciado = true;
  }
  if (event.key.toLowerCase() === "p" && jogoIniciado && !venceu) {
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
  Object.values(controlesMobile).forEach(controles => {
    Object.values(controles).forEach(key => {
      keys[key] = false;
      if (key.length === 1) keys[key.toLowerCase()] = false;
    });
  });
  document.querySelectorAll(".touch-btn").forEach(botao => botao.classList.remove("is-pressed"));
}

document.querySelectorAll(".player-choice").forEach(botao => {
  botao.addEventListener("click", () => {
    soltarControlesMobile();
    jogadorMobile = botao.dataset.player;
    document.querySelectorAll(".player-choice").forEach(b => b.classList.toggle("is-selected", b === botao));
    if (activePlayerLabel) {
      activePlayerLabel.innerText = jogadorMobile === "joao" ? "Controlando Joao" : "Controlando Luquinhas";
    }
  });
});

document.querySelectorAll(".touch-btn").forEach(botao => {
  const action = botao.dataset.action;

  const obterKey = () => controlesMobile[jogadorMobile][action];

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

const fases = [
  {
    nome: "Fase 1 - Bosque do Yoshi",
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
      criarVilao("soldado", 416, 438, 2.1, 380, 610)
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
      { x: 102, y: 396, w: 112, h: 24, tipo: "castelo" },
      { x: 292, y: 344, w: 124, h: 24, tipo: "castelo" },
      { x: 494, y: 292, w: 118, h: 24, tipo: "castelo" },
      { x: 700, y: 240, w: 168, h: 24, tipo: "castelo" }
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
      { x: 330, y: 312, coletado: false },
      { x: 742, y: 208, coletado: false }
    ],
    inimigos: [
      criarVilao("soldado", 118, 354, 3.4, 96, 208),
      criarVilao("soldado", 246, 438, 3.9, 214, 338),
      criarVilao("cavaleiro", 450, 438, 3.2, 420, 554),
      criarVilao("soldado", 528, 250, 2.8, 500, 598),
      criarVilao("cavaleiro", 690, 436, 3.5, 644, 828),
      criarVilao("soldado", 786, 198, 2.7, 710, 850),
      criarChefeFinal(656, 416)
    ]
  }
];

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
    poderTempo: 0
  };
}

function criarVilao(tipo, x, y, vel, min, max) {
  return {
    tipo,
    x,
    y,
    w: tipo === "cavaleiro" ? 48 : 42,
    h: tipo === "cavaleiro" ? 50 : 42,
    vel,
    min,
    max,
    direcao: vel >= 0 ? 1 : -1,
    morto: false
  };
}

function criarChefeFinal(x, y) {
  return {
    tipo: "chefe",
    x,
    y,
    w: 74,
    h: 70,
    vel: 2.2,
    min: 620,
    max: 878,
    direcao: 1,
    vida: 5,
    vidaMax: 5,
    invencivel: 0,
    morto: false
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
  if (!somLigado || venceu) return;
  musicaTimer--;
  if (musicaTimer > 0) return;

  const melodia = [330, 392, 494, 392, 440, 523, 440, 392, 294, 349, 440, 349, 392, 494, 587, 494];
  const baixo = [98, 98, 147, 147, 110, 110, 165, 165];
  tocarTom(melodia[notaMusica % melodia.length], 0.13, "square", 0.026);
  if (notaMusica % 2 === 0) {
    tocarTom(baixo[Math.floor(notaMusica / 2) % baixo.length], 0.16, "triangle", 0.018);
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

  joao.x = 52;
  joao.y = 422;
  joao.velX = 0;
  joao.velY = 0;
  joao.invencivel = 80;
  joao.montado = false;
  joao.grande = false;
  joao.poderTempo = 0;

  luquinhas.x = 112;
  luquinhas.y = 422;
  luquinhas.velX = 0;
  luquinhas.velY = 0;
  luquinhas.invencivel = 80;
  luquinhas.montado = false;
  luquinhas.grande = false;
  luquinhas.poderTempo = 0;
}

function moverPersonagem(p, esquerda, direita, pulo) {
  p.prevY = p.y;
  p.velX = 0;
  p.andando = false;
  const velocidade = (p.montado ? 5.35 : 4.35) + (p.grande ? 0.45 : 0);
  const forcaPulo = (p.montado ? -15.2 : -13.2) - (p.grande ? 0.8 : 0);
  const gravidade = p.montado ? 0.58 : 0.64;

  if (keys[esquerda]) {
    p.velX = -velocidade;
    p.andando = true;
    p.direcao = -1;
  }

  if (keys[direita]) {
    p.velX = velocidade;
    p.andando = true;
    p.direcao = 1;
  }

  if (keys[pulo] && p.noChao) {
    p.velY = forcaPulo;
    p.noChao = false;
    tocarSom("pulo");
  }

  p.velY += gravidade;
  p.x += p.velX;
  p.y += p.velY;
  p.noChao = false;

  fases[faseAtual].plataformas.forEach(plataforma => {
    const estavaAcima = p.y + p.h - p.velY <= plataforma.y + 4;

    if (colisao(p, plataforma) && p.velY >= 0 && estavaAcima) {
      p.y = plataforma.y - p.h;
      p.velY = 0;
      p.noChao = true;
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

function desenharPlataforma(p) {
  const cores = {
    grama: ["#43aa4f", "#2d7a32", "#7bd86a"],
    pedra: ["#7f8fa6", "#4b5568", "#b0bec5"],
    castelo: ["#6d6875", "#3d405b", "#a9a3b5"]
  };

  const paleta = cores[p.tipo] || cores.grama;
  ctx.fillStyle = paleta[0];
  ctx.fillRect(p.x, p.y, p.w, p.h);
  ctx.fillStyle = paleta[2];
  ctx.fillRect(p.x, p.y, p.w, 5);
  ctx.fillStyle = paleta[1];
  ctx.fillRect(p.x, p.y + p.h - 7, p.w, 7);

  for (let x = p.x + 10; x < p.x + p.w - 8; x += 28) {
    ctx.fillStyle = "rgba(0, 0, 0, 0.18)";
    ctx.fillRect(x, p.y + 8, 12, 5);
  }
}

function desenharBoneco(p) {
  const passo = p.andando && p.noChao ? Math.floor(frame / 7) % 2 : 0;
  const piscando = p.invencivel > 0 && Math.floor(frame / 5) % 2 === 0;
  if (piscando) return;
  const baseY = p.montado ? p.y - 18 : p.y;
  const escala = p.grande ? 1.18 : 1;
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

  if (i.tipo === "chefe") {
    desenharChefeFinal(i);
    return;
  }

  if (i.tipo === "cavaleiro") {
    desenharCavaleiro(i);
    return;
  }

  desenharSoldado(i);
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
  desenharEtiqueta("Rei Vulcao", i.x + i.w / 2, i.y - 28);
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
  ctx.fillText("Fase " + (faseAtual + 1) + "/" + fases.length + "  |  P: pausar  |  Cogumelo cresce e derruba viloes", 30, 92);

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
  desenharPortal(fase.portal);
  if (fase.princesa) desenharPrincesa(fase.princesa);
  desenharYoshi(fase.yoshi);

  fase.moedas.forEach(m => {
    if (!m.coletada) desenharMoeda(m);
  });

  fase.cogumelos.forEach(c => {
    if (!c.coletado) desenharCogumelo(c);
  });

  fase.inimigos.forEach(desenharVilao);
}

function atualizarInimigos() {
  const fase = fases[faseAtual];

  fase.inimigos.forEach(i => {
    if (i.morto) return;
    if (i.invencivel > 0) i.invencivel--;

    i.x += i.vel;

    if (i.x <= i.min || i.x >= i.max) {
      i.vel *= -1;
    }

    i.direcao = i.vel >= 0 ? 1 : -1;

    tratarColisaoVilao(joao, i);
    tratarColisaoVilao(luquinhas, i);
  });
}

function tratarColisaoVilao(jogador, vilao) {
  if (vilao.morto || jogador.invencivel > 0 || !colisao(jogador, vilao)) return;

  const veioDeCima = jogador.velY > 0 && jogador.prevY + jogador.h <= vilao.y + 14;

  if (vilao.tipo === "chefe" && veioDeCima && vilao.invencivel <= 0) {
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
      mostrarAviso("O Rei Vulcao caiu! Salvem a princesa!");
    } else {
      mostrarAviso("Chefe atingido! Vida: " + vilao.vida + "/" + vilao.vidaMax);
    }
    return;
  }

  if (vilao.tipo === "chefe" && jogador.grande && vilao.invencivel <= 0) {
    vilao.vida -= 2;
    vilao.invencivel = 50;
    jogador.invencivel = 55;
    tocarSom("pisao");
    tremor = 16;
    criarParticulas(vilao.x + vilao.w / 2, vilao.y + vilao.h / 2, "#ff8fab", 42);

    if (vilao.vida <= 0) {
      vilao.morto = true;
      tocarSom("vitoria");
      mostrarAviso("O cogumelo derrotou o Rei Vulcao!");
    } else {
      mostrarAviso("Golpe forte no chefe! Vida: " + vilao.vida + "/" + vilao.vidaMax);
    }
    return;
  }

  if (vilao.tipo === "chefe") {
    mostrarAviso("Pule na cabeca do Rei Vulcao!");
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

    if (!m.coletada && (colisao(joao, moedaBox) || colisao(luquinhas, moedaBox))) {
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
    const comedor = colisao(joao, box) ? joao : colisao(luquinhas, box) ? luquinhas : null;

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
  const candidatos = [joao, luquinhas];

  candidatos.forEach(p => {
    if (!fase.yoshi.montadoPor && !p.montado && colisao(p, yoshiBox)) {
      p.montado = true;
      fase.yoshi.montadoPor = p.nome;

      if (!fase.yoshi.salvo) {
        fase.yoshi.salvo = true;
        yoshis++;
      }

      tocarSom("yoshi");
      criarParticulas(fase.yoshi.x + 30, fase.yoshi.y + 28, "#51d88a", 24);
      mostrarAviso(p.nome + " montou no Yoshi!");
    }
  });
}

function tocarLava(jogador) {
  const fase = fases[faseAtual];
  if (fase.tema !== "vulcao") return;

  if (jogador.y + jogador.h > 488) {
    mostrarAviso(jogador.nome + " caiu no mar de fogo!");
    tocarSom("dano");
    tremor = 24;
    criarParticulas(jogador.x + jogador.w / 2, 500, "#ff3d00", 30);
    resetarPersonagens();
  }
}

function verificarPortal() {
  const fase = fases[faseAtual];

  if (colisao(joao, fase.portal) && colisao(luquinhas, fase.portal)) {
    const chefeVivo = fase.inimigos.some(i => i.tipo === "chefe" && !i.morto);

    if (chefeVivo) {
      mostrarAviso("Derrotem o Rei Vulcao antes de salvar a princesa!");
      return;
    }

    faseAtual++;

    if (faseAtual >= fases.length) {
      venceu = true;
      tocarSom("vitoria");
      mensagem.innerText = "Vitoria! Joao e Luquinhas salvaram a princesa.";
    } else {
      mensagem.innerText = fases[faseAtual].nome;
      bannerFase = 160;
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
  ctx.fillText("Joao e Luquinhas derrotaram os dois viloes.", 206, 234);
  ctx.fillText("Moedas coletadas: " + moedas, 326, 278);
  ctx.fillText("Yoshis resgatados: " + yoshis + "/" + fases.length, 332, 314);
  ctx.fillText("Clique em Reiniciar para jogar de novo.", 248, 392);
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
    "Joao e Luquinhas contra os viloes de armadura",
    "Monte no Yoshi, coma cogumelos e pise nos inimigos",
    "Pressione ENTER, ESPACO ou toque nos botoes"
  ]);
}

function telaPausa() {
  desenharFase();
  desenharBoneco(joao);
  desenharBoneco(luquinhas);
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
  jogoIniciado = true;
  pausado = false;
  aviso = "";
  avisoTempo = 0;
  bannerFase = 160;

  fases.forEach(fase => {
    fase.moedas.forEach(m => {
      m.coletada = false;
    });
    fase.cogumelos.forEach(c => {
      c.coletado = false;
    });
    fase.inimigos.forEach(i => {
      i.morto = false;
      if (i.tipo === "chefe") {
        i.vida = i.vidaMax;
        i.invencivel = 0;
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

  moverPersonagem(joao, "a", "d", "w");
  moverPersonagem(luquinhas, "ArrowLeft", "ArrowRight", "ArrowUp");

  atualizarInimigos();
  tocarLava(joao);
  tocarLava(luquinhas);
  coletarMoedas();
  comerCogumelos();
  salvarYoshi();
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
  desenharBoneco(luquinhas);
  desenharParticulas();
  desenharHUD(fases[faseAtual]);
  desenharBannerFase();
  ctx.restore();

  requestAnimationFrame(loop);
}

mensagem.innerText = fases[faseAtual].nome;
resetarPersonagens();
loop();
