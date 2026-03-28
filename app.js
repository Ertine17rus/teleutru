// =========================
// Локальная база слов
// =========================
const defaultWords = [
  { word: "аба", tr: ["отец"] },
  { word: "аару", tr: ["пчела"] },
  { word: "ай", tr: ["луна", "месяц"] },
  { word: "айак", tr: ["нога"] },
  { word: "айу", tr: ["медведь"] },
  { word: "ақ", tr: ["белый", "течь", "плыть"] },
  { word: "ал", tr: ["брать", "получать"] },
  { word: "алтын", tr: ["золото"] },
  { word: "амыр", tr: ["спокойный", "мир"] },
  { word: "ач", tr: ["голодный"] },
  { word: "аш", tr: ["еда"] }
];

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

const teleutNumbers = [
  { label: "1", file: "1" },
  { label: "2", file: "2" },
  { label: "3", file: "3" },
  { label: "4", file: "4" },
  { label: "5", file: "5" },
  { label: "6", file: "6" },
  { label: "7", file: "7" },
  { label: "8", file: "8" },
  { label: "9", file: "9" },
  { label: "10", file: "10" }
];

let storedWords = [];
try {
  storedWords = JSON.parse(localStorage.getItem("words")) || [];
} catch (e) {
  storedWords = [];
}

let words = [];
let currentTab = "tl";
let activeInput = null;
let aboutStatusMessage = "";
let currentABCSection = "letters";

// =========================
// DOM
// =========================
const searchInput = document.getElementById("search");
const content = document.getElementById("content");
const modal = document.getElementById("modal");
const titleEl = document.getElementById("title");

// =========================
// Инициализация слов
// =========================
function normalizeWord(wordObj) {
  return {
    word: String(wordObj.word || "").trim(),
    tr: Array.isArray(wordObj.tr)
      ? wordObj.tr.map(x => String(x).trim()).filter(Boolean)
      : []
  };
}

function uniqueKey(wordObj) {
  return `${wordObj.word.toLowerCase()}__${wordObj.tr.join("|").toLowerCase()}`;
}

function mergeWords(baseList, extraList) {
  const map = new Map();

  [...baseList, ...extraList].forEach(item => {
    const normalized = normalizeWord(item);
    if (!normalized.word || !normalized.tr.length) return;
    map.set(uniqueKey(normalized), normalized);
  });

  return Array.from(map.values()).sort((a, b) => a.word.localeCompare(b.word, "ru"));
}

words = mergeWords(defaultWords, storedWords);
saveLocalWords();

// =========================
// События
// =========================
document.addEventListener("focusin", (e) => {
  if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA") {
    activeInput = e.target;
  }
});

document.addEventListener("click", (e) => {
  if (e.target.classList.contains("modal")) {
    closeModal();
  }
});

searchInput.addEventListener("input", render);

// =========================
// Сохранение
// =========================
function saveLocalWords() {
  localStorage.setItem("words", JSON.stringify(words));
}

// =========================
// Вкладки
// =========================
function switchTab(tab) {
  currentTab = tab;

  const titles = {
    tl: "Телеут → Орус сöзлик",
    ru: "Русско → Телеутский словарь",
    abc: "Телеутская говорящая азбука",
    about: "Поддержите проект"
  };

  titleEl.innerText = titles[tab] || "Teleut App";

  if (tab === "tl") {
    searchInput.placeholder = "Педреерге";
    searchInput.classList.remove("hidden");
  }

  if (tab === "ru") {
    searchInput.placeholder = "Поиск";
    searchInput.classList.remove("hidden");
  }

  if (tab === "abc") {
    searchInput.value = "";
    searchInput.placeholder = "";
    searchInput.classList.add("hidden");
  }

  if (tab === "about") {
    searchInput.value = "";
    searchInput.placeholder = "";
    searchInput.classList.add("hidden");
  }

  updateActiveTabUI();
  render();
}

function updateActiveTabUI() {
  ["tl", "ru", "abc", "about"].forEach(id => {
    const el = document.getElementById("tab-" + id);
    if (el) {
      el.classList.toggle("active", currentTab === id);
    }
  });
}

// =========================
// Рендер
// =========================
function render() {
  if (currentTab === "tl") renderTL();
  if (currentTab === "ru") renderRU();
  if (currentTab === "abc") renderABC();
  if (currentTab === "about") renderAbout();
}

function renderTL() {
  const s = searchInput.value.trim().toLowerCase();

  const list = words.filter(w =>
    w.word.toLowerCase().includes(s)
  );

  if (!list.length) {
    content.innerHTML = `<div class="empty">Ничего не найдено</div>`;
    return;
  }

  let html = "";
  list.forEach((w) => {
    html += `
      <div class="card" onclick="openWordByIndex(${getGlobalIndex(w)}, 'tl')">
        <div class="word">${escapeHtml(w.word)}</div>
      </div>
    `;
  });

  content.innerHTML = html;
}

function renderRU() {
  const s = searchInput.value.trim().toLowerCase();

  const list = words.filter(w =>
    w.tr.join(" ").toLowerCase().includes(s)
  );

  if (!list.length) {
    content.innerHTML = `<div class="empty">Ничего не найдено</div>`;
    return;
  }

  let html = "";
  list.forEach((w) => {
    html += `
      <div class="card" onclick="openWordByIndex(${getGlobalIndex(w)}, 'ru')">
        <div class="word">${escapeHtml(w.tr[0])}</div>
        <div class="sub">${escapeHtml(w.word)}</div>
      </div>
    `;
  });

  content.innerHTML = html;
}

function renderAbout() {
  content.innerHTML = `
    <div class="note">
      <h2>Сохраним телеутский язык</h2>
      <p>
        Этот проект создан для сохранения языка.
        Можно искать слова, смотреть переводы и добавлять новые слова локально на этом устройстве.
      </p>
      <p>Связь со мной:</p>
      <a class="contactLink" href="mailto:erbolhabibulin74@gmail.com">erbolhabibulin74@gmail.com</a>
    </div>

    <div style="height:12px;"></div>

    <input id="newWord" placeholder="Телеутское слово">
    <textarea id="newTr" placeholder="Переводы через ;&#10;Например: отец; папа"></textarea>
    <button class="primaryBtn" onclick="addWord()">Добавить слово</button>

    <div id="statusBox">
      ${aboutStatusMessage ? `<div class="status">${escapeHtml(aboutStatusMessage)}</div>` : ""}
    </div>
  `;
}

function renderABC() {
  content.innerHTML = `
    <div class="abcMenu">
      <button type="button" onclick="showABC('letters')">🔤 Телеут Букварь </button>
      <button type="button" onclick="showABC('numbers')">🔢 Тоолдор|Цифры</button>
      <button type="button" onclick="showABC('songs')">🎵 Сарындар|Песни</button>
    </div>

    <div id="abc-letters" class="${currentABCSection === "letters" ? "gridABC" : "gridABC hidden"}">
      ${teleutAlphabet.map(item => createLetterCard(item.label, item.file)).join("")}
    </div>

    <div id="abc-numbers" class="${currentABCSection === "numbers" ? "gridABC" : "gridABC hidden"}">
      ${teleutNumbers.map(item => createLetterCard(item.label, item.file)).join("")}
    </div>

    <div id="abc-songs" class="${currentABCSection === "songs" ? "songList" : "songList hidden"}">
      <button type="button" onclick="playMusic('song1')">▶️ Сарын|Песня </button>
      <button type="button" onclick="playMusic('song2')">▶️ Сарын|Песня </button>
      <button type="button" onclick="playMusic('song3')">▶️ Сарын|Песня </button>
      <button type="button" onclick="playMusic('song4')">▶️ Сарын|Песня </button>
      <button type="button" onclick="playMusic('song5')">▶️ Сарын|Песня </button>
      <button type="button" onclick="playMusic('song6')">▶️ Сарын|Песня </button>
      <button type="button" onclick="playMusic('song7')">▶️ Сарын|Песня </button>
      <button type="button" onclick="playMusic('song8')">▶️ Сарын|Песня </button>
      <button type="button" onclick="playMusic('song9')">▶️ Cарын|Песня </button>
      -->
    </div>
  `;
}

// =========================
// Азбука
// =========================
function createLetterCard(label, file) {
  return `
    <div class="cardABC" onclick="playSound('${file}')">
      <div class="letterABC">${escapeHtml(label)}</div>

      <!-- КАРТИНКИ ДЛЯ БУКВ:
           положи файл в папку images/
           пример: images/${file}.png
      -->
      <img
        src="images/${file}.png"
        alt="${escapeHtml(label)}"
        onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';"
      />

      <!-- Если картинки пока нет, покажется эта заглушка -->
      <div class="imgPlaceholder" style="display:none;">
        нет<br>картинки
      </div>
    </div>
  `;
}

function showABC(type) {
  currentABCSection = type;
  renderABC();
}

function playSound(name) {
  const audio = new Audio("sounds/" + name + ".mp3");
  audio.play().catch(() => {
    console.log("Нет звука для:", name);
  });
}

function playMusic(name) {
  const audio = new Audio("songs/" + name + ".mp3");
  audio.play().catch(() => {
    console.log("Нет песни:", name);
  });
}

// =========================
// Модалка слова
// =========================
function getGlobalIndex(wordObj) {
  return words.findIndex(x =>
    x.word === wordObj.word &&
    JSON.stringify(x.tr) === JSON.stringify(wordObj.tr)
  );
}

function openWordByIndex(index, type) {
  const w = words[index];
  if (!w) return;

  const tr = w.tr.map(t => `<li>${escapeHtml(t)}</li>`).join("");

  let html = "";

  if (type === "tl") {
    html = `
      <h2>(телеут.) ${escapeHtml(w.word)}</h2>
      <div><b>(рус.)</b></div>
      <ul>${tr}</ul>
    `;
  } else {
    html = `
      <h2>(рус.) ${escapeHtml(w.tr[0])}</h2>
      <div><b>(телеут.)</b></div>
      <div style="font-size:20px; color:#007aff; font-weight:700; margin-top:8px;">
        ${escapeHtml(w.word)}
      </div>
      ${
        w.tr.length > 1
          ? `<div class="sub" style="margin-top:10px;">Другие значения: ${escapeHtml(w.tr.slice(1).join(", "))}</div>`
          : ""
      }
    `;
  }

  modal.innerHTML = `
    <div class="modal">
      <div class="modalBox">
        ${html}
        <button class="secondaryBtn" onclick="closeModal()">Закрыть</button>
      </div>
    </div>
  `;
}

function closeModal() {
  modal.innerHTML = "";
}

// =========================
// Клавиатура
// =========================
function add(letter) {
  if (!activeInput) {
    activeInput = searchInput;
  }

  const start = activeInput.selectionStart ?? activeInput.value.length;
  const end = activeInput.selectionEnd ?? activeInput.value.length;
  const value = activeInput.value;

  activeInput.value = value.slice(0, start) + letter + value.slice(end);
  activeInput.focus();

  const newPos = start + letter.length;
  if (activeInput.setSelectionRange) {
    activeInput.setSelectionRange(newPos, newPos);
  }

  if (activeInput.id === "search") {
    render();
  }
}

// =========================
// Добавление слова
// =========================
function addWord() {
  const newWordInput = document.getElementById("newWord");
  const newTrInput = document.getElementById("newTr");

  if (!newWordInput || !newTrInput) return;

  const word = newWordInput.value.trim();
  const tr = newTrInput.value
    .split(";")
    .map(x => x.trim())
    .filter(Boolean);

  if (!word || !tr.length) {
    aboutStatusMessage = "Заполни слово и хотя бы один перевод.";
    renderAbout();
    return;
  }

  const newWord = normalizeWord({ word, tr });

  const exists = words.some(w => uniqueKey(w) === uniqueKey(newWord));
  if (exists) {
    aboutStatusMessage = "Такое слово уже есть в словаре.";
    renderAbout();
    return;
  }

  words = mergeWords(words, [newWord]);
  saveLocalWords();

  aboutStatusMessage = "Слово сохранено на этом устройстве.";
  renderAbout();
}

// =========================
// Утилиты
// =========================
function escapeHtml(str) {
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

// =========================
// Старт
// =========================
updateActiveTabUI();
switchTab("tl");
