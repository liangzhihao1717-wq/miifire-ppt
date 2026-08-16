# cover 封面模板（竖屏）
> 竖屏海报封面：品牌 + 大标题 + 金色分割线 + 眉题 + 主视觉区 + 链条/元信息

## 适用场景
- 海报第一页（传播封面）

## DOM 骨架（源自 course-ip 1.html）

```html
<div class="slide center cover">
  <a class="brand"><img src="/runtime/assets/logo.png" alt="MIIFIRE"><span>觅火 MIIFIRE</span></a>
  <div class="title big">主标题<br><span class="thin">细体副句</span></div>
  <div class="rule gold mid"></div>
  <div class="kicker">眉题/引言</div>
  <div class="cover-main"><span class="kw">金色关键词</span></div>
  <div class="cover-lines">辅助线文案</div>
  <div class="cover-chain">链条/补充</div>
  <div class="meta">元信息（日期等）</div>
</div>
```

## class 约定
- `.slide.center.cover`：封面容器（居中）
- `.title.big`：大标题；`.thin` 细体
- `.rule.gold.mid`：金色短分割线
- `.kicker`：眉题；`.cover-main`：主视觉区；`.cover-lines`：辅助；`.cover-chain`：链条；`.meta`：元信息

## 范例页
- projects/course-ip-20260809/slides/1.html — 标准封面

## 注意事项
- 竖屏规则：不写死 px、品牌栏复用（见 POSTER_PROJECT_CHECKLIST.md）
- 封面信息层级：title.big > kicker > cover-main
