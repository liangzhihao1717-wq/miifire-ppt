// PPT 演讲备注 API 服务（生产环境）
// 用法: node api-server.js
// 端口: 8765
// Docker: DATA_DIR=/data 挂载各项目 notes.json
//
// 数据路径: $DATA_DIR/{project}/notes.json
// 若 project 为空，默认取 $DEFAULT_PROJECT 或 __dirname 的目录名

const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = parseInt(process.env.PORT || '8765', 10);
const DATA_DIR = process.env.DATA_DIR || __dirname;
const DEFAULT_PROJECT = process.env.DEFAULT_PROJECT || path.basename(__dirname);
const NOTES_PASSWORD = process.env.NOTES_PASSWORD;

function resolveProject(project) {
  return (project || DEFAULT_PROJECT).replace(/[^a-zA-Z0-9_-]/g, '_');
}

function notesFile(project) {
  const dir = path.join(DATA_DIR, project);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  const file = path.join(dir, 'notes.json');
  if (!fs.existsSync(file)) fs.writeFileSync(file, '{}');
  return file;
}

function readNotes(project) {
  try {
    return JSON.parse(fs.readFileSync(notesFile(project), 'utf-8'));
  } catch {
    return {};
  }
}

function writeNotes(project, data) {
  fs.writeFileSync(notesFile(project), JSON.stringify(data, null, 2));
}

function json(res, code, data) {
  res.writeHead(code, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(data));
}

const server = http.createServer((req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, x-notes-key');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  const url = new URL(req.url, `http://localhost:${PORT}`);

  // GET /api/projects → 扫描 $DATA_DIR/projects/*/manifest.json（新版结构海报清单）
  if (url.pathname === '/api/projects' && req.method === 'GET') {
    const projectsDir = path.join(DATA_DIR, 'projects');
    const projects = [];
    if (fs.existsSync(projectsDir)) {
      for (const d of fs.readdirSync(projectsDir)) {
        const mf = path.join(projectsDir, d, 'manifest.json');
        try {
          const m = JSON.parse(fs.readFileSync(mf, 'utf-8'));
          projects.push({ id: d, ...m });
        } catch { /* 忽略非项目目录 */ }
      }
    }
    json(res, 200, { projects });
    return;
  }

  // GET /api/notes?project=xxx&page=5
  if (url.pathname === '/api/notes' && req.method === 'GET') {
    const project = resolveProject(url.searchParams.get('project'));
    const page = url.searchParams.get('page');

    const notes = readNotes(project);
    if (page) {
      json(res, 200, { [page]: notes[page] || [] });
    } else {
      json(res, 200, notes);
    }
    return;
  }

  // POST /api/notes  body: { project, page, text, pos }
  if (url.pathname === '/api/notes' && req.method === 'POST') {
    if (NOTES_PASSWORD && req.headers['x-notes-key'] !== NOTES_PASSWORD) {
      return json(res, 403, { error: '无权操作' });
    }
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try {
        const { project: rawProject, page, text, pos } = JSON.parse(body);
        const project = resolveProject(rawProject);
        if (!page || !text) return json(res, 400, { error: '缺少 page 或 text' });

        const notes = readNotes(project);
        if (!notes[page]) notes[page] = [];
        notes[page].push({ text, pos: pos || '50%' });
        writeNotes(project, notes);
        json(res, 200, { ok: true, notes: notes[page] });
      } catch (e) {
        json(res, 400, { error: e.message });
      }
    });
    return;
  }

  // DELETE /api/notes  body: { project, page, index }
  if (url.pathname === '/api/notes' && req.method === 'DELETE') {
    if (NOTES_PASSWORD && req.headers['x-notes-key'] !== NOTES_PASSWORD) {
      return json(res, 403, { error: '无权操作' });
    }
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try {
        const { project: rawProject, page, index } = JSON.parse(body);
        const project = resolveProject(rawProject);
        if (page == null || index == null) return json(res, 400, { error: '缺少 page 或 index' });

        const notes = readNotes(project);
        if (notes[page]) {
          notes[page].splice(index, 1);
          if (notes[page].length === 0) delete notes[page];
          writeNotes(project, notes);
        }
        json(res, 200, { ok: true, notes: notes[page] || [] });
      } catch (e) {
        json(res, 400, { error: e.message });
      }
    });
    return;
  }

  res.writeHead(404);
  res.end('Not Found');
});

server.listen(PORT, () => {
  console.log(`ppt-api 已启动: http://0.0.0.0:${PORT}`);
  console.log(`数据目录: ${DATA_DIR}`);
});
