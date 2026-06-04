# PPT Viewer - Obsidian Plugin

在 Obsidian 中直接预览 PowerPoint (.pptx) 文件，无需离开笔记应用。

Preview PowerPoint (.pptx) files directly inside Obsidian without leaving your notes.

## 功能特性 / Features

- 📄 直接在 Obsidian 中预览 PPTX 文件
- 🎨 渲染幻灯片内容：文本、图片、表格、形状
- 🌈 支持背景颜色、渐变、背景图片
- 📐 保持原始幻灯片比例，自适应窗口大小
- 📑 幻灯片导航（上一页/下一页/跳转）
- 🔄 转换为 PDF（LibreOffice 无头模式 / Python 备用方案）
- 📂 使用外部应用打开

## 安装插件 / Install Plugin

### 手动安装

1. 下载最新 [Release](https://github.com/pherehouse/ppt-viewer/releases)
2. 解压到 Obsidian 插件目录：`<vault>/.obsidian/plugins/ppt-viewer/`
3. 确保目录中包含 `main.js`、`manifest.json`、`styles.css`
4. 重启 Obsidian，在设置 → 第三方插件中启用 PPT Viewer

### 从源码构建

```bash
git clone https://github.com/pherehouse/ppt-viewer.git
cd ppt-viewer
npm install
npm run build
```

将生成的 `main.js`、`manifest.json`、`styles.css` 复制到你的 Obsidian 插件目录。

## 环境依赖安装 / Dependencies Setup

预览功能开箱即用，无需额外依赖。**PDF 转换功能**需要安装以下任一方案：

### macOS

**方案一：LibreOffice（推荐，无损转换）**

```bash
brew install --cask libreoffice
```

**方案二：Python 库（备用方案）**

```bash
pip3 install python-pptx reportlab Pillow
```

### Windows

**方案一：LibreOffice（推荐，无损转换）**

1. 前往 https://www.libreoffice.org/download/ 下载安装
2. 确保 `soffice.exe` 在系统 PATH 中，或安装到默认路径：
   - `C:\Program Files\LibreOffice\program\soffice.exe`

**方案二：Python 库（备用方案）**

```bash
pip install python-pptx reportlab Pillow
```

### Linux

```bash
# Ubuntu/Debian
sudo apt install libreoffice

# 或使用 Python 方案
pip3 install python-pptx reportlab Pillow
```

## 使用方法 / Usage

1. 将 `.pptx` 文件放入 Obsidian vault 中
2. 在文件浏览器中点击 `.pptx` 文件即可预览
3. 使用底部工具栏进行幻灯片导航
4. 点击「转为 PDF」按钮可将 PPT 转换为 PDF

## PDF 转换说明

插件会按以下顺序尝试转换：

1. **LibreOffice 无头模式**（优先）— 完全静默，保留原始字体和排版
2. **Python (python-pptx + reportlab)**（备用）— 自动安装缺失的包，支持 CJK 字体

如需正确显示中文字体（如微软雅黑），请确保系统已安装对应字体。

## 技术实现

- 基于 Obsidian FileView API 构建
- 使用 JSZip 解析 PPTX（本质为 ZIP 包含 XML）
- 使用 DOMParser 解析 OOXML 命名空间
- 固定内部分辨率 960×540px，通过 CSS transform 缩放适配
- 只渲染幻灯片自身内容（文本、图片、表格、形状），简洁清晰

## 开发 / Development

```bash
npm install
npm run dev    # 开发模式（监听文件变更）
npm run build  # 生产构建
```

### 运行时依赖
- [JSZip](https://stuk.github.io/jszip/) - 解析 PPTX 文件

### 开发依赖
- TypeScript 5.3+
- esbuild
- Obsidian API

## License

MIT
