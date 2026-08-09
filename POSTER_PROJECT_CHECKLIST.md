# 觅火 MIIFIRE · 新建竖屏海报项目检查清单

> 每次新建一个竖屏海报（手机传播型，9:16）项目时，按此清单执行与自检。
> 横屏演示（16:9 电脑演示）走另一套，不适用本清单。

## 一、文件结构

```
projects/{project-id}/
  manifest.json          # 项目元数据（必填）
  slides/1.html          # 纯内容页，1 起编号
  slides/2.html
  ...                    # 共 manifest.total 页
  notes.json             # 演讲备注（可选，运行服务后自动生成）
```

## 二、manifest.json 字段

```json
{
  "id": "course-ip-20260809",
  "title": "海报标题",
  "date": "2026-08-09",
  "type": "poster",
  "ratio": "9:16",
  "total": 18,
  "theme": "portrait"
}
```

- `type` 必须是 `poster`（竖屏海报）；`presentation` 是横屏演示
- `theme` 必须是 `portrait`（对应 runtime/themes/portrait.css）
- `total` 必须等于 slides/ 下的页面数量

## 三、内容页硬性规则

1. 页面结构只保留 `.slide` 内容 DOM，**不写 `<head>` 样式、不写内联 `<style>`**
2. 样式全部来自 portrait.css，使用语义 class：`.modnum/.title/.subtitle/.items/.section/.out/.block/.form-grid/.chain` 等
3. 字号/间距**禁止写死 px**，由主题 cqw/cqh 容器单位控制
4. 品牌栏复用：
   ```html
   <a href="#" class="brand">
     <img src="/runtime/assets/logo.png" alt="MIIFIRE">
     <span>觅火 MIIFIRE</span>
   </a>
   ```
5. 内容页不要加 PC 居中盒子（max-width + margin auto），宽度由查看器统一控制
6. 长标题页用 `.title.sm`；封面页 `.slide.center` + `.title.big` + `.rule.gold.mid`

## 四、输出前自检清单

- [ ] 浏览器打开 `/p/{project-id}/` 正常显示（302 → poster viewer）
- [ ] 手机视口（<480px）下海报全宽、**不居左、无横向滚动**
- [ ] 电脑视口下海报 480px 居中、字号随容器缩放
- [ ] 逐页滚动：**内容不超高被裁**（每页 9:16，内容完整）
- [ ] 顶部金色进度条跟手、底部品牌落款正常
- [ ] 控制台无 JS 报错（尤其 fetch slides 全部 200）

## 五、快速验证命令

```bash
# 逐页响应检查（N 为页数）
for i in $(seq 1 N); do
  curl -s -o /dev/null -w "$i: %{http_code}\n" \
    http://localhost:8765/projects/{project-id}/slides/$i.html
done
```
