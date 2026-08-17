// ============================================================
// 觅火 MIIFIRE · 渲染内核（薄壳）
// 职责：
//   1. 解析 ?project=，加载 manifest
//   2. 注入主题 css（manifest.theme）
//   3. 按 manifest.features 挂载功能模块（window.MIIFIRE.features）
//   4. 向功能模块暴露统一 api 对象（唯一通信通道）
// 用法：由 viewers/*.html 以普通 <script> 引入
// ⚠️ 修改引擎前必读：runtime/MOBILE-NOTES.md（移动端兼容性规范）
// ============================================================

(function () {
  'use strict';

  const M = (window.MIIFIRE = window.MIIFIRE || {});
  M.features = M.features || {};

  // 附加页约定：页码 0 = cover（开屏），total+1 = toc（目录）
  // 由 cover/toc feature 注册附加页渲染器

  const params = new URLSearchParams(window.location.search);
  const project = params.get('project') || '';
  // 深链：?page=N（内容页）/ ?page=cover / ?page=toc
  const QPAGE_RAW = params.get('page');
  let QPAGE = null;
  if (QPAGE_RAW === 'cover' || QPAGE_RAW === 'toc') QPAGE = QPAGE_RAW;
  else if (QPAGE_RAW != null && /^\d+$/.test(QPAGE_RAW)) QPAGE = parseInt(QPAGE_RAW, 10);

  const state = {
    project,
    meta: null,
    theme: 'portrait',
    type: 'poster',
    total: 0,
    pages: [],
    current: 1,
    extraPages: {}, // index -> { id, title, render(api) -> HTMLElement }
    features: [],
    loaded: {},
    pageContainer: null,
  };

  // ---------------- 基础工具 ----------------

  function fetchText(url) {
    return fetch(url).then((r) => {
      if (!r.ok) throw new Error('HTTP ' + r.status);
      return r.text();
    });
  }

  // 加载内容页 HTML → 返回 slide 元素
  // 兼容两类页面：
  //   a) 新页（纯内容，无内嵌样式）→ 直接取 .slide
  //   b) 老页（内嵌 <style>）→ 提取样式注入 document（body → 容器选择器替换）
  function loadPageDOM(n) {
    const file = '/projects/' + encodeURIComponent(project) + '/slides/' + n + '.html';
    return fetchText(file).then((html) => {
      const doc = new DOMParser().parseFromString(html, 'text/html');
      const styles = doc.querySelectorAll('style');
      const injected = [];
      styles.forEach((s) => {
        const el = document.createElement('style');
        el.textContent = s.textContent.replace(/body\b/g, '#stage');
        document.head.appendChild(el);
        injected.push(el);
      });
      const slide = doc.querySelector('.slide');
      if (!slide) {
        injected.forEach((el) => el.remove());
        throw new Error('页面缺少 .slide 容器');
      }
      return { slide, injected };
    });
  }

  // ---------------- api 对象 ----------------

  const api = {
    get project() { return state.project; },
    get meta() { return state.meta; },
    get total() { return state.total; },
    get pages() { return state.pages; },
    get type() { return state.type; },
    get theme() { return state.theme; },
    get current() { return state.current; },
    get state() { return state; },

    // 跳页：n 为数字页码；'cover' / 'toc' 为附加页
    go(n, opts) {
      if (typeof n === 'string') {
        if (n === 'cover' && 0 in state.extraPages) n = 0;
        else if (n === 'toc' && (state.total + 1) in state.extraPages) n = state.total + 1;
        else return;
      }
      n = Math.round(n);
      const max = state.total + 1;
      // 边界校验：非法页直接忽略（防止 404），返回 false 表示未跳转
      if (n < 0 || n > max) return false;
      if (n === 0 && !(0 in state.extraPages)) return false;
      if (n === max && !(max in state.extraPages)) return false;
      if (n >= 1 && n <= state.total) { /* 内容页，合法 */ }
      else if (n !== 0 && n !== max) return false;
      if (n === state.current) return false;
      const prev = state.current;
      state.current = n;
      emitPageChange(n, prev, opts || {});
      return true;
    },

    // 页码 ⇄ 页面 ID（manifest.pages[].id）
    pageIdOf(n) {
      const p = state.pages.find((p) => p.n === n);
      return p ? p.id : null;
    },
    pageIndexOf(id) {
      const p = state.pages.find((p) => p.id === id);
      return p ? p.n : null;
    },

    // 订阅翻页
    onPage(fn) { return subscribe('page', fn); },

    // 内容页加载（返回 slide 元素 + 清理函数）
    loadPage(n) { return loadPageDOM(n); },

    // 注册附加页（cover/toc 用）
    registerExtra(index, id, title, render) {
      state.extraPages[index] = { id, title, render };
    },

    // 备注
    getNotes(page) {
      return fetch('/api/notes?project=' + encodeURIComponent(project) + '&page=' + page)
        .then((r) => r.json())
        .then((d) => normalizeNotes(d[page]))
        .catch(() => []);
    },
    getAllNotes() {
      return fetch('/api/notes?project=' + encodeURIComponent(project))
        .then((r) => r.json())
        .catch(() => ({}));
    },
    saveNotes(page, text, pos) {
      return fetch('/api/notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ project, page, text, pos: pos || '50%' }),
      }).then((r) => r.json());
    },
    deleteNote(page, index) {
      return fetch('/api/notes', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ project, page, index }),
      }).then((r) => r.json());
    },

    // 缩略图
    thumbs(n) {
      return '/projects/' + encodeURIComponent(project) + '/thumbs/' + n + '.png';
    },

    // 页面评价
    getReviews() {
      return fetch('/api/reviews?project=' + encodeURIComponent(project))
        .then((r) => r.json())
        .then((d) => d.reviews || [])
        .catch(() => []);
    },
    saveReview(pageId, text) {
      return fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ project, pageId, text }),
      }).then((r) => r.json());
    },

    // 容器
    get stage() { return document.getElementById('stage'); },
    get scroller() { return document.getElementById('scroller'); },
    get body() { return document.body; },
  };

  // ---------------- 事件总线 ----------------

  const listeners = { page: [] };
  function subscribe(ev, fn) { listeners[ev].push(fn); return () => { listeners[ev] = listeners[ev].filter((f) => f !== fn); }; }
  function emitPageChange(n, prev, opts) {
    listeners.page.forEach((fn) => {
      try { fn(n, prev, opts); } catch (e) { console.error('[shell] onPage error', e); }
    });
  }

  M.api = api;
  M.state = state;

  // ---------------- 引导 ----------------

  function boot() {
    if (!project) {
      document.body.innerHTML = '<div style="padding:20vh 10vw;color:rgba(255,255,255,0.4);font-size:1.2em">缺少项目参数（?project=xxx）</div>';
      return;
    }
    fetch('/projects/' + encodeURIComponent(project) + '/manifest.json')
      .then((r) => {
        if (!r.ok) throw new Error('manifest not found');
        return r.json();
      })
      .then((meta) => {
        state.meta = meta;
        state.theme = meta.theme || 'portrait';
        state.type = meta.type || 'poster';
        state.total = meta.total || 0;
        state.pages = meta.pages || [];
        if (meta.title) document.title = meta.title;

        // 微信小程序 web-view：上报分享信息（标题/封面/当前页）
        // 小程序端 bindmessage 接收后用于分享卡片与深链
        try {
          if (window.wx && wx.miniProgram && wx.miniProgram.postMessage) {
            wx.miniProgram.postMessage({
              data: {
                title: meta.title || '觅火 PPT',
                image: 'https://miifire.com/projects/' + encodeURIComponent(project) + '/thumbs/1.png',
                page: window.location.href,
              },
            });
          }
        } catch (e) { /* 非小程序环境忽略 */ }

        // 注入主题
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = '/runtime/themes/' + state.theme + '.css';
        document.head.appendChild(link);

        // 确定功能清单（manifest.features 或按 type 默认）
        const defaults = state.type === 'poster'
          ? ['scroller', 'progress', 'fullscreen', 'reviews']
          : ['pager', 'drawer', 'notes-ruler', 'keyboard', 'fullscreen', 'reviews'];
        state.features = Array.isArray(meta.features) && meta.features.length ? meta.features : defaults;

        // 挂载功能
        const cleanups = [];
        state.features.forEach((name) => {
          const f = M.features[name];
          if (!f) { console.warn('[shell] 未知功能: ' + name); return; }
          try {
            const cleanup = f.mount(api) || null;
            if (cleanup) cleanups.push(cleanup);
          } catch (e) {
            console.error('[shell] 功能挂载失败: ' + name, e);
          }
        });
        state.cleanups = cleanups;

        // 初始页：默认从 cover（如有）开始；深链优先
        let start = (0 in state.extraPages) ? 0 : 1;
        if (QPAGE === 'cover') start = 0 in state.extraPages ? 0 : 1;
        else if (QPAGE === 'toc') start = (state.total + 1) in state.extraPages ? state.total + 1 : state.total;
        else if (QPAGE != null && QPAGE >= 1 && QPAGE <= state.total) start = QPAGE;
        state.current = start;
        emitPageChange(start, null, { initial: true });
      })
      .catch((e) => {
        console.error('[shell] boot failed', e);
        const el = document.getElementById('stage') || document.body;
        el.innerHTML = '<div style="padding:20vh 10vw;color:rgba(255,255,255,0.4)">加载失败：' + (e.message || e) + '</div>';
      });
  }

  function normalizeNotes(list) {
    return (list || []).map((n) => (typeof n === 'string' ? { text: n, pos: '50%' } : n));
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
