// ============================================================
// 功能：keyboard — 键盘导航
// ←/→/↑/↓/PageUp/PageDown/Home/End/空格 翻页；F 全屏；S 方形屏补偿
// 依赖：shell（api.go / api.current / api.total）
// ============================================================

(function () {
  'use strict';

  let api = null;
  let cleanupFns = [];

  const feature = {
    id: 'keyboard',
    mount(a) {
      api = a;

      const onKey = function (e) {
        const tag = (e.target && e.target.tagName) || '';
        if (tag === 'INPUT' || tag === 'TEXTAREA') return;
        const key = e.key;
        const max = api.total + 1;
        let dir = 0;

        if (key === 'ArrowLeft' || key === 'ArrowUp' || key === 'PageUp') dir = -1;
        else if (key === 'ArrowRight' || key === 'ArrowDown' || key === 'PageDown' || key === ' ') dir = 1;
        else if (key === 'Home') { e.preventDefault(); api.go(0); return; }
        else if (key === 'End') { e.preventDefault(); api.go(max); return; }
        else if (key === 'f' || key === 'F') {
          e.preventDefault();
          toggleFullscreen();
          return;
        }
        else if (key === 's' || key === 'S') {
          e.preventDefault();
          const stage = document.getElementById('stage');
          if (stage) stage.classList.toggle('square');
          return;
        }

        if (dir !== 0) {
          e.preventDefault();
          const p = Math.max(0, Math.min(max, api.current + dir));
          if (p !== api.current) api.go(p);
        }
      };

      document.addEventListener('keydown', onKey);
      cleanupFns.push(function () { document.removeEventListener('keydown', onKey); });

      return function () { cleanupFns.forEach(function (f) { f(); }); cleanupFns = []; };
    },
  };

  function toggleFullscreen() {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(function () {});
    } else {
      document.exitFullscreen();
    }
  }

  window.MIIFIRE = window.MIIFIRE || {};
  window.MIIFIRE.features = window.MIIFIRE.features || {};
  window.MIIFIRE.features.keyboard = feature;
})();
