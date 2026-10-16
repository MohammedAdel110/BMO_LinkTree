const video = document.getElementById("intro");
const soundBtn = document.getElementById("soundBtn");
const screen = document.querySelector(".crt-screen");
const canvas = document.getElementById("spark");

function playVideo() {
  video.play().catch(() => {});
}

function toggleSound(event) {
  event?.stopPropagation();
  video.muted = !video.muted;
  soundBtn.classList.toggle("is-on", !video.muted);
  soundBtn.setAttribute("aria-pressed", String(!video.muted));
  soundBtn.setAttribute("aria-label", video.muted ? "Unmute video" : "Mute video");
  playVideo();
}

soundBtn.addEventListener("click", toggleSound);
screen.addEventListener("click", (event) => {
  if (event.target.closest(".sound")) return;
  toggleSound(event);
});

document.addEventListener("visibilitychange", () => {
  if (!document.hidden) playVideo();
});

playVideo();

function spawn() {
  return {
    x: Math.random(),
    y: Math.random(),
    s: 0.6 + Math.random() * 1.8,
    v: 0.0004 + Math.random() * 0.0012,
    a: 0.25 + Math.random() * 0.55,
    hue: Math.random() > 0.5 ? "rgba(107,182,170," : "rgba(255,106,213,",
  };
}

const ctx = canvas?.getContext?.("2d");
if (ctx) {
  const sparks = Array.from({ length: 48 }, () => spawn());

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  function tick() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (const p of sparks) {
      p.y -= p.v;
      if (p.y < -0.02) {
        p.y = 1.02;
        p.x = Math.random();
      }
      ctx.fillStyle = `${p.hue}${p.a})`;
      ctx.fillRect(p.x * canvas.width, p.y * canvas.height, p.s, p.s);
    }
    requestAnimationFrame(tick);
  }

  window.addEventListener("resize", resize);
  resize();
  tick();
}

// BMO Audio Synthesizer using Web Audio API
class BMOSoundSynth {
  constructor() {
    this.ctx = null;
  }

  init() {
    if (!this.ctx) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (AudioContextClass) {
        this.ctx = new AudioContextClass();
      }
    }
    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume().catch(() => {});
    }
  }

  playHappy() {
    this.init();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const freqs = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
    freqs.forEach((f, i) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = "triangle";
      osc.frequency.setValueAtTime(f, now + i * 0.055);
      gain.gain.setValueAtTime(0, now + i * 0.055);
      gain.gain.linearRampToValueAtTime(0.18, now + i * 0.055 + 0.012);
      gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.055 + 0.16);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now + i * 0.055);
      osc.stop(now + i * 0.055 + 0.18);
    });
  }

  playSad() {
    this.init();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(440, now); // A4
    osc.frequency.exponentialRampToValueAtTime(349.23, now + 0.18); // F4
    osc.frequency.exponentialRampToValueAtTime(293.66, now + 0.42); // D4
    gain.gain.setValueAtTime(0.16, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.52);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.55);
  }

  playWow() {
    this.init();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = "triangle";
    osc.frequency.setValueAtTime(320, now);
    osc.frequency.exponentialRampToValueAtTime(880, now + 0.12);
    osc.frequency.exponentialRampToValueAtTime(1320, now + 0.2);
    gain.gain.setValueAtTime(0.18, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.3);
  }

  playLove() {
    this.init();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    [659.25, 830.61, 987.77].forEach((f, i) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(f, now + i * 0.04);
      gain.gain.setValueAtTime(0.12, now + i * 0.04);
      gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.04 + 0.36);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now + i * 0.04);
      osc.stop(now + i * 0.04 + 0.38);
    });
  }

  playSleepy() {
    this.init();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const click = this.ctx.createOscillator();
    const clickGain = this.ctx.createGain();
    click.type = "square";
    click.frequency.setValueAtTime(180, now);
    clickGain.gain.setValueAtTime(0.08, now);
    clickGain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
    click.connect(clickGain);
    clickGain.connect(this.ctx.destination);
    click.start(now);
    click.stop(now + 0.05);

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(261.63, now + 0.04);
    osc.frequency.exponentialRampToValueAtTime(196.00, now + 0.32);
    gain.gain.setValueAtTime(0.14, now + 0.04);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.44);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now + 0.04);
    osc.stop(now + 0.46);
  }

  playMango() {
    this.init();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    [880, 1174.66, 1760].forEach((f, i) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = "triangle";
      osc.frequency.setValueAtTime(f, now + i * 0.04);
      gain.gain.setValueAtTime(0, now + i * 0.04);
      gain.gain.linearRampToValueAtTime(0.15, now + i * 0.04 + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.04 + 0.2);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now + i * 0.04);
      osc.stop(now + i * 0.04 + 0.22);
    });
  }

  playTick() {
    this.init();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(750, now);
    gain.gain.setValueAtTime(0.07, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.05);
  }
}

const bmoSound = new BMOSoundSynth();

const bmo = document.getElementById("bmo");
const bmoMood = document.getElementById("bmoMood");
const bmoHint = document.getElementById("bmoHint");
const dpadBtn = document.getElementById("btnDpad");

const moodData = {
  happy: {
    label: "BMO is smiling",
    hint: "BMO is happy! 💛",
    sound: () => bmoSound.playHappy()
  },
  sad: {
    label: "BMO is sad and crying",
    hint: "BMO is sad... 💔",
    sound: () => bmoSound.playSad()
  },
  wow: {
    label: "BMO is surprised",
    hint: "BMO is amazed! ⚡",
    sound: () => bmoSound.playWow()
  },
  love: {
    label: "BMO has heart eyes",
    hint: "BMO loves you! 💚",
    sound: () => bmoSound.playLove()
  },
  sleepy: {
    label: "BMO is sleepy",
    hint: "BMO is sleepy... 💤",
    sound: () => bmoSound.playSleepy()
  },
  mango: {
    label: "BMO is eating a mango",
    hint: "BMO loves mango! 🥭",
    sound: () => bmoSound.playMango()
  }
};

let hintTimer = null;
let dirTimer = null;

function setMood(mood, dir = null) {
  if (!bmo || !moodData[mood]) return;

  bmo.dataset.mood = mood;
  if (dir) {
    bmo.dataset.dir = dir;
    clearTimeout(dirTimer);
    dirTimer = setTimeout(() => {
      delete bmo.dataset.dir;
    }, 600);
  } else {
    delete bmo.dataset.dir;
  }

  // Trigger bounce/react animation
  bmo.classList.remove("react");
  void bmo.offsetWidth;
  bmo.classList.add("react");

  const info = moodData[mood];
  if (bmoMood) bmoMood.textContent = info.label;

  if (bmoHint) {
    bmoHint.textContent = info.hint;
    bmoHint.classList.add("active-hint");
    clearTimeout(hintTimer);
    hintTimer = setTimeout(() => {
      bmoHint.textContent = "press the buttons";
      bmoHint.classList.remove("active-hint");
    }, 2800);
  }

  // Play corresponding chiptune sound
  try {
    info.sound();
  } catch (_) {}
}

// Attach click listeners to all controller buttons
bmo?.querySelectorAll("[data-mood]").forEach((btn) => {
  btn.addEventListener("click", (event) => {
    event.stopPropagation();
    btn.classList.add("down");
    setTimeout(() => btn.classList.remove("down"), 160);

    const dirTarget = event.target.closest("[data-dir]");
    const dir = dirTarget ? dirTarget.dataset.dir : null;

    if (dir && dpadBtn) {
      dpadBtn.classList.remove("tilt-up", "tilt-down", "tilt-left", "tilt-right");
      dpadBtn.classList.add(`tilt-${dir}`);
      setTimeout(() => dpadBtn.classList.remove(`tilt-${dir}`), 220);
    }

    setMood(btn.dataset.mood, dir);
  });
});

// Click screen directly to cycle through moods
const moodKeys = ["happy", "love", "wow", "mango", "sleepy", "sad"];
document.getElementById("bmoScreen")?.addEventListener("click", () => {
  const current = bmo?.dataset.mood || "happy";
  const nextIdx = (moodKeys.indexOf(current) + 1) % moodKeys.length;
  setMood(moodKeys[nextIdx]);
});

// Keyboard controls: Arrow keys, WASD, 1-5, H, S, W, L, Z, M
window.addEventListener("keydown", (event) => {
  if (event.target.tagName === "INPUT" || event.target.tagName === "TEXTAREA") return;

  const key = event.key.toLowerCase();

  if (key === "arrowup" || key === "w") {
    dpadBtn?.classList.add("tilt-up", "down");
    setTimeout(() => dpadBtn?.classList.remove("tilt-up", "down"), 180);
    setMood("happy", "up");
  } else if (key === "arrowdown" || key === "s") {
    dpadBtn?.classList.add("tilt-down", "down");
    setTimeout(() => dpadBtn?.classList.remove("tilt-down", "down"), 180);
    setMood("happy", "down");
  } else if (key === "arrowleft" || key === "a") {
    dpadBtn?.classList.add("tilt-left", "down");
    setTimeout(() => dpadBtn?.classList.remove("tilt-left", "down"), 180);
    setMood("happy", "left");
  } else if (key === "arrowright" || key === "d") {
    dpadBtn?.classList.add("tilt-right", "down");
    setTimeout(() => dpadBtn?.classList.remove("tilt-right", "down"), 180);
    setMood("happy", "right");
  } else if (key === "1" || key === "h") {
    const btn = document.getElementById("btnDpad");
    btn?.classList.add("down");
    setTimeout(() => btn?.classList.remove("down"), 160);
    setMood("happy");
  } else if (key === "2" || key === "z") {
    const btn = document.getElementById("btnSlot");
    btn?.classList.add("down");
    setTimeout(() => btn?.classList.remove("down"), 160);
    setMood("sleepy");
  } else if (key === "3" || key === "o") {
    const btn = document.getElementById("btnTri");
    btn?.classList.add("down");
    setTimeout(() => btn?.classList.remove("down"), 160);
    setMood("wow");
  } else if (key === "4" || key === "l") {
    const btn = document.getElementById("btnGreen");
    btn?.classList.add("down");
    setTimeout(() => btn?.classList.remove("down"), 160);
    setMood("love");
  } else if (key === "5" || key === "x") {
    const btn = document.getElementById("btnRed");
    btn?.classList.add("down");
    setTimeout(() => btn?.classList.remove("down"), 160);
    setMood("sad");
  } else if (key === "m") {
    const btn = document.getElementById("btnMango");
    btn?.classList.add("down");
    setTimeout(() => btn?.classList.remove("down"), 160);
    setMood("mango");
  }
});

const bmoPixel = document.getElementById("bmoPixel");
bmoPixel?.addEventListener("click", () => {
  bmoPixel.classList.remove("bounce");
  void bmoPixel.offsetWidth;
  bmoPixel.classList.add("bounce");
  try {
    bmoSound.playHappy();
  } catch (_) {}
});

