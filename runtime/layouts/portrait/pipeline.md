# pipeline 管道模板（竖屏）
> 管道步骤页：标题 + 纵向管道步骤（线 + 编号 + 内容）

## 适用场景
- 流水线/流程步骤（纵向管道感）
- 环节递进（如内容生产的各环节）

## DOM 骨架（源自 course-ip 20.html）

```html
<div class="slide spread pipeline">
  <a class="brand"><img src="/runtime/assets/logo.png" alt="MIIFIRE"><span>觅火 MIIFIRE</span></a>
  <div class="title">标题<span class="modnum">20</span></div>
  <div class="subtitle">副题</div>
  <div class="rule"></div>
  <div class="note">说明（可选）</div>
  <div class="pipe">
    <div class="step">
      <div class="step-line"></div>
      <div class="step-no">01</div>
      <div class="step-body"><div class="step-t">步骤内容<span class="kw">金色关键词</span></div></div>
    </div>
    <!-- 多个 step -->
  </div>
</div>
```

## class 约定
- `.slide.spread.pipeline`：管道容器
- `.pipe` / `.step`：步骤 = `.step-line`（连接线）+ `.step-no`（编号）+ `.step-body`（`.step-t` 内容，可含 `.kw`）

## 范例页
- projects/course-ip-20260809/slides/20.html — 四步管道

## 注意事项
- 步骤 3-6 个；step-line 自动连接，保持纵向连续感
