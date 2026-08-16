// ============================================================
// 功能：fullscreen — 全屏按钮（右下角）
// 依赖：无
// ============================================================

(function () {
  'use strict';

  const CSS = `
  #mii-fs-btn {
    position: fixed;
    bottom: 1.2vw; right: 1.2vw;
    width: 3vw; height: 3vw;
    min-width: 28px; min-height: 28px;
    z-index: 300;
    cursor: pointer;
    opacity: 0.35;
    transition: opacity 0.2s;
    border: 1px solid rgba(255,255,255,0.25);
    border-radius: 6px;
    background: rgba(255,255,255,0.04);
    color: rgba(255,255,255,0.7);
    font-size: 1.2vw;
    display: flex; align-items: center; justify-content: center;
    font-family: sans-serif;
    -webkit-tap-highlight-color: transparent;
  }
  #mii-fs-btn:hover { opacity: 0.9; }
  `;

  let cleanupFns = [];

  const feature = {
    id: 'fullscreen',
    mount() {
      const styleEl = document.createElement('style');
      styleEl.textContent = CSS;
      document.head.appendChild(styleEl);
      cleanupFns.push(function () { styleEl.remove(); });

      const btn = document.createElement('div');
      btn.id = 'mii-fs-btn';
      btn.textContent = '⛶';
      btn.title = '全屏（F）';
      btn.addEventListener('click', function () {
        if (!document.fullscreenElement) {
          document.documentElement.requestFullscreen().catch(function () {});
        } else {
          document.exitFullscreen();
        }
      });
      document.body.appendChild(btn);
      cleanupFns.push(function () { btn.remove(); });

      return function () { cleanupFns.forEach(function (f) { f(); }); cleanupFns = []; };
    },
  };

  window.MIIFIRE = window.MIIFIRE || {};
  window.MIIFIRE.features = window.MIIFIRE.features || {};
  window.MIIFIRE.features.fullscreen = feature;
})();
