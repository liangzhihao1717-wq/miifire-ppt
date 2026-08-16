# duo 双栏对比模板
> 左右对照布局：左侧观点/标签 + 右侧支柱数据；或左右场景对比

## 适用场景
- 概念对立（"不是什么 vs 是什么"）
- 左右场景/模式对比（A 场景 vs B 场景）
- 左侧论点 + 右侧支撑数据

## DOM 骨架（观点+支柱变体，源自 2.html）

```html
<div class="slide">
  <a href="index.html" class="brand"><img src="logo.png" alt="MIIFIRE"><span>觅火 MIIFIRE</span></a>
  <div class="content">
    <div class="left">
      <div class="deny-row">
        <span class="deny-tag">排除标签1</span><span class="deny-tag">排除标签2</span>
      </div>
      <h1>主观点<br><em>强调部分</em></h1>
      <div class="sub"><strong>副说明</strong></div>
    </div>
    <div class="right">
      <div class="pillar"><div class="num">数字/编号</div><div class="word">说明词</div></div>
      <!-- 支柱可多个 -->
    </div>
  </div>
</div>
```

## DOM 骨架（双栏场景卡片变体，源自 10/11.html）

```html
<div class="slide">
  <a href="index.html" class="brand">...</a>
  <div class="columns">
    <div class="col-card">
      <div class="scene-name">场景名</div>
      <div class="field"><div class="label">标签</div><div class="text">内容</div></div>
      <div class="field"><div class="label">标签</div><div class="sell">卖点/亮点</div></div>
    </div>
    <div class="col-divider"></div>
    <div class="col-card"><!-- 第二个场景，同上 --></div>
  </div>
</div>
```

## class 约定
- `.left` / `.right`：左右两栏
- `.deny-row` / `.deny-tag`：排除式小标签（表示"不是这些"）
- `.pillar`：支柱单元 = `.num`（数字）+ `.word`（词）
- `.columns` / `.col` / `.col-card` / `.col-divider`：通用双栏容器
- `.scene-name`：场景标题；`.field` 字段 = `.label` + `.text`；`.sell`：金色卖点
- `.sub`：副标题；`em` 斜体强调

## 变体
- 16.html：双栏列表（`.col` 内 `.item` = `.gold` + `.arrow` + 文字）
- 20.html：上 trait 下双栏推演（`.trait` + `.cols` 内 `.insight` / `.formula-line` + `.golden` 金色总结）

## 范例页
- projects/product-roadshow-20260728/2.html — 排除标签 + 支柱对比
- projects/product-roadshow-20260728/10.html — 双场景卡片
- projects/product-roadshow-20260728/16.html — 双栏箭头列表
- projects/product-roadshow-20260728/20.html — 双栏推演

## 注意事项
- 两栏内容量要均衡，避免一栏挤一栏空
- deny-tag 用于"用户已有的错误认知"，不要滥用
