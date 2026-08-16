# points 要点模板
> 观点逐条陈列：副题 + 金色主标题 + 要点列表（标签 + 描述）

## 适用场景
- 核心观点/原则/结论的逐条展开
- 每条要点的"一句话标签 + 详细描述"

## DOM 骨架（源自 5.html）

```html
<div class="slide">
  <a href="index.html" class="brand">...</a>
  <div class="content">
    <div class="subtitle">副标题/眉题</div>
    <div class="title"><span class="gold">金色主标题</span></div>
    <div class="points">
      <div class="point">
        <div class="body">
          <div class="label">要点标签</div>
          <div class="desc">要点描述文字</div>
        </div>
      </div>
      <!-- 多个 point -->
    </div>
  </div>
</div>
```

## class 约定
- `.subtitle`：页首眉题（小字）
- `.title`：主标题；`.gold` 金色强调
- `.points` / `.point`：要点容器；`.point` 内 `.body` = `.label`（标签）+ `.desc`（描述）

## 变体
- 要点可加编号（`.num`）或不加，按内容密度
- 每条 point 内容多时 `.desc` 可含多个段落

## 范例页
- projects/product-roadshow-20260728/5.html — 标准要点页

## 注意事项
- 要点数 2-6 个为宜，超过建议拆页或换 grid/qa
- label 短、desc 长是本模板的节奏
