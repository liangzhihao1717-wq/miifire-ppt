// ============================================================
// 功能：drawer — 侧边抽屉（页面缩略图导航）
// 左边缘触发展开；缩略图列表；当前页高亮；有备注的页显示金色圆点
// 依赖：shell（api.total / api.current / api.go / api.onPage / api.thumbs / api.getAllNotes）
// ============================================================

(function () {
  'use strict';

  const CSS = `
  #drawer-container { position: fixed; top: 0; left: 0; height: 100%; z-index: 200; }
  #drawer-container .tab {
    position: absolute; top: 0; left: 0;
    width: 2px; height: 100%;
    cursor: pointer; z-index: 2;
  }
  #drawer-container .backdrop {
    position: fixed; top: 0; left: 0;
    width: 100%; height: 100%;
    z-index: 0; display: none;
  }
  #drawer-container.open .backdrop { display: block; }
  #drawer-container .panel {
    position: absolute; top: 0; left: 0;
    height: 100%;
    width: 16vw; min-width: 220px; max-width: 280px;
    background: rgba(10,10,10,0.97);
    border-right: 1px solid rgba(255,255,255,0.08);
    transform: translateX(-100%);
    transition: transform 0.35s cubic-bezier(0.16, 1, 0.3, 1);
    display: flex; flex-direction: column; overflow: hidden;
    z-index: 1; padding-left: 0.4vw;
  }
  #drawer-container.open .panel { transform: translateX(0); }
  #drawer-container .panel-header {
    padding: 2vh 1.2vw 1.2vh;
    border-bottom: 1px solid rgba(255,255,255,0.06);
    flex-shrink: 0;
  }
  #drawer-container .panel-header span {
    font-family: 'Noto Serif SC','Songti SC','SimSun',serif;
    font-size: 0.85vw; font-weight: 600;
    color: rgba(255,255,255,0.4); letter-spacing: 0.06em;
  }
  #drawer-container .panel-list {
    flex: 1; overflow-y: auto;
    padding: 1vh 0.8vw;
  }
  #drawer-container .panel-list::-webkit-scrollbar { width: 3px; }
  #drawer-container .panel-list::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 2px; }
  #drawer-container .drawer-item {
    position: relative;
    padding: 0.8vh 0.6vw;
    cursor: pointer;
    border-radius: 2px;
    transition: background 0.2s ease;
    border-left: 2px solid transparent;
    margin-bottom: 0.6vh;
  }
  #drawer-container .drawer-item:hover { background: rgba(255,255,255,0.03); }
  #drawer-container .drawer-item.active {
    background: rgba(212,184,122,0.06);
    border-left-color: #d4b87a;
  }
  #drawer-container .drawer-item.active .drawer-label { color: #d4b87a; font-weight: 700; }
  #drawer-container .drawer-thumb {
    width: 100%; aspect-ratio: 16 / 9;
    overflow: hidden; border-radius: 1px;
    border: 1px solid rgba(255,255,255,0.04);
    background: #0a0a0a; position: relative;
  }
  #drawer-container .drawer-thumb img {
    width: 100%; height: 100%;
    object-fit: cover; display: block;
  }
  #drawer-container .drawer-thumb .mii-thumb-missing {
    width: 100%; height: 100%;
    display: flex; align-items: center; justify-content: center;
    color: rgba(255,255,255,0.15);
    font-size: 1.4vw; font-family: serif;
  }
  #drawer-container .drawer-label {
    display: block;
    font-family: 'Noto Serif SC','Songti SC','SimSun',serif;
    font-size: 0.7vw; font-weight: 400;
    color: rgba(255,255,255,0.3); letter-spacing: 0.04em;
    padding: 0.5vh 0.2vw 0;
    transition: color 0.2s ease;
  }
  #drawer-container .drawer-item:hover .drawer-label { color: rgba(255,255,255,0.6); }
  #drawer-container .drawer-note-dot {
    position: absolute; top: 0.7vh; right: 0.55vw;
    width: 4px; height: 4px; border-radius: 50%;
    background: rgba(212,184,122,0.35);
    display: none;
  }
  #drawer-container .drawer-note-dot.show { display: block; }
  `;

  let api = null;
  let cleanupFns = [];
  let items = [];
  let container = null;

  const feature = {
    id: 'drawer',
    mount(a) {
      api = a;

      const styleEl = document.createElement('style');
      styleEl.textContent = CSS;
      document.head.appendChild(styleEl);
      cleanupFns.push(function () { styleEl.remove(); });

      container = document.createElement('div');
      container.id = 'drawer-container';
      container.innerHTML =
        '<div class="tab"></div>' +
        '<div class="backdrop"></div>' +
        '<div class="panel">' +
          '<div class="panel-header"><span id="drawer-label"></span></div>' +
          '<div class="panel-list" id="drawer-list"></div>' +
        '</div>';
      document.body.appendChild(container);
      cleanupFns.push(function () { container.remove(); });

      const list = container.querySelector('#drawer-list');
      const label = container.querySelector('#drawer-label');
      const tab = container.querySelector('.tab');
      const backdrop = container.querySelector('.backdrop');
      const panel = container.querySelector('.panel');

      label.textContent = '共 ' + api.total + ' 页';

      function openDrawer() { container.classList.add('open'); }
      function closeDrawer() { container.classList.remove('open'); }
      function toggleDrawer() {
        container.classList.contains('open') ? closeDrawer() : openDrawer();
      }

      tab.addEventListener('mouseenter', openDrawer);
      tab.addEventListener('click', function (e) { e.stopPropagation(); toggleDrawer(); });
      backdrop.addEventListener('click', closeDrawer);
      document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && container.classList.contains('open')) closeDrawer();
      });
      panel.addEventListener('wheel', function (e) { e.stopPropagation(); });
      cleanupFns.push(function () {
        tab.removeEventListener('mouseenter', openDrawer);
        backdrop.removeEventListener('click', closeDrawer);
      });

      // 生成条目：真实页 1..total；附加页（cover/toc）放最前/最后
      items = [];
      const entries = [];

      const extras = api.state.extraPages;
      if (0 in extras) {
        entries.push({ n: 0, label: extras[0].title || '封面', extra: true });
      }
      for (let i = 1; i <= api.total; i++) {
        const p = api.pages.find(function (x) { return x.n === i; });
        entries.push({ n: i, label: p && p.title ? p.title : '第 ' + i + ' 页', extra: false });
      }
      if ((api.total + 1) in extras) {
        entries.push({ n: api.total + 1, label: extras[api.total + 1].title || '目录', extra: true });
      }

      entries.forEach(function (entry) {
        const item = document.createElement('div');
        item.className = 'drawer-item';
        item.dataset.page = entry.n;

        const thumb = document.createElement('div');
        thumb.className = 'drawer-thumb';
        if (entry.extra) {
          const ph = document.createElement('div');
          ph.className = 'mii-thumb-missing';
          ph.textContent = entry.label;
          thumb.appendChild(ph);
        } else {
          const img = document.createElement('img');
          img.src = api.thumbs(entry.n);
          img.alt = entry.label;
          img.onerror = function () {
            thumb.innerHTML = '';
            const ph = document.createElement('div');
            ph.className = 'mii-thumb-missing';
            ph.textContent = entry.n;
            thumb.appendChild(ph);
          };
          thumb.appendChild(img);
        }
        item.appendChild(thumb);

        const lab = document.createElement('span');
        lab.className = 'drawer-label';
        lab.textContent = entry.label;
        item.appendChild(lab);

        const dot = document.createElement('span');
        dot.className = 'drawer-note-dot';
        item.appendChild(dot);

        item.addEventListener('click', function (e) {
          e.stopPropagation();
          if (entry.n === api.current) return;
          api.go(entry.n);
        });

        list.appendChild(item);
        items.push({ el: item, n: entry.n, dot: dot });
      });

      // 当前页高亮
      const unsub = api.onPage(function (n) {
        items.forEach(function (it) {
          it.el.classList.toggle('active', it.n === n);
        });
        const active = list.querySelector('.drawer-item.active');
        if (active) active.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
      });
      cleanupFns.push(unsub);

      // 备注圆点
      api.getAllNotes().then(function (all) {
        items.forEach(function (it) {
          const notes = all[String(it.n)] || [];
          it.dot.classList.toggle('show', notes.length > 0);
        });
      }).catch(function () {});

      return function () { cleanupFns.forEach(function (f) { f(); }); cleanupFns = []; };
    },
  };

  window.MIIFIRE = window.MIIFIRE || {};
  window.MIIFIRE.features = window.MIIFIRE.features || {};
  window.MIIFIRE.features.drawer = feature;
})();
