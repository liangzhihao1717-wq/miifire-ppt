# quote 引言模板（竖屏）
> 居中引言页：眉题 + 小标题 + 金色线 + 副句

## 适用场景
- 章节过渡页、金句页、段与段之间的喘息页

## DOM 骨架（源自 course-ip 4.html）

```html
<div class="slide center hero-note">
  <a class="brand"><img src="/runtime/assets/logo.png" alt="MIIFIRE"><span>觅火 MIIFIRE</span></a>
  <div class="kicker">眉题</div>
  <div class="title sm">小标题<br><span class="kw">金色关键词</span></div>
  <div class="rule gold mid"></div>
  <div class="subtitle">副句/引文</div>
</div>
```

## class 约定
- `.slide.center.hero-note`：居中引言容器
- `.kicker`：眉题；`.title.sm`：小号标题；`.rule.gold.mid`：金色线；`.subtitle`：副句

## 范例页
- projects/course-ip-20260809/slides/4.html — 标准引言页

## 注意事项
- 一页只有一句话的力量，不要堆内容
