// 本地开发服务器：静态文件 + 演讲提醒 API
// 用法: node api-server.js
// 端口: 8765

const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 8765;
const NOTES_FILE = path.join(__dirname, 'notes.json');

// 确保 notes.json 存在
if (!fs.existsSync(NOTES_FILE)) {
  fs.writeFileSync(NOTES_FILE, '{}');
}

function readNotes() {
  try {
    return JSON.parse(fs.readFileSync(NOTES_FILE, 'utf-8'));
  } catch {
    return {};
  }
}

function writeNotes(data) {
  fs.writeFileSync(NOTES_FILE, JSON.stringify(data, null, 2));
}

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.json': 'application/json',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
};

const server = http.createServer((req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  const url = new URL(req.url, `http://localhost:${PORT}`);

  // GET /api/notes?page=5 → 返回第 5 页的提醒（可选 page 参数，省略返回全部）
  if (url.pathname === '/api/notes' && req.method === 'GET') {
    const notes = readNotes();
    const page = url.searchParams.get('page');
    if (page) {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ [page]: notes[page] || [] }));
    } else {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(notes));
    }
    return;
  }

  // POST /api/notes  body: { page: 5, text: "提醒内容" }
  if (url.pathname === '/api/notes' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try {
        const { page, text } = JSON.parse(body);
        if (!page || !text) throw new Error('缺少 page 或 text');
        const notes = readNotes();
        if (!notes[page]) notes[page] = [];
        notes[page].push(text);
        writeNotes(notes);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ ok: true, notes: notes[page] }));
      } catch (e) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: e.message }));
      }
    });
    return;
  }

  // DELETE /api/notes  body: { page: 5, index: 0 }
  if (url.pathname === '/api/notes' && req.method === 'DELETE') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try {
        const { page, index } = JSON.parse(body);
        if (page == null || index == null) throw new Error('缺少 page 或 index');
        const notes = readNotes();
        if (notes[page]) {
          notes[page].splice(index, 1);
          if (notes[page].length === 0) delete notes[page];
          writeNotes(notes);
        }
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ ok: true, notes: notes[page] || [] }));
      } catch (e) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: e.message }));
      }
    });
    return;
  }

  // 静态文件
  let filePath = path.join(__dirname, url.pathname === '/' ? 'slides.html' : url.pathname);
  try {
    if (fs.statSync(filePath).isDirectory()) {
      filePath = path.join(filePath, 'index.html');
    }
    const content = fs.readFileSync(filePath);
    const ext = path.extname(filePath);
    res.writeHead(200, { 'Content-Type': MIME[ext] || 'text/plain' });
    res.end(content);
  } catch {
    res.writeHead(404);
    res.end('Not Found');
  }
});

server.listen(PORT, () => {
  console.log(`本地服务: http://localhost:${PORT}`);
  console.log(`提醒编辑: http://localhost:${PORT}/notes-editor.html`);
  console.log(`翻页预览: http://localhost:${PORT}/slides.html`);
});
