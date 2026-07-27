# PPT 设计标准

以下规则适用于每一页 PPT，确保风格统一。

---

## 配色

| 角色 | 颜色 |
|------|------|
| 底色 | `#0a0a0a` |
| 光晕 | `rgba(180,150,100,0.04)` 单点径向渐变 |
| 渐变强调色 | `#d4b87a → #c9a050`（香槟金，仅用于关键词高亮） |
| 正文 | `#e0ded5` ~ `#ece9e0`（暖白） |
| 弱化文字 | `rgba(255,255,255,0.35~0.75)` 分层透明度 |
| 分割线 | `rgba(255,255,255,0.18~0.30)` |

**硬性约束：单色系。** 不允许蓝/紫/青等多色混用。不允许多色光斑、网格纹理。

---

## 字体

- 全页使用 **思源宋体**（`Noto Serif SC`），Fallback: `Songti SC` → `SimSun` → `serif`
- 不使用无衬线字体

---
## 本地预览

每次新建或修改 PPT 页面后，必须确保能在本地浏览器直接预览。

**预览方式：在 ppt 目录启动本地 HTTP 服务器**

```bash
cd "/Users/liangzhihao/Desktop/miifire-ppt/product-roadshow-20260728" && node api-server.js
```

然后浏览器访问 `http://localhost:8765/13.html`（把 13 换成对应页码）。

**为什么不能直接双击 HTML 文件打开？**
- 页面内的 `<a href="/ppt/">` 等绝对路径需要 HTTP 服务器才能正常解析
- Logo 图片 `<img src="logo.png">` 在 file:// 协议下可能被浏览器安全策略拦截

**规范：**
- 每新建/修改一页，必须启动本地服务器让用户确认视觉效果
- 确认无误后再 `/ppt-deploy` 部署到线上

---
## 响应式

**核心原则：整页等比缩放，不做弹性压缩。** 像一张图片一样缩放，内部比例完全不变。

**实现方式：所有尺寸使用 `vw` 单位（视口宽度的百分比），基于 1280px 设计稿换算。**

换算公式：`vw = rem × 16 ÷ 12.8 = rem × 1.25`

| 设计值 (rem) | vw 值 | 用途 |
|-------------|-------|------|
| 3.6rem | 4.5vw | 最大标题 |
| 3.2rem | 4vw | 主标题 |
| 2.4rem | 3vw | 关键词大号 |
| 2.2rem | 2.75vw | 大号关键词 |
| 2.1rem | 2.625vw | 词卡标题 |
| 2.0rem | 2.5vw | 中号关键词 |
| 1.8rem | 2.25vw | 引子/结论 |
| 1.6rem | 2vw | 副标题/分类标签/logo img |
| 1.5rem | 1.875vw | 分类标签 |
| 1.4rem | 1.75vw | 二级标题 |
| 1.3rem | 1.625vw | 身份标签 |
| 1.25rem | 1.56vw | 路径正文最大值 |
| 1.2rem | 1.5vw | 示例正文 |
| 1.15rem | 1.44vw | 列表正文 |
| 1.1rem | 1.375vw | 推理结果 |
| 1.05rem | 1.31vw | 路径正文 |
| 1.0rem | 1.25vw | 正文/logo 文字 |
| 0.95rem | 1.19vw | 表格正文 |
| 0.9rem | 1.125vw | 弱化标签 |
| 0.85rem | 1.06vw | 编号 |
| 0.8rem | 1vw | 小字/logo |
| 0.7rem | 0.875vw | 最小字号 |
| 0.6rem | 0.75vw | gap |
| 0.58rem | 0.73vw | meta |
| 5.5rem | 6.875vw | 上下内边距 |
| 8rem | 10vw | 左右内边距/logo left |
| 2.2rem | 2.75vw | logo top |
| 20rem | 25vw | 分割线宽度 |

**px 值也一并换算**：
- 3px → 0.23vw（分割线/竖线）
- 2px → 0.16vw（细分割线）
- 1px → 0.08vw

**不变的项目**：
- `letter-spacing`（em 单位是相对值，自动等比例）
- `font-weight`、`opacity`、`line-height`（无单位或百分比，自动适应）

**容器约束**：
- `body`：flex 居中，去掉 `overflow: hidden`
- `.slide`：`width: 100%` + `aspect-ratio: 16/9` + `overflow: hidden`

---
## 排版

- 画面 **16:9**，内容垂直居中
- 内边距 `6.875vw 10vw`（等同 5.5rem 8rem）
- 主标题 **4~4.5vw** / 900 字重
- 二级标题 **1.625~1.875vw** / 400~500 字重
- 关键词大号 **2.25~3vw** / 900 字重
- 关键词标准 **1.5~2vw** / 900 字重
- 分类标签 **1.625~2vw** / 800~900 字重
- 路径/正文 **1.25~1.56vw** / 500~700 字重
- 编号/小字 **0.875~1.25vw** / 400~600 字重
- 弱化标签（删除线等）**1.125~1.25vw** / 400~500 字重

---

## 核心原则：可以弱化，但必须明显

- 字号不低于 **0.7rem**
- 透明度不低于 **25%**
- 分割线不低于 **2px**
- 宁可偏大偏重，不可小家子气
- **信息清晰度优先于纯美学追求**

---

## 装饰

- 零彩色光斑、零网格纹理
- 只用极细的分割线/横线来建立视觉关系
- 少用圆角卡片、色条、英文角标这类多余装饰

## 特效

**核心原则：用静态渐变模拟效果，禁止 CSS 动画。**

流光/金属/呼吸等效果，一律用静态 `linear-gradient` 内置多段高光带来实现，
不写 `@keyframes`、不写 `animation`、不写 `transition`。
原因：CSS 动画持续占用渲染管线，PPT 页数多了之后浏览流畅度会明显下降。

**假流光写法示例**：

```css
/* 金属流光感：底色中嵌入两道浅金色高光带，视觉上有光泽扫过的错觉 */
background: linear-gradient(135deg, #c9a050 0%, #f5e6c8 40%, #d4b87a 50%, #f5e6c8 60%, #c9a050 100%);
-webkit-background-clip: text;
-webkit-text-fill-color: transparent;
background-clip: text;
/* 无 animation，纯静态渲染 */
```

---

## Logo

- 左上角固定位置：`top: 2.2rem; left: 8rem`
- Logo 图片去饱和度 `filter: brightness(0.95) saturate(0.4)`
- 旁边跟「觅火 MIIFIRE」，宋体 0.8rem / 600 字重
- 整体透明度 75%，hover 到 100%
- 点击回到 PPT 目录页（`/ppt/`）

---

## 翻页容器 `slides.html`

`slides.html` 是 PPT 的翻页浏览模式，通过 `fetch()` 动态加载每一页 HTML，实现纯上下滑动翻页。

---

### 开幕特效（帷幕拉开）

打开 `slides.html` 后显示黑底帷幕，**点击任意位置**后两扇帷幕向左右滑开，露出第一页 PPT。

- 帷幕底色 `#0a0a0a`，与页面底色一致，拉开后无缝衔接
- 帷幕中央显示觅火 logo + 「点击开始」提示
- 点击后：logo 淡出，左帘向左、右帘向右滑出（0.9s 缓动曲线）
- 动画结束后帷幕从 DOM 移除
- 防重复点击：拉开后不再响应

**帷幕 CSS 关键约束：**
- `#curtain` 使用 `pointer-events: auto; cursor: pointer`，接收点击
- 面板动画使用 `transition: transform 0.9s cubic-bezier(0.7, 0, 0.3, 1)`
- 单次使用，不循环，不持续占用渲染管线

---

### 等比缩放策略

**核心原则：每一页都像一张完整显示的图片——整页等比缩放，logo 和文字绝不互相挤压、绝不裁切。**

**实现方式：`transform: scale()`**

1. 让每页 slide 按 CSS 自然渲染（`width: 100%` + `aspect-ratio: 16/9`）
2. 用 JS 读取 slide 的 `offsetWidth` / `offsetHeight`（自然尺寸）
3. 与 `window.innerWidth` / `window.innerHeight` 做对比，算出缩放比例
4. 应用 `transform: scale()` + `transformOrigin: center center`，整页等比缩小

**缩放公式：**

```javascript
// 先让 slide 按自然尺寸渲染
slide.style.width = '';
slide.style.height = '';
slide.style.transform = '';

const sw = slide.offsetWidth;   // slide 自然宽度
const sh = slide.offsetHeight;  // slide 自然高度
const vw = window.innerWidth;   // 浏览器可视区域宽度
const vh = window.innerHeight;  // 浏览器可视区域高度

// 算出能完整装进视口的最小缩放比，再留 8% 呼吸空间
const scale = Math.min(vw / sw, vh / sh, 1) * 0.92;

slide.style.transform = `scale(${scale})`;
slide.style.transformOrigin = 'center center';
```

**关键约束：**

- `#stage` 容器使用 `width: 100%; height: 100%`，**禁止使用 `dvh`**（不同浏览器对动态视口高度的实现不一致）
- `#stage` **禁止 `overflow: hidden`**，避免裁切缩放后的内容
- 缩放比乘 0.92 留出呼吸空间，确保 slide 四边都有黑边，内容绝不贴边
- 窗口 resize 时必须重新执行 `fitSlide()`
- 每次翻页（新 slide 注入后）必须重新执行 `fitSlide()`
- **绝不调整 slide 内部元素的尺寸或位置**——只能通过 `transform: scale()` 整体缩放

---

### 翻页动效

翻页时新页面带滑动 + 缩放动效入场，方向与翻页方向一致：

- **向下翻**：新页面从下方 100px 处缩小到 96% 滑入归位
- **向上翻**：新页面从上方 100px 处缩小到 96% 滑入归位

**动画参数：**
- 缩放范围：`96% → 100%`
- 位移量：`100px`
- 时长：`0.55s`
- 缓动曲线：`cubic-bezier(0.16, 1, 0.3, 1)`（弹簧减速，收尾有轻微回弹感）
- 结合 `#stage` 的 `opacity 0.25s` 淡入淡出，形成立体入场效果

**实现：**
```javascript
// fitSlide() 之后
const slide = stage.querySelector('.slide');
const baseTx = slide.style.transform; // "scale(0.92)"
const ty = dir > 0 ? '100px' : '-100px';
const scaleMatch = baseTx.match(/scale\(([^)]+)\)/);
const s = scaleMatch ? parseFloat(scaleMatch[1]) : 1;

slide.style.transition = 'none';
slide.style.transform = `scale(${s * 0.96}) translateY(${ty})`;
stage.style.opacity = '1';

slide.offsetHeight; // 强制回流
slide.style.transition = 'transform 0.55s cubic-bezier(0.16, 1, 0.3, 1)';
slide.style.transform = baseTx;
```

---

### 翻页方式

支持以下翻页方式，均传递方向参数：

| 方式 | 上一页 | 下一页 |
|------|--------|--------|
| 鼠标滚轮 | 上滚 | 下滚 |
| 键盘 | ↑ / ← / PageUp | ↓ / → / PageDown |
| 翻页笔 | PageUp / ArrowUp | PageDown / ArrowDown |
| 触摸板/触摸屏 | 下滑 | 上滑 |

**翻页笔兼容：** 同时监听 `ArrowUp/ArrowDown/ArrowLeft/ArrowRight/PageUp/PageDown`，覆盖市面上主流翻页笔的按键映射。

**防连翻架构（`requestFlip` 单一入口，原子 ID）：**

```
wheel / keydown / touch → requestFlip(dir, false)    ← 滚轮/键盘（受 _busy + 2s 冷却限制）
                              │
                         _busy? → 阻塞
                         距上次 < 2000ms? → 阻塞
                              │
                         executeFlip(p, dir)          ← 原子 ID 保底


corner buttons → requestFlip(dir, true)              ← 明确意图（跳过 _busy + 冷却）
                              │
                         executeFlip(p, dir)          ← 原子 ID 保底


drawer thumb → executeFlip(p, dir)                   ← 直接调用（跳过所有判据）
                              │
                         原子 ID 保底
```

**`_flipId` 原子 ID 机制：**

每次 `executeFlip()` 生成唯一递增 ID。`transitionend` 和 700ms 兜底 timer 只释放对应 ID 的 `_busy` 锁。快速连续点击时，旧翻页动画的回调不会误释放新翻页的 `_busy`，避免滚动穿透。

**设计原则：**

| 层 | 机制 | 职责 |
|---|------|------|
| CSS | `overflow: hidden; overscroll-behavior: none; touch-action: none` | 从浏览器底层禁止一切原生滚动 |
| 摄入层 | `wheel`/`keydown`/`touch` 事件处理器 | 统一调 `requestFlip(dir, false)` |
| 按钮层 | 角按钮 `requestFlip(dir, true)` / 抽屉 `executeFlip()` | 明确用户意图，不受判据限制 |
| 判据层 | `requestFlip()` — `_busy` 布尔锁 + `_flipAt` 时间戳 | 仅对非明确意图（滚轮/键盘）生效 |
| 执行层 | `executeFlip()` | `fetch` → DOM 替换 → `transitionend` 释锁（700ms 兜底），原子 ID 防竞态 |

**为什么冷却必须放在 `requestFlip` 而非单独事件层：**
macOS 触控板两指滑动在 JS 不可控层同时发射 `wheel` 和 `ArrowDown` 键盘事件，是两个独立事件源。若只在 wheel handler 做冷却，ArrowDown 幽灵事件在动画结束后（`_busy` 释放时）仍能穿透触发连翻。冷却必须覆盖所有输入来源的汇合点。

### 隐形翻页按钮

左上角和右下角各有一个不可见的点击区域，用于触屏/鼠标翻页：

| 位置 | 触发方向 | 参数 |
|------|---------|------|
| 左上角 `#prev-btn` | 上一页 | `requestFlip(-1, true)` |
| 右下角 `#next-btn` | 下一页 | `requestFlip(1, true)` |

**设计规则：**
- 尺寸 `8vw × 8vw`，`background: transparent`，完全不可见
- `z-index: 100`，位于帷幕和 slide 之上
- 帷幕期间不响应点击
- 调用 `requestFlip(dir, true)`，`immediate` 参数同时绕过 `_busy` 动画锁和 `_flipAt` 时间戳冷却
- 并发安全由 `_flipId` 原子 ID 保底，快速连点不会出现竞态

---

### 左侧抽屉页面列表

鼠标移到屏幕最左侧 30px 触发带内时，自动从左侧滑出一个抽屉面板，展示所有页面的缩略图列表。

**交互规则：**

| 行为 | 结果 |
|------|------|
| 鼠标移入左边缘 30px | 抽屉自动展开 |
| 鼠标移出抽屉面板 | 不自动折叠 |
| 点击抽屉外的遮罩层 | 抽屉折叠 |
| 按 Escape | 抽屉折叠 |
| 点击某一页缩略图 | 直接调用 `executeFlip()` 跳转，跳过 `_busy` 和 `_flipAt` 所有判据 |
| 快速连续点击 | 每次点击立即生效，`_flipId` 原子 ID 防竞态，旧动画回调自动失效 |
| 在抽屉列表上滚轮 | 仅滚动列表，不触发 PPT 翻页 |

**实现要点：**

- 抽屉面板 `position: fixed`，`z-index: 200`，位于翻页按钮之上
- 使用 `transform: translateX(-100%)` → `translateX(0)` 做滑入滑出，`cubic-bezier(0.16, 1, 0.3, 1)` 缓动，动画 0.35s
- 抽屉缩略图点击不检查 `_busy`，直接调用 `executeFlip()`，动画中也能立即响应新点击
- 抽屉面板的 `wheel` 事件必须 `e.stopPropagation()`，阻止冒泡到 document 触发翻页
- 遮罩层 `#drawer-container .backdrop` 覆盖全屏，`display: none` → `display: block` 随展开切换

**缩略图：静态 PNG（正统做法）**

抽屉列表的每一页缩略图使用预生成的静态 PNG 图片，**不使用 iframe 加载整页 HTML**。

原因：
- iframe 每加载一页就是一次完整的 DOM + CSS + 字体渲染，21 页即 21 个完整文档实例，内存开销巨大
- iframe 懒加载有延迟，首展开时需要逐帧创建，用户体验差
- 静态 PNG 缩略图零延时加载，零额外内存，浏览器原生 `<img>` 解码

**生成缩略图：**

```bash
cd /Users/liangzhihao/Desktop/miifire-ppt && node generate-thumbs.js <项目目录名>
```

脚本使用 Puppeteer 无头 Chrome 逐页截图，再用 `sips` 缩放到 320×180，输出到项目的 `thumbs/` 目录。

**CSS 样式：**

```css
#drawer-container .drawer-thumb img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}
```

`object-fit: cover` 确保缩略图铺满容器且保持 16:9 比例，不拉伸变形。

**DOM 结构：**

```html
<div id="drawer-container">
  <div class="tab"></div>          <!-- 左边缘触发带，30px 宽 -->
  <div class="backdrop"></div>      <!-- 遮罩层，展开时覆盖右侧 -->
  <div class="panel">
    <div class="panel-header"><span>页面列表</span></div>
    <div class="panel-list" id="drawer-list"></div>
  </div>
</div>
```

列表项由 JS 动态生成，每项包含 `<img src="thumbs/N.png">` 和 `<span>第 N 页</span>`，点击调用 `executeFlip()` 跳转。

---

### 右侧演讲提醒

翻页时从 API 拉取当前页的演讲提醒，在右下角以小圆点展示。每条提醒一个圆点，hover 弹出横向气泡显示提醒文字。

**交互规则：**

| 行为 | 结果 |
|------|------|
| 当前页有提醒时 | 右下角显示金色实心小圆点（每条一个） |
| 鼠标悬停圆点 | 圆点变亮 + 放大，左侧弹出气泡显示提醒文字 |
| 鼠标移出圆点 | 气泡消失，圆点恢复 |
| 翻到有提醒的页面 | 圆点自动出现 |
| 翻到无提醒的页面 | 圆点消失 |

**视觉设计：**

- 圆点：8px 实心圆，默认 `rgba(212,184,122,0.15)`，hover `0.35` + 光晕
- 容器：`position: fixed; bottom: 8vh; right: 0`，宽度 40px，`padding-right: 20px`（不贴边）
- 圆点垂直排列，间距 2.2vh，靠右对齐
- 气泡：深色底 `rgba(14,14,14,0.97)`，圆角 4px，`white-space: nowrap`，从圆点向左弹出
- 触摸区：`::before` 伪元素上下左右各扩展 10px

**提醒数据流：**

```
notes-editor.html → POST/DELETE /api/notes → notes.json ← GET /api/notes → slides.html
```

**提醒编辑（notes-editor.html）：**

- 选择页码 → 查看/编辑该页提醒
- 每条提醒可单独删除
- 输入框 + 「添加」按钮添加新提醒
- 自动保存到 `notes.json`，无需手动导出

**本地开发服务器（api-server.js）：**

```bash
cd product-roadshow-20260728 && node api-server.js
```

一个命令同时提供静态文件服务和 API 端点，替代 `python3 -m http.server`：

| 端点 | 功能 |
|------|------|
| `GET /api/notes?page=5` | 查询某一页的提醒 |
| `POST /api/notes` | 添加提醒 `{ page: "5", text: "..." }` |
| `DELETE /api/notes` | 删除提醒 `{ page: "5", index: 0 }` |

**数据存储（notes.json）：**

```json
{
  "5": ["提醒第一条", "提醒第二条"],
  "7": ["这一页只有一条提醒"]
}
```

页码为 key，值为字符串数组。每页可以有多条提醒，无忧虑无拖慢。

**部署上线：**

`api-server.js` 在服务器以 pm2 常驻运行，nginx 反向代理 `/api/` 至此进程。所有设备访问同一份 `notes.json`，天然跨设备同步。
