/* =========================================================
   Vaishnavi Hiremath: portfolio
   ========================================================= */
(() => {
  const root = document.documentElement;
  const hasGSAP = !!(window.gsap && window.ScrollTrigger);
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));

  if (hasGSAP) {
    root.classList.add('anim');
    gsap.registerPlugin(ScrollTrigger);
  }

  /* ---------------- Smooth scroll ---------------- */
  let lenis = null;
  if (hasGSAP && window.Lenis && !reduced) {
    lenis = new Lenis({ lerp: 0.1, wheelMultiplier: 1 });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((t) => lenis.raf(t * 1000));
    gsap.ticker.lagSmoothing(0);
  }

  /* ---------------- Mobile menu ---------------- */
  const menu = $('#menu');
  const menuBtn = $('.nav__menu');
  let menuTimer;
  function setMenu(open) {
    if (!menu || root.classList.contains('menu-open') === open) return;
    clearTimeout(menuTimer);
    if (open) {
      menu.hidden = false;
      menu.offsetHeight; // commit display before the reveal transition
      if (lenis) lenis.stop();
    } else {
      menuTimer = setTimeout(() => { menu.hidden = true; }, 700);
      if (lenis) lenis.start();
    }
    root.classList.toggle('menu-open', open);
    menuBtn.setAttribute('aria-expanded', String(open));
    $('.nav__menu-label').textContent = open ? 'Close' : 'Menu';
  }
  if (menu) {
    menuBtn.addEventListener('click', () => setMenu(!root.classList.contains('menu-open')));
    $$('a', menu).forEach((a) => a.addEventListener('click', () => setMenu(false)));
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') setMenu(false); });
    window.matchMedia('(min-width: 861px)').addEventListener('change', (m) => { if (m.matches) setMenu(false); });
  }

  $$('a[href^="#"]').forEach((a) => {
    a.addEventListener('click', (e) => {
      setMenu(false);
      const id = a.getAttribute('href');
      const target = id === '#top' ? document.body : $(id);
      if (!target) return;
      e.preventDefault();
      if (lenis) lenis.scrollTo(id === '#top' ? 0 : target, { duration: 1.6 });
      else target.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth' });
    });
  });

  /* ---------------- Clock (IST) ---------------- */
  const clock = $('#clock');
  const fmt = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false,
  });
  const tick = () => { clock.textContent = fmt.format(new Date()) + ' IST'; };
  tick(); setInterval(tick, 1000);

  /* ---------------- Fit hero lines to the full width ---------------- */
  function fitLines() {
    $$('.fit').forEach((el) => {
      const inner = el.firstElementChild;
      el.style.fontSize = '100px';
      const w = inner.getBoundingClientRect().width;
      const target = el.clientWidth;
      const maxByHeight = window.innerHeight * 0.26;
      el.style.fontSize = Math.min((100 * target) / w, maxByHeight) + 'px';
    });
  }
  fitLines();
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => { fitLines(); hasGSAP && ScrollTrigger.refresh(); });
  let rT;
  window.addEventListener('resize', () => { clearTimeout(rT); rT = setTimeout(fitLines, 120); });

  /* ---------------- Custom cursor ---------------- */
  if (finePointer) {
    root.classList.add('has-cursor');
    const cursor = $('.cursor');
    const dot = $('.cursor__dot');
    const ring = $('.cursor__ring');
    const label = $('.cursor__label');
    let mx = innerWidth / 2, my = innerHeight / 2, rx = mx, ry = my;
    window.addEventListener('mousemove', (e) => {
      mx = e.clientX; my = e.clientY;
      dot.style.transform = `translate(${mx}px, ${my}px)`;
    });
    const loop = () => {
      rx += (mx - rx) * 0.18; ry += (my - ry) * 0.18;
      ring.style.transform = `translate(${rx}px, ${ry}px)`;
      requestAnimationFrame(loop);
    };
    loop();
    $$('[data-cursor]').forEach((el) => {
      el.addEventListener('mouseenter', () => { label.textContent = el.dataset.cursor; cursor.classList.add('is-label'); });
      el.addEventListener('mouseleave', () => cursor.classList.remove('is-label'));
    });
    document.addEventListener('mouseleave', () => { cursor.style.opacity = 0; });
    document.addEventListener('mouseenter', () => { cursor.style.opacity = 1; });
  }

  /* ---------------- Magnetic buttons ---------------- */
  if (finePointer && hasGSAP) {
    $$('.magnetic').forEach((el) => {
      const strength = el.classList.contains('contact__mail') ? 0.15 : 0.35;
      el.addEventListener('mousemove', (e) => {
        const r = el.getBoundingClientRect();
        const x = e.clientX - (r.left + r.width / 2);
        const y = e.clientY - (r.top + r.height / 2);
        gsap.to(el, { x: x * strength, y: y * strength, duration: 0.6, ease: 'power3.out' });
      });
      el.addEventListener('mouseleave', () => gsap.to(el, { x: 0, y: 0, duration: 0.9, ease: 'elastic.out(1, 0.4)' }));
    });
  }

  /* ---------------- Project art (inline SVG) ---------------- */
  const ART = {
    sphere() {
      const n = 150, pts = [];
      const rot = 0.6, tilt = 0.35;
      for (let i = 0; i < n; i++) {
        const y = 1 - (i / (n - 1)) * 2;
        const r = Math.sqrt(1 - y * y);
        const th = i * 2.399963;
        let x = Math.cos(th) * r, z = Math.sin(th) * r;
        const x1 = x * Math.cos(rot) - z * Math.sin(rot);
        const z1 = x * Math.sin(rot) + z * Math.cos(rot);
        const y1 = y * Math.cos(tilt) - z1 * Math.sin(tilt);
        const z2 = y * Math.sin(tilt) + z1 * Math.cos(tilt);
        pts.push(`<circle cx="${(160 + x1 * 82).toFixed(1)}" cy="${(118 + y1 * 82).toFixed(1)}" r="${(1 + (z2 + 1) * 0.7).toFixed(2)}" fill="#ecebe6" fill-opacity="${(0.12 + (z2 + 1) * 0.3).toFixed(2)}"/>`);
      }
      return `<svg viewBox="0 0 320 240" xmlns="http://www.w3.org/2000/svg">
        ${pts.join('')}
        <ellipse class="art-stroke" cx="160" cy="118" rx="82" ry="26"/>
        <path class="art-copper" d="M160 118 L214 70" stroke-dasharray="4 4"/>
        <circle class="art-fill" cx="214" cy="70" r="5"/>
        <circle class="art-copper twinkle" cx="214" cy="70" r="12"/>
        <circle cx="160" cy="118" r="3" fill="#ecebe6"/>
        <text class="art-text" x="14" y="24">GCC-PHAT · BEAMFORMING</text>
        <text class="art-text" x="14" y="226">AZ 042°  EL 18°</text>
      </svg>`;
    },
    pulse() {
      let grid = '';
      for (let x = 0; x <= 320; x += 20) grid += `<path d="M${x} 0 V240" stroke="#ecebe6" stroke-opacity=".05"/>`;
      for (let y = 0; y <= 240; y += 20) grid += `<path d="M0 ${y} H320" stroke="#ecebe6" stroke-opacity=".05"/>`;
      return `<svg viewBox="0 0 320 240" xmlns="http://www.w3.org/2000/svg">
        ${grid}
        <path class="art-stroke" d="M0 130 H60 l8 -6 l8 6 H100 l6 10 l10 -70 l10 80 l6 -20 H150 l14 -12 l14 12 H220 l6 10 l10 -70 l10 80 l6 -20 H270 l14 -12 l14 12 H320"/>
        <path class="art-copper ecg" stroke-width="2" d="M0 130 H60 l8 -6 l8 6 H100 l6 10 l10 -70 l10 80 l6 -20 H150 l14 -12 l14 12 H220 l6 10 l10 -70 l10 80 l6 -20 H270 l14 -12 l14 12 H320"/>
        <text class="art-text" x="14" y="24">PPG · MAX30102 · I²C 0x57</text>
        <text class="art-text" x="14" y="226">MQTT ↑ SpO₂ · HR · TEMP</text>
      </svg>`;
    },
    hand() {
      const P = [[160, 215], [125, 195], [100, 170], [85, 148], [72, 128], [130, 140], [123, 105], [119, 82], [116, 60], [155, 135], [154, 96], [153, 70], [152, 46], [180, 140], [184, 104], [187, 80], [189, 60], [202, 152], [211, 125], [217, 107], [222, 90]];
      const E = [[0, 1], [1, 2], [2, 3], [3, 4], [0, 5], [5, 6], [6, 7], [7, 8], [5, 9], [9, 10], [10, 11], [11, 12], [9, 13], [13, 14], [14, 15], [15, 16], [13, 17], [17, 18], [18, 19], [19, 20], [0, 17]];
      const lines = E.map(([a, b]) => `<path class="art-stroke" stroke-opacity=".6" d="M${P[a][0]} ${P[a][1]} L${P[b][0]} ${P[b][1]}"/>`).join('');
      const dots = P.map(([x, y], i) => `<circle cx="${x}" cy="${y}" r="${[4, 8, 12, 16, 20].includes(i) ? 4 : 3}" fill="${[4, 8, 12, 16, 20].includes(i) ? '#e0874f' : '#ecebe6'}"/>`).join('');
      return `<svg viewBox="0 0 320 240" xmlns="http://www.w3.org/2000/svg">
        <rect x="60" y="34" width="176" height="194" fill="none" stroke="#e0874f" stroke-dasharray="4 4" stroke-opacity=".7"/>
        ${lines}${dots}
        <text class="art-text" x="14" y="24">MEDIAPIPE · 21 LANDMARKS</text>
        <text class="art-text" x="244" y="46">CONF .94</text>
        <text class="art-text" x="14" y="232">&lt; 200 MS END TO END</text>
      </svg>`;
    },
    pixels() {
      const font = { H: ['101', '101', '111', '101', '101'], E: ['111', '100', '110', '100', '111'], L: ['100', '100', '100', '100', '111'], O: ['111', '101', '101', '101', '111'], '!': ['1', '1', '1', '0', '1'] };
      const on = new Set();
      let col = 6;
      'HELLO!'.split('').forEach((ch) => {
        const g = font[ch];
        g.forEach((row, r) => row.split('').forEach((b, c) => { if (b === '1') on.add(`${col + c},${r + 2}`); }));
        col += g[0].length + 1;
      });
      for (let c = 0; c < 32; c++) on.add(`${c},${11 + Math.round(2.4 * Math.sin((c / 32) * Math.PI * 3))}`);
      let cells = '';
      for (let r = 0; r < 16; r++) for (let c = 0; c < 32; c++) {
        const lit = on.has(`${c},${r}`);
        cells += `<rect x="${32 + c * 8}" y="${48 + r * 8}" width="7" height="7" fill="${lit ? '#e0874f' : '#ecebe6'}" fill-opacity="${lit ? 1 : 0.06}"/>`;
      }
      return `<svg viewBox="0 0 320 240" xmlns="http://www.w3.org/2000/svg">
        <rect x="26" y="42" width="268" height="140" fill="none" stroke="#ecebe6" stroke-opacity=".25"/>
        ${cells}
        <text class="art-text" x="14" y="24">GLCD 128×64 · PARALLEL BUS</text>
        <text class="art-text" x="14" y="222">8051 · EMBEDDED C · KEIL</text>
      </svg>`;
    },
  };

  const projects = $$('.project');
  projects.forEach((p) => {
    const art = ART[p.dataset.art];
    if (art) $('.project__art', p).innerHTML = art();
  });

  /* ---------------- Project accordion ---------------- */
  projects.forEach((p) => {
    const btn = $('.project__row', p);
    btn.addEventListener('click', () => {
      const open = !p.classList.contains('is-open');
      projects.forEach((o) => { o.classList.remove('is-open'); $('.project__row', o).setAttribute('aria-expanded', 'false'); });
      if (open) { p.classList.add('is-open'); btn.setAttribute('aria-expanded', 'true'); }
      hidePreview();
      if (hasGSAP) setTimeout(() => ScrollTrigger.refresh(), 750);
    });
  });

  /* ---------------- Floating project preview ---------------- */
  const preview = $('.preview');
  const previewInner = $('.preview__inner');
  let px = 0, py = 0, tx = 0, ty = 0, previewOn = false, previewRAF = null;
  function hidePreview() { previewOn = false; preview.classList.remove('is-on'); }
  if (finePointer) {
    projects.forEach((p) => {
      const row = $('.project__row', p);
      row.addEventListener('mouseenter', (e) => {
        if (p.classList.contains('is-open')) return;
        previewInner.innerHTML = ART[p.dataset.art]();
        if (!previewOn) { px = tx = e.clientX; py = ty = e.clientY; }
        previewOn = true; preview.classList.add('is-on');
        if (!previewRAF) previewLoop();
      });
      row.addEventListener('mouseleave', hidePreview);
    });
    window.addEventListener('mousemove', (e) => { tx = e.clientX; ty = e.clientY; });
    function previewLoop() {
      px += (tx - px) * 0.14; py += (ty - py) * 0.14;
      const vx = tx - px;
      preview.style.transform = '';
      preview.style.left = px + 32 + 'px';
      preview.style.top = py - 110 + 'px';
      previewInner.style.transform = `rotate(${Math.max(-8, Math.min(8, vx * 0.08))}deg)`;
      previewRAF = requestAnimationFrame(previewLoop);
    }
  }

  /* ---------------- Listening demo (3D sound localization project) ----------------
     A small 2D version of the idea: 8 mics on a circle, the cursor is a sound
     source, wavefronts spread out, and a far-field least-squares solve on the
     time differences of arrival estimates the bearing. Textbook maths only. */
  function initListeningDemo() {
    const project = $('.project[data-art="sphere"]');
    if (!project) return;
    const box = $('.project__art', project);
    box.classList.add('doa-box');
    box.innerHTML = '<canvas class="doa"></canvas>' +
      '<div class="doa__readout mono"><span>DOA <b class="copper" data-doa>---.-°</b></span><span>Δt max <b data-dt>-.--- ms</b></span><span>Src <b data-src>auto</b></span></div>' +
      `<p class="doa__hint mono">${finePointer ? 'Move your cursor here' : 'Tap anywhere here'} · the array listens</p>`;
    const cv = $('canvas', box);
    const ctx = cv.getContext('2d');
    if (!ctx) return;
    const roDoa = $('[data-doa]', box), roDt = $('[data-dt]', box), roSrc = $('[data-src]', box);
    const N = 8;
    let w = 1, h = 1, cx = 0, cy = 0, R = 1, mics = [];
    const src = { x: 0, y: 0 }, target = { x: 0, y: 0 };
    let manualAt = -99, rings = [], lastRing = -99, lastEst = -99;
    let est = { ux: 1, uy: 0, deg: 0, dt: 0 };
    let running = false, raf = null, visible = true;

    function layout() {
      const r = box.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio, 2);
      w = Math.max(1, r.width); h = Math.max(1, r.height);
      cv.width = Math.round(w * dpr); cv.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      cx = w / 2; cy = h / 2; R = Math.min(w, h) * 0.17;
      mics = Array.from({ length: N }, (_, i) => {
        const a = (i / N) * Math.PI * 2;
        return { x: cx + Math.cos(a) * R, y: cy + Math.sin(a) * R, hit: -99 };
      });
    }

    function pointer(e, burst) {
      const r = box.getBoundingClientRect();
      target.x = e.clientX - r.left; target.y = e.clientY - r.top;
      manualAt = performance.now() / 1000;
      if (burst) { rings.push({ x: target.x, y: target.y, t: manualAt, strong: true }); }
    }
    box.addEventListener('pointermove', (e) => pointer(e, false));
    box.addEventListener('pointerdown', (e) => pointer(e, true));

    function estimate() {
      // far-field model: (m_i - m_0) · u = -(d_i - d_0), solved by least squares
      const d = mics.map((m) => Math.hypot(src.x - m.x, src.y - m.y) + (Math.random() - 0.5) * 0.5);
      let a11 = 0, a12 = 0, a22 = 0, b1 = 0, b2 = 0;
      for (let i = 1; i < N; i++) {
        const ax = mics[i].x - mics[0].x, ay = mics[i].y - mics[0].y, b = -(d[i] - d[0]);
        a11 += ax * ax; a12 += ax * ay; a22 += ay * ay; b1 += ax * b; b2 += ay * b;
      }
      const det = a11 * a22 - a12 * a12 || 1;
      let ux = (a22 * b1 - a12 * b2) / det, uy = (a11 * b2 - a12 * b1) / det;
      const len = Math.hypot(ux, uy) || 1; ux /= len; uy /= len;
      let deg = (Math.atan2(-uy, ux) * 180) / Math.PI; if (deg < 0) deg += 360;
      const metresPerPx = 0.16 / R;                    // array radius drawn as 16 cm
      const dt = ((Math.max(...d) - Math.min(...d)) * metresPerPx / 343) * 1000;
      return { ux, uy, deg, dt };
    }

    function draw(t) {
      ctx.clearRect(0, 0, w, h);
      // faint grid
      ctx.fillStyle = 'rgba(236,235,230,.08)';
      for (let x = 12; x < w; x += 18) for (let y = 12; y < h; y += 18) ctx.fillRect(x, y, 1, 1);

      // wavefronts
      const speed = Math.max(w, h) * 0.55;
      rings = rings.filter((r) => t - r.t < 2.4);
      for (const r of rings) {
        const age = t - r.t, rad = age * speed;
        ctx.strokeStyle = `rgba(224,135,79,${(0.5 * (1 - age / 2.4) * (r.strong ? 1.6 : 1)).toFixed(3)})`;
        ctx.lineWidth = r.strong ? 1.6 : 1;
        ctx.beginPath(); ctx.arc(r.x, r.y, rad, 0, Math.PI * 2); ctx.stroke();
        const prev = Math.max(0, rad - speed / 50);
        for (const m of mics) {
          const dm = Math.hypot(m.x - r.x, m.y - r.y);
          if (dm > prev && dm <= rad) m.hit = t;
        }
      }

      // array outline + bearing
      ctx.strokeStyle = 'rgba(236,235,230,.22)'; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.arc(cx, cy, R, 0, Math.PI * 2); ctx.stroke();
      ctx.strokeStyle = 'rgba(224,135,79,.95)'; ctx.lineWidth = 1.6;
      ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(cx + est.ux * R * 2.6, cy + est.uy * R * 2.6); ctx.stroke();

      // mics flash as a wavefront passes
      for (const m of mics) {
        const f = Math.exp(-(t - m.hit) * 7);
        ctx.strokeStyle = `rgba(224,135,79,${(0.55 + f * 0.45).toFixed(3)})`; ctx.lineWidth = 1.5;
        ctx.beginPath(); ctx.arc(m.x, m.y, 5 + f * 5, 0, Math.PI * 2); ctx.stroke();
        ctx.fillStyle = '#ecebe6';
        ctx.beginPath(); ctx.arc(m.x, m.y, 2, 0, Math.PI * 2); ctx.fill();
      }

      // source
      ctx.fillStyle = '#ecebe6';
      ctx.beginPath(); ctx.arc(src.x, src.y, 3.5, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = 'rgba(236,235,230,.6)'; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.arc(src.x, src.y, 9 + Math.sin(t * 6) * 1.5, 0, Math.PI * 2); ctx.stroke();
    }

    function frame(now) {
      raf = null;
      const t = now / 1000;
      const manual = t - manualAt < 2.5;
      if (!manual) {
        target.x = cx + Math.cos(t * 0.5) * w * 0.36;
        target.y = cy + Math.sin(t * 0.73) * h * 0.32;
      }
      src.x += (target.x - src.x) * (manual ? 0.2 : 0.06);
      src.y += (target.y - src.y) * (manual ? 0.2 : 0.06);
      if (t - lastRing > 0.6) { rings.push({ x: src.x, y: src.y, t }); lastRing = t; }
      if (t - lastEst > 0.12) {
        est = estimate(); lastEst = t;
        roDoa.textContent = est.deg.toFixed(1).padStart(5, '0') + '°';
        roDt.textContent = est.dt.toFixed(3) + ' ms';
        roSrc.textContent = manual ? (finePointer ? 'cursor' : 'touch') : 'auto';
      }
      draw(t);
      if (running && visible && !document.hidden && !reduced) raf = requestAnimationFrame(frame);
    }

    function start() {
      if (running) return;
      running = true; layout();
      src.x = target.x = cx + w * 0.3; src.y = target.y = cy - h * 0.2;
      if (reduced) { est = estimate(); frame(performance.now()); return; }
      if (!raf) raf = requestAnimationFrame(frame);
    }
    function stop() { running = false; if (raf) { cancelAnimationFrame(raf); raf = null; } }

    // run only while this project's panel is open and on screen
    const sync = () => (project.classList.contains('is-open') ? start() : stop());
    $$('.project__row').forEach((b) => b.addEventListener('click', () => setTimeout(sync, 30)));
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(([en]) => {
        visible = en.isIntersecting;
        if (visible && running && !raf && !reduced) raf = requestAnimationFrame(frame);
      }).observe(box);
    }
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden && running && !raf && !reduced) raf = requestAnimationFrame(frame);
    });
    window.addEventListener('resize', () => { if (running) layout(); });
  }
  initListeningDemo();

  /* ---------------- Datasheet chip ---------------- */
  (function buildChip() {
    const svg = $('#chip');
    if (!svg) return;
    svg.setAttribute('viewBox', '0 0 400 440');
    const names = ['LANG', 'PROTO', 'PERIPH', 'ELEC', 'PLATF', 'HW', 'TEST', 'TOOLS', 'VCC', 'GND'];
    const top = 70, step = 66;
    let out = `<rect class="body" x="120" y="40" width="160" height="360" rx="6"/>
      <path class="notch" d="M184 40 A16 16 0 0 0 216 40"/>
      <circle cx="140" cy="62" r="5" fill="#e0874f"/>
      <text class="mark" x="200" y="220" text-anchor="middle" transform="rotate(-90 200 220)">VH-2026</text>
      <text class="sub" x="236" y="220" text-anchor="middle" transform="rotate(-90 236 220)">EMBEDDED · PCB · C</text>
      <text class="sub" x="166" y="220" text-anchor="middle" transform="rotate(-90 166 220)">DHARWAD · IN</text>`;
    names.forEach((n, i) => {
      const left = i < 5;
      const y = left ? top + i * step : top + (9 - i) * step;
      const px = left ? 92 : 280;
      const pin = `<rect class="pin" x="${px}" y="${y - 7}" width="28" height="14" rx="2"/>`;
      const num = `<text class="pin-num" x="${left ? 128 : 272}" y="${y + 3}" text-anchor="${left ? 'start' : 'end'}">${String(i + 1).padStart(2, '0')}</text>`;
      const label = `<text class="pin-label" x="${left ? 84 : 316}" y="${y + 3}" text-anchor="${left ? 'end' : 'start'}">${n}</text>`;
      out += `<g data-pin="${i}">${pin}${num}${label}</g>`;
    });
    svg.innerHTML = out;

    const rows = $$('.datasheet tbody tr');
    const setOn = (i, on) => {
      const g = svg.querySelector(`g[data-pin="${i}"]`);
      if (g) g.classList.toggle('is-on', on);
      const tr = rows[i];
      if (tr) tr.classList.toggle('is-on', on);
    };
    rows.forEach((tr) => {
      const i = +tr.dataset.pin;
      tr.addEventListener('mouseenter', () => setOn(i, true));
      tr.addEventListener('mouseleave', () => setOn(i, false));
      if (!finePointer) tr.addEventListener('click', () => { rows.forEach((_, j) => setOn(j, j === i)); tapped = Date.now(); });
    });
    let tapped = 0;
    $$('g[data-pin]', svg).forEach((g) => {
      const i = +g.dataset.pin;
      if (i > 7) return;
      g.style.cursor = 'pointer';
      g.addEventListener('mouseenter', () => setOn(i, true));
      g.addEventListener('mouseleave', () => setOn(i, false));
    });

    // Idle: "scan" through the pins while the section is visible
    if (!reduced && 'IntersectionObserver' in window) {
      let idx = 0, timer = null;
      const io = new IntersectionObserver(([en]) => {
        if (en.isIntersecting && !timer) {
          timer = setInterval(() => {
            if ($$('.datasheet tbody tr:hover').length || Date.now() - tapped < 4000) return;
            idx = (idx + 1) % 8; rows.forEach((_, j) => setOn(j, j === idx));
          }, 1100);
        } else if (!en.isIntersecting && timer) {
          clearInterval(timer); timer = null; setOn(idx, false);
        }
      });
      io.observe(svg);
    }
  })();

  /* ---------------- About: split into words ---------------- */
  const statement = $('[data-words]');
  let words = [];
  if (statement && hasGSAP) {
    const text = statement.textContent.trim().replace(/\s+/g, ' ');
    statement.setAttribute('aria-label', text);
    statement.innerHTML = text.split(' ').map((w) => `<span class="w" aria-hidden="true">${w.replace(/&/g, '&amp;').replace(/</g, '&lt;')}</span>`).join(' ');
    words = $$('.w', statement);
  }

  /* ---------------- Scroll animations ---------------- */
  function initScroll() {
    if (!hasGSAP) return;

    ScrollTrigger.batch('[data-reveal]', {
      start: 'top 90%',
      once: true,
      onEnter: (batch) => gsap.to(batch, { opacity: 1, y: 0, duration: 1.1, ease: 'expo.out', stagger: 0.08 }),
    });

    if (words.length) {
      gsap.fromTo(words, { opacity: 0.14 }, {
        opacity: 1, ease: 'none', stagger: 0.1,
        scrollTrigger: { trigger: statement, start: 'top 82%', end: 'bottom 50%', scrub: true },
      });
    }

    gsap.to('.contact__title .line__inner', {
      y: 0, duration: 1.3, ease: 'expo.out', stagger: 0.1,
      scrollTrigger: { trigger: '.contact__title', start: 'top 85%', once: true },
    });

    // Hero parallax out
    gsap.to('.hero__title', {
      yPercent: -18, ease: 'none',
      scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true },
    });  }

  /* ---------------- Oscilloscope progress ---------------- */
  function initScope() {
    const svg = $('#scope-svg'), base = $('#scope-path'), live = $('#scope-live');
    const pct = $('#scope-pct'), label = $('#scope-label');
    if (!svg) return;

    // one scope trace: a quiet baseline with a pulse every few divisions
    let d = 'M0 16';
    for (let x = 0; x <= 1200; x += 4) {
      const pulse = x % 150;
      let y = 16 + Math.sin(x * 0.06) * 1.6;
      if (pulse < 20) y = 16 - Math.exp(-Math.pow((pulse - 10) / 4, 2)) * 11;
      d += ` L${x} ${y.toFixed(2)}`;
    }
    base.setAttribute('d', d);
    live.setAttribute('d', d);
    const len = live.getTotalLength();
    live.style.strokeDasharray = len;
    live.style.strokeDashoffset = len;

    const sections = [
      ['#top', '00 / Intro'], ['#about', '01 / About'], ['#experience', '02 / Experience'],
      ['#work', '03 / Work'], ['#skills', '04 / Skills'], ['#education', '05 / Education'],
      ['#contact', '06 / Contact'],
    ].map(([sel, name]) => ({ el: $(sel), name })).filter((s) => s.el);

    let ticking = false;
    function update() {
      ticking = false;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const p = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
      live.style.strokeDashoffset = len * (1 - p);
      pct.textContent = String(Math.round(p * 100)).padStart(2, '0') + '%';
      const mid = window.scrollY + window.innerHeight * 0.45;
      let current = sections[0];
      for (const s of sections) if (s.el.offsetTop <= mid) current = s;
      if (label.textContent !== current.name) label.textContent = current.name;
    }
    window.addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
    window.addEventListener('resize', update);
    update();
  }

  /* ---------------- PCB traces behind the hero name ---------------- */
  // deterministic pseudo-random, so the board looks the same on every load
  function makeRnd(GRID) {
    let seed = 20260920;
    const rnd = () => { seed = (seed * 1664525 + 1013904223) % 4294967296; return seed / 4294967296; };
    const pick = (arr) => arr[Math.floor(rnd() * arr.length)];
    const snap = (v) => Math.round(v / GRID) * GRID;
    return { rnd, pick, snap };
  }
  function chamfer(pts, cut = 16) {
    let d = `M${pts[0][0]} ${pts[0][1]}`;
    for (let i = 1; i < pts.length - 1; i++) {
      const [px, py] = pts[i - 1], [cx, cy] = pts[i], [nx, ny] = pts[i + 1];
      const a = Math.hypot(cx - px, cy - py), b = Math.hypot(nx - cx, ny - cy);
      const c1 = Math.min(cut, a / 2), c2 = Math.min(cut, b / 2);
      d += ` L${cx - ((cx - px) / (a || 1)) * c1} ${cy - ((cy - py) / (a || 1)) * c1}`;
      d += ` L${cx + ((nx - cx) / (b || 1)) * c2} ${cy + ((ny - cy) / (b || 1)) * c2}`;
    }
    const last = pts[pts.length - 1];
    return d + ` L${last[0]} ${last[1]}`;
  }

  // landscape board: the name sits on a copper pour, a QFP chip off to the right
  function wideBoard() {
    const W = 1600, H = 900, GRID = 40;
    const { rnd, pick, snap } = makeRnd(GRID);

    // route an orthogonal track, then chamfer its corners to 45° like real layout
    function route() {
      const fromLeft = rnd() < 0.5;
      let x = fromLeft ? -40 : W + 40;
      let y = snap(rnd() * H);
      const pts = [[x, y]];
      let horizontal = true;
      const steps = 3 + Math.floor(rnd() * 4);
      for (let i = 0; i < steps; i++) {
        if (horizontal) {
          const len = (2 + Math.floor(rnd() * 6)) * GRID;
          x += fromLeft ? len : -len;
        } else {
          const len = (1 + Math.floor(rnd() * 4)) * GRID;
          y += rnd() < 0.5 ? len : -len;
          y = Math.max(GRID, Math.min(H - GRID, y));
        }
        pts.push([x, y]);
        horizontal = !horizontal;
      }
      return pts;
    }
    let out = '';
    // faint fabrication grid
    for (let gx = GRID; gx < W; gx += GRID * 2) for (let gy = GRID; gy < H; gy += GRID * 2) {
      out += `<rect class="pcb__grid" x="${gx}" y="${gy}" width="1.4" height="1.4"/>`;
    }

    // hatched copper pour, the area a ground plane would occupy, sits behind the name
    const pour = { x: 40, y: 470, w: 1080, h: 330 };
    let hatch = '';
    for (let x = -pour.h; x < pour.w; x += 15) {
      hatch += `<path d="M${pour.x + x} ${pour.y + pour.h} L${pour.x + x + pour.h} ${pour.y}"/>`;
    }
    out += `<clipPath id="pourClip"><rect x="${pour.x}" y="${pour.y}" width="${pour.w}" height="${pour.h}" rx="8"/></clipPath>`
      + `<g class="pcb__pour" clip-path="url(#pourClip)">${hatch}</g>`
      + `<rect class="pcb__pour-edge" x="${pour.x}" y="${pour.y}" width="${pour.w}" height="${pour.h}" rx="8"/>`;

    // a QFP footprint: body, pins on four sides, pin-1 marker and silkscreen
    const q = { cx: 1290, cy: 600, s: 190, pins: 9, pitch: 18, len: 22 };
    const half = q.s / 2;
    let qfp = `<rect class="pcb__chip" x="${q.cx - half}" y="${q.cy - half}" width="${q.s}" height="${q.s}" rx="6"/>`;
    for (let i = 0; i < q.pins; i++) {
      const o = (i - (q.pins - 1) / 2) * q.pitch;
      qfp += `<rect class="pcb__pin" x="${q.cx - half - q.len}" y="${q.cy + o - 3}" width="${q.len}" height="6" rx="1"/>`;
      qfp += `<rect class="pcb__pin" x="${q.cx + half}" y="${q.cy + o - 3}" width="${q.len}" height="6" rx="1"/>`;
      qfp += `<rect class="pcb__pin" x="${q.cx + o - 3}" y="${q.cy - half - q.len}" width="6" height="${q.len}" rx="1"/>`;
      qfp += `<rect class="pcb__pin" x="${q.cx + o - 3}" y="${q.cy + half}" width="6" height="${q.len}" rx="1"/>`;
    }
    qfp += `<circle class="pcb__via" cx="${q.cx - half + 20}" cy="${q.cy - half + 20}" r="5"/>`;
    qfp += `<text class="pcb__silk" x="${q.cx}" y="${q.cy + 4}" text-anchor="middle">U1</text>`;
    qfp += `<text class="pcb__silk" x="${q.cx}" y="${q.cy + half + 44}" text-anchor="middle">VH-2026</text>`;
    out += qfp;
    const pulses = [];
    for (let i = 0; i < 26; i++) {
      const pts = route();
      const d = chamfer(pts);
      const bright = rnd() < 0.3;
      out += `<path class="pcb__trace${bright ? ' pcb__trace--bright' : ''}" d="${d}"/>`;
      const [ex, ey] = pts[pts.length - 1];
      if (ex > 0 && ex < W) {
        out += rnd() < 0.55
          ? `<circle class="pcb__pad" cx="${ex}" cy="${ey}" r="${pick([5, 6, 7])}"/>`
          : `<rect class="pcb__pad" x="${ex - 6}" y="${ey - 4}" width="12" height="8" rx="1"/>`;
      }
      if (ex > 0 && ex < W && ey > 330 && rnd() < 0.45) {
        const ref = pick(['R1', 'R7', 'C4', 'C12', 'U2', 'J1', 'TP3', 'D5', 'L2']);
        out += `<text class="pcb__silk" x="${ex + 12}" y="${ey - 8}">${ref}</text>`;
      }
      if (bright && pulses.length < 6) pulses.push(d);
    }
    for (let i = 0; i < 26; i++) {
      out += `<circle class="pcb__via" cx="${snap(rnd() * W)}" cy="${snap(rnd() * H)}" r="2.4"/>`;
    }
    return { W, H, out, pulses: pulses.map((d) => ({ d })) };
  }

  // portrait board for phones: the chip moves into the open space above the
  // name and its pins fan out to the edges, so the whole screen reads as a PCB
  function tallBoard() {
    const W = 900, H = 1600, GRID = 40;
    const { rnd, pick, snap } = makeRnd(GRID);
    const q = { cx: 470, cy: 570, s: 250, pins: 9, pitch: 24, len: 28 };
    const half = q.s / 2;
    const mid = (q.pins - 1) / 2;
    const pulses = [];
    let out = '';

    for (let gx = GRID; gx < W; gx += GRID * 2) for (let gy = GRID; gy < H; gy += GRID * 2) {
      out += `<rect class="pcb__grid" x="${gx}" y="${gy}" width="2" height="2"/>`;
    }

    // copper pour behind the name
    const pour = { x: 30, y: 900, w: 840, h: 250 };
    let hatch = '';
    for (let x = -pour.h; x < pour.w; x += 18) {
      hatch += `<path d="M${pour.x + x} ${pour.y + pour.h} L${pour.x + x + pour.h} ${pour.y}"/>`;
    }
    out += `<clipPath id="pourClip"><rect x="${pour.x}" y="${pour.y}" width="${pour.w}" height="${pour.h}" rx="10"/></clipPath>`
      + `<g class="pcb__pour" clip-path="url(#pourClip)">${hatch}</g>`
      + `<rect class="pcb__pour-edge" x="${pour.x}" y="${pour.y}" width="${pour.w}" height="${pour.h}" rx="10"/>`;

    // background tracks in the bands the chip leaves free
    const bands = [[160, 330], [780, 860], [1200, 1480]];
    for (let i = 0; i < 12; i++) {
      const [y0, y1] = bands[i % 3];
      const fromLeft = rnd() < 0.5;
      let x = fromLeft ? -40 : W + 40;
      let y = snap(y0 + rnd() * (y1 - y0));
      const pts = [[x, y]];
      const steps = 2 + Math.floor(rnd() * 3);
      for (let k = 0; k < steps; k++) {
        if (k % 2 === 0) x += (fromLeft ? 1 : -1) * (2 + Math.floor(rnd() * 5)) * GRID;
        else y = Math.max(y0, Math.min(y1, y + (rnd() < 0.5 ? 1 : -1) * (1 + Math.floor(rnd() * 2)) * GRID));
        pts.push([x, y]);
      }
      out += `<path class="pcb__trace${rnd() < 0.3 ? ' pcb__trace--bright' : ''}" d="${chamfer(pts, 22)}"/>`;
      const [ex, ey] = pts[pts.length - 1];
      out += rnd() < 0.55
        ? `<circle class="pcb__pad" cx="${ex}" cy="${ey}" r="${pick([7, 8, 9])}"/>`
        : `<rect class="pcb__pad" x="${ex - 8}" y="${ey - 6}" width="16" height="12" rx="1"/>`;
      if (rnd() < 0.4) {
        out += `<text class="pcb__silk" x="${ex + 14}" y="${ey - 12}">${pick(['R1', 'R7', 'C4', 'C12', 'J1', 'TP3', 'D5', 'L2'])}</text>`;
      }
    }

    // fan-out: left, right and top pins escape to the board edge without
    // crossing their neighbours, because the outer pins turn first
    for (let i = 0; i < q.pins; i++) {
      const o = (i - mid) * q.pitch;
      const rank = Math.abs(i - mid);
      const run = 34 + (mid - rank) * 22;
      const bend = (rank + 1) * 30 * (o < 0 ? -1 : 1);
      [-1, 1].forEach((side) => {
        const tx = q.cx + side * (half + q.len), ty = q.cy + o, x1 = tx + side * run;
        const pts = [[tx, ty], [x1, ty], [x1, ty + bend], [side < 0 ? -40 : W + 40, ty + bend]];
        const d = chamfer(pts, 14);
        const bright = (i + (side > 0 ? 1 : 0)) % 3 === 0;
        out += `<path class="pcb__trace${bright ? ' pcb__trace--bright' : ''}" d="${d}"/>`;
        out += `<circle class="pcb__via" cx="${x1}" cy="${ty + bend}" r="4"/>`;
        if (bright) pulses.push({ d, toChip: true });
      });
      const tx = q.cx + o, ty = q.cy - half - q.len;
      const up = chamfer([[tx, ty], [tx, ty - run], [tx + bend, ty - run - Math.abs(bend)], [tx + bend, -40]], 14);
      out += `<path class="pcb__trace${i % 4 === 1 ? ' pcb__trace--bright' : ''}" d="${up}"/>`;
      if (i % 4 === 1) pulses.push({ d: up, toChip: true });
      const by = q.cy + half + q.len, stub = by + 26 + (i % 3) * 18;
      out += `<path class="pcb__trace" d="M${tx} ${by} L${tx} ${stub}"/><circle class="pcb__via" cx="${tx}" cy="${stub}" r="4"/>`;
    }

    // the chip, drawn over its leads
    out += `<rect class="pcb__chip" x="${q.cx - half}" y="${q.cy - half}" width="${q.s}" height="${q.s}" rx="8"/>`;
    for (let i = 0; i < q.pins; i++) {
      const o = (i - mid) * q.pitch;
      out += `<rect class="pcb__pin" x="${q.cx - half - q.len}" y="${q.cy + o - 4}" width="${q.len}" height="8" rx="1"/>`;
      out += `<rect class="pcb__pin" x="${q.cx + half}" y="${q.cy + o - 4}" width="${q.len}" height="8" rx="1"/>`;
      out += `<rect class="pcb__pin" x="${q.cx + o - 4}" y="${q.cy - half - q.len}" width="8" height="${q.len}" rx="1"/>`;
      out += `<rect class="pcb__pin" x="${q.cx + o - 4}" y="${q.cy + half}" width="8" height="${q.len}" rx="1"/>`;
    }
    out += `<circle class="pcb__via" cx="${q.cx - half + 26}" cy="${q.cy - half + 26}" r="7"/>`;
    out += `<text class="pcb__silk" x="${q.cx}" y="${q.cy - 4}" text-anchor="middle">U1</text>`;
    out += `<text class="pcb__silk" x="${q.cx}" y="${q.cy + 30}" text-anchor="middle">VH-2026</text>`;

    for (let i = 0; i < 18; i++) out += `<circle class="pcb__via" cx="${snap(rnd() * W)}" cy="${snap(rnd() * H)}" r="3.2"/>`;
    return { W, H, out, pulses };
  }

  function initPCB() {
    const svg = $('#pcb');
    if (!svg) return;
    const tallQuery = window.matchMedia('(max-aspect-ratio: 4/5)');

    function build() {
      const tall = tallQuery.matches;
      const board = tall ? tallBoard() : wideBoard();
      let out = board.out;
      // data streams: 1s and 0s running along the bright tracks
      if (!reduced) {
        board.pulses.slice(0, tall ? 8 : 6).forEach((p, i) => {
          const dur = (tall ? 5 + (i % 4) * 1.4 : 9 + i * 2.2).toFixed(1);
          // on the tall board the bits flow from the board edge into the chip
          const dir = p.toChip ? ' keyPoints="1;0" keyTimes="0;1" calcMode="linear"' : '';
          out += `<text class="pcb__bit" dy="4">${Math.random() < 0.5 ? '0' : '1'}` +
            `<animateMotion dur="${dur}s" begin="${(i * (tall ? 0.7 : 1.6)).toFixed(2)}s" repeatCount="indefinite"${dir} path="${p.d}"/></text>`;
        });
      }
      svg.setAttribute('viewBox', `0 0 ${board.W} ${board.H}`);
      svg.classList.toggle('pcb--tall', tall);
      svg.innerHTML = out;
    }
    build();
    tallQuery.addEventListener('change', build);

    // each bit flips as it travels, so the stream never looks static
    if (!reduced) {
      let flipTimer = null;
      const flip = () => {
        const bits = $$('.pcb__bit', svg);
        const el = bits[Math.floor(Math.random() * bits.length)];
        if (el) el.firstChild.nodeValue = Math.random() < 0.5 ? '0' : '1';
      };
      const start = () => { if (!flipTimer) flipTimer = setInterval(flip, 220); };
      const stop = () => { if (flipTimer) { clearInterval(flipTimer); flipTimer = null; } };
      document.addEventListener('visibilitychange', () => (document.hidden ? stop() : start()));
      if ('IntersectionObserver' in window) {
        new IntersectionObserver(([en]) => (en.isIntersecting ? start() : stop())).observe(svg);
      } else start();
    }
  }

  /* ---------------- Intro ---------------- */
  function intro() {
    if (!hasGSAP) return;
    const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
    tl.to('.hero__title .line__inner', { y: 0, duration: 1.5, stagger: 0.12 }, 0.05)
      .to('[data-hero]', { opacity: 1, y: 0, duration: 1.2, stagger: 0.07 }, 0.45);
  }

  /* ---------------- Preloader: firmware boot log ---------------- */
  function preloader() {
    return new Promise((resolve) => {
      const el = $('#preloader');
      if (!hasGSAP || !el) { if (el) el.remove(); resolve(); return; }

      let seen = false;
      try { seen = sessionStorage.getItem('vh-booted') === '1'; sessionStorage.setItem('vh-booted', '1'); } catch (e) { /* storage unavailable */ }

      const lines = [
        '[    0.000] VH-FW bring-up · rev 2026',
        '[    0.012] power rails ........ 3V3 <span class="ok">OK</span> · 1V8 <span class="ok">OK</span>',
        '[    0.041] clock tree ......... PLL <span class="ok">locked</span>',
        '[    0.087] uart0 115200 8N1 ... <span class="ok">OK</span>',
        '[    0.120] i2c scan ........... 0x57 0x76',
        '[    0.164] spi flash .......... <span class="ok">OK</span>',
        '[    0.203] gpio · pwm · timers  <span class="ok">OK</span>',
        '[    0.251] adc sampling ....... <span class="ok">OK</span>',
        '[    0.298] portfolio.bin ...... <span class="ok">loaded</span>',
        '[    0.330] hello, world. I\'m Vaishnavi.',
      ];
      const log = $('#bootlog');
      const count = $('#bootcount');
      const bar = $('#bootbar');
      const state = { p: 0 };
      const duration = reduced ? 0.3 : seen ? 0.9 : 2.3;
      if (lenis) lenis.stop();

      gsap.to(state, {
        p: 100, duration, ease: 'power2.inOut',
        onUpdate() {
          const p = Math.round(state.p);
          count.textContent = String(p).padStart(3, '0');
          bar.style.width = p + '%';
          const n = Math.min(lines.length, Math.floor((p / 100) * lines.length) + 1);
          if (log.childElementCount < n) {
            for (let i = log.childElementCount; i < n; i++) {
              const d = document.createElement('div'); d.innerHTML = lines[i]; log.appendChild(d);
            }
          }
        },
        onComplete() {
          gsap.to(el, {
            yPercent: -100, duration: 1.1, ease: 'expo.inOut', delay: 0.15,
            onStart: () => { el.classList.add('is-done'); resolve(); },
            onComplete: () => { el.remove(); if (lenis) lenis.start(); },
          });
        },
      });
    });
  }

  initPCB();

  preloader().then(() => {
    intro();
    initScroll();
    initScope();
    if (hasGSAP) ScrollTrigger.refresh();
  });

  /* =========================================================
     BACKGROUND FIELD (WebGL)
     One point field behind the whole page. It ripples under the
     cursor, and as you scroll it morphs: grid → wave → chip
     outline → the initials VH, while the camera tilts to a plan
     view so the shapes read clearly.
     ========================================================= */
  (async function field() {
    const canvas = $('#field');
    let THREE;
    try {
      THREE = await import('./lib/three.module.min.js');
    } catch (e) { return; }

    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({ canvas, antialias: false, powerPreference: 'high-performance' });
    } catch (e) { return; }
    renderer.setClearColor(0x0a0a0a, 1);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100);

    const mobile = window.innerWidth < 760;
    const COLS = mobile ? 96 : 168, ROWS = mobile ? 74 : 102;
    const X0 = -20, X1 = 20, Z0 = -18, Z1 = 8;
    const N = COLS * ROWS;
    const pos = new Float32Array(N * 3);
    let k = 0;
    for (let r = 0; r < ROWS; r++) for (let c = 0; c < COLS; c++) {
      pos[k++] = X0 + (c / (COLS - 1)) * (X1 - X0);
      pos[k++] = 0;
      pos[k++] = Z0 + (r / (ROWS - 1)) * (Z1 - Z0);
    }

    /* ---- Shape targets, sampled from an offscreen 2D canvas ---- */
    const SHAPE_W = 19, SHAPE_D = 12.5, SHAPE_Z = -2.5;
    function samplePoints(draw) {
      const W = 320, H = 210;
      const cv = document.createElement('canvas');
      cv.width = W; cv.height = H;
      const ctx = cv.getContext('2d', { willReadFrequently: true });
      if (!ctx) return [];
      ctx.fillStyle = '#fff'; ctx.strokeStyle = '#fff';
      draw(ctx, W, H);
      let data;
      try { data = ctx.getImageData(0, 0, W, H).data; } catch (e) { return []; }
      const pts = [];
      for (let y = 0; y < H; y += 1) for (let x = 0; x < W; x += 1) {
        if (data[(y * W + x) * 4 + 3] > 120) {
          pts.push([((x + 0.5) / W - 0.5) * SHAPE_W, ((y + 0.5) / H - 0.5) * SHAPE_D + SHAPE_Z]);
        }
      }
      return pts;
    }

    const chipPts = samplePoints((ctx, W, H) => {
      ctx.lineWidth = 4;
      const bw = 150, bh = 116, bx = (W - bw) / 2, by = (H - bh) / 2;
      ctx.strokeRect(bx, by, bw, bh);                       // body
      ctx.beginPath(); ctx.arc(W / 2, by, 13, 0, Math.PI); ctx.stroke(); // notch
      ctx.beginPath(); ctx.arc(bx + 18, by + 18, 5, 0, Math.PI * 2); ctx.fill(); // pin-1 dot
      for (let i = 0; i < 5; i++) {                          // pins
        const y = by + 16 + i * 22;
        ctx.fillRect(bx - 26, y, 26, 9);
        ctx.fillRect(bx + bw, y, 26, 9);
      }
    });

    // top-down quadcopter; rotor positions are reused for the sound rings below
    const DRONE_ROTORS = [[-1, -1], [1, -1], [-1, 1], [1, 1]];
    const DRONE = { ax: 72, ay: 56, rr: 27 };   // canvas px from centre
    const PX = SHAPE_W / 320;                   // canvas px -> world units
    const dronePts = samplePoints((ctx, W, H) => {
      const cx = W / 2, cy = H / 2;
      ctx.lineWidth = 4; ctx.lineCap = 'round';
      DRONE_ROTORS.forEach(([sx, sy]) => {            // arms
        ctx.beginPath();
        ctx.moveTo(cx + sx * 16, cy + sy * 11);
        ctx.lineTo(cx + sx * DRONE.ax, cy + sy * DRONE.ay);
        ctx.stroke();
      });
      DRONE_ROTORS.forEach(([sx, sy], i) => {         // rotor guards, blades, hubs
        const rx = cx + sx * DRONE.ax, ry = cy + sy * DRONE.ay;
        ctx.beginPath(); ctx.arc(rx, ry, DRONE.rr, 0, Math.PI * 2); ctx.stroke();
        const a = 0.5 + i * 0.9;
        ctx.beginPath();
        ctx.moveTo(rx - Math.cos(a) * 19, ry - Math.sin(a) * 19);
        ctx.lineTo(rx + Math.cos(a) * 19, ry + Math.sin(a) * 19);
        ctx.stroke();
        ctx.beginPath(); ctx.arc(rx, ry, 3.5, 0, Math.PI * 2); ctx.fill();
      });
      ctx.strokeRect(cx - 22, cy - 16, 44, 32);        // body
      ctx.beginPath(); ctx.arc(cx, cy - 16, 5, 0, Math.PI * 2); ctx.fill(); // nose
    });

    const vhPts = samplePoints((ctx, W, H) => {
      // outlined, not filled: reads as letterforms without becoming noise
      ctx.font = '700 132px Archivo, Helvetica, Arial, sans-serif';
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.lineWidth = 4; ctx.lineJoin = 'round';
      ctx.strokeText('VH', W / 2, H / 2 + 4);
    });

    // Map grid points to shape points, keeping left-to-right order so the
    // morph reads as an orderly march rather than a scramble.
    const order = Array.from({ length: N }, (_, i) => i).sort((a, b) => {
      const dx = pos[a * 3] - pos[b * 3];
      return dx !== 0 ? dx : pos[a * 3 + 2] - pos[b * 3 + 2];
    });
    // Only as many points as the shape needs take part; the rest drift out
    // past the edge of the field, where they fade away.
    function targetsFrom(pts, density) {
      const arr = new Float32Array(N * 2);
      if (!pts.length) {
        for (let i = 0; i < N; i++) { arr[i * 2] = pos[i * 3]; arr[i * 2 + 1] = pos[i * 3 + 2]; }
        return arr;
      }
      const sorted = pts.slice().sort((a, b) => (a[0] - b[0]) || (a[1] - b[1]));
      const step = Math.max(1, Math.round(N / (sorted.length * density)));
      let used = 0;
      for (let r = 0; r < N; r++) {
        const i = order[r];
        if (r % step === 0) {
          const p = sorted[Math.min(sorted.length - 1, Math.floor((used * sorted.length) / Math.ceil(N / step)))];
          used++;
          arr[i * 2] = p[0] + (Math.random() - 0.5) * 0.04;
          arr[i * 2 + 1] = p[1] + (Math.random() - 0.5) * 0.04;
        } else {
          const a = (r / N) * Math.PI * 2;
          arr[i * 2] = Math.cos(a) * (26 + Math.random() * 8);
          arr[i * 2 + 1] = Math.sin(a) * (20 + Math.random() * 6) + SHAPE_Z;
        }
      }
      return arr;
    }

    // Drone: some points form the airframe; many of the rest sit in rings
    // around each rotor, where a travelling pulse lights them up like sound.
    function droneTargets(pts, density) {
      const arr = new Float32Array(N * 2);
      const ring = new Float32Array(N * 2);
      const sorted = pts.slice().sort((a, b) => (a[0] - b[0]) || (a[1] - b[1]));
      const step = Math.max(1, Math.round(N / (Math.max(1, sorted.length) * density)));
      const kept = Math.ceil(N / step);
      const rim = DRONE.rr * PX + 0.25, spread = 3.0;
      let used = 0;
      for (let r = 0; r < N; r++) {
        const i = order[r];
        ring[i * 2] = -1; ring[i * 2 + 1] = 0;
        if (sorted.length && r % step === 0) {
          const p = sorted[Math.min(sorted.length - 1, Math.floor((used * sorted.length) / kept))];
          used++;
          arr[i * 2] = p[0] + (Math.random() - 0.5) * 0.04;
          arr[i * 2 + 1] = p[1] + (Math.random() - 0.5) * 0.04;
        } else if (Math.random() < 0.55) {
          const ri = Math.floor(Math.random() * 4);
          const [sx, sy] = DRONE_ROTORS[ri];
          const rcx = sx * DRONE.ax * PX, rcz = sy * DRONE.ay * PX + SHAPE_Z;
          const off = Math.random() * spread;
          const a = Math.random() * Math.PI * 2;
          arr[i * 2] = rcx + Math.cos(a) * (rim + off);
          arr[i * 2 + 1] = rcz + Math.sin(a) * (rim + off);
          ring[i * 2] = off / spread;          // 0 at the rotor, 1 at the outer edge
          ring[i * 2 + 1] = ri * 0.25;         // each rotor pulses slightly out of step
        } else {
          const a = (r / N) * Math.PI * 2;
          arr[i * 2] = Math.cos(a) * (26 + Math.random() * 8);
          arr[i * 2 + 1] = Math.sin(a) * (20 + Math.random() * 6) + SHAPE_Z;
        }
      }
      return { arr, ring };
    }
    const drone = droneTargets(dronePts, 1.1);

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    geo.setAttribute('aDrone', new THREE.BufferAttribute(drone.arr, 2));
    geo.setAttribute('aRing', new THREE.BufferAttribute(drone.ring, 2));
    geo.setAttribute('aChip', new THREE.BufferAttribute(targetsFrom(chipPts, 1.3), 2));
    geo.setAttribute('aVH', new THREE.BufferAttribute(targetsFrom(vhPts, 0.45), 2));

    const MAXP = 6;
    const ripples = Array.from({ length: MAXP }, () => new THREE.Vector4(0, 0, 0, -100));
    const uniforms = {
      uTime: { value: 0 },
      uRipples: { value: ripples },
      uPR: { value: renderer.getPixelRatio() },
      uBase: { value: new THREE.Color(0xecebe6) },
      uHot: { value: new THREE.Color(0xe0874f) },
      uWave: { value: 0 },
      uDrone: { value: 0 },
      uChip: { value: 0 },
      uVH: { value: 0 },
      uDim: { value: 1 },
    };

    const mat = new THREE.ShaderMaterial({
      uniforms,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      vertexShader: /* glsl */`
        uniform float uTime;
        uniform vec4 uRipples[${MAXP}];
        uniform float uPR;
        uniform float uWave;
        uniform float uDrone;
        uniform float uChip;
        uniform float uVH;
        attribute vec2 aDrone;
        attribute vec2 aRing;
        attribute vec2 aChip;
        attribute vec2 aVH;
        varying float vGlow;
        varying float vFade;
        varying float vMorph;
        varying float vRingA;
        varying float vRingGlow;
        void main() {
          float morph = clamp(uDrone + uChip + uVH, 0.0, 1.0);
          vec2 g = vec2(position.x, position.z);
          vec2 xz = mix(g, aDrone, uDrone);
          xz = mix(xz, aChip, uChip);
          xz = mix(xz, aVH, uVH);
          vec3 p = vec3(xz.x, 0.0, xz.y);

          float h = 0.0;
          float glow = 0.0;
          for (int i = 0; i < ${MAXP}; i++) {
            vec4 rp = uRipples[i];
            float age = uTime - rp.w;
            if (age < 0.0 || age > 4.0) continue;
            float r = age * 3.2;
            float d = distance(p.xz, rp.xy);
            float band = exp(-pow((d - r) * 1.1, 2.0));
            float decay = exp(-age * 1.1) * rp.z / (1.0 + d * 0.1);
            h += sin((d - r) * 2.2) * band * decay;
            glow += band * decay;
          }
          h *= 1.0 - morph * 0.8;
          h += sin(p.x * 0.28 + uTime * 0.45) * cos(p.z * 0.35 + uTime * 0.3) * 0.12 * (1.0 - morph);
          // a slow swell that rolls across the field mid-page
          h += sin(p.x * 0.42 - uTime * 1.1) * cos(p.z * 0.3 + uTime * 0.5) * 1.5 * uWave;
          p.y += h * 0.6;

          vec4 mv = modelViewMatrix * vec4(p, 1.0);
          gl_Position = projectionMatrix * mv;
          gl_PointSize = (1.7 + glow * 1.6 + morph * 1.5) * uPR * (19.0 / -mv.z);
          // sound rings: two pulses travel outward from each rotor
          float ringA = 1.0, ringGlow = 0.0;
          if (aRing.x >= 0.0) {
            float b1 = fract(uTime * 0.38 + aRing.y);
            float b2 = fract(uTime * 0.38 + aRing.y + 0.5);
            float pls = exp(-pow((aRing.x - b1) * 10.0, 2.0)) + exp(-pow((aRing.x - b2) * 10.0, 2.0));
            float fall = 1.0 - aRing.x * 0.75;
            ringA = 0.05 + pls * fall * 0.95;
            ringGlow = pls * fall;
          }
          vRingA = mix(1.0, ringA, uDrone);
          vRingGlow = ringGlow * uDrone;

          vGlow = glow;
          vMorph = morph;
          vFade = smoothstep(${Z0.toFixed(1)}, ${(Z0 + 9).toFixed(1)}, p.z) * (1.0 - smoothstep(14.0, 20.0, abs(p.x)));
        }`,
      fragmentShader: /* glsl */`
        uniform vec3 uBase;
        uniform vec3 uHot;
        uniform float uDim;
        varying float vGlow;
        varying float vFade;
        varying float vMorph;
        varying float vRingA;
        varying float vRingGlow;
        void main() {
          vec2 c = gl_PointCoord - 0.5;
          float d = length(c);
          if (d > 0.5) discard;
          float a = smoothstep(0.5, 0.05, d);
          float g = clamp(vGlow * 1.2, 0.0, 1.0);
          vec3 col = mix(uBase, uHot, max(max(g * 0.8, vMorph * 0.35), clamp(vRingGlow, 0.0, 1.0) * 0.9));
          float alpha = a * (0.36 + g * 0.6 + vMorph * 0.25) * vFade * uDim * vRingA;
          gl_FragColor = vec4(col, alpha);
        }`,
    });
    scene.add(new THREE.Points(geo, mat));

    /* ---- Ripples follow the cursor, anywhere on the page ---- */
    const raycaster = new THREE.Raycaster();
    const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
    const ndc = new THREE.Vector2();
    const hitPt = new THREE.Vector3();
    const tclock = new THREE.Clock();
    let ri = 0, lastRipple = -10;
    const lastPt = new THREE.Vector2(9999, 9999);

    function ripple(x, z, strength) {
      ripples[ri].set(x, z, strength, tclock.getElapsedTime());
      ri = (ri + 1) % MAXP;
      lastRipple = tclock.getElapsedTime();
    }
    function pointerTo(clientX, clientY, force) {
      ndc.set((clientX / window.innerWidth) * 2 - 1, -(clientY / window.innerHeight) * 2 + 1);
      raycaster.setFromCamera(ndc, camera);
      if (!raycaster.ray.intersectPlane(plane, hitPt)) return;
      const t = tclock.getElapsedTime();
      const moved = Math.hypot(hitPt.x - lastPt.x, hitPt.z - lastPt.y);
      if (force || (moved > 1.2 && t - lastRipple > 0.35)) {
        ripple(hitPt.x, hitPt.z, force ? 1.2 : 0.7);
        lastPt.set(hitPt.x, hitPt.z);
      }
    }
    window.addEventListener('pointermove', (e) => pointerTo(e.clientX, e.clientY, false), { passive: true });
    window.addEventListener('pointerdown', (e) => pointerTo(e.clientX, e.clientY, true), { passive: true });

    /* ---- Camera: perspective at the top, plan view once it morphs ---- */
    const camNear = new THREE.Vector3(0, 8, 12.5);
    const camTop = new THREE.Vector3(0, 21, 0.4);
    const lookNear = new THREE.Vector3(0, -0.5, -4);
    const lookTop = new THREE.Vector3(0, 0, SHAPE_Z);
    const camPos = new THREE.Vector3();
    const lookAt = new THREE.Vector3();

    function layout() {
      const w = canvas.clientWidth, h = canvas.clientHeight;
      renderer.setSize(w, h, false);
      const aspect = w / h;
      camera.aspect = aspect;
      camera.fov = aspect < 0.8 ? 58 : aspect < 1.2 ? 48 : 38;
      camNear.set(0, aspect < 1 ? 11 : 8, aspect < 1 ? 13 : 12.5);
      camTop.set(0, aspect < 1 ? 26 : 21, 0.4);
      camera.updateProjectionMatrix();
    }
    layout();
    window.addEventListener('resize', () => { layout(); if (reduced) renderer.render(scene, camera); });

    /* ---- Scroll drives the morph ---- */
    const ease = (a, b, x) => { const t = Math.min(1, Math.max(0, (x - a) / (b - a))); return t * t * (3 - 2 * t); };
    const state = { wave: 0, drone: 0, chip: 0, vh: 0 };
    function scrollProgress() {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      return max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
    }
    function targetsForProgress(p) {
      // about .16 · experience .31 · work .46 · skills .65 · contact .97
      return {
        wave: ease(0.07, 0.13, p) * (1 - ease(0.18, 0.24, p)),
        drone: ease(0.22, 0.28, p) * (1 - ease(0.37, 0.43, p)),
        chip: ease(0.44, 0.60, p) * (1 - ease(0.74, 0.84, p)),
        vh: ease(0.80, 0.93, p),
      };
    }

    /* ---- Loop ---- */
    let raf = null;
    function frame() {
      raf = null;
      const t = tclock.getElapsedTime();
      uniforms.uTime.value = t;

      const p = scrollProgress();
      const want = targetsForProgress(p);
      const k2 = reduced ? 1 : 0.085;
      state.wave += (want.wave - state.wave) * k2;
      state.drone += (want.drone - state.drone) * k2;
      state.chip += (want.chip - state.chip) * k2;
      state.vh += (want.vh - state.vh) * k2;
      uniforms.uWave.value = state.wave;
      uniforms.uDrone.value = state.drone;
      uniforms.uChip.value = state.chip;
      uniforms.uVH.value = state.vh;

      const morph = Math.min(1, state.drone + state.chip + state.vh);
      // dim the field behind the text-heavy middle of the page
      uniforms.uDim.value = (0.05 + 0.95 * ease(0.03, 0.13, p)) * (1 + morph * 0.45) * (1 - state.vh * 0.22);

      camPos.copy(camNear).lerp(camTop, morph);
      lookAt.copy(lookNear).lerp(lookTop, morph);
      camera.position.copy(camPos);
      camera.lookAt(lookAt);

      if (!reduced && t - lastRipple > 3.2 && morph < 0.3) {
        ripple((Math.random() - 0.5) * 16, -9 + Math.random() * 6, 0.5);
      }

      renderer.render(scene, camera);
      if (!reduced && !document.hidden) run();
    }
    function run() { if (!raf) raf = requestAnimationFrame(frame); }
    document.addEventListener('visibilitychange', () => { if (!document.hidden) run(); });

    if (reduced) {
      ripples[0].set(2, -7, 0.8, -1.2);
      frame();
      window.addEventListener('scroll', () => { if (!raf) raf = requestAnimationFrame(frame); }, { passive: true });
    } else {
      run();
    }
  })();
})();
