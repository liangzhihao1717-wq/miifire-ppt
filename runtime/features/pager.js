// ============================================================
// 功能：pager — 横屏翻页器
// 职责：加载内容页到 #stage、16:9 缩放适配、翻页动画、深链 ?page=
// 交互：滚轮 / 触摸滑动 / 隐形翻页按钮（键盘见 keyboard 功能）
// 依赖：shell（api.loadPage / api.go / api.onPage / api.state.extraPages）
// ============================================================

(function () {
  'use strict';

  const CSS = `
  #stage {
    position: fixed; top: 0; left: 0;
    width: 100%; height: 100%;
    display: flex; align-items: center; justify-content: center;
    transition: opacity 0.25s ease;
    transform-origin: center center;
    overflow: hidden;
    background: #000;
  }
  #stage.square { transform: scaleY(0.5625); }
  #prev-btn, #next-btn {
    position: fixed; width: 8vw; height: 8vw; z-index: 100;
    cursor: pointer; background: transparent; border: none;
    -webkit-tap-highlight-color: transparent;
  }
  #prev-btn { top: 0; left: 0; }
  #next-btn { bottom: 0; right: 0; }
  .mii-extra-page {
    width: 100%; height: 100%;
    display: flex; flex-direction: column;
    align-items: center; justify-content: center;
    gap: 3vh; color: #e0ded5;
    font-family: 'Noto Serif SC','Songti SC','SimSun',serif;
    background: #000;
  }
  .mii-extra-page .mii-extra-title { font-size: 4vw; font-weight: 900; letter-spacing: 0.08em; }
  .mii-extra-page .mii-extra-sub { font-size: 1.6vw; color: rgba(255,255,255,0.55); letter-spacing: 0.12em; }
  .mii-extra-page .mii-extra-logo { height: 3.2vw; filter: brightness(0.95) saturate(0.4); }
  .mii-extra-page .mii-toc { display: flex; flex-direction: column; gap: 1.6vh; margin-top: 2vh; }
  .mii-extra-page .mii-toc-item {
    display: flex; align-items: baseline; gap: 1.2vw;
    color: rgba(255,255,255,0.75); font-size: 1.5vw;
    cursor: pointer; letter-spacing: 0.06em;
    padding: 0.4vh 0.8vw; border-radius: 2px;
    transition: color 0.2s, background 0.2s;
  }
  .mii-extra-page .mii-toc-item:hover { color: #d4b87a; background: rgba(212,184,122,0.06); }
  .mii-extra-page .mii-toc-item .mii-toc-num {
    font-size: 1.1vw; color: rgba(212,184,122,0.7);
    font-variant-numeric: tabular-nums;
  }
  .mii-extra-page .mii-btn {
    margin-top: 2vh;
    color: #d4b87a; font-size: 1.4vw; text-decoration: none;
    border: 0.12vw solid rgba(212,184,122,0.4);
    padding: 1.4vh 3vw; border-radius: 99px;
    letter-spacing: 0.1em; cursor: pointer;
    transition: background 0.2s, color 0.2s;
  }
  .mii-extra-page .mii-btn:hover { background: rgba(212,184,122,0.1); }
  `;

  let api = null;
  let cleanupFns = [];
  let busy = false, flipAt = 0, flipId = 0;
  let currentStyle = null;

  function fitSlide() {
    const stage = api.stage;
    const slide = stage.querySelector('.slide');
    if (!slide) return;
    slide.style.width = '';
    slide.style.height = '';
    slide.style.transform = '';
    const sw = slide.offsetWidth;
    const sh = slide.offsetHeight;
    if (!sw || !sh) return;
    const vw = window.innerWidth, vh = window.innerHeight;
    const scale = Math.min(vw / sw, vh / sh, 1) * 0.92;
    slide.style.transform = 'scale(' + scale + ')';
    slide.style.transformOrigin = 'center center';
  }

  function renderPage(n, opts) {
    const thisFlipId = ++flipId;
    const stage = api.stage;
    if (currentStyle) { currentStyle.remove(); currentStyle = null; }

    const fadeIn = () => {
      stage.style.transition = 'none';
      stage.style.opacity = '0';
      stage.offsetHeight;
      stage.style.transition = 'opacity 0.45s cubic-bezier(0.4, 0, 0.2, 1)';
      stage.style.opacity = '1';
      let released = false;
      const done = () => {
        if (released) return;
        released = true;
        stage.style.transition = '';
        if (flipId === thisFlipId) busy = false;
      };
      stage.addEventListener('transitionend', function h(e) {
        if (e.target !== stage || e.propertyName !== 'opacity') return;
        stage.removeEventListener('transitionend', h);
        done();
      });
      setTimeout(done, 500);
    };

    const extra = api.state.extraPages[n];
    if (extra !== undefined) {
      const box = extra.render(api);
      box.className = 'mii-extra-page' + (box.className ? ' ' + box.className : '');
      stage.innerHTML = '';
      stage.appendChild(box);
      if (opts && opts.initial) { stage.style.opacity = '1'; return; }
      fadeIn();
      return;
    }

    api.loadPage(n)
      .then(function (r) {
        if (r.injected && r.injected.length) currentStyle = r.injected[0];
        stage.innerHTML = '';
        stage.appendChild(r.slide);
        const brand = stage.querySelector('.brand');
        if (brand && brand.getAttribute('href')) {
          brand.setAttribute('href', 'index.html');
        }
        fitSlide();
        if (opts && opts.initial) { stage.style.opacity = '1'; return; }
        fadeIn();
      })
      .catch(function () {
        stage.innerHTML = '<div style="padding:20vh 10vw;color:rgba(255,255,255,0.4);font-size:1.2em">页面加载失败（' + n + '）</div>';
        stage.style.opacity = '1';
        if (flipId === thisFlipId) busy = false;
      });
  }

  function requestFlip(dir, immediate) {
    if (!immediate && busy) return;
    if (!immediate) {
      const now = Date.now();
      if (now - flipAt < 2000) return;
    }
    const max = api.total + 1;
    const p = Math.max(0, Math.min(max, api.current + dir));
    if (p === api.current) return;
    flipAt = Date.now();
    if (api.go(p) !== false) {
      busy = true;
    }
  }

  const feature = {
    id: 'pager',
    mount(a) {
      api = a;

      const styleEl = document.createElement('style');
      styleEl.textContent = CSS;
      document.head.appendChild(styleEl);
      cleanupFns.push(function () { styleEl.remove(); });

      // 主舞台容器（pager 自建）
      const stage = document.createElement('div');
      stage.id = 'stage';
      document.body.appendChild(stage);
      cleanupFns.push(function () { stage.remove(); });
      api.state.stageEl = stage;

      const prevBtn = document.createElement('div');
      prevBtn.id = 'prev-btn';
      const nextBtn = document.createElement('div');
      nextBtn.id = 'next-btn';
      document.body.appendChild(prevBtn);
      document.body.appendChild(nextBtn);
      cleanupFns.push(function () { prevBtn.remove(); nextBtn.remove(); });
      prevBtn.addEventListener('click', function () { requestFlip(-1, true); });
      nextBtn.addEventListener('click', function () { requestFlip(1, true); });

      const onWheel = function (e) {
        e.preventDefault();
        requestFlip(e.deltaY > 0 ? 1 : -1);
      };
      document.addEventListener('wheel', onWheel, { passive: false });
      cleanupFns.push(function () { document.removeEventListener('wheel', onWheel); });

      let touchY = 0;
      const onTouchStart = function (e) { touchY = e.touches[0].clientY; };
      const onTouchEnd = function (e) {
        const dy = touchY - e.changedTouches[0].clientY;
        if (Math.abs(dy) > 50) requestFlip(dy > 0 ? 1 : -1);
      };
      document.addEventListener('touchstart', onTouchStart);
      document.addEventListener('touchend', onTouchEnd);
      cleanupFns.push(function () {
        document.removeEventListener('touchstart', onTouchStart);
        document.removeEventListener('touchend', onTouchEnd);
      });

      const unsub = api.onPage(function (n, prev, opts) {
        renderPage(n, opts);
      });
      cleanupFns.push(unsub);

      const onResize = fitSlide;
      window.addEventListener('resize', onResize);
      cleanupFns.push(function () { window.removeEventListener('resize', onResize); });

      return function () { cleanupFns.forEach(function (f) { f(); }); cleanupFns = []; };
    },
  };

  window.MIIFIRE = window.MIIFIRE || {};
  window.MIIFIRE.features = window.MIIFIRE.features || {};
  window.MIIFIRE.features.pager = feature;
})();
