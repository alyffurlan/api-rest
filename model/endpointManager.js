(() => {
  const BASE = 'https://api-rest-pr24.onrender.com/api';

  // ── State ──────────────────────────────────────────────────────────
  let resource = 'locations'; // 'locations' | 'impacts'
  let method   = 'GET';

  // ── Field definitions per resource × method ───────────────────────
  // type: 'text' | 'number' | 'boolean' | 'textarea'
  // required: shown with red asterisk
  // hint: shown below the field group
  const SCHEMAS = {
    locations: {
      GET:    {
        hint: 'Busca todos os locais, ou informe um ID para buscar apenas um.',
        fields: [
          { id: 'id', label: 'ID', type: 'number', placeholder: 'Deixe em branco para todos', required: false }
        ]
      },
      POST:   {
        hint: 'Cria um novo local de impacto.',
        fields: [
          { id: 'name',      label: 'NOME',      type: 'text',   placeholder: 'Cratera Barringer', required: true  },
          { id: 'country',   label: 'PAÍS',       type: 'text',   placeholder: 'Estados Unidos',   required: true  },
          { id: 'latitude',  label: 'LATITUDE',  type: 'number', placeholder: '35.02694',          required: false },
          { id: 'longitude', label: 'LONGITUDE', type: 'number', placeholder: '-111.02278',        required: false }
        ]
      },
      PUT:    {
        hint: 'Atualiza campos de um local existente. Apenas os campos informados são alterados.',
        fields: [
          { id: 'id',        label: 'ID',        type: 'number', placeholder: 'Obrigatório',       required: true  },
          { id: 'name',      label: 'NOME',      type: 'text',   placeholder: 'Novo nome',         required: false },
          { id: 'country',   label: 'PAÍS',       type: 'text',   placeholder: 'Novo país',        required: false },
          { id: 'latitude',  label: 'LATITUDE',  type: 'number', placeholder: '0.00000',           required: false },
          { id: 'longitude', label: 'LONGITUDE', type: 'number', placeholder: '0.00000',           required: false }
        ]
      },
      DELETE: {
        hint: 'Remove permanentemente um registro de local.',
        fields: [
          { id: 'id', label: 'ID', type: 'number', placeholder: 'Obrigatório', required: true }
        ]
      }
    },
    impacts: {
      GET:    {
        hint: 'Busca todos os impactos (com local), um por ID, ou filtra por location_id.',
        fields: [
          { id: 'id',          label: 'ID DO IMPACTO', type: 'number', placeholder: 'Deixe em branco para todos', required: false },
          { id: 'location_id', label: 'ID DO LOCAL',   type: 'number', placeholder: 'Filtrar por local',          required: false }
        ]
      },
      POST:   {
        hint: 'Registra um novo evento de impacto de meteoro.',
        fields: [
          { id: 'locationId',     label: 'ID DO LOCAL',      type: 'number',  placeholder: '1',             required: true  },
          { id: 'name',           label: 'NOME',             type: 'text',    placeholder: 'Canyon Diablo', required: true  },
          { id: 'year',           label: 'ANO',              type: 'number',  placeholder: '-50000',        required: false },
          { id: 'massKg',         label: 'MASSA (KG)',       type: 'number',  placeholder: '18143.0',       required: false },
          { id: 'classification', label: 'CLASSIFICAÇÃO',    type: 'text',    placeholder: 'Ferro IAB',     required: false },
          { id: 'wasObserved',    label: 'FOI OBSERVADO',    type: 'boolean', placeholder: '',              required: false }
        ]
      },
      PUT:    {
        hint: 'Atualiza campos de um impacto existente.',
        fields: [
          { id: 'id',             label: 'ID DO IMPACTO',    type: 'number',  placeholder: 'Obrigatório',   required: true  },
          { id: 'locationId',     label: 'ID DO LOCAL',      type: 'number',  placeholder: 'Mudar local',   required: false },
          { id: 'name',           label: 'NOME',             type: 'text',    placeholder: 'Novo nome',     required: false },
          { id: 'year',           label: 'ANO',              type: 'number',  placeholder: '0',             required: false },
          { id: 'massKg',         label: 'MASSA (KG)',       type: 'number',  placeholder: '0.0',           required: false },
          { id: 'classification', label: 'CLASSIFICAÇÃO',    type: 'text',    placeholder: 'Novo tipo',     required: false },
          { id: 'wasObserved',    label: 'FOI OBSERVADO',    type: 'boolean', placeholder: '',              required: false }
        ]
      },
      DELETE: {
        hint: 'Remove permanentemente um registro de impacto.',
        fields: [
          { id: 'id', label: 'ID DO IMPACTO', type: 'number', placeholder: 'Obrigatório', required: true }
        ]
      }
    }
  };

  // ── DOM refs ───────────────────────────────────────────────────────
  const methodSelect    = document.getElementById('http_method_select');
  const methodBadge     = document.getElementById('method-badge');
  const endpointInput   = document.getElementById('endpoint-input');
  const dynamicFields   = document.getElementById('dynamic-fields');
  const launchBtn       = document.getElementById('launch-btn');
  const responseOutput  = document.getElementById('response-output');
  const responseStatus  = document.getElementById('response-status');

  // ── Endpoint builder ───────────────────────────────────────────────
  function buildEndpoint() {
    const idField = dynamicFields.querySelector('#field-id');
    const id      = idField ? idField.value.trim() : '';
    let url = `${BASE}/${resource}`;
    if (id && (method === 'GET' || method === 'DELETE' || method === 'PUT')) {
      url += `/${id}`;
    }
    // GET with location_id filter on impacts (no id)
    if (method === 'GET' && resource === 'impacts' && !id) {
      const locField = dynamicFields.querySelector('#field-location_id');
      if (locField && locField.value.trim()) {
        url += `?location_id=${locField.value.trim()}`;
      }
    }
    endpointInput.value = url;
  }

  // ── Render dynamic fields ──────────────────────────────────────────
  function renderFields() {
    const schema = SCHEMAS[resource][method];
    dynamicFields.innerHTML = '';

    if (!schema.fields.length) {
      dynamicFields.innerHTML = `<div class="control-group"><p class="fields-empty">// NENHUM PARÂMETRO NECESSÁRIO</p></div>`;
      buildEndpoint();
      return;
    }

    const group = document.createElement('div');
    group.className = 'control-group';

    // Label row
    const labelEl = document.createElement('label');
    labelEl.className = 'control-label';
    labelEl.innerHTML = `<svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor"><polygon points="6,0 12,12 0,12"/></svg> PARÂMETROS`;
    group.appendChild(labelEl);

    // Grid: 2-col for 3+ fields, 1-col for ≤2
    const grid = document.createElement('div');
    grid.className = schema.fields.length > 2 ? 'field-grid' : 'field-grid full';

    schema.fields.forEach(f => {
      const item = document.createElement('div');
      item.className = 'field-item';

      const lbl = document.createElement('span');
      lbl.className = 'field-item-label';
      lbl.innerHTML = f.label + (f.required ? '<span class="required">*</span>' : '');
      item.appendChild(lbl);

      if (f.type === 'boolean') {
        // Render as a toggle select
        const wrap = document.createElement('div');
        wrap.className = 'select-wrapper';
        const sel = document.createElement('select');
        sel.id = `field-${f.id}`;
        sel.className = 'space-input';
        sel.style.padding = '0.65rem 2.5rem 0.65rem 1rem';
        sel.innerHTML = `<option value="">— não definido —</option><option value="true">VERDADEIRO</option><option value="false">FALSO</option>`;
        sel.addEventListener('change', buildEndpoint);
        const arrow = document.createElement('div');
        arrow.className = 'select-arrow';
        arrow.textContent = '▾';
        wrap.appendChild(sel);
        wrap.appendChild(arrow);
        item.appendChild(wrap);
      } else {
        const inp = document.createElement('input');
        inp.type        = f.type === 'number' ? 'number' : 'text';
        inp.id          = `field-${f.id}`;
        inp.className   = 'space-input';
        inp.placeholder = f.placeholder;
        inp.addEventListener('input', buildEndpoint);
        item.appendChild(inp);
      }

      grid.appendChild(item);
    });

    group.appendChild(grid);

    if (schema.hint) {
      const hint = document.createElement('p');
      hint.className = 'field-hint';
      hint.textContent = '// ' + schema.hint;
      group.appendChild(hint);
    }

    dynamicFields.appendChild(group);
    buildEndpoint();
  }

  // ── Collect field values into a body object ────────────────────────
  function collectBody() {
    const schema = SCHEMAS[resource][method];
    const body   = {};
    schema.fields.forEach(f => {
      // ID goes in the URL for PUT/DELETE/GET, not in the body
      if (f.id === 'id' || f.id === 'location_id') return;
      const el = dynamicFields.querySelector(`#field-${f.id}`);
      if (!el || el.value.trim() === '') return;
      if (f.type === 'number') {
        body[f.id] = Number(el.value);
      } else if (f.type === 'boolean') {
        body[f.id] = el.value === 'true';
      } else {
        body[f.id] = el.value.trim();
      }
    });
    return body;
  }

  // ── Method badge update ────────────────────────────────────────────
  function updateBadge(m) {
    methodBadge.textContent  = m;
    methodBadge.className    = `method-badge ${m}`;
  }

  // ── Resource toggle ────────────────────────────────────────────────
  document.querySelectorAll('.resource-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.resource-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      resource = btn.dataset.resource;
      renderFields();
    });
  });

  // ── Method change ──────────────────────────────────────────────────
  methodSelect.addEventListener('change', () => {
    method = methodSelect.value;
    updateBadge(method);
    renderFields();
  });

  // ── Launch request ─────────────────────────────────────────────────
  launchBtn.addEventListener('click', async () => {
    const url  = endpointInput.value;
    const body = collectBody();

    responseStatus.textContent = '';
    responseStatus.className   = 'response-status';
    responseOutput.textContent = '// Transmitindo sinal...';

    const options = { method, headers: { 'Content-Type': 'application/json' } };
    if (method !== 'GET' && method !== 'DELETE') {
      options.body = JSON.stringify(body);
    }

    try {
      const res  = await fetch(url, options);
      const data = await res.json();

      responseStatus.textContent = `${res.status} ${res.statusText}`;
      responseStatus.className   = `response-status ${res.ok ? 'ok' : 'err'}`;
      responseOutput.textContent = JSON.stringify(data, null, 2);
    } catch (err) {
      responseStatus.textContent = 'FALHA NA CONEXÃO';
      responseStatus.className   = 'response-status err';
      responseOutput.textContent = `// ${err.message}`;
    }
  });

  // ── Mission clock ──────────────────────────────────────────────────
  const start = Date.now();
  function tickClock() {
    const s   = Math.floor((Date.now() - start) / 1000);
    const hh  = String(Math.floor(s / 3600)).padStart(2, '0');
    const mm  = String(Math.floor((s % 3600) / 60)).padStart(2, '0');
    const ss  = String(s % 60).padStart(2, '0');
    const val = `${hh}:${mm}:${ss}`;
    document.querySelectorAll('#mission-clock, #mission-clock-2').forEach(el => el.textContent = val);
  }
  setInterval(tickClock, 1000);

  // ── Init ───────────────────────────────────────────────────────────
  method = methodSelect.value;
  updateBadge(method);
  renderFields();
})();
