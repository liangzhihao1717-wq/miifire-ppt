# 字体规范（FONTS）

## 字体分工
- **中文汉字** → `MIIFIRE Serif`（思源宋体子集）
- **数字 / 英文** → `MIIFIRE Sans`（黑体子集）
- **例外**：logo 里的字不受此约束

## 血泪教训（必读）
字体用「子集」（subset）来减小体积，但子集只覆盖**生成当时**的字符。
新增 PPT 项目用了新字 → 子集里没有 → 浏览器**静默回退到系统字体** → 字体不统一、用户察觉"有些字不是思源宋体"。

所以子集必须覆盖**足够大的字符集**（GB2312 全集 6763 字），而不是"刚好够当前项目"。

## 字体源（本机完整字体）
| 字重 | 源文件 |
|---|---|
| 400 | `~/Library/Fonts/SourceHanSerifCN-Regular.ttf` |
| 500 | `~/Library/Fonts/SourceHanSerifCN-Medium.ttf` |
| 700 | `~/Library/Fonts/SourceHanSerifCN-Bold.ttf` |

## 怎么重新生成子集
新增项目出现缺字（validate 报错）时，跑：

```bash
python3 scripts/generate-font-subset.py
```

会重新生成 `miifire-serif-{400,500,700}.woff2` + `charset.txt`（字符清单）。

## QA 自动检查
`node scripts/validate-project.js <项目目录>` 会检查项目里的中文是否都在 `charset.txt` 里，
**缺字直接报错**，从流程上拦住「字体回退不统一」的问题。

## 部署注意
新字体部署到线上后，用户端有字体缓存，需**清缓存 / 换浏览器**才能看到新字体。
