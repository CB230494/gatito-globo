const app = document.getElementById("app");

let score = 0;
let totalPoints = Number(localStorage.getItem("totalPoints")) || 0;
let record = Number(localStorage.getItem("record")) || 0;
let lives = 3;
let balloonTop = 210;
let gameLoop = null;
let speed = 1.5;
let paused = false;

function saveData() {
  localStorage.setItem("totalPoints", totalPoints);
  localStorage.setItem("record", record);
}

function showCover() {
  app.innerHTML = `
    <div class="screen">
      <div class="heart">❤️</div>
      <h1 class="paper-title">Juego</h1>
      <button class="btn" onclick="showMenu()">JUGAR</button>
    </div>
  `;
}

function showMenu() {
  app.innerHTML = `
    <div class="screen">
      <div class="menu-cat">🐱🎈</div>

      <div class="info-box">
        Jugador:<br>
        <span class="red">Juego</span>
      </div>

      <div class="info-box">
        Puntos totales:<br>
        <span class="red">${totalPoints}</span>
      </div>

      <div class="info-box">
        Récord:<br>
        <span class="red">${record}</span>
      </div>

      <button class="btn" onclick="startGame()">INICIAR</button>
    </div>
  `;
}

function startGame() {
  score = 0;
  lives = 3;
  balloonTop = 210;
  speed = 1.5;
  paused = false;

  renderGame();

  clearInterval(gameLoop);
  gameLoop = setInterval(updateGame, 40);
}

function renderGame() {
  app.innerHTML = `
    <div class="screen">
      <div class="hud">
        <div>Puntos:<br><span class="red" id="score">${score}</span></div>
        <div class="lives" id="lives">${"❤️".repeat(lives)}</div>
        <div>Récord:<br><span class="red" id="record">${record}</span></div>
        <button class="pause" onclick="togglePause()">Ⅱ</button>
      </div>

      <div class="game-area">
        <div class="sun">☀️</div>
        <div class="cloud one">☁️</div>
        <div class="cloud two">☁️</div>
        <div class="flower left">🌸</div>
        <div class="flower right">🌼</div>

        <div class="balloon" id="balloon">🎈</div>
        <div class="string" id="string"></div>
        <div class="cat">🐱</div>
      </div>

      <div class="controls">
        <button class="small-btn" onclick="grabBalloon()">X</button>
        <button class="small-btn" onclick="recoverBalloon()">□</button>
      </div>

      <div class="action-labels">
        <span>agarrar</span>
        <span>recuperar</span>
      </div>
    </div>
  `;

  updateBalloonPosition();
}

function updateGame() {
  if (paused) return;

  balloonTop -= speed;
  speed += 0.002;

  updateBalloonPosition();

  if (balloonTop < 20) {
    loseLife();
  }
}

function updateBalloonPosition() {
  const balloon = document.getElementById("balloon");
  const string = document.getElementById("string");

  if (!balloon || !string) return;

  balloon.style.top = balloonTop + "px";
  string.style.top = balloonTop + 65 + "px";
}

function grabBalloon() {
  if (paused) return;

  if (balloonTop > 120 && balloonTop < 260) {
    score += 10;
    totalPoints += 10;
    balloonTop = 210;
  } else {
    score -= 5;
    if (score < 0) score = 0;
  }

  updateScore();
}

function recoverBalloon() {
  if (paused) return;

  if (balloonTop <= 120) {
    score += 20;
    totalPoints += 20;
    balloonTop = 210;
  } else {
    score -= 5;
    if (score < 0) score = 0;
  }

  updateScore();
}

function updateScore() {
  if (score > record) {
    record = score;
  }

  saveData();

  const scoreBox = document.getElementById("score");
  const recordBox = document.getElementById("record");

  if (scoreBox) scoreBox.textContent = score;
  if (recordBox) recordBox.textContent = record;
}

function loseLife() {
  lives--;
  balloonTop = 210;

  const livesBox = document.getElementById("lives");
  if (livesBox) livesBox.textContent = "❤️".repeat(lives);

  if (lives <= 0) {
    endGame();
  }
}

function endGame() {
  clearInterval(gameLoop);

  app.innerHTML = `
    <div class="screen">
      <h1 class="gameover-title">¡GLOBO ESCAPÓ!</h1>
      <div class="sad-cat">😿</div>

      <div class="info-box">
        Puntos:<br>
        <span class="red">${score}</span>
      </div>

      <div class="info-box">
        Récord:<br>
        <span class="red">${record}</span>
      </div>

      <button class="btn" onclick="startGame()">REINTENTAR</button>
      <button class="btn" onclick="showMenu()">MENÚ</button>
    </div>
  `;
}

function togglePause() {
  paused = !paused;
}

document.addEventListener("keydown", (e) => {
  if (e.key.toLowerCase() === "x") grabBalloon();
  if (e.key === " " || e.key === "Enter") recoverBalloon();
});

showCover();
