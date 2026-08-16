# concept 概念公式模板
> 概念/公式/推演页：标题 + 术语公式行 + 实例解释

## 适用场景
- 定义公式（A × B = C 之类）
- 概念拆解 + 举例验证

## DOM 骨架（源自 9.html）

```html
<div class="slide">
  <a href="index.html" class="brand">...</a>
  <div class="content">
    <div class="title">标题</div>
    <div class="divider"></div>
    <div class="formula">
      <span class="term">术语A</span>
      <span class="times">×</span>
      <span class="term">术语B</span>
      <span class="times">×</span>
      <span class="term">术语C</span>
    </div>
    <div class="example">
      <div class="text"><em>实例说明</em></div>
    </div>
  </div>
</div>
```

## class 约定
- `.formula`：公式行；`.term`（术语）、`.times`（乘号）
- `.example` / `.text`：实例区；`em` 斜体强调
- `.divider`：金色分隔线

## 变体
- 17.html：带 `.question`（问题）+ `.warning`（警示，`.zero` 标记）+ `.conclusion` 的完整推演页；公式中 `.term gold`（重点术语）/ `.term dim`（弱化术语）+ `.op`（运算符）
- 20.html：`.formula-line` 单行公式 + 双栏推演（见 duo.md）

## 范例页
- projects/product-roadshow-20260728/9.html — 公式 + 实例
- projects/product-roadshow-20260728/17.html — 问题 + 公式 + 警示 + 结论

## 注意事项
- 公式行是"术语 × 术语"的节奏，运算符固定用 `.times` 或 `.op`
- 术语可分级：`.term` 普通、`.term gold` 重点、`.term dim` 弱化
