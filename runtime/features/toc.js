// ============================================================
// 功能：toc — 目录页（附加页 index total+1）
// 数据驱动：manifest.pages[].title，点击直达对应页
// 依赖：shell（api.registerExtra / api.go / api.meta / api.pages）
// ============================================================

(function () {
  'use strict';

  let api = null;
  let cleanupFns = [];

  const feature = {
    id: 'toc',
    mount(a) {
      api = a;

      api.registerExtra(api.total + 1, 'toc', '目录', function () {
        const box = document.createElement('div');
        box.innerHTML = '<div class="mii-extra-title">目录</div>';

        const list = document.createElement('div');
        list.className = 'mii-toc';
        (api.pages || []).forEach(function (p) {
          const item = document.createElement('div');
          item.className = 'mii-toc-item';
          item.innerHTML =
            '<span class="mii-toc-num">' + String(p.n).padStart(2, '0') + '</span>' +
            '<span class="mii-toc-text">' + (p.title || '') + '</span>';
          item.addEventListener('click', function () { api.go(p.n); });
          list.appendChild(item);
        });
        box.appendChild(list);
        return box;
      });

      return function () { cleanupFns.forEach(function (f) { f(); }); cleanupFns = []; };
    },
  };

  window.MIIFIRE = window.MIIFIRE || {};
  window.MIIFIRE.features = window.MIIFIRE.features || {};
  window.MIIFIRE.features.toc = feature;
})();
