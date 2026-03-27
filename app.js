let words = [
  { word: "аба", tr: ["отец"] },
  { word: "ай", tr: ["луна"] }
];

let currentTab = "tl";

const content = document.getElementById("content");
const search = document.getElementById("search");

// =======================
// ПЕРЕКЛЮЧЕНИЕ ВКЛАДОК
// =======================
function switchTab(tab){
  currentTab = tab;

  search.classList.toggle("hidden", tab==="abc" || tab==="about");

  updateTabs();
  render();
}

function updateTabs(){
  ["tl","ru","abc","about"].forEach(id=>{
    document.getElementById("tab-"+id)
      .classList.toggle("active", currentTab===id);
  });
}

// =======================
// РЕНДЕР
// =======================
function render(){
  if(currentTab==="tl") renderTL();
  if(currentTab==="abc") renderABC();
}

// =======================
// СЛОВАРЬ
// =======================
function renderTL(){
  let html="";
  words.forEach(w=>{
    html+=`<div class="card">${w.word}</div>`;
  });
  content.innerHTML=html;
}

// =======================
// 🔥 АЗБУКА
// =======================
function renderABC(){
content.innerHTML=`

<div>
<button onclick="showABC('letters')">🔤 Буквы</button>
<button onclick="showABC('numbers')">🔢 Цифры</button>
<button onclick="showABC('songs')">🎵 Песни</button>
</div>

<div id="letters" class="gridABC">

${letter("А а","a")}
${letter("Б б","b")}
${letter("В в","v")}
${letter("Г г","g")}
${letter("Ғ ғ","gh")}
${letter("Қ қ","q")}
${letter("Ң ң","ng")}
${letter("Ö ö","o2")}
${letter("Ӱ ӱ","u2")}
${letter("J j","j")}

</div>

<div id="numbers" class="gridABC hidden">
${letter("1","1")}
${letter("2","2")}
${letter("3","3")}
</div>

<div id="songs" class="hidden">
<button onclick="music('song1')">▶️ Песня 1</button>
</div>

`;
}

// =======================
// СОЗДАНИЕ БУКВЫ
// =======================
function letter(name,file){
return `
<div class="cardABC" onclick="sound('${file}')">

<div class="letterABC">${name}</div>

<!-- 📸 ВСТАВЬ КАРТИНКУ -->
<img src="images/${file}.png">

</div>
`;
}

// =======================
// ПЕРЕКЛЮЧЕНИЕ
// =======================
function showABC(t){
document.getElementById("letters").classList.add("hidden");
document.getElementById("numbers").classList.add("hidden");
document.getElementById("songs").classList.add("hidden");

document.getElementById(t).classList.remove("hidden");
}

// =======================
// ЗВУК
// =======================
function sound(n){
new Audio("sounds/"+n+".mp3").play();
}

// =======================
// ПЕСНИ
// =======================
function music(n){
new Audio("songs/"+n+".mp3").play();
}

// =======================
// КЛАВИАТУРА
// =======================
function add(l){
search.value+=l;
}

// =======================
switchTab("tl");
