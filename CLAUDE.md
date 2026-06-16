# PPT Viewer - Claude 工作上下文

## 项目

- **名称**：PPT Viewer
- **类型**：Obsidian 插件
- **路径**：`/Volumes/AIWS/AI_Project_OB/ppt-viewer`
- **GitHub**：`pherehouse/ppt-viewer`
- **当前版本**：1.0.0
- **当前状态**：已发布 Release，论坛提交 Pending 审核中

## 文件结构

```
ppt-viewer/
├── main.js              # 插件主代码（bundled，直接可加载）
├── manifest.json        # 插件清单
├── styles.css           # 样式
├── README.md            # 英文文档
├── README_ZH.md         # 中文文档
├── docs/
│   ├── publish-to-obsidian-market.md   # 发布流程指南
│   └── PROGRESS.md                     # 项目进展记录
└── tests/               # 回归测试（Node.js 直接运行）
```

## 干活规则

1. **主代码是 `main.js`**：这是 bundler 打包后的直接可加载文件，不是 TypeScript 源码项目。修改时直接编辑 `main.js`。
2. **改完要更新 `manifest.json`**：特别是 `version` 字段，必须与 Git tag 一致。
3. **改完要跑测试**：
   ```bash
   node tests/accurate-preview.test.js
   node tests/group-transform.test.js
   node tests/text-wrapping.test.js
   node --check main.js
   ```
4. **发布流程**（如果需要发新版）：
   - 改 `manifest.json` version
   - commit + push
   - `git tag -a x.x.x`
   - `gh release create x.x.x main.js manifest.json styles.css`
   - 论坛回复原帖通知更新
5. **文档同步**：README、README_ZH、docs/ 里的文件改了要一起 push。
6. **最小可执行**：不要引入新构建工具或重构目录，当前项目直接维护 `main.js` 即可。
