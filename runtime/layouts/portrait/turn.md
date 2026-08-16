# turn 转折对比模板（竖屏）
> 转折页：眉题 + 主句 + 转折分隔 + 做法对比（尝试列表 + 结果）

## 适用场景
- "试了很多方法都不行"的转折页（制造情绪落差）
- 否定 → 转折 → 引出正题

## DOM 骨架（源自 course-ip 2.html）

```html
<div class="slide spread">
  <a class="brand"><img src="/runtime/assets/logo.png" alt="MIIFIRE"><span>觅火 MIIFIRE</span></a>
  <div class="eyebrow">眉题</div>
  <div class="hero">主句<br><span class="kw">金色关键词</span></div>
  <div class="turn-divider"></div>
  <div class="tried">
    <div class="tried-bar">尝试过的做法</div>
    <div class="tried-items">
      <div>做法1</div><div>做法2</div><div>做法3</div><div>做法4</div>
    </div>
  </div>
  <div class="but">转折词（但是）</div>
  <div class="noresult"><span class="kw">没有结果/结论</span></div>
  <div class="noresult"><span class="kw">第二条结论</span></div>
</div>
```

## class 约定
- `.eyebrow`：眉题；`.hero`：主句（视觉焦点，可含 `.kw`）
- `.turn-divider`：转折分隔线
- `.tried` = `.tried-bar`（做法标题）+ `.tried-items`（做法列表）
- `.but`：转折连接词；`.noresult`：结果行（可含 `.kw`）

## 范例页
- projects/course-ip-20260809/slides/2.html — 转折对比标准版

## 注意事项
- 本模板是"情绪设计"页：先压低（试过都不行）再扬起（引出正题）
- noresult 是"传统做法的问题"，不是最终结论
