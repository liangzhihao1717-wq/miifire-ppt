// ============================================================
// 功能：cover — 开屏页（附加页 index 0）
// 数据驱动：manifest.cover { logo, slogan, title }
// 依赖：shell（api.registerExtra / api.go / api.meta）
// ============================================================

(function () {
  'use strict';

  let api = null;
  let cleanupFns = [];

  const feature = {
    id: 'cover',
    mount(a) {
      api = a;

      // 注册附加页 0
      api.registerExtra(0, 'cover', '封面', function () {
        const cover = api.meta.cover || {};
        const box = document.createElement('div');
        box.innerHTML =
          '<img class="mii-extra-logo" src="' + (cover.logo || '/runtime/assets/logo.png') + '" alt="MIIFIRE">' +
          '<div class="mii-extra-title">' + (cover.title || api.meta.title || '') + '</div>' +
          (cover.slogan ? '<div class="mii-extra-sub">' + cover.slogan + '</div>' : '') +
          '<a class="mii-btn" href="javascript:void(0)">开始翻阅</a>';
        const btn = box.querySelector('.mii-btn');
        btn.addEventListener('click', function () { api.go(1); });
        return box;
      });

      return function () { cleanupFns.forEach(function (f) { f(); }); cleanupFns = []; };
    },
  };

  window.MIIFIRE = window.MIIFIRE || {};
  window.MIIFIRE.features = window.MIIFIRE.features || {};
  window.MIIFIRE.features.cover = feature;
})();
