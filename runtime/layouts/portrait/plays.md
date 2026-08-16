# plays 打法卡模板（竖屏）
> 策略卡页：标题 + 打法卡片（编号 + 名称 + 内部流程箭头）

## 适用场景
- 运营/内容"打法"（策略卡 + 动作流程）
- 多方案卡片，卡内带小流程

## DOM 骨架（源自 course-ip 16.html）

```html
<div class="slide spread plays">
  <a class="brand"><img src="/runtime/assets/logo.png" alt="MIIFIRE"><span>觅火 MIIFIRE</span></a>
  <div class="title">标题<span class="modnum">16</span></div>
  <div class="subtitle">副题</div>
  <div class="rule"></div>
  <div class="note">说明</div>
  <div class="play-card play-hot">
    <div class="play-head">
      <span class="play-no">01</span>
      <span class="play-name">打法名称<span class="kw">金色词</span></span>
    </div>
    <div class="play-flow">
      <span>环节1</span><i class="arr">→</i><span>环节2</span><i class="arr">→</i><span>环节3</span>
    </div>
  </div>
  <!-- 多个 play-card；重点卡加 play-hot -->
</div>
```

## class 约定
- `.slide.spread.plays`：打法容器
- `.play-card`：卡片；`.play-hot`：重点卡（高亮）
- `.play-head` = `.play-no`（编号）+ `.play-name`（名称，可含 `.kw`）
- `.play-flow`：卡内流程：`span` 环节 + `.arr` 箭头

## 范例页
- projects/course-ip-20260809/slides/16.html — 双打法卡

## 注意事项
- 卡片 2-3 张；重点打法用 play-hot 突出
