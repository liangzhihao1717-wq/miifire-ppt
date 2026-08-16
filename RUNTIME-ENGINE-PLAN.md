# 觅火 MIIFIRE · PPT 运行时引擎分层方案

> **一句话目标：功能做一次，内容写无限。**
> 侧边菜单、缩略图、备注、开屏、目录……这些功能在引擎里只有一份实现，
> 以后做任何 PPT 直接套用；功能优化一次，所有 PPT 同步更新。
> 做 PPT 的人只考虑一件事：**每一页的呈现内容**。

> **⚠️ 三个层面（v2 补充）：**
> 1. **功能层**（引擎能力）：侧边菜单、缩略图、备注、开屏、目录……一份代码，全部 PPT 共享
> 2. **排版层**（设计系统）：页面类型模板 + 语义 class 规范 + 已做范例页——让 AI 照着做，不用每次重新描述排版
> 3. **内容层**（每页内容）：manifest 声明 + 纯内容页，作者只填文字与素材

---

## 一、核心原则

1. **功能是功能，内容是内容** — 两个层面彻底分离，互不掺和
2. **排版是排版** — 排版模板与规范单独成层，AI 做新页时"选模板 + 填内容"，而不是"听描述 + 自由发挥"
3. **一份功能代码，服务所有 PPT** — 修 bug / 加功能 = 改引擎一处，全部生效
4. **内容 = manifest 声明 + 纯内容页** — 作者不写任何功能代码、不维护任何功能页面
5. **功能可插拔** — 每个 PPT 在 manifest 里勾选自己要的功能组合
6. **主题可换皮** — 视觉风格独立成主题 css，功能层不关心长相

---

## 二、目标架构

```
miifire-ppt/
├── runtime/                          ← 功能层（引擎，一份代码）
│   ├── server.js                     ← 统一服务入口
│   │                                   · 目录页（扫描 projects/*/manifest.json）
│   │                                   · 项目入口 /p/{id}/ → 按 type 选壳
│   │                                   · 备注 API /api/notes
│   │                                   · 缩略图 API /api/thumbs
│   ├── shell.js / shell.html         ← 渲染内核（薄壳）
│   │                                   · 读 manifest
│   │                                   · 按 features 清单挂载功能
│   │                                   · 暴露 api 对象给功能模块
│   ├── features/                     ← 功能模块库（可插拔，每个一个文件）
│   │   ├── cover.js                  · 开屏页（数据驱动生成）
│   │   ├── toc.js                    · 目录页（manifest.pages 自动生成）
│   │   ├── drawer.js                 · 侧边抽屉菜单（缩略图列表）
│   │   ├── pager.js                  · 翻页器（含 ?page=N 深链）
│   │   ├── scroller.js               · 滚动器（竖屏海报纵向滚动）
│   │   ├── notes-ruler.js            · 时间轴备注尺（演讲看备注）
│   │   ├── notes-editor.js           · 备注编辑器
│   │   ├── keyboard.js               · 键盘导航（←/→/空格/Home/End）
│   │   ├── fullscreen.js             · 全屏
│   │   └── progress.js               · 顶部进度条
│   ├── themes/                       ← 视觉主题（可换皮）
│   │   ├── portrait.css              · 竖屏主题（已有）
│   │   └── landscape.css             · 横屏主题（待建，从老项目提炼）
│   ├── viewers/                      ← 壳的载体（每个壳 = 薄壳 + 默认功能组合）
│   │   ├── poster.html               · 竖屏海报壳（已有，功能精简版）
│   │   └── presentation.html         · 横屏演示壳（待建，从老 slides.html 提炼）
│   ├── fonts/                        · 自托管字体
│   └── assets/                       · 公共素材（logo 等）
│
└── projects/                         ← 内容层（每个 PPT 一个目录）
    ├── course-ip-20260809/
    │   ├── manifest.json             · 项目身份证（形态/主题/功能勾选/页标题）
    │   ├── slides/1.html ... N.html  · 纯内容页（无功能代码、无样式依赖引擎）
    │   └── notes.json                · 备注数据（运行时生成）
    └── 未来每个新 PPT 照此结构      · 开屏/目录/侧边栏/缩略图/备注全部自动
```

**数据流**：`manifest.json` → 壳 → 按 `features` 挂功能 → 功能经 `api` 对象渲染内容与交互。内容页只被加载，永远不知道功能的存在。

---

## 三、功能模块清单（v1）

| 模块 | 类型 | 来源 | 说明 |
|------|------|------|------|
| cover 开屏页 | 页面型 | 老 index.html 提炼 | 品牌头 + 进入按钮，manifest 提供 logo/slogan |
| toc 目录页 | 页面型 | 老 index.html 提炼 | 按 manifest.pages 自动生成，点击直达 `?page=N` |
| drawer 侧边抽屉 | 嵌入型 | 老 slides.html 提炼 | 右侧抽屉，列出全部页缩略图 |
| pager 翻页器 | 嵌入型 | 老 slides.html 提炼 | 上一页/下一页/页码，支持 `?page=N` 深链 |
| scroller 滚动器 | 嵌入型 | 新 poster.html 已有 | 纵向滚动逐页，用于竖屏海报 |
| notes-ruler 备注尺 | 嵌入型 | 老 slides.html 提炼 | 底部时间轴刻度 + 备注标记点，演讲时查看 |
| notes-editor 备注编辑器 | 页面型 | 老 notes-editor.html 提炼 | 给指定页写备注 |
| keyboard 键盘导航 | 嵌入型 | 老 slides.html 提炼 | ←/→/空格/Home/End |
| fullscreen 全屏 | 嵌入型 | 已有 | F 键 / 点击全屏 |
| progress 进度条 | 嵌入型 | 新 poster.html 已有 | 顶部金色进度条 |

**形态 = 默认功能组合**（manifest 可覆盖）：
- `poster` 竖屏海报 → `[scroller, progress, fullscreen]`
- `presentation` 横屏演示 → `[cover, toc, drawer, pager, notes-ruler, keyboard, fullscreen]`

---

## 四、接口契约

### 功能模块注册（每个 feature 一个文件）

```js
// features/drawer.js
export default {
  id: 'drawer',
  // 壳在初始化完成后调用；api 是内核提供的唯一通信通道
  mount(api) {
    // api 提供的核心能力：
    //   api.meta          → manifest 全文
    //   api.total         → 总页数
    //   api.go(n)         → 跳转到第 n 页
    //   api.current()     → 当前页
    //   api.onPage(fn)    → 订阅翻页事件
    //   api.getNotes(p)   → 读第 p 页备注
    //   api.saveNotes(...)→ 写备注
    //   api.thumbs(n)     → 第 n 页缩略图 URL
    //   api.attach(dom)   → 把功能 UI 挂到壳的层
  },
  unmount() { /* 清理 */ }
}
```

### 设计约束

- 功能之间**禁止直接互相调用**，只通过 `api` 通信（如 drawer 跳页 = `api.go(n)`，不关心 pager 怎么实现）
- 功能 UI 必须可清理（`unmount`），保证壳可热切换功能组合
- 数据读写统一走 `api`（最终落到 server.js 的 /api/notes、/api/thumbs）
- 主题 css 只定义视觉 token 和布局骨架，**不写任何交互逻辑**

---

## 五、manifest 升级（能力声明）

```json
{
  "id": "product-roadshow-20260728",
  "title": "觅火 MIIFIRE 产品路演",
  "date": "2026-07-28",
  "type": "presentation",
  "ratio": "16:9",
  "theme": "landscape",
  "total": 21,
  "features": ["cover", "toc", "drawer", "pager", "notes-ruler", "keyboard", "fullscreen"],
  "cover": { "logo": "/runtime/assets/logo.png", "slogan": "让每一句都被看见" },
  "pages": [
    { "id": "prelude", "n": 1, "title": "开场：为什么是觅火" },
    { "id": "market",  "n": 2, "title": "市场背景" },
    { "id": "arch",    "n": 5, "title": "产品架构" }
  ]
}
```

**页面身份与顺序分离（稳定 ID 机制）：**
- `pages[].id`：**页面 ID（语义 slug，永不变）** —— 评价、引用、模板范例一律用 ID
- `pages[].n`：**页面顺序（可变）** —— 增删/插入页面时重排，ID 不动，所有引用不失效
- 文件序号（N.html）跟随 `n` 重命名，是纯机械操作

作者**不需要**：
- 写开屏页、目录页 → cover/toc 自动生成
- 维护目录链接 → pages 驱动
- 写任何功能代码 → features 勾选即可

---

## 六、老项目功能提炼清单（需求来源）

从现有实现提取，作为功能模块的第一版需求：

| 源文件 | 提炼出的模块 | 关键实现细节 |
|--------|-------------|-------------|
| `product-roadshow-20260728/slides.html` | drawer / pager / notes-ruler / keyboard | 抽屉样式、缩略图网格、备注刻度渲染、翻页逻辑、`?page=` 深链 |
| `product-roadshow-20260728/index.html` | cover / toc | 品牌头、目录双列布局、toc-item 跳转 |
| `product-roadshow-20260728/notes-editor.html` | notes-editor | 备注编辑交互 |
| 根目录 `api-server.js` + 每项目 `api-server.js` | server.js 合并 | **双服务合并为 runtime/server.js 一个**，保留 NOTES_PASSWORD 鉴权 |
| `generate-thumbs.js`（puppeteer） | 缩略图管线 | 保留独立脚本或引擎化；竖屏海报按需 |

**竖屏侧**：poster.html 已具备 `[scroller, progress, fullscreen]`，按新契约重构为 feature 组合，行为不变。

---

## 八、排版层：页面类型模板库（Layout System）

### 8.1 为什么需要这一层

做新 PPT 时，排版描述是最大的沟通成本。解决办法：**把做过的页面沉淀成"页面类型模板"**——
每类模板 = 用途说明 + DOM 骨架 + 语义 class + 变体 + **已做范例页**。
以后给 AI 的指令变成："第 3 页用「双栏对比」模板，左栏……右栏……"，AI 直接照模板产出，不用再听长篇描述。

### 8.2 竖屏海报（已有雏形 → 升级为正式规范）

`POSTER_PROJECT_CHECKLIST.md` 已定义：语义 class（`.cover/.spread/.modnum/.title.big/.rule.gold.mid/.brand` 等）、硬规则（不写死 px、容器单位、品牌栏复用、`.slide.center` 封面 / `.slide.spread` 内容页）。
**保留并升级**：补页面类型模板表 + 范例页引用（course-ip 的页作为活样本）。

### 8.3 横屏页面类型模板清单（从 product-roadshow 21 页归纳）

| 模板 | 用途 | 核心骨架 / class | 范例页 |
|------|------|-----------------|--------|
| `cover` 封面 | 开篇品牌页 | `bracket` 大括号 + `header` + `brand` + `title` + `subtitle` + `rule` | 1.html |
| `duo` 双栏对比 | 左右对照、概念对立 | `left/right` + `col/col-divider/col-rule/col-label` + `deny-row/deny-tag` | 2.html |
| `grid` 网格列表 | 多条目平铺（词、标签、卡片） | `list-grid/list-row/list-col/list-item` + `words/words-row` + `tags` + `cards/card` | 3/4.html |
| `points` 要点 | 观点/结论逐条陈列 | `points/point` + `takeaways/takeaway` + `insight` + `conclusion` + `lessons` | 5.html |
| `data` 数据页 | 数字强调、指标展示 | `data-row/data-num/data-desc` + `num` + `bar` | 数据类页 |
| `flow` 流程/链路 | 步骤、链条、演进 | `flow` + `stages/stage` + `chain/chain-item` + `arrow/arrow-block` + `pillar` | 链式页 |
| `concept` 概念定义 | 术语解释、公式 | `definition` + `term/term gold/term dim` + `formula/formula-line` + `word-card` | 概念页 |
| `quote` 引述 | 金句、案例引述 | `quote/quotes` + `q/question` + `example/examples` | 引述页 |
| `warning` 警示 | 陷阱、风险提示 | `traps/trap` + `warning` + `deny-row` | 警示页 |
| `closing` 收尾 | 总结页、落款 | `closing/closing-line` + `bottom/bottom-chain/bottom-label` + `conclusion gold` | 21.html |

### 8.4 排版层的落地形态

```
runtime/layouts/                    ← 排版模板（一份，所有 PPT 共享）
├── README.md                       ← AI 排版指令手册（模板清单 + 如何选 + 输出约束）
├── presentation/                   ← 横屏模板（每类一个文件）
│   ├── cover.md / duo.md / grid.md / points.md / data.md / flow.md ...
│   └── (每个含：DOM 骨架 + class 约定 + 变体 + 范例页链接)
└── portrait/                       ← 竖屏模板（对接 POSTER_PROJECT_CHECKLIST）
    └── cover.md / spread.md / chain.md ...
```

**给 AI 的排版指令模板（README 核心）**：
> 你正在制作 PPT 第 N 页。请使用「模板名」模板（见 runtime/layouts/…），内容如下：标题/要点/数据……
> 输出：纯内容页 HTML，只用模板规定的语义 class，不写内联样式，字号由主题控制。

### 8.5 排版层收益

- 新 PPT 排版 = 选模板 + 填内容，**不再需要长篇描述**
- 模板统一后，同一类页面风格天然一致（品牌统一性）
- 模板可迭代：优化一个模板 = 以后所有用它的页受益（样式层面；已生成页面如需同步需人工切换或约定重生成）

### 8.6 持续沉淀机制（排版知识飞轮）★

**目标：每一次排版产出/调整都沉淀为资产，模板库越用越厚，AI 越做越懂用户。**

**核心流程（固化进 AI 工作流，每次做完页面必须执行）：**

```
做页面（AI 按模板库产出） → 用户验收/提出调整 → 页面定稿
        ↓                                        ↓
   ┌─────────────────────────────────────────────┘
   │ 沉淀检查（定稿后自动执行）：
   │  ① 这页用的布局，模板库里已有 → 只登记新范例页引用（模板文件里加一行）
   │  ② 布局大体相同但用户调整了细节（间距/对齐/变体/配色）→ 在对应模板补"变体"记录
   │  ③ 布局是全新的 → 新建一个模板文件（骨架 + class + 范例页）
   │  ④ 同类页面出现了第 2/3 次新模式 → 合并归纳，升级模板
   └─────────────────────────────────────────────┘
```

**沉淀规则（写进 runtime/layouts/README.md 的 AI 指令手册）：**

1. **每次页面定稿后必做沉淀检查**，不得跳过（与"改完代码等确认"同级的工作流铁律）
2. 沉淀内容三选一：登记范例 / 补变体 / 新建模板
3. 模板文件固定结构：`用途 → DOM 骨架 → 语义 class 约定 → 变体列表 → 范例页引用列表`
4. 范例页引用必须指向真实页面（`projects/{id}/slides/N.html`），AI 可随时打开参考
5. 模板库更新后，更新 README 的模板清单索引

**沉淀产物的三类资产：**

| 资产 | 内容 | 存放 |
|------|------|------|
| 模板 | 页面类型 = 骨架 + class + 变体 + 范例 | `runtime/layouts/presentation/*.md`、`portrait/*.md` |
| 规范 | 通用硬规则（不写死 px、品牌栏复用、语义 class 优先） | `POSTER_PROJECT_CHECKLIST.md` 升级为通用《排版规范》 |
| 范例索引 | 每类模板的活样本清单 | 模板文件内范例页引用 |

**AI 做排版时的固定动作（写进指令手册）：**

```
1. 先查模板库：runtime/layouts/README.md（模板清单）+ 对应类型模板文件
2. 选定模板 → 按模板骨架产出页面
3. 找不到合适模板 → 按语义 class 规范自由排版 → 定稿后走沉淀流程新建模板
4. 涉及细节调整 → 定稿后在模板补变体
```

**飞轮效果：** 做第 1 个 PPT 靠人工描述 → 沉淀 10 个模板 → 做第 2 个 PPT 直接选模板 → 用户微调 → 再沉淀 → 第 3 个 PPT 连微调都少了 → 模板库持续增厚，沟通成本持续下降。

---

## 九、实施阶段

| 阶段 | 内容 | 产出 | 状态 |
|------|------|------|------|
| 0 | 方案确认 | 方案文档 | ✅ 完成 |
| 1 | 引擎骨架：统一壳 + feature 挂载机制 + 契约 | runtime/shell.js | ✅ 完成 |
| 2 | 横屏功能移植：drawer/pager/notes-ruler/cover/toc/keyboard + scroller/progress/fullscreen | runtime/features/ 9 个模块 | ✅ 完成 |
| 2.5 | 排版模板库（26 模板 + 自动匹配 + 偏好档案 + 稳定 ID + 形态识别） | runtime/layouts/ 全套 | ✅ 完成 |
| 2.6 | QA 校验脚本 | scripts/validate-project.js | ✅ 完成 |
| 3 | 老项目验证（manifest 已补，含 21 页 ID/标题） | 待验收：新引擎跑通横屏链路 | ⏳ 本地已验证，待用户验收 |
| 4 | 双服务合并：api-server.js 功能并入 runtime/server.js | 单一服务入口 | ⏳ 部分完成（notes API 已统一在 runtime/server.js，根 api-server.js 暂保留兼容老项目） |
| 5 | 新项目试点：用新流程 + 模板库做下一个 PPT | 首个"纯内容"项目 | ⏳ demo-landscape-20260816 已建成验证 |
| 6 | 全面切换：旧项目正式迁移，沉淀新人指南 | 迁移完成 + 文档 | ⏳ 待办 |

**贯穿原则**：每一步都可在当前步回退；老项目在验证通过前不删不改。
**2026-08-16 状态**：引擎骨架 + 全部功能模块 + 模板库 + QA 脚本已完成并通过本地端到端验证（详见 git 工作区新增文件）。

---

## 九·五、架构师审视：补充设计要点（v2 追加）

> 用户已覆盖：三层分离、稳定 ID、形态识别、模板库、自动匹配、评价沉淀。
> 以下为架构师视角的**补充盲区**，按重要性排序，全部纳入设计。

### 1. 质量校验自动化（QA 脚本）★最高优先
AI 生成页面最易犯低级错误，必须脚本化校验（`scripts/validate-project.js`）：
- manifest `total` ↔ 页面文件数一致性
- 页面引用 class ⊆ 主题 css 中的 class（class 注册表）
- 禁止 `px`、禁止内联 `<style>`、禁止 `<script>` 的正则扫描
- 品牌栏完整性检查
- （可选）puppeteer 渲染溢出检测（复用 generate-thumbs.js 基础设施）
校验纳入产出流程：**AI 产出页面 → 跑校验 → 通过才交付**。

### 2. 主题与模板的契约（class 只增不删）
- 模板引用的 class 必须存在于主题 css；新增 class 需同步进主题
- 铁律：**class 只增不改不删**，改名=新增+废弃期，避免老页面错乱
- 校验脚本检查「模板 class ⊆ 主题 class」

### 3. 评价提炼的确认反馈环
- AI 提炼偏好信号后**必须向用户确认**（"我提炼了 3 条偏好信号：①…②…③…，对吗？"）
- 用户确认后才写入 PREFERENCES.md；提炼不准是最大的污染源

### 4. 运行时数据备份
- 服务器 notes.json 定期同步回仓库（纳入部署流程或定时任务）
- PREFERENCES.md / 模板库是核心资产：随 `/ppt-push` 推送，本地与远端双份
- 无备份 = 评价/偏好丢失不可恢复

### 5. 素材边界：项目私有 vs 全局共享
- `projects/{id}/assets/`：项目私有素材（照片、配图、专属 logo）
- `runtime/assets/`：仅真正跨项目共享的公共件
- 现有 `runtime/assets/tutor-photo.png` 属于 course-ip 私有，迁移期处理

### 6. 多品牌/多主题扩展
- `theme` 字段预留品牌变体（`portrait-course` / `portrait-investor` 等）
- 需主题注册表：主题清单 + 主题与 class 契约校验
- 语义 class 层已支持，无需改动结构

### 7. 索引缓存（规模性能）
- server.js 每次请求同步扫描 projects/，项目增多会慢
- 改为启动扫描 + 文件变更刷新索引缓存

### 8. 过渡期路径（先上车）
- **模板库不依赖引擎，现在即可用**：AI 照模板产出 → 项目目录 → nginx 服务（老流程）
- 新 PPT 现在就走模板库流程，不等引擎；引擎建好后无缝切换

---

## 八、边界与注意

- PPT 引擎与觅火主应用**完全独立**，本方案不涉及觅火代码与部署
- 部署仍走 `/ppt-push` + `/ppt-deploy`；nginx.conf / docker-compose.yml 变更走觅火 `/release`（需谨慎）
- 缩略图生成（puppeteer）依赖 node_modules，属构建期工具，不进部署
- 新增功能模块 = 新增一个 feature 文件 + 在文档登记，不碰其他模块
