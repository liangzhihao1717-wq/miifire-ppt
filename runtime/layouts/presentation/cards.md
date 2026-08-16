# cards 卡片模板
> 卡片式展示：标题 + 卡片组（标签 + 描述）+ 底部模式行

## 适用场景
- 多方案/多模式对比（每个方案一张卡）
- 特点/功能分组展示

## DOM 骨架（源自 18.html）

```html
<div class="slide">
  <a href="index.html" class="brand">...</a>
  <div class="content">
    <div class="title"><span class="gold">金色标题</span></div>
    <div class="divider"></div>
    <div class="cards">
      <div class="card">
        <div class="label">卡片标题<span class="note">备注小字</span></div>
        <div class="desc">卡片描述</div>
      </div>
      <!-- 多个 card -->
    </div>
    <div class="modes">
      <span>模式1</span><span class="gold">金色模式</span><span class="sep">/</span>
      <span>模式2</span><span class="gold">金色模式</span><span class="sep">/</span>
      <!-- ... -->
    </div>
  </div>
</div>
```

## class 约定
- `.cards` / `.card`：卡片容器 = `.label`（标题，可含 `.note`）+ `.desc`（描述）
- `.modes`：底部模式行；`.sep` 分隔符；`.gold` 金色强调
- `.divider`：金色分隔线

## 变体
- 10/11.html：双栏场景卡片（`.columns` + `.col-card`，见 duo.md 的骨架）

## 范例页
- projects/product-roadshow-20260728/18.html — 双卡片 + 模式行
- projects/product-roadshow-20260728/10.html — 双场景卡片变体

## 注意事项
- 卡片数量 2-4 张为宜
- note 小字用于补充说明（如"当前版本"），不要喧宾夺主
