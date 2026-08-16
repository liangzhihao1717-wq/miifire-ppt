# closing 收尾模板
> 总结页：标题 + 关键收获列表（编号 + 金句）+ 收尾线

## 适用场景
- PPT 最后一页：全篇总结
- "核心收获 / 记住这几点"

## DOM 骨架（源自 21.html）

```html
<div class="slide">
  <a href="index.html" class="brand">...</a>
  <div class="content">
    <div class="title">总结标题</div>
    <div class="divider"></div>
    <div class="takeaways">
      <div class="takeaway">
        <span class="num">01</span>
        <span class="text">收获文字<span class="gold">金色重点</span></span>
      </div>
      <!-- 多个 takeaway -->
    </div>
    <div class="closing-line">收尾金句/品牌落款</div>
  </div>
</div>
```

## class 约定
- `.takeaways` / `.takeaway`：收获条目 = `.num`（编号）+ `.text`（内容，可含 `.gold`）
- `.closing-line`：页尾收束线
- `.divider`：金色分隔线

## 变体
- 收获 3-5 条；最后一条常是行动号召

## 范例页
- projects/product-roadshow-20260728/21.html — 四收获 + 收尾线

## 注意事项
- 收尾页不要塞新信息，只总结 + 行动号召
- closing-line 是品牌落款位，保留
