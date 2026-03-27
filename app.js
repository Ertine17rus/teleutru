// =========================
// 🔥 ГЛОБАЛЬНЫЙ АУДИО-ПЛЕЕР
// =========================
let currentAudio = null;
let currentTrack = "";

// =========================
// ЗВУК БУКВ
// =========================
function playSound(name) {
  if (currentAudio) {
    currentAudio.pause();
    currentAudio.currentTime = 0;
  }

  currentTrack = name;
  currentAudio = new Audio("sounds/" + name + ".mp3");

  currentAudio.play().catch(() => {
    console.log("Нет звука для:", name);
  });
}

// =========================
// ПЕСНИ
// =========================
function playMusic(name) {
  // если нажали ту же песню → пауза/плей
  if (currentTrack === name && currentAudio) {
    if (currentAudio.paused) {
      currentAudio.play();
    } else {
      currentAudio.pause();
    }
    return;
  }

  // остановка прошлого
  if (currentAudio) {
    currentAudio.pause();
    currentAudio.currentTime = 0;
  }

  currentTrack = name;
  currentAudio = new Audio("songs/" + name + ".mp3");

  currentAudio.play().catch(() => {
    console.log("Нет песни:", name);
  });
}
