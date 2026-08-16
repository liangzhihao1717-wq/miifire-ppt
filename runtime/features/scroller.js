// ============================================================
// 功能：scroller — 竖屏滚动器
// 职责：纵向加载全部内容页（9:16 海报），逐页排列，滚动浏览
// 依赖：shell（api.total / api.project）
// ============================================================

(function () {
  'use strict';

  const CSS = `
  html, body { width: 100%; height: 100%; background: #0a0a0a; overflow: hidden; }
  #scroller {
    width: 100%; height: 100%;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
  }
  #poster {
    width: 100%;
    max-width: 480px;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 5vh;
  }
  #poster .page {
    width: 100%;
    aspect-ratio: 9 / 16;
    position: relative;
    overflow: hidden;
    container-type: size;
    background: #0a0a0a;
  }
  #poster .page .page-index {
    position: absolute;
    right: 4vw; right: 4cqw;
    bottom: 3vh; bottom: 3cqh;
    font-variant-numeric: tabular-nums;
    font-size: 3vw; font-size: 3cqw;
    font-weight: 300;
    color: rgba(255,255,255,0.15);
    letter-spacing: 0.2em;
    z-index: 5;
  }
  #footer {
    width: 100%;
    max-width: 480px;
    margin: 0 auto;
    padding: 6vh 10vw 8vh;
    text-align: center;
    border-top: 0.12vw solid rgba(212,184,122,0.12);
  }
  #footer img { height: 5vh; filter: brightness(0.95) saturate(0.4); opacity: 0.6; }
  #footer .name {
    margin-top: 2vh;
    font-size: 3vw; font-weight: 400;
    color: rgba(255,255,255,0.25);
    letter-spacing: 0.3em;
  }
  #footer .hint {
    margin-top: 1vh;
    font-size: 2.6vw; font-weight: 300;
    color: rgba(255,255,255,0.12);
    letter-spacing: 0.2em;
  }
  `;

  let api = null;
  let cleanupFns = [];

  const feature = {
    id: 'scroller',
    mount(a) {
      api = a;

      const styleEl = document.createElement('style');
      styleEl.textContent = CSS;
      document.head.appendChild(styleEl);
      cleanupFns.push(function () { styleEl.remove(); });

      // 滚动容器
      const scroller = document.createElement('div');
      scroller.id = 'scroller';
      const poster = document.createElement('div');
      poster.id = 'poster';
      const footer = document.createElement('div');
      footer.id = 'footer';
      footer.innerHTML =
        '<img src="/runtime/assets/logo.png" alt="MIIFIRE">' +
        '<div class="name">觅火 MIIFIRE</div>' +
        '<div class="hint" id="footer-hint"></div>';
      scroller.appendChild(poster);
      scroller.appendChild(footer);
      document.body.appendChild(scroller);
      cleanupFns.push(function () { scroller.remove(); });

      const hint = footer.querySelector('#footer-hint');
      if (api.meta && api.meta.title) document.title = api.meta.title;
      if (hint && api.total) hint.textContent = '共 ' + api.total + ' 页 · 滑到底 · 收获你的内容资产';

      // 逐页加载
      const total = api.total || 0;
      let loaded = 0;
      const loadPage = function (n, page) {
        api.loadPage(n)
          .then(function (r) {
            const slide = r.slide;
            const extra = (slide.className || '').split(/\s+/).filter(function (c) { return c && c !== 'slide'; }).join(' ');
            page.insertAdjacentHTML('afterbegin',
              '<div class="slide-inner' + (extra ? ' ' + extra : '') + '">' + slide.innerHTML + '</div>');
            loaded++;
            if (loaded === total) {
              if (typeof window.__MII_SCROLLER_READY__ === 'function') window.__MII_SCROLLER_READY__();
            }
          })
          .catch(function () { loaded++; });
      };
      for (let i = 1; i <= total; i++) {
        const page = document.createElement('div');
        page.className = 'page';
        const idx = document.createElement('div');
        idx.className = 'page-index';
        idx.textContent = String(i).padStart(2, '0');
        page.appendChild(idx);
        poster.appendChild(page);
        loadPage(i, page);
      }

      return function () { cleanupFns.forEach(function (f) { f(); }); cleanupFns = []; };
    },
  };

  window.MIIFIRE = window.MIIFIRE || {};
  window.MIIFIRE.features = window.MIIFIRE.features || {};
  window.MIIFIRE.features.scroller = feature;
})();
