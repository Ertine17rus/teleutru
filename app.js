// =========================
// ДАННЫЕ
// =========================
let currentTab = "tl";

const words = [
  { word:"аару", tr:["пчела"] },
  { word:"ай", tr:["луна"] }
];

// =========================
// РЕНДЕР
// =========================
function render(){
  if(currentTab === "tl"){
    document.getElementById("content").innerHTML =
      words.map(w=>`
        <div class="card">${w.word}</div>
      `).join("");
  }

  if(currentTab === "ru"){
    document.getElementById("content").innerHTML =
      words.map(w=>`
        <div class="card">${w.tr[0]}</div>
      `).join("");
  }

  if(currentTab === "abc"){
    document.getElementById("content").innerHTML = `
      <button onclick="playMusic('song1')">🎵 song1</button>
      <button onclick="playMusic('song2')">🎵 song2</button>
    `;
  }
}

// =========================
// ТАБЫ
// =========================
function switchTab(tab){
  currentTab = tab;

  document.querySelectorAll(".tabs button").forEach(b=>{
    b.classList.remove("active");
  });

  document.getElementById("tab-"+tab).classList.add("active");

  render();
}

// =========================
// 🔥 ПЛЕЕР
// =========================
let player = {
  audio:null,
  current:"",
  playlist:["song1","song2"],
  index:0,
  isPlaying:false
};

function playMusic(name){
  const i = player.playlist.indexOf(name);
  if(i !== -1) player.index = i;

  if(player.current === name && player.audio){
    togglePlay();
    return;
  }

  if(player.audio){
    player.audio.pause();
    player.audio.currentTime = 0;
  }

  player.audio = new Audio("songs/"+name+".mp3");
  player.current = name;
  player.isPlaying = true;

  player.audio.play();

  updatePlayer();

  player.audio.onended = nextTrack;
}

function togglePlay(){
  if(!player.audio) return;

  if(player.audio.paused){
    player.audio.play();
    player.isPlaying = true;
  }else{
    player.audio.pause();
    player.isPlaying = false;
  }

  updatePlayer();
}

function nextTrack(){
  player.index = (player.index+1) % player.playlist.length;
  playMusic(player.playlist[player.index]);
}

function setVolume(v){
  if(player.audio){
    player.audio.volume = v;
  }
}

function updatePlayer(){
  document.getElementById("miniPlayer").classList.remove("hidden");
  document.getElementById("trackName").innerText = player.current;

  document.getElementById("playBtn").innerText =
    player.isPlaying ? "⏸" : "▶️";
}

// =========================
// СТАРТ
// =========================
switchTab("tl");
