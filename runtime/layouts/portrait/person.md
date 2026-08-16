# person 人物页模板（竖屏）
> 人物介绍页：标题行（姓名+徽章）+ 照片 + 简介 + 编号条目

## 适用场景
- 讲师/人物介绍（照片 + 履历要点）

## DOM 骨架（源自 course-ip 6.html）

```html
<div class="slide compact">
  <a class="brand"><img src="/runtime/assets/logo.png" alt="MIIFIRE"><span>觅火 MIIFIRE</span></a>
  <div class="title-row">
    <div class="name-row"><span class="name">姓名</span></div>
    <div class="sub-row"><span class="badge">徽章/头衔</span></div>
  </div>
  <img class="tutor-photo" src="...">
  <div class="bio">个人简介</div>
  <div class="sep"></div>
  <div class="items">
    <div class="item"><span class="n">01</span><span class="t">履历点<span class="kw">金色关键词</span></span></div>
    <!-- 多个 -->
  </div>
</div>
```

## class 约定
- `.slide.compact`：紧凑容器
- `.title-row` = `.name-row`（`.name` 姓名）+ `.sub-row`（`.badge` 徽章）
- `.tutor-photo`：照片；`.bio`：简介
- `.items` / `.item`：履历条目 = `.n` + `.t`（可含 `.kw`）

## 范例页
- projects/course-ip-20260809/slides/6.html — 讲师页

## 注意事项
- 照片用 runtime/assets/tutor-photo.png 或项目自有素材
- 履历点 3-6 条
