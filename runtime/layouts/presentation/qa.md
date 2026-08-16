# qa 问答模板
> 问题 + 答案清单页：标题 + 问题句 + 编号答案条目 + 底部收束

## 适用场景
- "如何做？"类疑问的逐条解答
- FAQ、决策清单

## DOM 骨架（源自 13.html）

```html
<div class="slide">
  <a href="index.html" class="brand">...</a>
  <div class="content">
    <div class="title"><span class="kw">关键词</span> 标题</div>
    <div class="divider"></div>
    <div class="question">问题句（大字号）</div>
    <div class="items">
      <div class="item"><span class="num">01</span><span class="kw">答案要点</span></div>
      <div class="item"><span class="num">02</span><span class="kw">答案要点</span></div>
      <!-- 多个 -->
    </div>
    <div class="bottom">底部收束文字</div>
  </div>
</div>
```

## class 约定
- `.title`：标题，可含 `.kw` 关键词
- `.question`：问题句（页面视觉焦点）
- `.items` / `.item`：答案条目 = `.num`（编号）+ `.kw`（金色要点）
- `.bottom`：页底收束
- `.divider`：金色分隔线

## 变体
- 条目可含多个 `.kw`（多关键词）
- 条目数 4-8 个均可

## 范例页
- projects/product-roadshow-20260728/13.html — 问题 + 8 条答案

## 注意事项
- question 是这一页的灵魂，字号最大
- 答案条目尽量短语化（kw 是关键词不是长句）
