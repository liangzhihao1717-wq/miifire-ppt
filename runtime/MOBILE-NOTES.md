# 移动端兼容性规范（MOBILE NOTES）

> **功能层（引擎）的移动端铁律。任何 AI 在修改引擎（runtime/）、新增功能模块、
> 或创建新项目内容页之前，必须先读本文件。**
> 每一条规范背后都是一次真实事故（见文末事故史）。

---

## 一、滚动方案（X5 正统方案，2026-08-10 事故定案）

**移动端滚动必须使用「显式滚动容器」，禁止依赖根滚动（body/html）。**

```css
/* ✅ 正确：根滚动锁定，独立滚动容器 */
html, body { width: 100%; height: 100%; overflow: hidden; }
#scroller {
  width: 100%; height: 100%;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;   /* X5 惯性滚动必需 */
}
```

规则：
1. 滚动监听（scroll 事件、进度条）一律挂到滚动容器上，**禁止用 window.scrollY / document 滚动**
2. 微信 X5 内核（部分安卓：华为、小米等）对根滚动手势支持不可靠，显式容器是唯一可靠方案
3. 竖屏海报 = scroller 滚动容器；横屏 = pager 翻页（滚轮/触摸滑动翻页），不要混用

## 二、viewport 铁律

**禁止在内容页写 `user-scalable=no`**——X5 内核下它会禁用触摸滚动手势，
导致「iOS 正常、安卓必须双指才能滑动」事故（2026-08-10 真实事故）。

```html
<!-- ✅ 允许 -->
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<!-- ❌ 禁止 -->
<meta name="viewport" content="...user-scalable=no">
<!-- ❌ 禁止 maximum-scale=1.0（同类风险） -->
```

内容页契约：**内容页只保留 `.slide` 内容 DOM，不写 `<head>`（含 viewport）、
不写内联 `<style>`、不写 `<script>`**。引擎加载时丢弃 head，只注入 .slide。

QA 门禁：`scripts/validate-project.js` 检测到 `user-scalable=no` 直接报错（error 级）。

## 三、其他移动端要点

| 项 | 规则 |
|----|------|
| 惯性滚动 | 滚动容器必须 `-webkit-overflow-scrolling: touch` |
| 触摸翻页（横屏） | touchstart/touchend 差值 > 50px 触发翻页，注意与滚动容器事件隔离 |
| 字号单位 | 竖屏用 cqw/cqh 容器单位；横屏用 vw；**禁止写死 px** |
| 页面缩放 | 内容页不要加 PC 居中盒子（max-width + margin auto），宽度由 viewer 统一控制 |
| 全屏 | 用小程序/浏览器原生 fullscreen API，勿依赖 viewport 缩放 hack |

---

## 事故史（每条规范的来历）

| 日期 | 事故 | 根因 | 修复 |
|------|------|------|------|
| 2026-08-10 | **华为微信 X5：单指滑动失效，必须双指才能滑** | viewport `user-scalable=no` 禁用缩放 → X5 拦截单指滚动手势 | 移除 user-scalable=no（commit c612832） |
| 2026-08-10 | 滚动仍不稳（X5 根滚动不可靠） | 依赖 body 根滚动 | 显式滚动容器方案（commit 478877a） |
| 2026-08-16 | 内容页残留 user-scalable=no（隐患） | 内容页违规带 viewport meta | 清理残留 + QA 禁止规则（commit eb3b5fa） |

**原则：引擎（功能层）的能力必须可靠；内容层永远不允许用内容页 hack 覆盖引擎行为。**
