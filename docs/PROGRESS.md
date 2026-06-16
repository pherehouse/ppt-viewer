# PPT Viewer 项目进展

## 项目概述

**PPT Viewer** 是一个 Obsidian 插件，支持在 Obsidian 内直接预览 `.pptx` 和 `.ppt` 文件，无需打开外部软件。

- **仓库地址**：https://github.com/pherehouse/ppt-viewer
- **作者**：pherehouse
- **当前版本**：1.0.0

---

## 开发历程

### 阶段一：项目初始化

| 时间 | 提交 | 说明 |
|---|---|---|
| 早期 | `0660a35` | 使用 esbuild 构建系统初始化 PPT Viewer 插件 |
| 早期 | `e97dd2a` | 修改为简单版本 |
| 早期 | `7542444` | 更新 README |
| 早期 | `bbe130c` | 初步版本完成 |

### 阶段二：功能完善

| 时间 | 提交 | 说明 |
|---|---|---|
| 近期 | `be2a01f` | 修改完善渲染问题，插件可正常使用 |

**主要功能实现：**
- ✅ 高精度预览（Accurate Preview）：通过 LibreOffice + Poppler 将 PPT 转为 PDF 再渲染为 PNG
- ✅ HTML 降级预览（HTML Fallback）：直接解析 PPTX 的 XML 结构，用 HTML/CSS 渲染
- ✅ 缓存机制：PDF 和 PNG 页面缓存到系统临时目录，重复打开更快
- ✅ 首页优先渲染：先渲染第一页展示，后台渲染剩余页面
- ✅ 工具栏折叠、全屏预览、外部打开、导出 PDF
- ✅ 支持基础文本、图片、形状、表格、背景、组合形状变换

### 阶段三：准备发布

| 时间 | 提交 | 说明 |
|---|---|---|
| 2026-06-16 | `ba65290` | 更新 `manifest.json` 的 `author` 为 `pherehouse` |
| 2026-06-16 | — | 创建 Git tag `1.0.0` 并推送 |
| 2026-06-16 | — | 创建 [GitHub Release v1.0.0](https://github.com/pherehouse/ppt-viewer/releases/tag/1.0.0)，上传 `main.js`、`manifest.json`、`styles.css` |

### 阶段四：提交社区市场

| 时间 | 事件 | 状态 |
|---|---|---|
| 2026-06-16 | 尝试向 `obsidianmd/obsidian-releases` 提交 PR | ❌ 失败，官方已关闭 PR 功能 |
| 2026-06-16 | 调研发现官方改为通过论坛自动化拉取数据 | 🔍 确认新流程 |
| 2026-06-16 | 在 [Obsidian 论坛](https://forum.obsidian.md/c/plugin-developers/8) 发布插件提交帖 | ⏳ **Pending 审核中** |

### 阶段五：文档完善

| 时间 | 提交 | 说明 |
|---|---|---|
| 2026-06-16 | `e0c50f4` | 新增 `docs/publish-to-obsidian-market.md`，记录发布流程 |
| 2026-06-16 | `ce9e666` | README 顶部添加 GitHub 仓库链接 |
| 2026-06-16 | — | 新建 `docs/PROGRESS.md`（本文件），记录项目进展 |

---

## 当前状态

- **代码状态**：功能完整，已发布 Release
- **市场收录**：论坛提交帖 Pending，等待 Obsidian 团队审核
- **后续待办**：
  - [ ] 论坛审核通过后，插件正式上线社区市场
  - [ ] 可在论坛 Showcase 区和 Discord #updates 频道发布公告
  - [ ] 根据用户反馈迭代功能

---

## 技术栈

- Obsidian Plugin API
- JavaScript
- JSZip（读取 PPTX zip 结构）
- DOMParser（解析 PPTX XML）
- HTML/CSS（降级渲染器）
- LibreOffice headless（高精度 PDF 转换）
- Poppler `pdftoppm`（PDF 转 PNG）

## 文件结构

```text
ppt-viewer/
├── main.js                  # 插件主代码（bundled）
├── manifest.json            # 插件清单
├── styles.css               # 插件样式
├── README.md                # 英文文档
├── README_ZH.md             # 中文文档
├── docs/
│   ├── publish-to-obsidian-market.md   # 发布流程指南
│   └── PROGRESS.md                     # 项目进展（本文件）
└── tests/
    ├── accurate-preview.test.js
    ├── group-transform.test.js
    └── text-wrapping.test.js
```
