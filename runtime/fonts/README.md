# 字体规范（FONTS）

## 字体分工
- **中文汉字** → `MIIFIRE Serif`（思源宋体子集）
- **数字 / 英文** → `MIIFIRE Sans`（黑体，源是 Inter）
- **标点符号** → 宋体（黑体里不放标点）
- **例外**：logo 里的字不受此约束

## 血泪教训（四个坑，必读）

### 坑 1：子集太小 → 字体回退、不统一
字体用「子集」减小体积，但子集只覆盖**生成当时**的字符。
新增项目用了新字 → 子集没有 → 浏览器**静默回退系统字体** → 字体不统一。
**解法**：子集覆盖 GB2312 全集（6763 字）+ 所有项目字符，而不是"刚好够当前项目"。

### 坑 2：标点被黑体抢走
黑体（Inter）自带 `· – — “ ” …` 等标点，字体栈里黑体排第一，会抢走中文标点，和宋体不协调。
**解法**：黑体子集**只保留字母 + 数字 + 空格**，标点一律交给宋体。

### 坑 3：Options.flavor 对 CFF 字体不生效 → 输出 TTF 白屏
思源宋体是 CFF 轮廓（OTF），`Subsetter(Options(flavor='woff2'))` **不生效**，会输出 TTF 格式。
文件名/Content-Type 却声明 woff2 → 浏览器解析失败 → **文字全不显示**。
**解法**：subset 之后用 `font.flavor = 'woff2'` **属性**（不是 Options.flavor）。

### 坑 4：字体缓存 → 更新了用户看不到
nginx 给字体设了 30 天 + immutable 缓存，字体更新（文件名不变）用户端看不到。
**解法**：字体文件名加版本号（`.v2` / `.v3` …）做 cache-busting，文件名一变浏览器自动重新下载，无需清缓存。

## 字体源（本机完整字体）
| 字重 | 源文件 |
|---|---|
| 400 | `~/Library/Fonts/SourceHanSerifCN-Regular.ttf` |
| 500 | `~/Library/Fonts/SourceHanSerifCN-Medium.ttf` |
| 700 | `~/Library/Fonts/SourceHanSerifCN-Bold.ttf` |

## 怎么重新生成字体
```bash
python3 scripts/generate-font-subset.py
```
会重新生成宋体 + 黑体子集 + `charset.txt`（字符清单）。

**⚠️ 生成后必须做三件事**：
1. 字体文件名改版本号（`.v2` → `.v3`）；
2. 同步改 `portrait.css` 里的字体 url；
3. 重新部署 + 提交推送。

## QA 自动检查
`node scripts/validate-project.js <项目目录>` 会检查项目里的中文是否都在 `charset.txt` 里，
**缺字直接报错**，从流程上拦住「字体回退不统一」。

## 部署注意
字体更新 = 重新生成 → **改版本号** → 改 CSS url → 同步线上 → 提交推送。
改版本号后用户端**无需清缓存**（文件名变了，浏览器自动下载）。
