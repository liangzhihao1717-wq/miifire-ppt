// ============================================================
// 功能：progress — 进度条
// 竖屏：跟随滚动容器（#scroller）scrollTop 计算百分比
// 横屏：跟随当前页 / 总页数
// 依赖：shell（api.onPage / api.total）；scroller 就绪事件
// ============================================================

(function () {
  'use strict';

  const CSS = `
  #progress {
    position: fixed; top: 0; left: 0;
    height: 3px; width: 0%;
    background: linear-gradient(90deg, #c9a050, #d4b87a);
    z-index: 100;
    transition: width 0.1s linear;
  }
  `;

  let api = null;
  let cleanupFns = [];

  function updateForScroller() {
    const scroller = document.getElementById('scroller');
    const bar = document.getElementById('progress');
    if (!scroller || !bar) return;
    const total = scroller.scrollHeight - scroller.clientHeight;
    const pct = total > 0 ? (scroller.scrollTop / total) * 100 : 100;
    bar.style.width = pct + '%';
  }

  function updateForPager() {
    const bar = document.getElementById('progress');
    if (!bar) return;
    const max = api.total + 1;
    const pct = max > 0 ? (api.current / max) * 100 : 0;
    bar.style.width = pct + '%';
  }

  const feature = {
    id: 'progress',
    mount(a) {
      api = a;

      const styleEl = document.createElement('style');
      styleEl.textContent = CSS;
      document.head.appendChild(styleEl);
      cleanupFns.push(function () { styleEl.remove(); });

      const bar = document.createElement('div');
      bar.id = 'progress';
      document.body.appendChild(bar);
      cleanupFns.push(function () { bar.remove(); });

      if (api.type === 'poster') {
        // 竖屏：等 scroller 就绪后监听滚动
        window.__MII_SCROLLER_READY__ = function () {
          updateForScroller();
          const scroller = document.getElementById('scroller');
          const onScroll = updateForScroller;
          scroller.addEventListener('scroll', onScroll, { passive: true });
          window.addEventListener('resize', onScroll);
          cleanupFns.push(function () {
            scroller.removeEventListener('scroll', onScroll);
            window.removeEventListener('resize', onScroll);
          });
        };
      } else {
        // 横屏：跟随翻页
        const unsub = api.onPage(updateForPager);
        cleanupFns.push(unsub);
        updateForPager();
      }

      return function () { cleanupFns.forEach(function (f) { f(); }); cleanupFns = []; };
    },
  };

  window.MIIFIRE = window.MIIFIRE || {};
  window.MIIFIRE.features = window.MIIFIRE.features || {};
  window.MIIFIRE.features.progress = feature;
})();
