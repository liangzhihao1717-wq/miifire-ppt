# wordgrid 词卡网格模板
> 关键词分组展示：多个分组，每组一组词卡 + 底部说明条

## 适用场景
- 术语/概念盘点（"这些词都是什么意思"）
- 分类词汇展示（每组一个主题，卡内编号 + 中文释义）

## DOM 骨架（源自 3.html）

```html
<div class="slide">
  <a href="index.html" class="brand"><img src="logo.png" alt="MIIFIRE"><span>觅火 MIIFIRE</span></a>
  <div class="content">
    <div class="words-row">
      <div class="group-block">
        <div class="words">
          <div class="word-card"><div class="num">01</div><div class="cn">词条</div></div>
          <div class="word-card"><div class="num">02</div><div class="cn">词条</div></div>
        </div>
        <div class="bar"></div>
        <div class="label">分组名</div>
      </div>
      <div class="vline"></div>
      <div class="group-block"><!-- 第二组，同上 --></div>
      <div class="vline"></div>
      <div class="group-block"><!-- 第三组 --></div>
    </div>
  </div>
</div>
```

## class 约定
- `.words-row`：横向分组容器
- `.group-block`：一个分组 = `.words`（词卡区）+ `.bar`（金色条）+ `.label`（组名）
- `.word-card`：词卡 = `.num`（编号）+ `.cn`（中文词条）
- `.vline`：分组间竖分隔线

## 变体
- 组数可 2-4 组，词卡每行 1-2 个
- 词条多时 `.word-card` 可加 `.dim` 弱化非重点词

## 范例页
- projects/product-roadshow-20260728/3.html — 三组词卡标准版

## 注意事项
- 每组词卡数量尽量一致，视觉平衡
- bar + label 在组底部，是"组名在下面"的特色，不要挪到顶部
