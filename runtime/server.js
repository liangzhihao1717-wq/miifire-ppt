// ============================================================
// 觅火 MIIFIRE · PPT 统一服务入口（重构版）
// 用法: node runtime/server.js
// 端口: 8765（可用 PORT 环境变量覆盖）
//
// 架构：内容(projects/) 与 运行时(runtime/) 分离
//   - projects/{id}/manifest.json   项目元数据（类型/比例/页数/主题）
//   - projects/{id}/slides/N.html   纯内容页（样式来自 runtime/themes）
//   - runtime/themes/*.css          主题（横屏/竖屏）
//   - runtime/viewers/*.html        查看容器（presentation/poster）
//
// 路由：
//   GET /                        → 动态目录页（扫描 projects/*/manifest.json）
//   GET /p/{project}/            → 项目查看入口（按 type 重定向）
//   GET /runtime/...             → 运行时静态资源
//   GET /projects/{project}/...  → 项目内容静态资源
//   GET /api/projects            → 项目列表（manifest 聚合）
//   GET/POST/DELETE /api/notes   → 演讲备注
// ============================================================

const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = parseInt(process.env.PORT || '8765', 10);
const ROOT = __dirname;                 // runtime 目录
const REPO = path.dirname(__dirname);   // miifire-ppt 根目录
const PROJECTS_DIR = path.join(REPO, 'projects');
const NOTES_PASSWORD = process.env.NOTES_PASSWORD;

// ---------- 工具 ----------

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.md': 'text/markdown; charset=utf-8',
};

function send(res, code, data, type) {
  res.writeHead(code, {
    'Content-Type': type || 'text/plain; charset=utf-8',
    'Cache-Control': 'no-store',
  });
  res.end(data);
}

function json(res, code, data) {
  send(res, code, JSON.stringify(data), 'application/json; charset=utf-8');
}

function safeProjectName(name) {
  return String(name || '').replace(/[^a-zA-Z0-9_-]/g, '_');
}

// ---------- 项目 manifest 聚合 ----------

function listProjects() {
  if (!fs.existsSync(PROJECTS_DIR)) return [];
  return fs.readdirSync(PROJECTS_DIR)
    .filter(d => {
      try { return fs.statSync(path.join(PROJECTS_DIR, d)).isDirectory(); } catch { return false; }
    })
    .map(d => {
      const mf = path.join(PROJECTS_DIR, d, 'manifest.json');
      try {
        const m = JSON.parse(fs.readFileSync(mf, 'utf-8'));
        return { id: d, ...m };
      } catch {
        return { id: d, title: d, type: 'presentation', ratio: '16:9' };
      }
    });
}

function loadManifest(project) {
  const file = path.join(PROJECTS_DIR, project, 'manifest.json');
  try {
    return JSON.parse(fs.readFileSync(file, 'utf-8'));
  } catch {
    return null;
  }
}

// ---------- 备注数据（存于项目目录 notes.json） ----------

function notesFile(project) {
  const dir = path.join(PROJECTS_DIR, project);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  const file = path.join(dir, 'notes.json');
  if (!fs.existsSync(file)) fs.writeFileSync(file, '{}');
  return file;
}

function readNotes(project) {
  try { return JSON.parse(fs.readFileSync(notesFile(project), 'utf-8')); } catch { return {}; }
}

function writeNotes(project, data) {
  fs.writeFileSync(notesFile(project), JSON.stringify(data, null, 2));
}

// ---------- 静态文件服务 ----------

function serveFile(res, filePath) {
  try {
    const content = fs.readFileSync(filePath);
    const ext = path.extname(filePath).toLowerCase();
    send(res, 200, content, MIME[ext] || 'application/octet-stream');
  } catch {
    send(res, 404, 'Not Found');
  }
}

// ---------- 项目查看入口（重定向到对应 viewer） ----------

function projectEntry(project, manifest) {
  const type = (manifest && manifest.type) || 'presentation';
  const viewer = type === 'poster' ? 'poster.html' : 'presentation.html';
  return `/runtime/viewers/${viewer}?project=${encodeURIComponent(project)}`;
}

// ---------- 路由 ----------

const server = http.createServer((req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, x-notes-key');

  if (req.method === 'OPTIONS') { res.writeHead(204); res.end(); return; }

  const url = new URL(req.url, `http://localhost:${PORT}`);
  const pathname = decodeURIComponent(url.pathname);

  // --- API: 项目列表 ---
  if (pathname === '/api/projects' && req.method === 'GET') {
    json(res, 200, { projects: listProjects() });
    return;
  }

  // --- API: 备注 ---
  if (pathname === '/api/notes' && req.method === 'GET') {
    const project = safeProjectName(url.searchParams.get('project'));
    const page = url.searchParams.get('page');
    const notes = readNotes(project);
    if (page) json(res, 200, { [page]: notes[page] || [] });
    else json(res, 200, notes);
    return;
  }

  if (pathname === '/api/notes' && (req.method === 'POST' || req.method === 'DELETE')) {
    if (NOTES_PASSWORD && req.headers['x-notes-key'] !== NOTES_PASSWORD) {
      return json(res, 403, { error: '无权操作' });
    }
    let body = '';
    req.on('data', c => body += c);
    req.on('end', () => {
      try {
        const { project: rawProject, page, text, pos, index } = JSON.parse(body);
        const project = safeProjectName(rawProject);
        const notes = readNotes(project);
        if (req.method === 'POST') {
          if (!page || !text) return json(res, 400, { error: '缺少 page 或 text' });
          if (!notes[page]) notes[page] = [];
          notes[page].push({ text, pos: pos || '50%' });
          writeNotes(project, notes);
          json(res, 200, { ok: true, notes: notes[page] });
        } else {
          if (page == null || index == null) return json(res, 400, { error: '缺少 page 或 index' });
          if (notes[page]) {
            notes[page].splice(index, 1);
            if (notes[page].length === 0) delete notes[page];
            writeNotes(project, notes);
          }
          json(res, 200, { ok: true, notes: notes[page] || [] });
        }
      } catch (e) {
        json(res, 400, { error: e.message });
      }
    });
    return;
  }

  // --- 项目查看入口: /p/{project}/ ---
  const entryMatch = pathname.match(/^\/p\/([A-Za-z0-9_-]+)\/?$/);
  if (entryMatch) {
    const project = entryMatch[1];
    const manifest = loadManifest(project);
    if (!manifest) return send(res, 404, 'Project Not Found');
    const target = projectEntry(project, manifest);
    res.writeHead(302, { Location: target });
    res.end();
    return;
  }

  // --- 根目录：动态目录页 ---
  if (pathname === '/' || pathname === '/index.html') {
    const file = path.join(REPO, 'index.html');
    serveFile(res, file);
    return;
  }

  // --- runtime 静态资源 ---
  if (pathname.startsWith('/runtime/')) {
    const file = path.join(REPO, pathname.replace(/^\/runtime\//, 'runtime/'));
    serveFile(res, file);
    return;
  }

  // --- projects 内容静态资源 ---
  const projMatch = pathname.match(/^\/projects\/([A-Za-z0-9_-]+)\/(.*)$/);
  if (projMatch) {
    const file = path.join(PROJECTS_DIR, projMatch[1], projMatch[2]);
    serveFile(res, file);
    return;
  }

  send(res, 404, 'Not Found');
});

server.listen(PORT, () => {
  console.log(`觅火 PPT 服务已启动: http://localhost:${PORT}`);
  console.log(`项目目录: ${PROJECTS_DIR}`);
  console.log(`目录页:   http://localhost:${PORT}/`);
});
