# lines 要点行模板（竖屏）
> 逐行要点页：标题 + 金色线 + 多行要点（关键词行），可带 out 小结

## 适用场景
- 要点逐条陈述（每条一行或两行）
- 轻量清单

## DOM 骨架（源自 course-ip 3.html）

```html
<div class="slide spread">
  <a class="brand"><img src="/runtime/assets/logo.png" alt="MIIFIRE"><span>觅火 MIIFIRE</span></a>
  <div class="title">标题<span class="modnum">03</span></div>
  <div class="subtitle">副题</div>
  <div class="rule"></div>
  <div class="lines">
    <div><span class="kw">金色要点</span> 补充文字</div>
    <div class="dim">弱化行</div>
    <div><span class="kw">要点</span></div>
    <div class="sep"></div>
    <div>...</div>
  </div>
  <div class="out"><div class="label">小结标签</div><div class="val">小结内容</div></div>
</div>
```

## class 约定
- `.slide.spread`：内容页容器
- `.title`（可含 `.modnum` 页码号）、`.subtitle`、`.rule`（金色线）
- `.lines`：行容器；行内 `.kw` 金色关键词、`.dim` 弱化、`.sep` 分隔
- `.out`：底部小结 = `.label` + `.val`

## 变体
- 5/11/18.html：行数、kw 密度不同；11.html 带 `.page-tag`
- 17.html：items + sep + lines 混合

## 范例页
- projects/course-ip-20260809/slides/3.html — 标准 lines
- projects/course-ip-20260809/slides/18.html — 密集 lines 变体

## 注意事项
- 行与行之间用 sep 分隔，不用空行
- out 小结可加可省，加了就是"列完点出结论"
