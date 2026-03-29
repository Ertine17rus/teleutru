// =========================
// Локальная база слов
// =========================
const defaultWords = [
  { word: "аба", tr: ["отец"] },
  { word: "аару", tr: ["пчела"] },
  { word: "ай", tr: ["луна", "месяц"] },
  { word: "айак", tr: ["нога, чашка, пиала"] },
  { word: "айу", tr: ["медведь"] },
  { word: "ақ", tr: ["белый", "течь", "плыть"] },
  { word: "ал", tr: ["брать", "получать"] },
  { word: "алтын", tr: ["золото"] },
  { word: "амыр", tr: ["спокойный", "мир"] },
  { word: "ач", tr: ["голодный"] },
  { word: "аш", tr: ["еда"] }
];

const teleutAlphabet = [
  { label: "А а", file: "aa" },
  { label: "Б б", file: "bb" },
  { label: "В в", file: "vv" },
  { label: "Г г", file: "g3" },
  { label: "Ғ ғ", file: "gh2" },
  { label: "Д д", file: "dd" },
  { label: "J j", file: "jj" },
  { label: "Е е", file: "e" },
  { label: "Ё ё", file: "yo" },
  { label: "Ж ж", file: "zh" },
  { label: "З з", file: "z" },
  { label: "И и", file: "i" },
  { label: "Й й", file: "y" },
  { label: "К к", file: "kk" },
  { label: "Қ қ", file: "q" },
  { label: "Л л", file: "l" },
  { label: "М м", file: "m" },
  { label: "Н н", file: "n" },
  { label: "Ң ң", file: "ng" },
  { label: "О о", file: "oo" },
  { label: "Ö ö", file: "o2" },
  { label: "П п", file: "pp" },
  { label: "Р р", file: "rr" },
  { label: "С с", file: "s" },
  { label: "Т т", file: "t" },
  { label: "У у", file: "uu" },
  { label: "Ӱ ӱ", file: "u22" },
  { label: "Ф ф", file: "f" },
  { label: "Х х", file: "h" },
  { label: "Ц ц", file: "ts" },
  { label: "Ч ч", file: "chh" },
  { label: "Ш ш", file: "sh2" },
  { label: "Щ щ", file: "shh" },
  { label: "Ъ ъ", file: "tz" },
  { label: "Ь ь", file: "mz" },
  { label: "Ы ы", file: "y2" },
  { label: "Э э", file: "e2" },
  { label: "Ю ю", file: "yu" },
  { label: "Я я", file: "ya3" },
  
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
const songs = [
  { id: "song1", title: "Сарын 1", cover: "covers/song1.jpg" },
  { id: "song2", title: "Сарын 2", cover: "covers/song2.jpg" },
  { id: "song3", title: "Сарын 3", cover: "covers/song3.jpg" },
  { id: "song4", title: "Сарын 4", cover: "covers/song4.jpg" },
  { id: "song5", title: "Сарын 5", cover: "covers/song5.jpg" },
  { id: "song6", title: "Сарын 6", cover: "covers/song6.jpg" },
  { id: "song7", title: "Сарын 7", cover: "covers/song7.jpg" },
  { id: "song8", title: "Сарын 8", cover: "covers/song8.jpg" },
  { id: "song9", title: "Сарын 9", cover: "covers/song9.jpg" }
];

let currentSong = null;

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
// 🔊 звук
let currentAudio = null;
let currentMusic = null;
let volume = parseFloat(localStorage.getItem("volume")) || 1;

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
    updateKeyboardVisibility(); // 👈 добавили
  }
});

document.addEventListener("click", (e) => {
  // закрытие модалки
  if (e.target.classList.contains("modal")) {
    closeModal();
  }

  // скрытие клавиатуры
  if (!e.target.closest("input") && !e.target.closest("#keyboard")) {
    activeInput = null;
    updateKeyboardVisibility();
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

  // 🔥 ВАЖНО (логика клавиатуры)
  activeInput = null;
  updateKeyboardVisibility();
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
        Есть говорящий букварь для детей и песни на телеутском языке.
        Скоро выйдет физическая версия букваря - игрушка для детей...
        Поддержите меня пожалуйста - разошлите  эту ссылку всем знакомым.
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

    <!-- 🔊 ГРОМКОСТЬ -->
    <div style="padding:10px; display:flex; align-items:center; gap:10px;">
      <span>🔊</span>
      <input type="range" id="volumeControl" min="0" max="1" step="0.1" value="1" style="flex:1;">
    </div>

<div id="abc-letters" class="${currentABCSection === "letters" ? "gridABC" : "gridABC hidden"}">
  ${teleutAlphabet.map(item => createLetterCard(item.label, item.file, "letters")).join("")}
</div>
   <div id="abc-numbers" class="${currentABCSection === "numbers" ? "gridABC" : "gridABC hidden"}">
  ${teleutNumbers.map(item => createLetterCard(item.label, item.file, "numbers")).join("")}
</div>
<div id="abc-songs" class="${currentABCSection === "songs" ? "songList" : "songList hidden"}">

  <div id="playerBox" class="playerBox hidden">
    <div class="playerCover" id="playerCover"></div>

    <div class="playerInfo">
      <div class="playerTitle" id="playerTitle">Название</div>

      <div class="playerControls">
        <button onclick="prevSong()">⏮</button>
        <button onclick="togglePlay()">⏯</button>
        <button onclick="nextSong()">⏭</button>
      </div>
    </div>
  </div>

  ${songs.map(s => `
    <div class="songCard" onclick="playMusic('${s.id}', '${s.title}', '${s.cover}')">
      <img src="${s.cover}" onerror="this.style.display='none'">
      <div>${s.title}</div>
    </div>
  `).join("")}

</div>
  `;

  // 🔊 логика громкости
  setTimeout(() => {
    const vol = document.getElementById("volumeControl");
    if (vol) {
      vol.value = volume;

      vol.addEventListener("input", function () {
        volume = this.value;

        if (currentAudio) currentAudio.volume = volume;
        if (currentMusic) currentMusic.volume = volume;

        localStorage.setItem("volume", volume);
      });
    }
  }, 0);
}

// =========================
// Азбука
// =========================
function createLetterCard(label, file, type = "letters") {
  return `
    <div class="cardABC" onclick="playSound('${file}', '${type}')">
      <div class="letterABC">${escapeHtml(label)}</div>

      <img
        src="images/${file}.png"
        alt="${escapeHtml(label)}"
        onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';"
      />

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

function playSound(name, type = "letters") {
  stopAllAudio();

  const audio = new Audio(`sounds/${type}/${name}.mp3`);
  audio.volume = volume;

  currentAudio = audio;

  audio.play().catch(() => {
    console.log("Нет звука:", name);
  });
}
function updateKeyboardVisibility() {
  const keyboard = document.getElementById("keyboard");
  if (!keyboard) return;

  // ❌ скрываем в детском разделе и about
  if (currentTab === "abc" || currentTab === "about") {
    keyboard.classList.add("hidden");
    return;
  }

  // ✅ показываем только если есть активный input
  if (activeInput) {
    keyboard.classList.remove("hidden");
  } else {
    keyboard.classList.add("hidden");
  }
}
  function translit(word) {
  const map = {
    "а": "a",
    "б": "b",
    "в": "v",
    "г": "g",
    "ғ": "gh",
    "д": "d",
    "е": "e",
    "ё": "yo",
    "ж": "zh",
    "з": "z",
    "и": "i",
    "й": "y",
    "к": "k",
    "қ": "q",
    "л": "l",
    "м": "m",
    "н": "n",
    "ң": "ng",
    "о": "o",
    "ө": "o2",
    "п": "p",
    "р": "r",
    "с": "s",
    "т": "t",
    "у": "u",
    "ӱ": "u22",
    "ф": "f",
    "х": "h",
    "ц": "ts",
    "ч": "ch",
    "ш": "sh",
    "щ": "shh",
    "ы": "y2",
    "э": "e2",
    "ю": "yu",
    "я": "ya"
  };

  return word
    .toLowerCase()
    .split("")
    .map(l => map[l] || l)
    .join("");
}
function playWord(word) {
  if (!word) return;

  let clean = translit(word);

  // 🔥 страховка
  if (word === "алтын") clean = "altyn";
  if (word === "амыр") clean = "amyr";

  playSound(clean, "words");
}
function stopAllAudio() {
  if (currentAudio) {
    currentAudio.pause();
    currentAudio.currentTime = 0;
  }
  if (currentMusic) {
    currentMusic.pause();
    currentMusic.currentTime = 0;
  }
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

      <button class="primaryBtn" onclick="playWord('${w.word}')">
        🔊 Ӱнӱн пожотjап|Озвучить
      </button>

      <div style="margin-top:10px;"><b>(рус.)</b></div>
      <ul>${tr}</ul>
    `;
  } else {
    html = `
      <h2>(рус.) ${escapeHtml(w.tr[0])}</h2>

      <div style="font-size:20px; color:#007aff; font-weight:700; margin-top:8px;">
        ${escapeHtml(w.word)}
      </div>

      <button class="primaryBtn" onclick="playWord('${w.word}')">
        🔊 Ӱнӱн пожотjап|Озвучить
      </button>

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

// 🔊 автопроигрывание 
  setTimeout(() => 
    { playWord(w.word); 
    }, 200); 
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
// =========================
// 🎧 Плеер (Spotify логика)
// =========================
let currentSongIndex = -1;
let isPlaying = false;

function playMusic(name, title, cover) {
  if (currentMusic) {
    currentMusic.pause();
  }

  currentMusic = new Audio("songs/" + name + ".mp3");
  currentMusic.volume = volume;
  currentMusic.play();

  isPlaying = true;

  currentSongIndex = songs.findIndex(s => s.id === name);

 const box = document.getElementById("playerBox");
const playerTitleEl = document.getElementById("playerTitle"); // ✅ новое имя
const coverEl = document.getElementById("playerCover");

if (box && playerTitleEl && coverEl) {
  box.classList.remove("hidden");
  playerTitleEl.innerText = title; // ✅ используем новое имя
  coverEl.style.backgroundImage = `url('${cover}')`;
}
}

function togglePlay() {
  if (!currentMusic) return;

  if (currentMusic.paused) {
    currentMusic.play();
    isPlaying = true;
  } else {
    currentMusic.pause();
    isPlaying = false;
  }
}

function nextSong() {
  if (currentSongIndex === -1) return;

  let next = (currentSongIndex + 1) % songs.length;
  const s = songs[next];
  playMusic(s.id, s.title, s.cover);
}

function prevSong() {
  if (currentSongIndex === -1) return;

  let prev = (currentSongIndex - 1 + songs.length) % songs.length;
  const s = songs[prev];
  playMusic(s.id, s.title, s.cover);
}
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
updateKeyboardVisibility();
