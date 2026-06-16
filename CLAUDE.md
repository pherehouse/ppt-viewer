# PPT Viewer - Claude 工作上下文

> 面向 Claude 的项目协作约定（与 AGENTS.md 内容应保持一致；AGENTS.md 是同一份约定，给 Codex / opencode 使用）。

## 项目

- **名称**：PPT Viewer
- **类型**：Obsidian 插件
- **本地路径**：`/Volumes/AIWS/AI_Project_OB/ppt-viewer`
- **GitHub**：`pherehouse/ppt-viewer`
- **当前版本**：1.0.0
- **当前状态**：已发布 Release，论坛提交 Pending 审核

## 关键现实

- **`main.js` 是 minified bundle（152KB，233 行）**，不是人类可读源码。项目中**没有 `package.json`、没有 esbuild 配置、没有源码目录**。之前 commit 提到 "esbuild build system"，但现在只剩 bundle 产物。
- **直接编辑 `main.js` 风险高**：变量名被压缩（如 `Rt`, `wt`, `Lt`），一处改错可能破坏整个 bundle。优先用 **精确的小范围 Edit**，改前确认上下文唯一。
- **无法重新 bundle**：没有构建配置，改完 `main.js` 只能直接用它，不能重新打包。

## 文件结构

```
ppt-viewer/
├── main.js              # minified bundle（高风险直接编辑）
├── manifest.json        # 插件清单
├── styles.css           # 样式
├── README.md            # 用户使用说明（中英文）
├── README_ZH.md
├── docs/
│   ├── publish-to-obsidian-market.md   # 发布流程指南：怎么发版、怎么提交到社区市场
│   └── PROGRESS.md                     # 项目进展：开发历史、当前状态、待办
└── tests/               # Node.js 回归测试（仅覆盖纯逻辑，不覆盖 Obsidian API）
```

**去哪找什么：**
- 要发新版 → `docs/publish-to-obsidian-market.md`
- 要看项目做到哪了、还有什么没做 → `docs/PROGRESS.md`
- 要看用户怎么用 → `README.md` / `README_ZH.md`

## 修改原则

1. **优先改 `styles.css`**：安全、无风险。
2. **改 `manifest.json`**：版本号、描述等简单字段。
3. **改 `main.js` 要谨慎**：
   - 用 Edit 做精确替换，old_string 要足够长确保唯一
   - 避免改压缩后的变量名和模块引用
   - 改完后跑 `node --check main.js` 做语法检查
   - 改完后在 Obsidian 里实际加载测试（不能只靠语法检查）
4. **不改目录结构、不加构建工具**：当前没有源码工程，加构建系统是另一回事，需用户明确要求。

## 测试

```bash
# 纯逻辑回归测试（不涉及 Obsidian API）
node tests/accurate-preview.test.js
node tests/group-transform.test.js
node tests/text-wrapping.test.js

# 语法检查（通过不代表逻辑正确）
node --check main.js
```

**重要**：`node --check` 只检查语法，不执行代码。真正的测试必须在 Obsidian 桌面端打开开发者模式加载插件验证。

## 发布流程

1. 改 `manifest.json` 中的 `version`（语义化版本）
2. 如有兼容性变化，添加/更新 `versions.json`（当前项目没有，如需要可新建）
3. commit + push
4. `git tag -a x.x.x -m "Release x.x.x" && git push origin x.x.x`
5. `gh release create x.x.x --title "PPT Viewer x.x.x" --notes "..." main.js manifest.json styles.css`
6. 论坛回复原帖或另开帖通知更新

## 调试方式

- Obsidian 桌面版 → 设置 → 第三方插件 → 关闭安全模式 → 加载 `ppt-viewer` 目录
- 开发者工具：`Ctrl/Cmd + Shift + I` 查看控制台
- 插件目录：`<vault>/.obsidian/plugins/ppt-viewer/`

## 三文档同步规则（重要）

本项目有三份顶层指南文件，必须保持同步：

| 文件 | 受众 | 角色 |
|------|------|------|
| `CLAUDE.md` | Claude | AI 协作约定 |
| `AGENTS.md` | Codex / opencode | 与 CLAUDE.md 内容相同，只是给另一类客户端 |
| `README.md` | 人（团队成员、对外） | 项目状态、团队、文件清单 |

**当你（Claude）修改 CLAUDE.md 时，必须立即同步：**

1. **AGENTS.md** —— 内容应与 CLAUDE.md 完全一致，仅文件标题、自指语句不同（CLAUDE.md 里写 "AGENTS.md 你不用读取"，AGENTS.md 里写 "CLAUDE.md 你不用读取"）。改完后用 `diff CLAUDE.md AGENTS.md` 确认仅这两处差异。
2. **README.md** —— 当改动涉及项目阶段、文件清单、目录结构时同步过去。

**当你修改项目结构（新增 / 移动 / 删除文件、改目录、改阶段）时，必须同时更新这三份文件。**

不要等用户提醒。改一份就改三份，是默认动作。

## 注意事项

- AGENTS.md 你不用读取（那是给 Codex/opencode 看的，内容与本文件一致）
