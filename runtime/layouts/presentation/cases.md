# cases 案例模板
> 案例列表页：标题 + 案例条目（纯文字）+ 可选结论

## 适用场景
- 案例盘点（"看几个例子"）
- 例证 + 小结

## DOM 骨架（源自 8.html）

```html
<div class="slide">
  <a href="index.html" class="brand">...</a>
  <div class="content">
    <div class="title">标题</div>
    <div class="examples">
      <div class="example"><div class="text">案例内容</div></div>
      <div class="example"><div class="text">案例内容</div></div>
      <div class="example"><div class="text">案例内容</div></div>
    </div>
    <div class="divider"></div>
    <div class="conclusion"><em>结论金句</em></div>
  </div>
</div>
```

## class 约定
- `.examples` / `.example`：案例容器；`.text` 案例正文
- `.divider`：金色分隔线
- `.conclusion`：结论区；`em` 斜体

## 变体
- 12.html：examples 分成两段（中间 `.divider` 分隔不同类别的案例）+ `.conclusion`

## 范例页
- projects/product-roadshow-20260728/8.html — 案例列表
- projects/product-roadshow-20260728/12.html — 分组案例 + 结论

## 注意事项
- 案例多时用 `.divider` 分组，不要一坨
- 结论可加可省；有结论时是"案例 → 升华"的节奏
