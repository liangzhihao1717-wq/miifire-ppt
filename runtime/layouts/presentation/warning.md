# warning 警示模板
> 陷阱 + 教训页：标题 + 陷阱标签组 + 教训列表（金条 + 关键词 + 说明）

## 适用场景
- "这些坑别踩"（错误做法清单）
- 风险警示 + 正确教训对照

## DOM 骨架（源自 6.html）

```html
<div class="slide">
  <a href="index.html" class="brand">...</a>
  <div class="content">
    <div class="title">标题</div>
    <div class="traps">
      <span class="trap">陷阱1</span><span class="trap">陷阱2</span><span class="trap">陷阱3</span>
    </div>
    <div class="lessons">
      <div class="lesson">
        <span class="bar"></span>
        <span class="keyword">教训关键词</span>
        <span class="text">教训说明<span class="gold">金色重点</span></span>
      </div>
      <!-- 多个 lesson -->
    </div>
  </div>
</div>
```

## class 约定
- `.traps` / `.trap`：陷阱标签（页首，强调"这些都是坑"）
- `.lessons` / `.lesson`：教训列表 = `.bar`（金条）+ `.keyword`（关键词）+ `.text`（说明，可含 `.gold`）

## 变体
- 教训条数 3-5 个；`keyword` 短、`text` 长

## 范例页
- projects/product-roadshow-20260728/6.html — 三陷阱 + 三教训

## 注意事项
- traps 与 lessons 一一对应或按顺序呼应，别混排
- 这是"负面清单 + 正面结论"的结构，结论要给出路（lesson 就是出路）
