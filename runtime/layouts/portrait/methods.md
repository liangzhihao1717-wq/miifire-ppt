# methods 方法选择模板（竖屏）
> 方法列表页：页标 + 标题 + 方法条目（编号 + 标签 + 名称）

## 适用场景
- 多个方法/选项的横向选择（"三个方法选一个"）
- 方法盘点

## DOM 骨架（源自 course-ip 10.html）

```html
<div class="slide spread pick">
  <a class="brand"><img src="/runtime/assets/logo.png" alt="MIIFIRE"><span>觅火 MIIFIRE</span></a>
  <div class="page-tag">页标</div>
  <div class="title">标题<span class="modnum">10</span></div>
  <div class="subtitle">副题</div>
  <div class="rule"></div>
  <div class="methods">
    <div class="m-head">方法区头</div>
    <div class="method">
      <span class="m-no">01</span>
      <div class="m-body">
        <span class="m-label">方法标签</span>
        <span class="m-name">方法名称<span class="kw">金色关键词</span></span>
      </div>
    </div>
    <!-- 多个 method -->
  </div>
</div>
```

## class 约定
- `.slide.spread.pick`：选择容器
- `.page-tag`：页标
- `.methods` / `.method`：方法条目 = `.m-no`（编号）+ `.m-body`（`.m-label` 标签 + `.m-name` 名称，可含 `.kw`）

## 范例页
- projects/course-ip-20260809/slides/10.html — 三方法选择

## 注意事项
- 方法 2-4 个；label 是"类型"，name 是"具体名"
