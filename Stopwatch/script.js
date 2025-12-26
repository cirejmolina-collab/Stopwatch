const display = document.getElementById('display');
const startBtn = document.getElementById('startBtn');
const pauseBtn = document.getElementById('pauseBtn');
const resetBtn = document.getElementById('resetBtn');
const lapBtn = document.getElementById('lapBtn');
const saveBtn = document.getElementById('saveBtn');
const clearLapsBtn = document.getElementById('clearLapsBtn');
const lapsDiv = document.getElementById('laps');
const historyDiv = document.getElementById('history');
const themeToggle = document.getElementById('themeToggle');

themeToggle.addEventListener('click', () => {
  document.body.classList.toggle('dark');
  themeToggle.textContent = document.body.classList.contains('dark') ? '☀️' : '🌙';
});

let startTime = 0;
let elapsed = 0;
let timer = null;
let running = false;
let laps = [];
let history = JSON.parse(localStorage.getItem('stopwatchHistory') || '[]');

function formatTime(ms) {
  const cs = Math.floor((ms % 1000) / 10);
  const s = Math.floor((ms / 1000) % 60);
  const m = Math.floor((ms / 60000) % 60);
  const h = Math.floor(ms / 3600000);
  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}.${cs.toString().padStart(2, '0')}`;
}

function updateDisplay() {
  display.textContent = formatTime(elapsed);
}

function tick() {
  elapsed = Date.now() - startTime;
  updateDisplay();
}

startBtn.onclick = () => {
  if (!running) {
    startTime = Date.now() - elapsed;
    timer = setInterval(tick, 10);
    running = true;
  }
};

pauseBtn.onclick = () => {
  if (running) {
    clearInterval(timer);
    running = false;
  }
};

resetBtn.onclick = () => {
  clearInterval(timer);
  running = false;
  elapsed = 0;
  laps = [];
  updateDisplay();
  renderLaps();
};

lapBtn.onclick = () => {
  if (running) {
    laps.push(elapsed);
    renderLaps();
  }
};

saveBtn.onclick = () => {
  if (elapsed > 0) {
    history.push({
      time: elapsed,
      laps: [...laps],
      date: new Date().toLocaleString()
    });
    localStorage.setItem('stopwatchHistory', JSON.stringify(history));
    renderHistory();
  }
};

clearLapsBtn.onclick = () => {
  laps = [];
  renderLaps();
};

function renderLaps() {
  lapsDiv.innerHTML = '<h3>Laps</h3>';
  laps.forEach((lap, i) => {
    const div = document.createElement('div');
    div.className = 'lap-item';
    div.innerHTML = `<span>Lap ${i + 1}</span><span class="lap-time">${formatTime(lap)}</span>`;
    lapsDiv.appendChild(div);
  });
}

function renderHistory() {
  historyDiv.innerHTML = '<h3>Saved Sessions</h3>';
  history.slice().reverse().forEach((session, i) => {
    const div = document.createElement('div');
    div.className = 'history-item';
    div.innerHTML = `<span>${session.date}</span><span class="lap-time">${formatTime(session.time)}</span>`;
    div.title = session.laps.map((lap, idx) => `Lap ${idx + 1}: ${formatTime(lap)}`).join('\n');
    historyDiv.appendChild(div);
  });
}

updateDisplay();
renderLaps();
renderHistory();
