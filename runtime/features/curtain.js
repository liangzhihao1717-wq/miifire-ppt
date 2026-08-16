// ============================================================
// 功能：curtain — 帷幕开屏特效（横屏开场仪式感）
// 点击开始 → 左右拉帘 → 进入第一页；?fullscreen 参数自动全屏
// 依赖：shell（api.go / api.meta）
// ============================================================

(function () {
  'use strict';

  const CSS = `
  #curtain {
    position: fixed; top: 0; left: 0;
    width: 100%; height: 100%;
    z-index: 9999;
    pointer-events: auto;
    cursor: pointer;
  }
  #curtain .panel {
    position: absolute; top: 0;
    width: 50%; height: 100%;
    background: #0a0a0a;
    transition: transform 0.9s cubic-bezier(0.7, 0, 0.3, 1);
  }
  #curtain .panel.left { left: 0; }
  #curtain .panel.right { right: 0; }
  #curtain .curtain-logo {
    position: absolute;
    top: 50%; left: 50%;
    transform: translate(-50%, -50%);
    display: flex; flex-direction: column;
    align-items: center; gap: 1.2vw;
    z-index: 1;
    transition: opacity 0.5s ease;
  }
  #curtain .curtain-logo img { height: 4vw; filter: brightness(0.95) saturate(0.4); }
  #curtain .curtain-logo span {
    font-family: 'Noto Serif SC','Songti SC','SimSun',serif;
    font-size: 1.6vw; font-weight: 600;
    color: rgba(255,255,255,0.7);
    letter-spacing: 0.08em;
  }
  #curtain .curtain-logo .hint {
    font-size: 0.9vw; font-weight: 300;
    color: rgba(255,255,255,0.25);
    letter-spacing: 0.12em;
    margin-top: 0.6vw;
  }
  #curtain.open .curtain-logo { opacity: 0; }
  #curtain.open .panel.left { transform: translateX(-100%); }
  #curtain.open .panel.right { transform: translateX(100%); }
  #curtain.done { display: none; }
  `;

  let api = null;
  let cleanupFns = [];
  let opened = false;

  const feature = {
    id: 'curtain',
    mount(a) {
      api = a;

      const styleEl = document.createElement('style');
      styleEl.textContent = CSS;
      document.head.appendChild(styleEl);
      cleanupFns.push(function () { styleEl.remove(); });

      // 已带 ?page= 深链时跳过帷幕（直接看目标页）
      const params = new URLSearchParams(window.location.search);
      if (params.get('page')) return function () {};

      const curtain = document.createElement('div');
      curtain.id = 'curtain';
      curtain.innerHTML =
        '<div class="panel left"></div>' +
        '<div class="panel right"></div>' +
        '<div class="curtain-logo">' +
          '<img src="/runtime/assets/logo.png" alt="MIIFIRE">' +
          '<span>觅火 MIIFIRE</span>' +
          '<span class="hint">点击开始</span>' +
        '</div>';
      document.body.appendChild(curtain);
      cleanupFns.push(function () { curtain.remove(); });

      function open() {
        if (opened) return;
        opened = true;
        curtain.classList.add('open');
        setTimeout(function () {
          curtain.classList.add('done');
          if (params.get('fullscreen') != null) {
            document.documentElement.requestFullscreen().catch(function () {});
          }
        }, 1000);
      }

      curtain.addEventListener('click', open);
      cleanupFns.push(function () { curtain.removeEventListener('click', open); });

      return function () { cleanupFns.forEach(function (f) { f(); }); cleanupFns = []; };
    },
  };

  window.MIIFIRE = window.MIIFIRE || {};
  window.MIIFIRE.features = window.MIIFIRE.features || {};
  window.MIIFIRE.features.curtain = feature;
})();
