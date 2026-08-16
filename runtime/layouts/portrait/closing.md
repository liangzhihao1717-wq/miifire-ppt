# closing 收尾模板（竖屏）
> 收尾页：居中主句 + 副句

## 适用场景
- 海报最后一页（行动号召/落款）

## DOM 骨架（源自 course-ip 21.html）

```html
<div class="slide center">
  <a class="brand"><img src="/runtime/assets/logo.png" alt="MIIFIRE"><span>觅火 MIIFIRE</span></a>
  <div class="closing">
    <div class="main">主句<br><span class="kw">金色关键词</span></div>
    <div class="sub">副句/行动号召</div>
  </div>
</div>
```

## class 约定
- `.slide.center`：居中容器
- `.closing` = `.main`（主句，可含 `.kw`）+ `.sub`（副句）

## 范例页
- projects/course-ip-20260809/slides/21.html — 收尾页

## 注意事项
- 一页一句话，留白要大
