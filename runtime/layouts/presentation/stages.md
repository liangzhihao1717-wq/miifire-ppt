# stages 阶段流程模板
> 阶段演进：导语 + 多个阶段节点（谁 + 做什么），箭头连接

## 适用场景
- 时间线/演进过程（"从 A 到 B 到 C"）
- 角色阶段分工（谁在哪个阶段做什么）

## DOM 骨架（源自 7.html）

```html
<div class="slide">
  <a href="index.html" class="brand">...</a>
  <div class="content">
    <div class="lead">导语句</div>
    <div class="divider"></div>
    <div class="stages">
      <div class="stage">
        <div class="who">阶段主体</div>
        <div class="what">做了什么<span class="gold">金色强调</span></div>
      </div>
      <div class="arrow-block"><span class="arrow">→</span></div>
      <div class="stage"><!-- 第二个阶段 --></div>
      <div class="arrow-block"><span class="arrow">→</span></div>
      <div class="stage"><!-- 第三个阶段 --></div>
    </div>
  </div>
</div>
```

## class 约定
- `.lead`：页首导语
- `.stages`：阶段容器（横向排列）
- `.stage`：阶段节点 = `.who`（主体）+ `.what`（动作/说明，可含 `.gold`）
- `.arrow-block` + `.arrow`：阶段间箭头

## 变体
- 阶段 2-5 个均可；`.what` 内容多时可加 `.gold` 突出重点
- 15.html 的 `.flow` 词链属于更轻量的横向演进（见 chain.md 变体）

## 范例页
- projects/product-roadshow-20260728/7.html — 三阶段标准版

## 注意事项
- 阶段数量超过 5 个建议换 chain 或 pipeline 类模板
- who/what 语义明确：who 是主体（人/角色），what 是动作
