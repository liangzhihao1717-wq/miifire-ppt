// ============================================================
// 觅火 MIIFIRE · PPT 项目质量校验（QA 门禁）
// 用法: node scripts/validate-project.js <项目目录>
// 示例: node scripts/validate-project.js projects/course-ip-20260809
//
// 校验项：
//  1. manifest.json 存在且合法，type/ratio/theme/total 必填
//  2. manifest.total == slides/ 下页面文件数
//  3. pages[].n 与文件编号一一对应；pages[].id 唯一且符合命名
//  4. 内容页禁止：内联 <style>、<script>、写死 px、非 .slide 根容器
//  5. 内容页引用的 class 必须存在于主题 css（class 注册表）
//  6. 每页存在 .slide 容器
// 退出码：0 通过，1 有错误，2 有警告
// ============================================================

const fs = require('fs');
const path = require('path');

const projectDir = process.argv[2];
if (!projectDir) {
  console.error('用法: node scripts/validate-project.js <项目目录>');
  process.exit(2);
}

const errors = [];
const warnings = [];

// ---------- 1. manifest ----------
const mfPath = path.join(projectDir, 'manifest.json');
if (!fs.existsSync(mfPath)) {
  console.error('✗ 缺少 manifest.json（项目必须声明 type/ratio/theme）');
  process.exit(1);
}
let meta;
try {
  meta = JSON.parse(fs.readFileSync(mfPath, 'utf-8'));
} catch (e) {
  console.error('✗ manifest.json 不是合法 JSON:', e.message);
  process.exit(1);
}

['type', 'ratio', 'theme', 'total'].forEach((k) => {
  if (meta[k] == null) errors.push('manifest 缺少必填字段: ' + k);
});
if (meta.type !== 'poster' && meta.type !== 'presentation') {
  errors.push('type 必须是 poster 或 presentation，当前: ' + meta.type);
}
if (meta.type === 'poster' && meta.theme !== 'portrait') {
  warnings.push('竖屏海报建议 theme=portrait（当前: ' + meta.theme + '）');
}
if (meta.type === 'presentation' && meta.theme !== 'landscape') {
  warnings.push('横屏演示建议 theme=landscape（当前: ' + meta.theme + '）');
}

// ---------- 2. 页数一致性（兼容两种结构：slides/ 子目录 / 项目根目录） ----------
const slidesDir = path.join(projectDir, 'slides');
const legacyDir = projectDir; // 老结构：页面在项目根
let pageFiles = [];
let pageDirUsed = '';
if (fs.existsSync(slidesDir)) {
  pageFiles = fs.readdirSync(slidesDir).filter((f) => /^\d+\.html$/.test(f));
  pageDirUsed = slidesDir;
} else {
  pageFiles = fs.readdirSync(legacyDir).filter((f) => /^\d+\.html$/.test(f));
  pageDirUsed = legacyDir;
}
if (meta.total !== pageFiles.length) {
  errors.push(`manifest.total=${meta.total} 但 ${pageDirUsed} 实际有 ${pageFiles.length} 个页面`);
}

// ---------- 3. pages 元数据 ----------
const seenIds = new Set();
const seenNs = new Set();
(meta.pages || []).forEach((p) => {
  if (!p.id) { errors.push('pages 条目缺少 id（稳定 ID 必填）'); return; }
  if (!/^[a-z0-9][a-z0-9-]*$/.test(p.id)) {
    errors.push(`pages[${p.n || '?'}].id 命名非法（需小写字母数字短横线）: ${p.id}`);
  }
  if (seenIds.has(p.id)) errors.push(`pages[].id 重复: ${p.id}`);
  seenIds.add(p.id);
  if (p.n != null) {
    if (seenNs.has(p.n)) errors.push(`pages[].n 重复: ${p.n}`);
    seenNs.add(p.n);
  }
});
const pageNums = new Set(pageFiles.map((f) => parseInt(f, 10)));
(meta.pages || []).forEach((p) => {
  if (p.n != null && !pageNums.has(p.n)) {
    warnings.push(`pages[].n=${p.n} 在 slides/ 中找不到对应文件`);
  }
});

// ---------- 4/6. 内容页合规 ----------
const themeFile = path.join(__dirname, '..', 'runtime', 'themes', (meta.theme || 'portrait') + '.css');
let themeCss = '';
try { themeCss = fs.readFileSync(themeFile, 'utf-8'); } catch { warnings.push('主题文件不存在: ' + themeFile); }

// class 注册表：主题中定义的所有选择器里的类名
const themeClasses = new Set();
const selRe = /([^{}]+)\{/g;
let m;
while ((m = selRe.exec(themeCss))) {
  const sel = m[1];
  sel.split(',').forEach((s) => {
    const parts = s.match(/\.([a-zA-Z][a-zA-Z0-9_-]*)/g);
    if (parts) parts.forEach((p) => themeClasses.add(p.slice(1)));
  });
}
// 功能层提供的通用 class（引擎内置）
['slide', 'brand', 'mii-extra-page'].forEach((c) => themeClasses.add(c));

const BAD_PX = /(\d+(\.\d+)?)px\b/;
const BAD_STYLE_TAG = /<style[\s>]/i;
const BAD_SCRIPT = /<script[\s>]/i;

pageFiles.sort((a, b) => parseInt(a) - parseInt(b)).forEach((f) => {
  const src = fs.readFileSync(path.join(pageDirUsed, f), 'utf-8');
  const n = parseInt(f, 10);
  const hasInlineStyle = BAD_STYLE_TAG.test(src);

  if (hasInlineStyle) {
    // 老架构页面（自带样式）：提示但跳过 class 注册表检查（其样式自包含）
    warnings.push(`${f}: 含内联 <style>（老架构特征；新页面应纯内容，样式来自主题）`);
  }
  if (BAD_SCRIPT.test(src)) {
    errors.push(`${f}: 含 <script>（内容页禁止脚本）`);
  }
  if (BAD_PX.test(src.replace(/<!--[\s\S]*?-->/g, ''))) {
    warnings.push(`${f}: 含写死 px（应使用主题容器单位）`);
  }
  if (!/<div[^>]*class="[^"]*\bslide\b[^"]*"/.test(src)) {
    errors.push(`${f}: 缺少 .slide 根容器`);
  }

  // class 存在性：仅对纯内容页（新架构）执行
  if (!hasInlineStyle) {
    const used = new Set();
    const clsRe = /class="([^"]+)"/g;
    let cm;
    while ((cm = clsRe.exec(src))) {
      cm[1].split(/\s+/).forEach((c) => { if (c) used.add(c); });
    }
    used.forEach((c) => {
      if (!themeClasses.has(c) && !/^mii-/.test(c)) {
        warnings.push(`${f}: class "${c}" 不在主题注册表中（需在主题 css 实现或模板中登记）`);
      }
    });
  }
});

// ---------- 输出 ----------
console.log('项目:', meta.title || projectDir, `(${meta.type} / ${meta.ratio} / ${meta.theme})`);
console.log('页面数:', meta.total, pageFiles.length === meta.total ? '✓' : '✗');
if (errors.length) {
  console.log('\n错误:');
  errors.forEach((e) => console.log('  ✗', e));
  process.exit(1);
}
if (warnings.length) {
  console.log('\n警告:');
  warnings.forEach((w) => console.log('  ⚠', w));
  console.log('\n校验通过（有警告）');
  process.exit(2);
}
console.log('\n✓ 校验全部通过');
process.exit(0);
