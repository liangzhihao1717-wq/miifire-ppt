// ============================================================
// 功能：reviews — 页面评价面板（审美沉淀采集入口）
// 看页时随时写下"这页哪里好、为什么好"，保存到项目 reviews.json
// AI 后续把评价提炼进 runtime/layouts/PREFERENCES.md
// 依赖：shell（api.getReviews / api.saveReview / api.current / api.onPage / api.pageIdOf）
// ============================================================

(function () {
  'use strict';

  const CSS = `
  #mii-reviews-btn {
    position: fixed;
    bottom: 1.2vw; right: 5vw;
    min-width: 3vw; height: 3vw;
    min-width: 28px; min-height: 28px;
    z-index: 300;
    cursor: pointer;
    opacity: 0.35;
    transition: opacity 0.2s;
    border: 1px solid rgba(212,184,122,0.4);
    border-radius: 6px;
    background: rgba(212,184,122,0.06);
    color: #d4b87a;
    font-size: 1.2vw;
    display: flex; align-items: center; justify-content: center;
    font-family: serif;
    -webkit-tap-highlight-color: transparent;
    padding: 0 0.6vw;
    letter-spacing: 0.1em;
  }
  #mii-reviews-btn:hover { opacity: 1; }
  #mii-reviews-panel {
    position: fixed;
    right: 1.2vw; bottom: 5.2vw;
    width: 30vw; min-width: 300px; max-width: 420px;
    z-index: 400;
    background: rgba(14,14,14,0.97);
    border: 1px solid rgba(212,184,122,0.25);
    border-radius: 8px;
    padding: 1.4vw;
    display: none;
    flex-direction: column;
    gap: 1vh;
    font-family: 'Noto Serif SC','Songti SC','SimSun',serif;
    color: #e0ded5;
    box-shadow: 0 8px 30px rgba(0,0,0,0.6);
  }
  #mii-reviews-panel.open { display: flex; }
  #mii-reviews-panel .mii-rv-head {
    display: flex; align-items: baseline; justify-content: space-between;
  }
  #mii-reviews-panel .mii-rv-title {
    font-size: 1.1vw; font-weight: 700; color: #d4b87a; letter-spacing: 0.08em;
  }
  #mii-reviews-panel .mii-rv-page {
    font-size: 0.85vw; color: rgba(255,255,255,0.4); letter-spacing: 0.05em;
  }
  #mii-reviews-panel .mii-rv-close {
    cursor: pointer; color: rgba(255,255,255,0.4); font-size: 1vw;
    border: none; background: none; padding: 0.2vw;
  }
  #mii-reviews-panel .mii-rv-close:hover { color: #fff; }
  #mii-reviews-panel textarea {
    width: 100%; height: 9vh;
    background: rgba(255,255,255,0.05);
    border: 1px solid rgba(255,255,255,0.12);
    border-radius: 4px;
    color: #e0ded5;
    font-family: inherit; font-size: 0.95vw;
    padding: 0.6vw; resize: vertical;
    outline: none;
  }
  #mii-reviews-panel textarea:focus { border-color: rgba(212,184,122,0.5); }
  #mii-reviews-panel .mii-rv-actions {
    display: flex; gap: 0.8vw; align-items: center;
  }
  #mii-reviews-panel .mii-rv-save {
    cursor: pointer;
    background: rgba(212,184,122,0.15);
    border: 1px solid rgba(212,184,122,0.5);
    color: #d4b87a;
    font-family: inherit; font-size: 0.95vw;
    padding: 0.5vh 1.2vw;
    border-radius: 4px;
    letter-spacing: 0.08em;
  }
  #mii-reviews-panel .mii-rv-save:hover { background: rgba(212,184,122,0.28); }
  #mii-reviews-panel .mii-rv-status { font-size: 0.85vw; color: rgba(255,255,255,0.45); }
  #mii-reviews-panel .mii-rv-status.ok { color: #d4b87a; }
  #mii-reviews-panel .mii-rv-list {
    max-height: 16vh; overflow-y: auto;
    border-top: 1px solid rgba(255,255,255,0.08);
    padding-top: 1vh;
    display: flex; flex-direction: column; gap: 0.6vh;
  }
  #mii-reviews-panel .mii-rv-item {
    font-size: 0.85vw; color: rgba(255,255,255,0.6);
    line-height: 1.5;
  }
  #mii-reviews-panel .mii-rv-item .mii-rv-del {
    cursor: pointer; color: rgba(255,255,255,0.25); margin-left: 0.5vw;
  }
  #mii-reviews-panel .mii-rv-item .mii-rv-del:hover { color: #e07a6a; }
  `;

  let api = null;
  let cleanupFns = [];
  let panel = null;
  let statusEl = null;
  let listEl = null;
  let textarea = null;
  let allReviews = [];

  const feature = {
    id: 'reviews',
    mount(a) {
      api = a;

      const styleEl = document.createElement('style');
      styleEl.textContent = CSS;
      document.head.appendChild(styleEl);
      cleanupFns.push(function () { styleEl.remove(); });

      // 按钮
      const btn = document.createElement('div');
      btn.id = 'mii-reviews-btn';
      btn.textContent = '评';
      btn.title = '页面评价（沉淀审美偏好）';
      document.body.appendChild(btn);
      cleanupFns.push(function () { btn.remove(); });

      // 面板
      panel = document.createElement('div');
      panel.id = 'mii-reviews-panel';
      panel.innerHTML =
        '<div class="mii-rv-head">' +
          '<span class="mii-rv-title">页面评价</span>' +
          '<span class="mii-rv-page" id="mii-rv-page"></span>' +
          '<button class="mii-rv-close" title="关闭">✕</button>' +
        '</div>' +
        '<textarea placeholder="这页哪里好？为什么好？（你的评价会沉淀进偏好档案，让以后的排版更懂你）"></textarea>' +
        '<div class="mii-rv-actions">' +
          '<button class="mii-rv-save">保存评价</button>' +
          '<span class="mii-rv-status"></span>' +
        '</div>' +
        '<div class="mii-rv-list"></div>';
      document.body.appendChild(panel);
      cleanupFns.push(function () { panel.remove(); });

      statusEl = panel.querySelector('.mii-rv-status');
      listEl = panel.querySelector('.mii-rv-list');
      textarea = panel.querySelector('textarea');
      const pageEl = panel.querySelector('#mii-rv-page');
      const closeBtn = panel.querySelector('.mii-rv-close');
      const saveBtn = panel.querySelector('.mii-rv-save');

      function currentPageId() {
        const n = api.current;
        if (n === 0) return 'cover';
        if (n === api.total + 1) return 'toc';
        return api.pageIdOf(n) || String(n);
      }

      function refreshList() {
        listEl.innerHTML = '';
        const mine = allReviews.filter(function (r) { return r.pageId === currentPageId(); });
        if (mine.length === 0) {
          listEl.innerHTML = '<div class="mii-rv-item" style="color:rgba(255,255,255,0.25)">本页还没有评价</div>';
          return;
        }
        mine.forEach(function (r, i) {
          const idx = allReviews.indexOf(r);
          const item = document.createElement('div');
          item.className = 'mii-rv-item';
          const d = new Date(r.ts);
          item.textContent = '· ' + r.text + ' (' + (d.getMonth() + 1) + '/' + d.getDate() + ')';
          const del = document.createElement('span');
          del.className = 'mii-rv-del';
          del.textContent = '删除';
          del.addEventListener('click', function () {
            fetch('/api/reviews', {
              method: 'DELETE',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ project: api.project, index: idx }),
            }).then(function (r) { return r.json(); }).then(function () {
              allReviews.splice(idx, 1);
              refreshList();
            });
          });
          item.appendChild(del);
          listEl.appendChild(item);
        });
      }

      function openPanel() {
        panel.classList.add('open');
        pageEl.textContent = '页#' + currentPageId();
        textarea.value = '';
        statusEl.textContent = '';
        refreshList();
        textarea.focus();
      }

      function closePanel() { panel.classList.remove('open'); }

      btn.addEventListener('click', function () {
        panel.classList.contains('open') ? closePanel() : openPanel();
      });
      closeBtn.addEventListener('click', closePanel);

      saveBtn.addEventListener('click', function () {
        const text = textarea.value.trim();
        if (!text) { statusEl.textContent = '写点什么再保存'; return; }
        saveBtn.disabled = true;
        api.saveReview(currentPageId(), text).then(function (d) {
          saveBtn.disabled = false;
          if (d && d.ok) {
            statusEl.textContent = '✓ 已保存（' + d.count + ' 条）';
            statusEl.className = 'mii-rv-status ok';
            allReviews.push({ pageId: currentPageId(), text: text, ts: new Date().toISOString() });
            textarea.value = '';
            refreshList();
          } else {
            statusEl.textContent = '保存失败';
          }
        }).catch(function () {
          saveBtn.disabled = false;
          statusEl.textContent = '保存失败';
        });
      });

      // 翻页时刷新面板页面标识
      const unsub = api.onPage(function () {
        if (panel.classList.contains('open')) {
          pageEl.textContent = '页#' + currentPageId();
          refreshList();
        }
      });
      cleanupFns.push(unsub);

      // 预载评价
      api.getReviews().then(function (rs) {
        allReviews = rs;
      });

      return function () { cleanupFns.forEach(function (f) { f(); }); cleanupFns = []; };
    },
  };

  window.MIIFIRE = window.MIIFIRE || {};
  window.MIIFIRE.features = window.MIIFIRE.features || {};
  window.MIIFIRE.features.reviews = feature;
})();
