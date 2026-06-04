# PPT Viewer - Obsidian 插件

在 Obsidian 中直接预览 PowerPoint (.pptx) 文件，无需离开笔记应用。

## 功能特性

- 📄 直接在 Obsidian 中预览 PPTX 文件
- 🎨 完整渲染幻灯片内容：文本、图片、表格、形状
- 🖼️ 支持母版和版式内容继承渲染
- 🌈 支持背景颜色、渐变、背景图片
- 📐 保持原始幻灯片比例，自适应窗口大小
- 📑 幻灯片导航（上一页/下一页/跳转）
- 🔄 转换为 PDF（使用 LibreOffice 无头模式，静默无损转换）
- 📂 使用外部应用打开

## 安装

### 手动安装

1. 下载最新 [Release](https://github.com/ppt-viewer/ppt-viewer/releases)
2. 解压到 Obsidian 插件目录：`<vault>/.obsidian/plugins/ppt-viewer/`
3. 确保目录中包含 `main.js`、`manifest.json`、`styles.css`
4. 重启 Obsidian，在设置 → 第三方插件中启用 PPT Viewer

### 从源码构建

```bash
git clone https://github.com/ppt-viewer/ppt-viewer.git
cd ppt-viewer
npm install
npm run build
```

将生成的 `main.js`、`manifest.json`、`styles.css` 复制到你的 Obsidian 插件目录。

## 依赖

### 运行时依赖
- [JSZip](https://stuk.github.io/jszip/) - 解析 PPTX 文件（ZIP 格式）

### PDF 转换依赖（可选）
- [LibreOffice](https://www.libreoffice.org/) - 用于无损 PDF 转换
  ```bash
  brew install --cask libreoffice
  ```

### 开发依赖
- TypeScript 5.3+
- esbuild
- Obsidian API

## 使用方法

1. 将 `.pptx` 文件放入 Obsidian vault 中
2. 在文件浏览器中点击 `.pptx` 文件即可预览
3. 使用底部工具栏进行幻灯片导航
4. 点击「转为 PDF」按钮可将 PPT 无损转换为 PDF

## PDF 转换说明

- 使用 LibreOffice 无头模式（`--headless`），完全静默，不弹出任何窗口
- 保留原始字体、排版、样式
- 需要安装 LibreOffice（`brew install --cask libreoffice`）
- 如需正确显示中文字体（如微软雅黑），请确保系统已安装对应字体

## 技术实现

- 基于 Obsidian FileView API 构建
- 使用 JSZip 解析 PPTX（本质为 ZIP 包含 XML）
- 使用 DOMParser 解析 OOXML 命名空间
- 固定内部分辨率 960×540px，通过 CSS transform 缩放适配
- 幻灯片内容分层渲染：母版 → 版式 → 幻灯片

## 开发

```bash
# 安装依赖
npm install

# 开发模式（监听文件变更）
npm run dev

# 生产构建
npm run build
```

## License

MIT
