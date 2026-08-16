# chain 流程链模板
> 双栏流程链：每栏一个主题的步骤链 + 金色结论，底部横向链条收束

## 适用场景
- 两条路径/逻辑链的并排展示（如"错误做法链 vs 正确做法链"）
- 步骤推演 + 结论页

## DOM 骨架（源自 4.html）

```html
<div class="slide">
  <a href="index.html" class="brand">...</a>
  <div class="content">
    <div class="top-title">顶部总标题</div>
    <div class="columns">
      <div class="col">
        <div class="col-label">栏目标题</div>
        <div class="chain">
          <div class="chain-item"><span class="arrow">→</span><span class="text">步骤文字</span></div>
          <!-- 多个 -->
        </div>
        <div class="conclusion gold">金色结论</div>
      </div>
      <div class="col"><!-- 第二栏，同上 --></div>
    </div>
    <div class="divider"></div>
    <div>
      <div class="bottom-label">底部标签</div>
      <div class="bottom-chain">
        <span class="text">环节</span><span class="arrow">→</span><span class="text">环节</span>
        <span class="dot">·</span><span class="text">环节</span><span class="dot">·</span><span class="text">环节</span>
      </div>
    </div>
  </div>
</div>
```

## class 约定
- `.top-title`：页顶总标题
- `.columns` / `.col`：双栏容器；`.col-label`：栏目标题
- `.chain` / `.chain-item`：纵向步骤链 = `.arrow`（箭头）+ `.text`
- `.conclusion`：结论行，`.gold` 金色
- `.divider`：金色分隔线（通用）
- `.bottom-label` / `.bottom-chain`：底部横向环节链（`.dot` 分隔）

## 变体
- 14.html：横向大流程（`.list-row` 多行，行间 `.row-rule` + `.arrow-right`，末尾 `.quote` 金句）
- 15.html：推演链（`.flow` 横向词链 + `.inferences` 圆点 + `.quotes` 双引句 + `.conclusion`）

## 范例页
- projects/product-roadshow-20260728/4.html — 双栏链 + 底部链标准版
- projects/product-roadshow-20260728/14.html — 横排流程变体
- projects/product-roadshow-20260728/15.html — 推演链变体

## 注意事项
- 双栏的步骤数尽量一致，结论区对齐
- 底部链条用于"全局收束"，不是每页都放
