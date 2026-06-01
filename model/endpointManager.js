const launchButton = document.getElementById('launch-btn');

/* ── LAUNCH BUTTON ──────────────────────── */
launchButton.addEventListener('click', async () => {
  const method   = document.getElementById('http_method_select').value;
  const endpoint = document.getElementById('endpoint-input').value.trim();
  const body     = document.getElementById('body-input').value.trim();
  const output   = document.getElementById('response-output');
  const status   = document.getElementById('response-status');

  output.textContent = '// Transmitting signal…';
  launchButton.disabled = true;
  status.textContent = '';
  status.className   = 'response-status';
  console.info(method);

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
  launchButton.disabled = false;
});