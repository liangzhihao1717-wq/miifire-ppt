# route 路径格模板（竖屏）
> 路径九宫格页：路径头（标题+副题）+ 分隔线 + 网格单元（n + 文字）

## 适用场景
- 学习路径/成长路径/步骤地图（网格化展示）

## DOM 骨架（源自 course-ip 7.html）

```html
<div class="slide spread route">
  <a class="brand"><img src="/runtime/assets/logo.png" alt="MIIFIRE"><span>觅火 MIIFIRE</span></a>
  <div class="route-head">
    <div class="title sm">路径标题</div>
    <div class="route-sub">路径副题</div>
  </div>
  <div class="sep"></div>
  <div class="route-grid">
    <div class="cell"><span class="n">01</span><span class="t">单元文字</span></div>
    <div class="cell"><span class="n">02</span><span class="t">单元文字</span></div>
    <!-- 多个 cell，凑成网格 -->
  </div>
</div>
```

## class 约定
- `.slide.spread.route`：路径容器
- `.route-head`：头 = `.title.sm` + `.route-sub`
- `.route-grid` / `.cell`：网格单元 = `.n`（编号）+ `.t`（文字）

## 范例页
- projects/course-ip-20260809/slides/7.html — 八格路径

## 注意事项
- cell 数量与网格行列匹配（如 2×4 / 4×2），内容均衡
