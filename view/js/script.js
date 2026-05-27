/* ── STARFIELD ──────────────────────────── */
const canvas = document.getElementById('stars');
const ctx = canvas.getContext('2d');
let stars = [];

function resize() {
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;
}

function initStars() {
  stars = Array.from({ length: 200 }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    r: Math.random() * 1.4 + 0.2,
    speed: Math.random() * 0.3 + 0.05,
    alpha: Math.random(),
    dAlpha: (Math.random() - 0.5) * 0.015
  }));
}

function drawStars() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (const s of stars) {
    s.alpha += s.dAlpha;
    if (s.alpha <= 0 || s.alpha >= 1) s.dAlpha *= -1;
    s.y += s.speed;
    if (s.y > canvas.height) { s.y = 0; s.x = Math.random() * canvas.width; }
    ctx.beginPath();
    ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(200,232,255,${Math.max(0,Math.min(1,s.alpha))})`;
    ctx.fill();
  }
  requestAnimationFrame(drawStars);
}

resize();
initStars();
drawStars();
window.addEventListener('resize', () => { resize(); initStars(); });

/* ── MISSION CLOCK ──────────────────────── */
const start = Date.now();
function updateClock() {
  const s = Math.floor((Date.now() - start) / 1000);
  const h = String(Math.floor(s / 3600)).padStart(2,'0');
  const m = String(Math.floor((s % 3600) / 60)).padStart(2,'0');
  const sec = String(s % 60).padStart(2,'0');
  document.getElementById('mission-clock').textContent = `${h}:${m}:${sec}`;
}
setInterval(updateClock, 1000);

/* ── METHOD BADGE ───────────────────────── */
const select = document.getElementById('http_method_select');
const badge  = document.getElementById('method-badge');
select.addEventListener('change', () => {
  badge.textContent = select.value;
  badge.className = `method-badge ${select.value}`;
});

/* ── LAUNCH BUTTON ──────────────────────── */
document.getElementById('launch-btn').addEventListener('click', async () => {
  const method   = select.value;
  const endpoint = document.getElementById('endpoint-input').value.trim();
  const body     = document.getElementById('body-input').value.trim();
  const output   = document.getElementById('response-output');
  const status   = document.getElementById('response-status');

  output.textContent = '// Transmitting signal…';
  status.textContent = '';
  status.className   = 'response-status';

  try {
    const opts = { method, headers: { 'Content-Type': 'application/json' } };
    if (body && method !== 'GET') opts.body = body;
    const res  = await fetch(endpoint, opts);
    const text = await res.text();
    let pretty;
    try { pretty = JSON.stringify(JSON.parse(text), null, 2); }
    catch { pretty = text; }
    output.textContent = pretty;
    status.textContent = `STATUS ${res.status}`;
    status.className   = `response-status ${res.ok ? 'ok' : 'err'}`;
  } catch (err) {
    output.textContent = `// Signal lost: ${err.message}`;
    status.textContent = 'ERROR';
    status.className   = 'response-status err';
  }
});
