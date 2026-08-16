// ============================================================
// 功能：notes-ruler — 时间轴备注尺（右侧竖线刻度 + 备注标记）
// 演讲时展示备注位置；悬停显示备注气泡
// 依赖：shell（api.getNotes / api.onPage / api.project）
// ============================================================

(function () {
  'use strict';

  const CSS = `
  #notes-ruler {
    position: fixed; top: 8vh; right: 1.5vw;
    width: 16px; height: 84vh;
    z-index: 200;
    pointer-events: none;
    display: none;
  }
  #notes-ruler.show { display: block; }
  #notes-ruler .ruler-line {
    position: absolute; top: 0; right: 0;
    width: 1px; height: 100%;
    background: rgba(212,184,122,0.06);
  }
  .ruler-tick {
    position: absolute; right: 0; height: 1px;
    background: rgba(212,184,122,0.14);
    pointer-events: none;
  }
  .ruler-tick.major { width: 8px; }
  .ruler-tick.minor { width: 4px; }
  .ruler-note {
    position: absolute; left: 12px;
    width: 7px; height: 7px; border-radius: 50%;
    background: rgba(212,184,122,0.25);
    pointer-events: auto; cursor: pointer;
    transform: translateY(-50%);
    transition: background 0.2s, transform 0.2s, box-shadow 0.2s;
  }
  .ruler-note::before {
    content: '';
    position: absolute; top: -8px; left: -8px;
    right: -8px; bottom: -8px;
  }
  .ruler-note:hover {
    background: rgba(212,184,122,0.5);
    transform: translateY(-50%) scale(1.4);
    box-shadow: 0 0 8px rgba(212,184,122,0.12);
  }
  .ruler-note .ruler-bubble {
    position: absolute; right: calc(100% + 10px); top: 50%;
    transform: translateY(-50%);
    background: rgba(14,14,14,0.97);
    border-radius: 4px; padding: 0.6vh 0.8vw;
    white-space: nowrap;
    opacity: 0; pointer-events: none;
    transition: opacity 0.2s;
    font-family: 'Noto Serif SC','Songti SC','SimSun',serif;
    font-size: 0.9vw; font-weight: 500;
    color: rgba(255,255,255,0.7);
    letter-spacing: 0.04em;
    box-shadow: 0 2px 10px rgba(0,0,0,0.4);
  }
  .ruler-note:hover .ruler-bubble { opacity: 1; }
  `;

  let api = null;
  let cleanupFns = [];
  let ruler = null;

  function posToPct(pos) {
    if (pos === '开篇') return 5;
    if (pos === '结尾') return 95;
    const m = String(pos).match(/^(\d+)%$/);
    return m ? parseInt(m[1], 10) : 50;
  }

  function renderRuler(notes) {
    if (!ruler) return;
    ruler.querySelectorAll('.ruler-note').forEach(function (n) { n.remove(); });
    ruler.querySelectorAll('.ruler-tick').forEach(function (t) { t.style.display = ''; });

    if (!notes || notes.length === 0) {
      ruler.classList.remove('show');
      return;
    }
    ruler.classList.add('show');
    notes.forEach(function (note) {
      const pct = posToPct(note.pos);
      const tick = ruler.querySelector('.ruler-tick[style*="top: ' + pct + '%"]');
      if (tick) tick.style.display = 'none';
      const mark = document.createElement('div');
      mark.className = 'ruler-note';
      mark.style.top = pct + '%';
      const bubble = document.createElement('div');
      bubble.className = 'ruler-bubble';
      bubble.textContent = note.text;
      mark.appendChild(bubble);
      ruler.appendChild(mark);
    });
  }

  const feature = {
    id: 'notes-ruler',
    mount(a) {
      api = a;

      const styleEl = document.createElement('style');
      styleEl.textContent = CSS;
      document.head.appendChild(styleEl);
      cleanupFns.push(function () { styleEl.remove(); });

      ruler = document.createElement('div');
      ruler.id = 'notes-ruler';
      ruler.innerHTML = '<div class="ruler-line"></div>';
      document.body.appendChild(ruler);
      cleanupFns.push(function () { ruler.remove(); });

      // 刻度 0-100 每 5%
      for (let p = 0; p <= 100; p += 5) {
        const tick = document.createElement('div');
        tick.className = p % 10 === 0 ? 'ruler-tick major' : 'ruler-tick minor';
        tick.style.top = p + '%';
        ruler.appendChild(tick);
      }

      function loadForPage(n) {
        api.getNotes(n).then(function (notes) {
          renderRuler(notes);
        });
      }

      const unsub = api.onPage(function (n) {
        if (n >= 1 && n <= api.total) loadForPage(n);
        else renderRuler([]);
      });
      cleanupFns.push(unsub);

      return function () { cleanupFns.forEach(function (f) { f(); }); cleanupFns = []; };
    },
  };

  window.MIIFIRE = window.MIIFIRE || {};
  window.MIIFIRE.features = window.MIIFIRE.features || {};
  window.MIIFIRE.features['notes-ruler'] = feature;
})();
