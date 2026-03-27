// =========================
// ДАННЫЕ
// =========================
const defaultWords = [
  { word: "аба", tr: ["отец"] },
  { word: "аару", tr: ["пчела"] },
  { word: "ай", tr: ["луна"] },
  { word: "айак", tr: ["нога"] },
  { word: "айу", tr: ["медведь"] },
  { word: "ақ", tr: ["белый", "течь", "плыть"] },
  { word: "ал", tr: ["брать", "получать"] },
  { word: "алтын", tr: ["золото"] },
  { word: "амыр", tr: ["спокойный", "мир"] },
  { word: "ач", tr: ["голодный"] },
  { word: "аш", tr: ["еда"] }
];

// =========================
// АЛФАВИТ
// =========================
const teleutAlphabet = [
  { label: "А а", file: "a" },
  { label: "Б б", file: "b" },
  { label: "В в", file: "v" },
  { label: "Г г", file: "g" },
  { label: "Ғ ғ", file: "gh" },
  { label: "Д д", file: "d" },
  { label: "Е е", file: "e" },
  { label: "Ё ё", file: "yo" },
  { label: "Ж ж", file: "zh" },
  { label: "З з", file: "z" },
  { label: "И и", file: "i" },
  { label: "Й й", file: "y" },
  { label: "К к", file: "k" },
  { label: "Қ қ", file: "q" },
  { label: "Л л", file: "l" },
  { label: "М м", file: "m" },
  { label: "Н н", file: "n" },
  { label: "Ң ң", file: "ng" },
  { label: "О о", file: "o" },
  { label: "Ö ö", file: "o2" },
  { label: "П п", file: "p" },
  { label: "Р р", file: "r" },
  { label: "С с", file: "s" },
  { label: "Т т", file: "t" },
  { label: "У у", file: "u" },
  { label: "Ӱ ӱ", file: "u2" },
  { label: "Ф ф", file: "f" },
  { label: "Х х", file: "h" },
  { label: "Ц ц", file: "ts" },
  { label: "Ч ч", file: "ch" },
  { label: "Ш ш", file: "sh" },
  { label: "Щ щ", file: "shh" },
  { label: "Ы ы", file: "y2" },
  { label: "Э э", file: "e2" },
  { label: "Ю ю", file: "yu" },
  { label: "Я я", file: "ya" },
  { label: "J j", file: "j" }
];

// =========================
// AUDIO (фикс бага)
// =========================
let currentAudio = null;

function playSound(name) {
  if (currentAudio) {
    currentAudio.pause();
    currentAudio.currentTime = 0;
  }

  currentAudio = new Audio("sounds/" + name + ".mp3");
  currentAudio.play().catch(() => {});
}

// =========================
// СОСТОЯНИЕ
// =========================
let words = [...defaultWords];
let currentTab = "tl";

const content = document.getElementById("content");
const searchInput = document.getElementById("search");
const titleEl = document.getElementById("title");

// =========================
// РЕНДЕР
// =========================
function render() {
  if (currentTab === "tl") renderTL();
  if (currentTab === "ru") renderRU();
  if (currentTab === "abc") renderABC();
}

// =========================
// ТЕЛЕУТ → РУССКИЙ
// =========================
function renderTL() {
  const s = searchInput.value.toLowerCase();

  const list = words.filter(w => w.word.includes(s));

  content.innerHTML = list.map(w => `
    <div class="card">
      <div class="word">${w.word}</div>
    </div>
  `).join("");
}

// =========================
// РУССКИЙ → ТЕЛЕУТ
// =========================
function renderRU() {
  const s = searchInput.value.toLowerCase();

  const list = words.filter(w =>
    w.tr.join(" ").toLowerCase().includes(s)
  );

  content.innerHTML = list.map(w => `
    <div class="card">
      <div class="word">${w.tr[0]}</div>
      <div class="sub">${w.word}</div>
    </div>
  `).join("");
}

// =========================
// АЗБУКА
// =========================
function renderABC() {
  searchInput.value = "";
  searchInput.classList.add("hidden");

  content.innerHTML = `
    <div class="gridABC">
      ${teleutAlphabet.map(l => `
        <div class="cardABC" onclick="playSound('${l.file}')">
          <div class="letterABC">${l.label}</div>

          <img src="images/${l.file}.png"
          onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">

          <div class="imgPlaceholder" style="display:none;">
            нет<br>картинки
          </div>

        </div>
      `).join("")}
    </div>
  `;
}

// =========================
// ТАБЫ
// =========================
function switchTab(tab) {
  currentTab = tab;

  searchInput.classList.remove("hidden");

  if (tab === "abc") {
    titleEl.innerText = "Азбука";
  } else {
    titleEl.innerText = "Словарь";
  }

  render();
}

// =========================
// ПОИСК
// =========================
searchInput.addEventListener("input", render);

// =========================
// СТАРТ
// =========================
switchTab("tl");
