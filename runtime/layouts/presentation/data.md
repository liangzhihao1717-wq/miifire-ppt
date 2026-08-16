# data 数据模板
> 数字指标页：数据行（大数字 + 描述）+ 定义 + 收尾

## 适用场景
- 核心数据/指标展示（增长、规模、比例）
- 数字 + 一句话定义的总结页

## DOM 骨架（源自 19.html）

```html
<div class="slide">
  <a href="index.html" class="brand">...</a>
  <div class="content">
    <div class="data-row">
      <span class="data-num big">大数字</span>
      <span class="data-desc">描述</span>
      <span class="data-num dim">次要数字</span>
      <span class="data-num mid">中等数字</span>
      <span class="data-desc">描述</span>
      <!-- 可多个 -->
    </div>
    <div class="definition"><span class="gold">定义金句</span></div>
    <div class="divider"></div>
    <div class="closing">收尾文字</div>
  </div>
</div>
```

## class 约定
- `.data-row`：数据行容器
- `.data-num`：数字，级别：`.big`（主角，最大）、`.mid`（中等）、`.dim`（弱化/对比）
- `.data-desc`：数字说明
- `.definition`：定义区，`.gold` 金色
- `.closing`：收尾

## 变体
- 数字带单位写在 `.data-desc` 里；对比数字用 `.dim`

## 范例页
- projects/product-roadshow-20260728/19.html — 数据行 + 定义 + 收尾

## 注意事项
- 一页最多 2-3 个 `.big` 数字，多了没有重点
- 数字层级（big/mid/dim）是本品类特色，务必用级别表达主次
