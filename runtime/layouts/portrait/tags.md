# tags 标签分组模板（竖屏）
> 标签分组页：标题 + 多个分组（组标题 + 标签组），可带 out

## 适用场景
- 分类标签展示（每个分组一堆标签）
- 分组盘点

## DOM 骨架（源自 course-ip 9.html）

```html
<div class="slide compact digs">
  <a class="brand"><img src="/runtime/assets/logo.png" alt="MIIFIRE"><span>觅火 MIIFIRE</span></a>
  <div class="title">标题<span class="modnum">09</span></div>
  <div class="subtitle">副题</div>
  <div class="rule"></div>
  <div class="section">
    <div class="tags">
      <span class="tag"><span class="t-label">标签名</span><span class="kw">关键词</span></span>
      <!-- 多个 tag -->
    </div>
  </div>
  <div class="section method">
    <div class="sh">分组标题</div>
    <div class="tags"><!-- 第二组标签 --></div>
  </div>
  <div class="out"><div class="label">小结标签</div><div class="val">小结内容</div></div>
</div>
```

## class 约定
- `.slide.compact.digs`：容器
- `.section`：分组；`.section.method` 第二类分组（`.sh` 分组标题）
- `.tags` / `.tag`：标签 = `.t-label`（标签名）+ `.kw`（金色关键词）
- `.out` = `.label` + `.val`

## 范例页
- projects/course-ip-20260809/slides/9.html — 双分组标签

## 注意事项
- 分组 1-3 个；标签 3-6 个/组
