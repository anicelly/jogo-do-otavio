const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
ctx.imageSmoothingEnabled = false;

const W = canvas.width;
const H = canvas.height;
const ground = 476;
const keys = {};

const ui = {
  stage: document.getElementById("stageLabel"),
  wallet: document.getElementById("walletLabel"),
  hero: document.getElementById("heroLabel"),
  heroes: document.getElementById("heroGrid"),
  count: document.getElementById("countHeroes"),
  shop: document.getElementById("shopGrid"),
  shopPanel: document.getElementById("shopPanel"),
  stages: document.getElementById("stageList"),
  difficulty: document.getElementById("difficultyLabel")
};

const heroes = [
  { id: "ryu", name: "Ryu", color: "#f7f3de", desc: "Hadouken, foco de combate e golpe ascendente.", speed: 4.4, jump: 12.5, power: "hadouken" },
  { id: "ken", name: "Ken", color: "#ff4d5e", desc: "Shoryuken flamejante, chute rapido e combo de fogo.", speed: 4.7, jump: 12.8, power: "shoryuken" },
  { id: "may", name: "May", color: "#ff8ac7", desc: "Sequencia veloz, energia rosa e ataque especial giratorio.", speed: 4.8, jump: 12.7, power: "giro" },
  { id: "cr7", name: "CR7", color: "#f7f3de", desc: "Bicicleta CR7, chute SIUUU e rajada de campeao.", speed: 4.5, jump: 13.1, power: "chute" },
  { id: "yoshi", name: "Yoshi", color: "#36c96b", desc: "Chama verde, salto alto e esfera jurassica.", speed: 4.4, jump: 13.4, power: "yoshi" },
  { id: "messi", name: "Messi", color: "#74c0fc", desc: "Drible curto, Bola de Ouro e explosao de gols.", speed: 4.8, jump: 12.1, power: "bola" },
  { id: "harry", name: "Harry Potter", color: "#8b5a2b", desc: "Expelliarmus, pomo dourado e magia de protecao.", speed: 4.1, jump: 12.7, power: "magia" },
  { id: "ranger", name: "Power Ranger Vermelho", color: "#ff4d5e", desc: "Espada vermelha, golpe heroico e raio final.", speed: 4.4, jump: 12, power: "raio" },
  { id: "ancelotti", name: "Carlo Ancelotti", color: "#d0d7de", desc: "Estrategia lendaria, Endrick no banco e buff tatico.", speed: 3.9, jump: 11.8, power: "tatico" },
  { id: "neymar", name: "Neymar", color: "#ffe066", desc: "Drible, fogo, muleta power e chute amarelo.", speed: 4.9, jump: 12.5, power: "drible" },
  { id: "goku", name: "Goku", color: "#ff8a00", desc: "Ki blast, voo curto e Genki Dama retro.", speed: 4.6, jump: 13, power: "genki" },
  { id: "meninoRoblox", name: "Menino Roblox", color: "#e03131", desc: "Celular, placa de injustica e cubo explosivo.", speed: 4.0, jump: 12.2, power: "bloco" },
  { id: "chaves", name: "Chaves", color: "#d8c9a7", desc: "Barril, sanduiche de presunto e suco de tamarindo.", speed: 3.8, jump: 12, power: "barril" },
  { id: "esqueleto", name: "Esqueleto", color: "#f1f1df", desc: "Corte duplo, ossada giratoria e contra-ataque.", speed: 4.2, jump: 12.3, power: "osso" },
  { id: "silvioSantos", name: "Silvio Santos", color: "#5dade2", desc: "Jequiti, microfone e chuva de premios.", speed: 3.9, jump: 11.9, power: "premio" },
  { id: "sailor", name: "Sailor Moon", color: "#ff8ac7", desc: "Tiara lunar, cura, estrelas e explosao da lua.", speed: 4.0, jump: 12.5, power: "lua" }
];

const shopItems = [
  { id: "sword", name: "Espada do Reino", cost: 60, max: 4, desc: "+ dano em ataques." },
  { id: "armor", name: "Armadura de Prata", cost: 75, max: 4, desc: "+ vida maxima." },
  { id: "boots", name: "Botas do Vento", cost: 65, max: 3, desc: "+ velocidade e pulo." },
  { id: "potion", name: "Pocao Real", cost: 35, max: 9, desc: "Cura instantanea." },
  { id: "amulet", name: "Amuleto Lunar", cost: 95, max: 3, desc: "+ poder especial." },
  { id: "shield", name: "Escudo do Castelo", cost: 85, max: 3, desc: "Reduz dano recebido." }
];

const stages = [
  { name: "Fortaleza Sombria", theme: "city", goal: 8, hard: 1.15, enemies: ["skeleton", "drone"] },
  { name: "Torre Sailor Moon", theme: "moon", goal: 11, hard: 1.55, enemies: ["star", "eclipse"], boss: "Rainha Eclipse" },
  { name: "Circo da Gravida de Taubate", theme: "meme", goal: 13, hard: 1.95, enemies: ["doll", "cushion"], boss: "Gravida de Taubate" },
  { name: "Calabouco dos Cavaleiros", theme: "dungeon", goal: 16, hard: 2.35, enemies: ["knight", "archer"], boss: "General de Ferro" },
  { name: "Castelo RPG Final", theme: "castle", goal: 22, hard: 3.35, enemies: ["knight", "dragon", "archer"], boss: "Rei Medieval Supremo", final: true }
];

const state = {
  running: false,
  paused: false,
  stage: 0,
  hero: 0,
  coins: Number(localStorage.getItem("rpeCoins") || 120),
  items: JSON.parse(localStorage.getItem("rpeItems") || "{}"),
  player: null,
  enemies: [],
  shots: [],
  enemyShots: [],
  particles: [],
  kills: 0,
  bossSpawned: false,
  frame: 0,
  message: "Toque em START para jogar.",
  shopOpen: false
};

function save() {
  localStorage.setItem("rpeCoins", String(state.coins));
  localStorage.setItem("rpeItems", JSON.stringify(state.items));
}

function itemLevel(id) {
  return state.items[id] || 0;
}

function currentHero() {
  return heroes[state.hero];
}

function makePlayer() {
  const h = currentHero();
  return {
    x: 84,
    y: ground - 54,
    w: 28,
    h: 54,
    vx: 0,
    vy: 0,
    facing: 1,
    onGround: true,
    crouch: false,
    hp: 120 + itemLevel("armor") * 30,
    maxHp: 120 + itemLevel("armor") * 30,
    inv: 0,
    cd: 0,
    powerCd: 0,
    color: h.color
  };
}

function restartStage() {
  state.player = makePlayer();
  state.enemies = [];
  state.shots = [];
  state.enemyShots = [];
  state.particles = [];
  state.kills = 0;
  state.bossSpawned = false;
  state.message = stages[state.stage].name;
  spawnWave(5 + state.stage * 2);
  renderUI();
}

function startGame() {
  state.running = true;
  state.paused = false;
  restartStage();
}

function stopGame() {
  state.running = false;
  state.paused = false;
  state.message = "Jogo parado. Toque em START para voltar.";
}

function nextStage() {
  state.stage++;
  if (state.stage >= stages.length) {
    state.stage = stages.length - 1;
    state.running = false;
    state.message = "Voce venceu o RPG medieval final!";
    state.coins += 300;
    save();
    return;
  }
  state.coins += 80 + state.stage * 25;
  save();
  restartStage();
}

function spawnWave(count) {
  const s = stages[state.stage];
  for (let i = 0; i < count; i++) {
    spawnEnemy(s.enemies[i % s.enemies.length], W + 80 + i * 85);
  }
  if (s.boss && state.kills >= Math.floor(s.goal * .55)) spawnEnemy("boss", W + 180);
}

function spawnEnemy(type, x) {
  const s = stages[state.stage];
  const boss = type === "boss";
  const colors = {
    skeleton: "#f1f1df",
    drone: "#8aa1b8",
    star: "#ffe66d",
    eclipse: "#b388ff",
    doll: "#ff9fb8",
    cushion: "#ffca7a",
    knight: "#cbd5e1",
    archer: "#70e39a",
    dragon: "#ff5d73",
    boss: s.final ? "#ffd166" : s.theme === "meme" ? "#ff8ac7" : "#b388ff"
  };
  state.enemies.push({
    type,
    boss,
    name: boss ? s.boss : type,
    x,
    y: ground - (boss ? 86 : 42),
    w: boss ? 58 : 32,
    h: boss ? 86 : 42,
    hp: Math.round((boss ? 420 : 58) * s.hard),
    maxHp: Math.round((boss ? 420 : 58) * s.hard),
    speed: (boss ? 1.1 : 1.55 + Math.random() * .45) * (1 + state.stage * .12),
    damage: Math.round((boss ? 24 : 13) * s.hard),
    color: colors[type],
    cd: 40 + Math.random() * 80,
    phase: Math.random() * 8
  });
}

function rect(a, b) {
  return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
}

function hitPlayer(dmg) {
  const p = state.player;
  if (p.inv > 0) return;
  const reduced = Math.max(1, dmg - itemLevel("shield") * 4);
  p.hp -= reduced;
  p.inv = 45;
  burst(p.x + p.w / 2, p.y + p.h / 2, "#ff5d73", 18);
  if (p.hp <= 0) {
    state.running = false;
    state.message = "Voce caiu. Compre itens e tente de novo.";
  }
}

function shoot(power = false) {
  const p = state.player;
  if (!p || p.cd > 0) return;
  p.cd = power ? 24 : 12;
  const h = currentHero();
  const dmg = (power ? 48 : 25) + itemLevel("sword") * 10 + itemLevel("amulet") * (power ? 16 : 4);
  if (power) p.powerCd = 130;
  state.shots.push({
    x: p.x + (p.facing > 0 ? p.w : -24),
    y: p.y + (p.crouch ? 31 : 18),
    w: power ? 36 : 20,
    h: power ? 14 : 8,
    vx: p.facing * (power ? 12 : 9),
    vy: h.power === "genki" && power ? -1.2 : 0,
    dmg,
    color: power ? h.color : "#fff4d6",
    life: power ? 80 : 55
  });
  burst(p.x + p.w / 2, p.y + 20, power ? h.color : "#ffd166", power ? 16 : 6);
}

function special() {
  const p = state.player;
  if (!p || p.powerCd > 0) return;
  const h = currentHero();
  p.powerCd = 180;
  if (h.power === "lua") {
    p.hp = Math.min(p.maxHp, p.hp + 38 + itemLevel("amulet") * 18);
  }
  for (let i = 0; i < (h.power === "espada" ? 7 : 5); i++) shoot(true);
  state.enemies.forEach(e => {
    if (Math.abs(e.x - p.x) < 190 + itemLevel("amulet") * 30) damageEnemy(e, 35 + itemLevel("amulet") * 14);
  });
  burst(p.x + p.w / 2, p.y + p.h / 2, h.color, 42);
}

function damageEnemy(e, dmg) {
  e.hp -= dmg;
  e.x += 7;
  burst(e.x + e.w / 2, e.y + e.h / 2, e.color, 8);
  if (e.hp <= 0 && !e.dead) {
    e.dead = true;
    state.kills++;
    state.coins += e.boss ? 120 : 12;
    save();
    state.message = e.boss ? `${e.name} derrotado!` : "Vilao derrotado!";
  }
}

function enemyFire(e) {
  const p = state.player;
  const dx = p.x - e.x;
  const dy = p.y - e.y;
  const len = Math.max(1, Math.hypot(dx, dy));
  const label = e.name === "Gravida de Taubate" ? "boneco cenografico" : e.type;
  state.enemyShots.push({
    x: e.x,
    y: e.y + e.h * .35,
    w: e.boss ? 18 : 12,
    h: e.boss ? 18 : 12,
    vx: dx / len * (e.boss ? 5.2 : 4.1),
    vy: dy / len * (e.boss ? 5.2 : 4.1),
    dmg: e.damage,
    color: label === "boneco cenografico" ? "#ff9fb8" : e.color,
    label
  });
}

function burst(x, y, color, n) {
  for (let i = 0; i < n; i++) {
    state.particles.push({
      x,
      y,
      vx: (Math.random() - .5) * 7,
      vy: (Math.random() - .5) * 7,
      color,
      life: 28 + Math.random() * 22
    });
  }
}

function update() {
  if (!state.running || state.paused) return;
  state.frame++;
  const p = state.player;
  const h = currentHero();
  const moveBoost = itemLevel("boots") * .35;

  p.crouch = !!keys.down;
  if (keys.left) {
    p.vx = -(h.speed + moveBoost);
    p.facing = -1;
  } else if (keys.right) {
    p.vx = h.speed + moveBoost;
    p.facing = 1;
  } else {
    p.vx *= .72;
  }

  if (keys.jump && p.onGround) {
    p.vy = -(h.jump + itemLevel("boots") * .8);
    p.onGround = false;
  }

  p.vy += .62;
  p.x = Math.max(18, Math.min(W - p.w - 18, p.x + p.vx));
  p.y += p.vy;
  if (p.y + p.h >= ground) {
    p.y = ground - p.h;
    p.vy = 0;
    p.onGround = true;
  }
  if (p.inv > 0) p.inv--;
  if (p.cd > 0) p.cd--;
  if (p.powerCd > 0) p.powerCd--;

  state.shots.forEach(s => {
    s.x += s.vx;
    s.y += s.vy;
    s.life--;
    state.enemies.forEach(e => {
      if (!e.dead && s.life > 0 && rect(s, e)) {
        s.life = 0;
        damageEnemy(e, s.dmg);
      }
    });
  });

  state.enemyShots.forEach(s => {
    s.x += s.vx;
    s.y += s.vy;
    if (rect(s, p)) {
      s.dead = true;
      hitPlayer(s.dmg);
    }
  });

  state.enemies.forEach(e => {
    if (e.dead) return;
    e.phase += .08;
    e.x += e.x > p.x ? -e.speed : e.speed * .4;
    e.y = ground - e.h + Math.sin(e.phase) * (e.boss ? 5 : 2);
    e.cd--;
    if (e.cd <= 0) {
      e.cd = e.boss ? 42 : 95 + Math.random() * 55;
      enemyFire(e);
      if (e.boss && stages[state.stage].final) {
        enemyFire({ ...e, y: e.y - 22 });
        enemyFire({ ...e, y: e.y + 22 });
      }
    }
    if (rect(p, e)) hitPlayer(e.damage);
  });

  state.particles.forEach(pt => {
    pt.x += pt.vx;
    pt.y += pt.vy;
    pt.life--;
  });

  state.enemies = state.enemies.filter(e => !e.dead);
  state.shots = state.shots.filter(s => s.life > 0 && s.x > -80 && s.x < W + 80);
  state.enemyShots = state.enemyShots.filter(s => !s.dead && s.x > -80 && s.x < W + 80 && s.y > -80 && s.y < H + 80);
  state.particles = state.particles.filter(p => p.life > 0);

  const s = stages[state.stage];
  const bossAlive = state.enemies.some(e => e.boss);
  const bossNeeded = s.boss && state.kills >= Math.floor(s.goal * .55) && !bossAlive && !state.bossSpawned;
  if (bossNeeded) {
    state.bossSpawned = true;
    spawnEnemy("boss", W + 120);
  }
  if (state.enemies.length < 4 && state.kills < s.goal) spawnWave(3 + state.stage);
  if (state.kills >= s.goal && !bossAlive && state.enemies.length === 0) nextStage();
}

function drawBg() {
  const s = stages[state.stage];
  const palettes = {
    city: ["#111827", "#27364f", "#56ccff"],
    moon: ["#1a1632", "#46356e", "#ff8ac7"],
    meme: ["#191625", "#57405f", "#ffd166"],
    dungeon: ["#12151d", "#34384a", "#70e39a"],
    castle: ["#16121b", "#4a4053", "#ffd166"]
  }[s.theme];
  ctx.fillStyle = palettes[0];
  ctx.fillRect(0, 0, W, H);
  ctx.fillStyle = palettes[1];
  for (let x = 0; x < W; x += 72) {
    ctx.fillRect(x, 280 - (x % 150), 46, 210 + (x % 150));
  }
  ctx.fillStyle = palettes[2];
  for (let x = 0; x < W; x += 24) ctx.fillRect(x, ground + 10, 14, 4);
  ctx.fillStyle = "#1f2937";
  ctx.fillRect(0, ground, W, H - ground);
  ctx.fillStyle = "rgba(255,255,255,.08)";
  for (let x = 0; x < W; x += 16) ctx.fillRect(x, 0, 1, H);
  for (let y = 0; y < H; y += 16) ctx.fillRect(0, y, W, 1);
}

function drawPlayer(p) {
  const h = currentHero();
  const blink = p.inv > 0 && state.frame % 6 < 3;
  if (blink) return;
  const walk = Math.floor(state.frame / 8) % 2;
  const crouch = p.crouch ? 10 : 0;
  const cx = p.x + p.w / 2;
  const base = p.y + p.h;

  if (h.id === "yoshi") {
    drawYoshiSprite(cx - 34, base - 58 + crouch, p.facing);
  } else {
    drawHumanSprite(cx, base + crouch, p.facing, h, walk, p.crouch);
  }

  if (p.powerCd > 0) {
    ctx.strokeStyle = h.color;
    ctx.lineWidth = 2;
    ctx.strokeRect(p.x - 6, p.y - 6 + crouch, p.w + 12, p.h + 12 - crouch);
  }
}

function drawHumanSprite(cx, base, facing, hero, walk, crouch) {
  const skin = hero.id === "esqueleto" ? "#f1f1df" : "#f0b58f";
  const hair = {
    ryu: "#1b1b1b",
    ken: "#ffd166",
    may: "#5c2e12",
    cr7: "#24130c",
    messi: "#5c2e12",
    harry: "#111111",
    ancelotti: "#d0d7de",
    neymar: "#f7c948",
    goku: "#111111",
    chaves: "#5c3b1e",
    silvioSantos: "#d0d7de"
  }[hero.id] || "#2a160f";
  const pants = {
    ryu: "#f7f3de",
    ken: "#d90429",
    may: "#2f6f9f",
    cr7: "#d90429",
    messi: "#ffffff",
    harry: "#111827",
    ranger: "#f7f3de",
    ancelotti: "#111827",
    neymar: "#2457c5",
    goku: "#0b5ed7",
    meninoRoblox: "#1971c2",
    chaves: "#2f6f9f",
    esqueleto: "#d0d7de",
    silvioSantos: "#111827",
    sailor: "#2f6f9f"
  }[hero.id] || "#1d3557";
  const top = hero.color;
  const y = base - (crouch ? 46 : 60);

  ctx.save();
  ctx.translate(cx, 0);
  ctx.scale(facing < 0 ? -1 : 1, 1);

  ctx.fillStyle = "rgba(0,0,0,.34)";
  ctx.fillRect(-22, base - 4, 44, 5);

  if (hero.id === "goku") {
    ctx.fillStyle = "#111111";
    ctx.fillRect(-13, y - 7, 6, 9);
    ctx.fillRect(-5, y - 11, 7, 12);
    ctx.fillRect(5, y - 7, 7, 10);
  }
  if (hero.id === "sailor") {
    ctx.fillStyle = "#ffd166";
    ctx.fillRect(-15, y - 9, 30, 5);
    ctx.fillStyle = "#ff8ac7";
    ctx.fillRect(-4, y - 15, 8, 8);
  }

  ctx.fillStyle = hair;
  ctx.fillRect(-13, y, 26, 9);
  ctx.fillStyle = skin;
  ctx.fillRect(-12, y + 8, 24, 18);
  ctx.fillStyle = "#070a10";
  ctx.fillRect(3, y + 13, 4, 4);
  ctx.fillRect(8, y + 22, 8, 3);

  ctx.fillStyle = top;
  if (hero.id === "ranger") {
    ctx.fillRect(-16, y + 25, 32, 24);
    ctx.fillStyle = "#fff";
    ctx.fillRect(-9, y + 29, 18, 5);
  } else if (hero.id === "sailor") {
    ctx.fillRect(-15, y + 25, 30, 16);
    ctx.fillStyle = "#f7f3de";
    ctx.fillRect(-18, y + 30, 36, 5);
    ctx.fillStyle = "#ff8ac7";
    ctx.fillRect(-18, y + 41, 36, 10);
  } else {
    ctx.fillRect(-15, y + 25, 30, 24);
  }

  ctx.fillStyle = skin;
  ctx.fillRect(-23, y + 28, 8, 20);
  ctx.fillRect(15, y + 28, 8, 20);
  if (hero.id === "ken" || hero.id === "ryu") {
    ctx.fillStyle = hero.id === "ken" ? "#ffbf69" : "#d90429";
    ctx.fillRect(16, y + 30, 12, 7);
  }

  ctx.fillStyle = pants;
  const legStep = walk ? 3 : 0;
  ctx.fillRect(-13, y + 49, 10, 13 + legStep);
  ctx.fillRect(4, y + 49, 10, 13 - legStep);
  ctx.fillStyle = "#111111";
  ctx.fillRect(-15, y + 61 + legStep, 14, 5);
  ctx.fillRect(3, y + 61 - legStep, 14, 5);

  if (hero.id === "harry") {
    ctx.strokeStyle = "#111";
    ctx.lineWidth = 2;
    ctx.strokeRect(-8, y + 13, 6, 5);
    ctx.strokeRect(3, y + 13, 6, 5);
    ctx.fillStyle = "#ffd166";
    ctx.fillRect(18, y + 28, 22, 4);
  }
  if (hero.id === "chaves") {
    ctx.fillStyle = "#6b4b2a";
    ctx.fillRect(-18, y - 6, 36, 7);
  }
  if (hero.id === "esqueleto") {
    ctx.fillStyle = "#070a10";
    ctx.fillRect(-7, y + 13, 4, 5);
    ctx.fillRect(4, y + 13, 4, 5);
    ctx.fillRect(-8, y + 34, 16, 4);
  }
  if (hero.id === "silvioSantos") {
    ctx.fillStyle = "#d0d7de";
    ctx.fillRect(18, y + 27, 8, 18);
    ctx.fillStyle = "#111827";
    ctx.fillRect(21, y + 23, 6, 8);
  }
  if (hero.id === "meninoRoblox") {
    ctx.fillStyle = "#1d3557";
    ctx.fillRect(17, y + 25, 12, 18);
    ctx.fillStyle = "#74c0fc";
    ctx.fillRect(20, y + 28, 6, 8);
  }
  ctx.restore();
}

function drawYoshiSprite(x, y, facing) {
  ctx.save();
  if (facing < 0) {
    ctx.translate(x + 68, y);
    ctx.scale(-1, 1);
    x = 0;
    y = 0;
  }
  ctx.fillStyle = "rgba(0,0,0,.32)";
  ctx.fillRect(x - 6, y + 54, 66, 5);
  ctx.fillStyle = "#36c96b";
  ctx.fillRect(x + 5, y + 25, 34, 27);
  ctx.fillRect(x + 25, y + 8, 30, 27);
  ctx.fillRect(x + 51, y + 20, 12, 10);
  ctx.fillRect(x - 2, y + 32, 12, 14);
  ctx.fillStyle = "#f7f3de";
  ctx.fillRect(x + 28, y + 15, 16, 16);
  ctx.fillRect(x + 12, y + 33, 20, 15);
  ctx.fillStyle = "#fff";
  ctx.fillRect(x + 29, y + 2, 10, 12);
  ctx.fillRect(x + 43, y + 2, 10, 12);
  ctx.fillStyle = "#111";
  ctx.fillRect(x + 34, y + 6, 3, 5);
  ctx.fillRect(x + 48, y + 6, 3, 5);
  ctx.fillStyle = "#ef476f";
  ctx.fillRect(x + 5, y + 17, 13, 12);
  ctx.fillStyle = "#f7f3de";
  ctx.fillRect(x + 2, y + 48, 14, 8);
  ctx.fillRect(x + 33, y + 48, 16, 8);
  ctx.fillStyle = "#111";
  ctx.fillRect(x + 2, y + 55, 16, 4);
  ctx.fillRect(x + 33, y + 55, 18, 4);
  ctx.restore();
}

function drawEnemy(e) {
  ctx.fillStyle = e.color;
  ctx.fillRect(e.x, e.y, e.w, e.h);
  ctx.fillStyle = "#070a10";
  ctx.fillRect(e.x + 6, e.y + 10, 6, 6);
  ctx.fillRect(e.x + e.w - 12, e.y + 10, 6, 6);
  if (e.type === "doll" || e.name === "Gravida de Taubate") {
    ctx.fillStyle = "#fff4d6";
    ctx.fillRect(e.x + e.w * .25, e.y - 12, e.w * .5, 10);
  }
  ctx.fillStyle = "#05070b";
  ctx.fillRect(e.x, e.y - 10, e.w, 5);
  ctx.fillStyle = "#ff5d73";
  ctx.fillRect(e.x, e.y - 10, e.w * Math.max(0, e.hp / e.maxHp), 5);
}

function drawHud() {
  const p = state.player || makePlayer();
  ctx.fillStyle = "rgba(5,7,11,.86)";
  ctx.fillRect(16, 14, 420, 70);
  ctx.fillStyle = "#fff4d6";
  ctx.font = "18px monospace";
  ctx.fillText(`${currentHero().name} | ${stages[state.stage].name}`, 28, 38);
  ctx.fillStyle = "#3b475f";
  ctx.fillRect(28, 50, 230, 12);
  ctx.fillStyle = p.hp > p.maxHp * .35 ? "#70e39a" : "#ff5d73";
  ctx.fillRect(28, 50, 230 * Math.max(0, p.hp / p.maxHp), 12);
  ctx.fillStyle = "#ffd166";
  ctx.fillText(`${state.kills}/${stages[state.stage].goal} viloes`, 280, 63);

  if (!state.running) {
    ctx.fillStyle = "rgba(5,7,11,.74)";
    ctx.fillRect(190, 160, 580, 190);
    ctx.strokeStyle = "#ffd166";
    ctx.strokeRect(190, 160, 580, 190);
    ctx.fillStyle = "#ffd166";
    ctx.font = "36px monospace";
    ctx.fillText("REINO PIXEL", 330, 225);
    ctx.fillStyle = "#fff4d6";
    ctx.font = "18px monospace";
    ctx.fillText(state.message, 245, 274);
    ctx.fillText("Celular: use os botoes na tela.", 300, 312);
  } else if (state.paused) {
    ctx.fillStyle = "rgba(5,7,11,.72)";
    ctx.fillRect(0, 0, W, H);
    ctx.fillStyle = "#70e39a";
    ctx.font = "44px monospace";
    ctx.fillText("PAUSADO", 370, 270);
  }
}

function draw() {
  drawBg();
  state.shots.forEach(s => {
    ctx.fillStyle = s.color;
    ctx.fillRect(s.x, s.y, s.w, s.h);
  });
  state.enemyShots.forEach(s => {
    ctx.fillStyle = s.color;
    ctx.fillRect(s.x, s.y, s.w, s.h);
    if (s.label === "boneco cenografico") {
      ctx.fillStyle = "#fff4d6";
      ctx.fillRect(s.x + 4, s.y + 4, 4, 4);
    }
  });
  state.enemies.forEach(drawEnemy);
  if (state.player) drawPlayer(state.player);
  state.particles.forEach(pt => {
    ctx.fillStyle = pt.color;
    ctx.fillRect(pt.x, pt.y, 4, 4);
  });
  drawHud();
}

function renderUI() {
  ui.stage.textContent = `Fase ${state.stage + 1}`;
  ui.wallet.textContent = `${state.coins} moedas`;
  ui.hero.textContent = currentHero().name;
  ui.count.textContent = `${heroes.length}`;
  ui.difficulty.textContent = stages[state.stage].final ? "Extrema" : "Dificil";

  ui.heroes.innerHTML = "";
  heroes.forEach((h, i) => {
    const card = document.createElement("div");
    card.className = `card ${i === state.hero ? "active" : ""}`;
    card.innerHTML = `<strong>${h.name}</strong><small>${h.desc}</small><button type="button">Usar</button>`;
    card.querySelector("button").onclick = () => {
      state.hero = i;
      restartStage();
    };
    ui.heroes.appendChild(card);
  });

  ui.shop.innerHTML = "";
  shopItems.forEach(item => {
    const lvl = itemLevel(item.id);
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `<strong>${item.name} ${lvl}/${item.max}</strong><small>${item.desc}<br>${item.cost} moedas</small><button type="button">${lvl >= item.max ? "Maximo" : "Comprar"}</button>`;
    const btn = card.querySelector("button");
    btn.disabled = lvl >= item.max || state.coins < item.cost;
    btn.onclick = () => buy(item);
    ui.shop.appendChild(card);
  });

  ui.stages.innerHTML = "";
  stages.forEach((s, i) => {
    const li = document.createElement("li");
    li.className = i === state.stage ? "active" : "";
    li.textContent = `${s.name} - ${s.final ? "RPG medieval extremo" : `${s.hard.toFixed(2)}x`}`;
    ui.stages.appendChild(li);
  });
}

function buy(item) {
  if (state.coins < item.cost || itemLevel(item.id) >= item.max) return;
  state.coins -= item.cost;
  state.items[item.id] = itemLevel(item.id) + 1;
  if (item.id === "potion" && state.player) state.player.hp = state.player.maxHp;
  save();
  restartStage();
}

function loop() {
  update();
  draw();
  if (state.frame % 12 === 0) renderUI();
  requestAnimationFrame(loop);
}

function setHold(name, value, button) {
  keys[name] = value;
  if (button) button.classList.toggle("is-down", value);
}

document.getElementById("startBtn").onclick = startGame;
document.getElementById("pauseBtn").onclick = () => {
  if (state.running) state.paused = !state.paused;
};
document.getElementById("stopBtn").onclick = stopGame;
document.getElementById("shopBtn").onclick = () => {
  state.shopOpen = !state.shopOpen;
  ui.shopPanel.classList.toggle("open", state.shopOpen);
};

document.querySelectorAll("[data-hold]").forEach(btn => {
  const key = btn.dataset.hold;
  btn.addEventListener("pointerdown", e => {
    e.preventDefault();
    setHold(key, true, btn);
  });
  ["pointerup", "pointercancel", "pointerleave"].forEach(type => {
    btn.addEventListener(type, e => {
      e.preventDefault();
      setHold(key, false, btn);
    });
  });
});

document.querySelectorAll("[data-tap]").forEach(btn => {
  btn.addEventListener("pointerdown", e => {
    e.preventDefault();
    const action = btn.dataset.tap;
    btn.classList.add("is-down");
    if (action === "jump") {
      keys.jump = true;
      setTimeout(() => keys.jump = false, 120);
    }
    if (action === "attack") shoot(false);
    if (action === "power") special();
  });
  ["pointerup", "pointercancel", "pointerleave"].forEach(type => {
    btn.addEventListener(type, () => btn.classList.remove("is-down"));
  });
});

document.addEventListener("keydown", e => {
  if (["ArrowLeft", "ArrowRight", "ArrowDown", "ArrowUp", " "].includes(e.key)) e.preventDefault();
  if (e.key === "ArrowLeft" || e.key.toLowerCase() === "a") keys.left = true;
  if (e.key === "ArrowRight" || e.key.toLowerCase() === "d") keys.right = true;
  if (e.key === "ArrowDown" || e.key.toLowerCase() === "s") keys.down = true;
  if (e.key === "ArrowUp" || e.key.toLowerCase() === "w" || e.key === " ") keys.jump = true;
  if (e.key.toLowerCase() === "x") shoot(false);
  if (e.key.toLowerCase() === "z") special();
  if (e.key.toLowerCase() === "p") state.paused = !state.paused;
  if (e.key === "Enter") startGame();
});

document.addEventListener("keyup", e => {
  if (e.key === "ArrowLeft" || e.key.toLowerCase() === "a") keys.left = false;
  if (e.key === "ArrowRight" || e.key.toLowerCase() === "d") keys.right = false;
  if (e.key === "ArrowDown" || e.key.toLowerCase() === "s") keys.down = false;
  if (e.key === "ArrowUp" || e.key.toLowerCase() === "w" || e.key === " ") keys.jump = false;
});

renderUI();
loop();
