# cover 封面模板
> 横屏演示的开篇页：品牌 + 主标题 + 要点网格预告

## 适用场景
PPT 第一页；或需要"品牌亮相 + 内容预告"的开场页。

## DOM 骨架

```html
<div class="slide">
  <a href="index.html" class="brand"><img src="logo.png" alt="MIIFIRE"><span>觅火 MIIFIRE</span></a>
  <div class="content">
    <div class="header">
      <div class="title">主标题（可换行）</div>
      <div class="tags">
        <span><span class="bracket">「</span><span class="keyword">关键词</span><span class="bracket">」</span><span class="suffix">后缀说明</span></span>
        <!-- 可多组 -->
      </div>
    </div>
    <div class="rule"></div>
    <div class="list-grid">
      <div class="list-col">
        <div class="list-item"><span class="num">01</span><span class="text">要点文字</span></div>
        <!-- 多个 -->
      </div>
      <div class="col-rule"></div>
      <div class="list-col"><!-- 第二列，同上 --></div>
    </div>
  </div>
</div>
```

## class 约定
- `.brand`：左上品牌栏（所有页通用）
- `.content`：内容容器（所有页通用）
- `.header` + `.title`：主标题区
- `.tags`：关键词标签组；`.bracket`（「」装饰）、`.keyword`（金色关键词）、`.suffix`（普通后缀）
- `.rule`：金色分隔线
- `.list-grid`：多列网格；`.list-col` 列、`.col-rule` 列间分隔线
- `.list-item`：单条 = `.num`（编号）+ `.text`（文字）

## 变体
- 无预告网格的极简封面：去掉 `.list-grid`，`.header` 居中放大即可

## 范例页
- projects/product-roadshow-20260728/1.html — 标准三列预告封面

## 注意事项
- 封面是整个 PPT 的第一印象，标题层级要突出
- 关键词用 bracket 包裹是本品类特色，不要丢
