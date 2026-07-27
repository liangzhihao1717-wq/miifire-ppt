// 缩略图生成脚本：将 PPT 项目的每一页截图为 320×180 PNG
// 用法: node generate-thumbs.js <项目目录名>
// 示例: node generate-thumbs.js product-roadshow-20260728

const puppeteer = require('puppeteer');
const http = require('http');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const project = process.argv[2];
if (!project) {
  console.error('用法: node generate-thumbs.js <项目目录名>');
  process.exit(1);
}

const projectDir = path.join(__dirname, project);
const thumbsDir = path.join(projectDir, 'thumbs');

if (!fs.existsSync(projectDir)) {
  console.error('项目目录不存在:', projectDir);
  process.exit(1);
}

// 数一下有多少页 HTML
const htmlFiles = fs.readdirSync(projectDir)
  .filter(f => /^\d+\.html$/.test(f))
  .sort((a, b) => parseInt(a) - parseInt(b));
const total = htmlFiles.length;

if (total === 0) {
  console.error('项目目录下没有找到页面文件 (N.html)');
  process.exit(1);
}

// 启动本地 HTTP 服务器
const PORT = 8765;
function startServer() {
  return new Promise((resolve) => {
    const server = http.createServer((req, res) => {
      const filePath = path.join(projectDir, req.url === '/' ? '1.html' : req.url);
      try {
        const content = fs.readFileSync(filePath);
        const ext = path.extname(filePath);
        const mime = {
          '.html': 'text/html; charset=utf-8',
          '.png': 'image/png',
          '.css': 'text/css',
        }[ext] || 'text/plain';
        res.writeHead(200, { 'Content-Type': mime });
        res.end(content);
      } catch {
        res.writeHead(404);
        res.end();
      }
    });
    server.listen(PORT, () => resolve(server));
  });
}

(async () => {
  console.log(`生成缩略图: ${project} (${total} 页)`);

  // 创建 thumbs 目录
  if (!fs.existsSync(thumbsDir)) fs.mkdirSync(thumbsDir);

  const server = await startServer();
  console.log(`本地服务: http://localhost:${PORT}`);

  const browser = await puppeteer.launch({ 
    headless: true,
    executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 720 });

  // 拦截外部资源请求，避免 Google Fonts 等拖慢加载
  await page.setRequestInterception(true);
  page.on('request', (req) => {
    const host = new URL(req.url()).hostname;
    if (host === 'localhost' || host === '127.0.0.1') {
      req.continue();
    } else {
      req.abort();
    }
  });

  for (let i = 0; i < total; i++) {
    const n = parseInt(htmlFiles[i]);
    const url = `http://localhost:${PORT}/${n}.html`;
    console.log(`  [${i + 1}/${total}] 截图第 ${n} 页...`);

    await page.goto(url, { waitUntil: 'load', timeout: 10000 });
    await new Promise(r => setTimeout(r, 500)); // 等渲染

    const outFile = path.join(thumbsDir, `${n}.png`);
    await page.screenshot({ path: outFile, type: 'png', omitBackground: false });

    // 缩小到 320×180 (16:9 缩略图)
    execSync(`sips -z 180 320 "${outFile}"`);
  }

  await browser.close();
  server.close();
  console.log(`完成: ${thumbsDir}/ 生成 ${total} 张缩略图`);
})();
