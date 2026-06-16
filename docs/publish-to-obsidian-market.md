# 发布 Obsidian 插件到社区插件市场完整流程

> 本文档以 **PPT Viewer** 插件为例，记录从代码准备到提交审核的完整过程。

---

## 一、前置条件

在开始之前，确保你的插件满足以下要求：

### 1.1 文件结构
```
ppt-viewer/
├── main.js          # 插件主代码（必须）
├── manifest.json    # 插件清单（必须）
└── styles.css       # 样式文件（可选）
```

### 1.2 manifest.json 字段检查
```json
{
  "id": "ppt-viewer",
  "name": "PPT Viewer",
  "version": "1.0.0",
  "minAppVersion": "0.15.0",
  "description": "Preview PowerPoint (.pptx and .ppt) files directly within Obsidian.",
  "author": "pherehouse",
  "isDesktopOnly": false
}
```

**必填字段：**

| 字段 | 说明 |
|---|---|
| `id` | 插件唯一标识符，小写，不要含空格 |
| `name` | 显示名称 |
| `version` | 版本号，与 Git tag 一致 |
| `minAppVersion` | 最低支持的 Obsidian 版本 |
| `description` | 插件描述 |
| `author` | 作者名，建议和 GitHub 用户名一致 |

---

## 二、GitHub 仓库准备

### 2.1 推送到 GitHub
```bash
git remote add origin https://github.com/pherehouse/ppt-viewer.git
git push -u origin master
```

### 2.2 更新 author
确保 `manifest.json` 中的 `author` 字段与 GitHub 用户名一致：
```bash
git add manifest.json
git commit -m "Update author to pherehouse"
git push origin master
```

### 2.3 创建版本标签
版本号必须与 `manifest.json` 中的 `version` 完全一致：
```bash
git tag -a 1.0.0 -m "Release 1.0.0"
git push origin 1.0.0
```

### 2.4 创建 GitHub Release
```bash
gh release create 1.0.0 \
  --title "PPT Viewer 1.0.0" \
  --notes "Initial release of PPT Viewer." \
  main.js manifest.json styles.css
```

**注意事项：**
- Release 必须包含 `main.js` 和 `manifest.json`
- `styles.css` 如果有的话也要上传
- Obsidian 会从 Release 附件中下载这些文件安装到用户本地

---

## 三、提交到社区插件市场

### ⚠️ 重要更新：PR 路径已失效

过去开发者需要向 `obsidianmd/obsidian-releases` 仓库提交 Pull Request，**但现在已经不行了**。该仓库：
- 已关闭 Pull Request 功能
- 已关闭 Issues 功能
- 使用自动化 Workflow 从论坛拉取数据

**官方仓库的自动化机制：**
- 每小时从 `https://community.obsidian.md/assets/community-plugins.json` 拉取数据
- 自动同步到 `community-plugins.json`
- 开发者**无法通过 GitHub PR 提交**

### 3.1 正确路径：Obsidian 论坛提交

#### Step 1：注册论坛账号
- 访问 https://forum.obsidian.md
- 注册并**验证邮箱**（新用户必须验证才能发帖）

#### Step 2：进入 Plugin Developers 板块
- 访问 https://forum.obsidian.md/c/plugin-developers/8
- 点击右上角的 **+ New Topic**

#### Step 3：撰写提交帖

**标题格式：**
```
[Plugin Submission] {插件名称} - {简短描述}
```

**正文格式（参考）：**
```markdown
Hi Obsidian team and community,

I'd like to submit my plugin **PPT Viewer** to the community plugin directory.

### Plugin Details

| Field | Value |
|---|---|
| **ID** | `ppt-viewer` |
| **Name** | PPT Viewer |
| **Author** | pherehouse |
| **Repository** | [pherehouse/ppt-viewer](https://github.com/pherehouse/ppt-viewer) |
| **Description** | Preview PowerPoint (.pptx and .ppt) files directly within Obsidian. |

### Release

GitHub Release: https://github.com/pherehouse/ppt-viewer/releases/tag/1.0.0

### What it does

This plugin allows users to preview PowerPoint presentations (.pptx and .ppt) directly inside Obsidian, without needing external software.

### Manifest

```json
{
  "id": "ppt-viewer",
  "name": "PPT Viewer",
  "version": "1.0.0",
  "minAppVersion": "0.15.0",
  "description": "Preview PowerPoint (.pptx and .ppt) files directly within Obsidian.",
  "author": "pherehouse",
  "isDesktopOnly": false
}
```

Please let me know if any changes are needed. Thank you!
#### Step 4：等待审核

- **新用户首帖自动审核**：Discourse 论坛对新注册用户的第一篇帖子会进行自动审核，状态显示为 `Pending`
- **等待管理员处理**：Obsidian 团队会在 1-3 个工作日内审核并收录
- **收录后**：你的插件会出现在 Obsidian 客户端的「设置 → 社区插件」中，用户可以搜索并安装

---

## 四、发布后

### 4.1 发布社区公告（可选但推荐）
插件被收录后，可以在以下渠道宣布：
- **论坛 Showcase 区**：https://forum.obsidian.md/c/share-showcase/9
- **Discord #updates 频道**：https://discord.gg/veuWUTm（需要 `developer` 角色）

### 4.2 后续版本更新
更新插件时，重复以下步骤：
1. 更新 `manifest.json` 中的 `version`
2. 提交代码并推送
3. 创建新的 Git tag（如 `1.0.1`）
4. 创建新的 GitHub Release，上传最新文件
5. 在论坛回复原帖或开新帖通知更新（视论坛规则而定）

---

## 五、常见问题

### Q1：为什么我不能给 obsidian-releases 发 PR？
**A：** Obsidian 官方已经关闭了该仓库的 PR 功能。所有插件信息现在通过论坛提交，由官方自动化脚本拉取同步。

### Q2：论坛帖子显示 Pending 是什么意思？
**A：** 这是 Discourse 论坛对新用户首帖的自动防垃圾审核机制。审核通过后帖子会公开显示，管理员也会看到并处理你的提交。

### Q3：Release 中的文件会被 Obsidian 怎么使用？
**A：**
- `manifest.json`：用于判断最新版本号和最低 Obsidian 版本要求
- `main.js`：插件主代码
- `styles.css`：插件样式
- 用户安装时，Obsidian 会自动从 GitHub Release 下载这三个文件

### Q4：author 字段应该填什么？
**A：** 建议和 GitHub 用户名一致，这样便于用户找到你的仓库。

---

## 六、参考链接

- [Obsidian 插件开发文档](https://docs.obsidian.md/Plugins/Getting+started/Build+a+plugin)
- [提交插件官方指南](https://docs.obsidian.md/Plugins/Releasing/Submit+your+plugin)
- [开发者政策](https://docs.obsidian.md/Developer+policies)
- [Obsidian 论坛 - Plugin Developers](https://forum.obsidian.md/c/plugin-developers/8)
- [PPT Viewer GitHub 仓库](https://github.com/pherehouse/ppt-viewer)
