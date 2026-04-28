/* ═══════════════════════════════════════════
   ECOTRACK — app.js
   ═══════════════════════════════════════════ */

/* ── Demo Data ── */
const DATA = {
  community: "Dharavi Block 7, Mumbai",
  households: 34,
  water:  { today: 180, yesterday: 210, unit: "L"   },
  energy: { today: 42,  yesterday: 34,  unit: "kWh" },
  waste:  { today: 56,  yesterday: 42,  unit: "kg"  },
  ecoScore: 74,
  leaderboard: [
    { name: "House 14", badges: ["🍃","🍃","🍃"], score: 98  },
    { name: "House 03", badges: ["☀️","☀️","🍃"],  score: 85  },
    { name: "House 21", badges: ["💧","🍃","☀️"], score: 79  },
    { name: "House 09", badges: ["♻️","💧"],        score: 71  },
    { name: "House 27", badges: ["🍃","☀️"],        score: 66  },
  ]
};

/* ── Language ── */
let lang = "en";
const translations = {
  en: {
    syncNow:      "Sync Now",
    syncDone:     "Synced!",
    syncTime:     "Just now",
    voiceNote:    "Voice Note",
    recording:    "Recording…",
    submitBtn:    "Submit ✓",
    reportAnother:"Report Another",
    listenImpact: "Listen to your impact",
    shareWA:      "Share on WhatsApp",
    shareSMS:     "Send SMS",
    impactCalc:   "Impact Calculated! 🎉",
  },
  hi: {
    syncNow:      "सिंक करें",
    syncDone:     "सिंक हो गया!",
    syncTime:     "अभी",
    voiceNote:    "वॉयस नोट",
    recording:    "रिकॉर्ड हो रहा है…",
    submitBtn:    "जमा करें ✓",
    reportAnother:"एक और रिपोर्ट करें",
    listenImpact: "अपना प्रभाव सुनें",
    shareWA:      "WhatsApp पर शेयर करें",
    shareSMS:     "SMS भेजें",
    impactCalc:   "प्रभाव गणना हो गई! 🎉",
  }
};

function t(key) { return translations[lang][key] || translations.en[key]; }

function applyLang() {
  document.querySelectorAll("[data-en]").forEach(el => {
    el.textContent = el.dataset[lang] || el.dataset.en;
  });
  document.getElementById("langLabel").textContent = lang.toUpperCase();
}

document.getElementById("langToggle").addEventListener("click", () => {
  lang = lang === "en" ? "hi" : "en";
  applyLang();
});

/* ── Screen Navigation ── */
const screens = document.querySelectorAll(".screen");
const tabs    = document.querySelectorAll(".tab");

tabs.forEach(tab => {
  tab.addEventListener("click", () => {
    const target = tab.dataset.screen;
    screens.forEach(s => s.classList.remove("active"));
    tabs.forEach(t  => t.classList.remove("active"));
    document.getElementById("screen-" + target).classList.add("active");
    tab.classList.add("active");
    if (target === "feedback") animateFeedback();
  });
});

/* ── Sync Button ── */
const syncBtn  = document.getElementById("syncBtn");
const syncIcon = document.getElementById("syncIcon");
const syncTime = document.getElementById("syncTime");
const syncLabel= document.getElementById("syncBtnLabel");

syncBtn.addEventListener("click", () => {
  syncIcon.classList.add("spinning");
  syncBtn.disabled = true;
  syncLabel.textContent = lang === "hi" ? "सिंक हो रहा है…" : "Syncing…";
  setTimeout(() => {
    syncIcon.classList.remove("spinning");
    syncBtn.disabled = false;
    syncLabel.textContent = t("syncDone");
    syncTime.textContent  = (lang === "hi") ? "अभी सिंक हुआ" : "Just synced";
    setTimeout(() => {
      syncLabel.textContent = t("syncNow");
      syncTime.textContent  = (lang === "hi") ? "2 घंटे पहले" : "Last synced: 2 hrs ago";
    }, 4000);
  }, 2200);
});

/* ═══════════════════════════════════════════
   DASHBOARD INIT
   ═══════════════════════════════════════════ */
function buildLeaderboard() {
  const list = document.getElementById("leaderboard");
  list.innerHTML = "";
  const medals = ["gold", "silver", "bronze", "", ""];
  const rankSymbols = ["🥇", "🥈", "🥉", "4", "5"];
  DATA.leaderboard.forEach((h, i) => {
    const item = document.createElement("div");
    item.className = "lb-item";
    item.innerHTML = `
      <div class="lb-rank ${medals[i]}">${rankSymbols[i]}</div>
      <div class="lb-name">${h.name}</div>
      <div class="lb-badges">${h.badges.map(b => `<span class="lb-badge">${b}</span>`).join("")}</div>
      <div class="lb-score">${h.score} pts</div>`;
    list.appendChild(item);
  });
}

function animateRing() {
  const score  = DATA.ecoScore;
  const ring   = document.getElementById("ecoRing");
  const ringScore  = document.getElementById("ringScore");
  const ringStatus = document.getElementById("ringStatus");
  const circumference = 314;
  const offset = circumference - (score / 100) * circumference;

  let color = score >= 70 ? "#2D6A4F" : score >= 45 ? "#E9C46A" : "#E76F51";
  let status = score >= 70 ? (lang === "hi" ? "अच्छा 🌿" : "Great 🌿")
             : score >= 45 ? (lang === "hi" ? "ठीक है 🌤️" : "OK 🌤️")
             : (lang === "hi" ? "सतर्क 🔴" : "Alert 🔴");

  ring.style.stroke = color;
  ringStatus.style.color = color;
  ringStatus.textContent = status;

  setTimeout(() => {
    ring.style.strokeDashoffset = offset;
    let current = 0;
    const step = score / 60;
    const counter = setInterval(() => {
      current = Math.min(current + step, score);
      ringScore.textContent = Math.round(current);
      if (current >= score) clearInterval(counter);
    }, 25);
  }, 400);
}

function animateTree() {
  const score = DATA.ecoScore;
  const l1 = document.getElementById("treeL1");
  const l2 = document.getElementById("treeL2");
  const l3 = document.getElementById("treeL3");
  const flowers = document.getElementById("treeFlowers");

  if (score >= 30) setTimeout(() => l1.classList.add("grown"), 400);
  if (score >= 55) setTimeout(() => l2.classList.add("grown"), 800);
  if (score >= 70) setTimeout(() => l3.classList.add("grown"), 1200);
  if (score >= 65) setTimeout(() => flowers.classList.add("visible"), 1600);
}

buildLeaderboard();
animateRing();
animateTree();

/* ═══════════════════════════════════════════
   INPUT / CHAT SCREEN
   ═══════════════════════════════════════════ */
const catConfig = {
  water:  { emoji: "💧", unit: "L",   color: "#48CAE4", label: "Water",  labelHi: "पानी"  },
  energy: { emoji: "⚡", unit: "kWh", color: "#E9C46A", label: "Energy", labelHi: "ऊर्जा" },
  waste:  { emoji: "♻️", unit: "kg",  color: "#52B788", label: "Waste",  labelHi: "कचरा"  },
};

let selectedCat = null;
let voiceActive  = false;
let voiceTimer   = null;

const chatMessages = document.getElementById("chatMessages");
const categoryTiles= document.getElementById("categoryTiles");
const inputRow     = document.getElementById("inputRow");
const confirmWrap  = document.getElementById("confirmWrap");
const numInput     = document.getElementById("numInput");
const numUnit      = document.getElementById("numUnit");
const selectedBadge= document.getElementById("selectedCatBadge");
const voiceBtn     = document.getElementById("voiceBtn");
const voiceIcon    = document.getElementById("voiceIcon");
const voiceLabel   = document.getElementById("voiceBtnLabel");

function addMsg(text, type = "bot") {
  const now = new Date();
  const time = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  const div = document.createElement("div");
  div.className = `msg ${type}`;
  div.innerHTML = `<div class="msg-bubble">${text}</div><div class="msg-time">${time}</div>`;
  chatMessages.appendChild(div);
  chatMessages.scrollTo({ top: chatMessages.scrollHeight, behavior: "smooth" });
}

document.querySelectorAll(".cat-tile").forEach(tile => {
  tile.addEventListener("click", () => {
    const cat  = tile.dataset.cat;
    const cfg  = catConfig[cat];
    selectedCat = cat;

    // User selection message
    const catName = lang === "hi" ? cfg.labelHi : cfg.label;
    addMsg(`${cfg.emoji} ${catName}`, "user");

    // Bot response
    setTimeout(() => {
      const prompt = lang === "hi"
        ? `कितने ${cfg.unit} ${cfg.labelHi} बचाई/साझा की?`
        : `How many ${cfg.unit} of ${cfg.label} did you save/share?`;
      addMsg(prompt, "bot");
    }, 500);

    numUnit.textContent     = cfg.unit;
    selectedBadge.innerHTML = `${cfg.emoji} <strong>${lang === "hi" ? cfg.labelHi : cfg.label}</strong> selected`;
    categoryTiles.style.display = "none";
    inputRow.style.display      = "flex";
    numInput.focus();
  });
});

voiceBtn.addEventListener("click", () => {
  if (voiceActive) {
    clearInterval(voiceTimer);
    voiceActive = false;
    voiceBtn.classList.remove("recording");
    voiceIcon.textContent = "🎙️";
    voiceLabel.textContent = t("voiceNote");
    addMsg("🎙️ Voice note recorded (3s)", "user");
    setTimeout(() => addMsg(lang === "hi" ? "वॉयस नोट प्राप्त हुआ ✅" : "Got it! Voice note received ✅", "bot"), 600);
  } else {
    voiceActive = true;
    voiceBtn.classList.add("recording");
    voiceIcon.textContent = "⏹️";
    voiceLabel.textContent = t("recording");
    let sec = 0;
    voiceTimer = setInterval(() => {
      sec++;
      voiceLabel.textContent = `${sec}s…`;
    }, 1000);
  }
});

document.getElementById("submitBtn").addEventListener("click", submitReport);
numInput.addEventListener("keydown", e => { if (e.key === "Enter") submitReport(); });

function submitReport() {
  const val = parseFloat(numInput.value);
  if (!val || val <= 0) {
    numInput.style.borderColor = "var(--red)";
    setTimeout(() => numInput.style.borderColor = "", 1200);
    return;
  }
  const cfg = catConfig[selectedCat];
  addMsg(`${val}${cfg.unit}`, "user");

  // Show confirm overlay
  confirmWrap.style.display = "flex";
  document.getElementById("confirmEmoji").textContent = cfg.emoji;
  document.getElementById("confirmTitle").textContent = t("impactCalc");

  const catName = lang === "hi" ? cfg.labelHi : cfg.label;
  const saved = lang === "hi"
    ? `आपने आज <strong>${val}${cfg.unit}</strong> ${catName} बचाई।`
    : `You saved <strong>${val}${cfg.unit}</strong> of ${catName} today.`;
  document.getElementById("confirmMsg").innerHTML = saved;

  // Animate confirm ring
  setTimeout(() => {
    document.getElementById("confirmRing").style.strokeDashoffset = "0";
  }, 200);

  // Update live metric
  if (selectedCat === "water")  { DATA.water.today  += val; updateMetricCard("waterVal",  DATA.water.today,  "L");   }
  if (selectedCat === "energy") { DATA.energy.today += val; updateMetricCard("energyVal", DATA.energy.today, "kWh"); }
  if (selectedCat === "waste")  { DATA.waste.today  += val; updateMetricCard("wasteVal",  DATA.waste.today,  "kg");  }
}

function updateMetricCard(id, val, unit) {
  const el = document.getElementById(id);
  el.innerHTML = `${val}<span class="metric-unit">${unit}</span>`;
  el.parentElement.style.transform = "scale(1.08)";
  setTimeout(() => el.parentElement.style.transform = "", 300);
}

document.getElementById("confirmNewBtn").addEventListener("click", () => {
  confirmWrap.style.display = "none";
  document.getElementById("confirmRing").style.strokeDashoffset = "264";
  categoryTiles.style.display = "flex";
  inputRow.style.display      = "none";
  numInput.value              = "";
  selectedCat                 = null;
  voiceActive                 = false;
  voiceBtn.classList.remove("recording");
  voiceIcon.textContent       = "🎙️";
  voiceLabel.textContent      = t("voiceNote");
});

/* ═══════════════════════════════════════════
   FEEDBACK SCREEN
   ═══════════════════════════════════════════ */
let feedbackAnimated = false;

function animateFeedback() {
  const score = DATA.ecoScore;
  const shell = document.getElementById("feedbackShell");
  const hero  = document.querySelector(".feedback-hero");
  const badge = document.getElementById("feedbackBadge");
  const number= document.getElementById("feedbackNumber");
  const msg   = document.getElementById("feedbackMessage");
  const icon  = document.getElementById("feedbackIcon");

  if (score >= 70) {
    hero.style.background = "linear-gradient(135deg,#2D6A4F,#40916C)";
    badge.textContent = lang === "hi" ? "🟢 बेहतरीन प्रदर्शन" : "🟢 Great Performance";
    icon.textContent = "💧";
  } else if (score >= 45) {
    hero.style.background = "linear-gradient(135deg,#9B7D1A,#E9C46A)";
    badge.textContent = lang === "hi" ? "🟡 ठीक-ठाक प्रदर्शन" : "🟡 OK Performance";
    icon.textContent = "⚡";
  } else {
    hero.style.background = "linear-gradient(135deg,#B84A2B,#E76F51)";
    badge.textContent = lang === "hi" ? "🔴 ध्यान दें!" : "🔴 Needs Attention!";
    icon.textContent = "⚠️";
  }

  number.textContent = DATA.water.today + "L";
  msg.innerHTML = lang === "hi"
    ? `आपके समूह ने आज <strong>${DATA.water.today}L</strong> बचाए!`
    : `Your group saved <strong>${DATA.water.today}L</strong> today!`;

  // Animate bars
  setTimeout(() => {
    document.getElementById("fbWaterBar").style.width  = Math.min((DATA.water.today  / 250) * 100, 100) + "%";
    document.getElementById("fbEnergyBar").style.width = Math.min((DATA.energy.today / 80)  * 100, 100) + "%";
    document.getElementById("fbWasteBar").style.width  = Math.min((DATA.waste.today  / 80)  * 100, 100) + "%";
  }, 300);
}

/* Audio playback simulation */
const audioBtn  = document.getElementById("audioBtn");
const audioWave = document.getElementById("audioWave");
let playing = false;
let audioTimer = null;

audioBtn.addEventListener("click", () => {
  if (playing) {
    playing = false;
    audioWave.classList.remove("playing");
    clearTimeout(audioTimer);
    audioBtn.querySelector(".audio-icon-wrap").style.background = "var(--green)";
  } else {
    playing = true;
    audioWave.classList.add("playing");
    audioBtn.querySelector(".audio-icon-wrap").style.background = "var(--red)";
    audioTimer = setTimeout(() => {
      playing = false;
      audioWave.classList.remove("playing");
      audioBtn.querySelector(".audio-icon-wrap").style.background = "var(--green)";
    }, 8000);
  }
});

/* Nudge buttons */
document.getElementById("nudgeWA").addEventListener("click", () => {
  const msg = encodeURIComponent(
    lang === "hi"
    ? `मैं EcoTrack से जुड़ा हूँ! आज हमने ${DATA.water.today}L पानी बचाया। आप भी जुड़ें!`
    : `I'm on EcoTrack! Our community saved ${DATA.water.today}L today. Join us! 🌿`
  );
  window.open(`https://wa.me/?text=${msg}`, "_blank");
});

document.getElementById("nudgeSMS").addEventListener("click", () => {
  const body = lang === "hi"
    ? `EcoTrack: आज ${DATA.water.today}L बचाए। जुड़ें!`
    : `EcoTrack: We saved ${DATA.water.today}L today. Join Dharavi Block 7!`;
  window.open(`sms:?body=${encodeURIComponent(body)}`, "_blank");
});

/* ── Initial language pass ── */
applyLang();
