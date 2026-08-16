# items 编号要点模板（竖屏）
> 编号条目页：标题 + 编号条目（n + 内容，可含关键词/补充），可带 note 和 out

## 适用场景
- 有顺序/编号的要点（步骤、特征、清单）
- 每条 = 编号 + 主内容 + 可选补充

## DOM 骨架（源自 course-ip 8.html）

```html
<div class="slide spread pos">
  <a class="brand"><img src="/runtime/assets/logo.png" alt="MIIFIRE"><span>觅火 MIIFIRE</span></a>
  <div class="title">标题<span class="modnum">08</span></div>
  <div class="subtitle">副题</div>
  <div class="rule"></div>
  <div class="note">前置说明（可选）</div>
  <div class="items">
    <div class="item">
      <span class="n">01</span>
      <span class="t">内容<span class="kw">金色关键词</span><span class="sub">补充小字</span></span>
    </div>
    <!-- 多个 item -->
  </div>
  <div class="out"><div class="label">小结标签</div><div class="val">小结内容</div></div>
</div>
```

## class 约定
- `.slide.spread` / `.slide.compact`：内容容器（compact 更紧凑）
- `.title` + `.modnum`：标题 + 页码号；`.subtitle`；`.rule`
- `.note`：页内说明
- `.items` / `.item`：条目 = `.n`（编号）+ `.t`（内容：`.kw` 关键词 + `.sub` 补充）
- `.out` = `.label` + `.val`：底部小结

## 变体
- 13/14/15.html：compact + kw/sub 密度不同；15.html 带 note
- 19.html：items + lines 混合

## 范例页
- projects/course-ip-20260809/slides/8.html — 编号条目 + out 标准版
- projects/course-ip-20260809/slides/13.html — compact 变体

## 注意事项
- 编号 n 用两位数（01、02…）
- 条数 4-8 条；内容长的用 compact
