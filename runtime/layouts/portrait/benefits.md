# benefits 锚点式编号列表模板（竖屏）
> 多段信息页：每段 = 大号金色编号（垂直居中）+ 金色渐隐竖线 + 大标题 + 描述

## 适用场景
- 一页承载多段（约 4 段）信息，每段是"主标题 + 一句描述"
- 需要编号作为视觉锚点、竖线分隔的清单页（如"能给你什么""三大价值"）

## DOM 骨架（源自 agent-meet 4.html）

```html
<div class="slide center">
  <a class="brand"><img src="/runtime/assets/logo.png" alt="MIIFIRE"><span>觅火 MIIFIRE</span></a>
  <div class="title sm">标题（<span class="kw">金色关键词</span>）</div>
  <div class="rule"></div>
  <div class="benefits">
    <div class="b-item">
      <span class="b-no">01</span>
      <span class="b-line"></span>
      <div class="b-body">
        <div class="b-title">主标题<span class="kw">金色关键词</span></div>
        <div class="b-desc">描述<span class="kw">金色关键词</span></div>
      </div>
    </div>
    <!-- 多个 b-item -->
  </div>
</div>
```

## class 约定
- `.benefits`：列表容器（flex column，gap 3.6cqh，text-align left）
- `.b-item`：每段（flex row，align-items center → 编号垂直居中于整段）
- `.b-no`：大号金色编号（6cqw，text-align right，min-width 8cqw）
- `.b-line`：金色渐隐竖线（align-self stretch 撑满整段高度，上淡中亮下淡）
- `.b-body`：内容块（flex column，放标题 + 描述）
- `.b-title`：主标题（4.8cqw，暖白，金色用金属渐变）
- `.b-desc`：描述（3.4cqw，弱化，金色用纯色金 + margin 0 0.5cqw 前后留白）

## 变体
（暂无）

## 范例页
- projects/agent-meet-20260818/slides/4.html — "这场闭门会能给你什么" 4 段价值清单

## 注意事项
- 编号垂直居中于"标题 + 描述"整段（.b-item align-items: center），不是顶部对齐
- 竖线用 align-self: stretch 撑满整段高度，金色渐隐（上淡中亮下淡）
- 描述里的金色关键词前后加 margin 0 0.5cqw，避免与相邻文字堆叠
- 段数约 4 段为宜；段数再多或描述过长会溢出，考虑拆页或精简
