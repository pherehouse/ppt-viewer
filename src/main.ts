import { Plugin, FileView, WorkspaceLeaf, TFile, Notice } from "obsidian";
import JSZip from "jszip";

const VIEW_TYPE_PPT = "ppt-view";

// EMU conversion helpers
const EMU_PER_INCH = 914400;
// Standard slide dimensions (widescreen 16:9)
const SLIDE_WIDTH_EMU = 12192000;
const SLIDE_HEIGHT_EMU = 6858000;

// Fixed internal resolution for rendering
const INTERNAL_WIDTH = 960;
const INTERNAL_HEIGHT = 540;

interface SlideElement {
  type: "text" | "image" | "shape";
  x: number; // pixels (based on internal resolution)
  y: number; // pixels (based on internal resolution)
  width: number; // pixels (based on internal resolution)
  height: number; // pixels (based on internal resolution)
  content: string;
  fontSize?: number;
  fontBold?: boolean;
  fontItalic?: boolean;
  fontColor?: string;
  fillColor?: string;
  paragraphs?: ParagraphInfo[];
}

interface ParagraphInfo {
  alignment?: string;
  runs: RunInfo[];
}

interface RunInfo {
  text: string;
  bold?: boolean;
  italic?: boolean;
  fontSize?: number;
  color?: string;
}

interface SlideData {
  elements: SlideElement[];
  background?: string;
}

export default class PPTViewerPlugin extends Plugin {
  async onload() {
    this.registerView(VIEW_TYPE_PPT, (leaf) => new PPTView(leaf));
    this.registerExtensions(["pptx", "ppt"], VIEW_TYPE_PPT);
  }

  onunload() {}
}

class PPTView extends FileView {
  private container: HTMLElement;
  private slides: SlideData[] = [];
  private currentSlide = 0;
  private zip: JSZip | null = null;
  private mediaCache: Map<string, string> = new Map();
  private relationships: Map<string, Map<string, string>> = new Map();
  private slideWidth = SLIDE_WIDTH_EMU;
  private slideHeight = SLIDE_HEIGHT_EMU;
  private resizeObserver: ResizeObserver | null = null;

  constructor(leaf: WorkspaceLeaf) {
    super(leaf);
    this.container = this.contentEl.createDiv({ cls: "ppt-viewer-container" });
  }

  getViewType(): string {
    return VIEW_TYPE_PPT;
  }

  getDisplayText(): string {
    return this.file?.basename || "PPT Viewer";
  }

  getIcon(): string {
    return "presentation";
  }

  async onLoadFile(file: TFile): Promise<void> {
    this.container.empty();
    this.slides = [];
    this.currentSlide = 0;
    this.mediaCache.clear();
    this.relationships.clear();

    try {
      const data = await this.app.vault.readBinary(file);
      await this.parsePPTX(data);
      this.renderUI();
    } catch (e) {
      this.renderError(e as Error);
    }
  }

  async onUnloadFile(): Promise<void> {
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
      this.resizeObserver = null;
    }
    this.container.empty();
    this.slides = [];
    this.zip = null;
    this.mediaCache.clear();
  }

  private async parsePPTX(data: ArrayBuffer): Promise<void> {
    this.zip = await JSZip.loadAsync(data);

    // Log all files in ZIP for debugging
    console.log('[PPT Viewer] ZIP contents:');
    this.zip.forEach((relativePath) => {
      if (relativePath.includes('media') || relativePath.includes('rels') || relativePath.includes('slide')) {
        console.log(`  ${relativePath}`);
      }
    });

    // Parse presentation.xml to get slide dimensions and slide list
    const presentationXml = await this.getFileContent("ppt/presentation.xml");
    if (!presentationXml) {
      throw new Error("Invalid PPTX file: missing presentation.xml");
    }

    this.parseSlideDimensions(presentationXml);

    // Parse presentation relationships to get slide file paths
    const presRels = await this.getFileContent("ppt/_rels/presentation.xml.rels");
    const slideFiles = this.getSlideFilesFromPresentation(presentationXml, presRels || "");

    // Parse each slide
    for (const slideFile of slideFiles) {
      const slideXml = await this.getFileContent(`ppt/${slideFile}`);
      if (!slideXml) continue;

      // Parse slide relationships for images
      // slideFile is like "slides/slide1.xml"
      const slideBasename = slideFile.split('/').pop(); // "slide1.xml"
      const slideRelsPath = `ppt/slides/_rels/${slideBasename}.rels`;
      let slideRels = await this.getFileContent(slideRelsPath);
      // Fallback: try alternative path format
      if (!slideRels) {
        slideRels = await this.getFileContent(`ppt/${slideFile.replace(/([^/]+)$/, '_rels/$1.rels')}`);
      }
      if (slideRels) {
        this.parseRelationships(slideFile, slideRels);
      }

      const slideData = await this.parseSlide(slideXml, slideFile);
      this.slides.push(slideData);
    }

    if (this.slides.length === 0) {
      throw new Error("No slides found in the presentation.");
    }
  }

  private parseXml(xmlString: string): Document {
    const parser = new DOMParser();
    return parser.parseFromString(xmlString, 'application/xml');
  }

  // General element lookup (works for unique element names)
  private getElements(parent: Element | Document, localName: string): HTMLCollectionOf<Element> {
    return parent.getElementsByTagNameNS('*', localName);
  }

  // Drawing ML specific (for short names like p, r, t that might collide)
  private getDrawingElements(parent: Element | Document, localName: string): HTMLCollectionOf<Element> {
    const NS = 'http://schemas.openxmlformats.org/drawingml/2006/main';
    const result = parent.getElementsByTagNameNS(NS, localName);
    // Fallback to wildcard if specific NS finds nothing (compatibility)
    if (result.length === 0) {
      return parent.getElementsByTagNameNS('*', localName);
    }
    return result;
  }
  
  private parseSlideDimensions(xml: string): void {
    const doc = this.parseXml(xml);
    const sldSz = this.getElements(doc, 'sldSz')[0];
    if (sldSz) {
      const cx = sldSz.getAttribute('cx');
      const cy = sldSz.getAttribute('cy');
      if (cx) this.slideWidth = parseInt(cx);
      if (cy) this.slideHeight = parseInt(cy);
    }
  }
  
  private getSlideFilesFromPresentation(presXml: string, relsXml: string): string[] {
    const slideFiles: string[] = [];
    const relMap = new Map<string, string>();
  
    // Parse relationships using DOMParser
    const relsDoc = this.parseXml(relsXml);
    const relationships = this.getElements(relsDoc, 'Relationship');
    for (let i = 0; i < relationships.length; i++) {
      const rel = relationships[i];
      const id = rel.getAttribute('Id');
      const target = rel.getAttribute('Target');
      if (id && target) {
        relMap.set(id, target);
      }
    }
  
    // Parse slide references from presentation.xml in order
    const presDoc = this.parseXml(presXml);
    const sldIds = this.getElements(presDoc, 'sldId');
    for (let i = 0; i < sldIds.length; i++) {
      const rId = sldIds[i].getAttribute('r:id');
      if (rId) {
        const target = relMap.get(rId);
        if (target) {
          slideFiles.push(target.replace(/^\//, ""));
        }
      }
    }
  
    // Fallback: if no slides found via relationships, search the zip
    if (slideFiles.length === 0) {
      const slidePattern = /^ppt\/slides\/slide(\d+)\.xml$/;
      const entries: { name: string; num: number }[] = [];
      this.zip?.forEach((path) => {
        const m = path.match(slidePattern);
        if (m) {
          entries.push({ name: path.replace("ppt/", ""), num: parseInt(m[1]) });
        }
      });
      entries.sort((a, b) => a.num - b.num);
      return entries.map((e) => e.name);
    }
  
    return slideFiles;
  }
  
  private parseRelationships(slideFile: string, relsXml: string): void {
    const relMap = new Map<string, string>();
    const doc = this.parseXml(relsXml);
    const relationships = this.getElements(doc, 'Relationship');
    for (let i = 0; i < relationships.length; i++) {
      const rel = relationships[i];
      const id = rel.getAttribute('Id');
      const target = rel.getAttribute('Target');
      if (id && target) {
        relMap.set(id, target);
      }
    }
    this.relationships.set(slideFile, relMap);
    console.log(`[PPT Viewer] Parsed ${relMap.size} relationships for ${slideFile}`);
  }
  
  private async parseSlide(xml: string, slideFile: string): Promise<SlideData> {
    const elements: SlideElement[] = [];
    let background: string | undefined;
  
    const doc = this.parseXml(xml);
  
    // Parse background
    const bgEl = this.getElements(doc, 'bg')[0];
    if (bgEl) {
      const bgPr = this.getElements(bgEl, 'bgPr')[0];
      if (bgPr) {
        // Solid fill
        const solidFill = this.getElements(bgPr, 'solidFill')[0];
        if (solidFill) {
          const srgbClr = this.getElements(solidFill, 'srgbClr')[0];
          if (srgbClr) {
            const val = srgbClr.getAttribute('val');
            if (val) background = `#${val}`;
          }
        }

        // Background image (blipFill)
        if (!background) {
          const blipFill = this.getElements(bgPr, 'blipFill')[0];
          if (blipFill) {
            const blip = this.getElements(blipFill, 'blip')[0];
            if (blip) {
              const rId = blip.getAttribute('r:embed')
                || blip.getAttributeNS('http://schemas.openxmlformats.org/officeDocument/2006/relationships', 'embed');
              if (rId) {
                const relMap = this.relationships.get(slideFile);
                if (relMap) {
                  const imagePath = relMap.get(rId);
                  if (imagePath) {
                    const fullPath = this.resolveMediaPath(slideFile, imagePath);
                    const imageData = await this.getImageAsBase64(fullPath);
                    if (imageData) {
                      background = imageData;
                    }
                  }
                }
              }
            }
          }
        }

        // Gradient fill
        if (!background) {
          const gradFill = this.getElements(bgPr, 'gradFill')[0];
          if (gradFill) {
            const gsLst = this.getElements(gradFill, 'gs');
            if (gsLst.length >= 2) {
              const colors: string[] = [];
              for (let i = 0; i < gsLst.length; i++) {
                const srgb = this.getElements(gsLst[i], 'srgbClr')[0];
                if (srgb) {
                  const val = srgb.getAttribute('val');
                  if (val) colors.push(`#${val}`);
                }
              }
              if (colors.length >= 2) {
                background = `linear-gradient(180deg, ${colors.join(', ')})`;
              }
            }
          }
        }
      }

      // Also check <p:bgRef> (reference to theme background)
      if (!background) {
        const bgRef = this.getElements(bgEl, 'bgRef')[0];
        if (bgRef) {
          const srgbClr = this.getElements(bgRef, 'srgbClr')[0];
          if (srgbClr) {
            const val = srgbClr.getAttribute('val');
            if (val) background = `#${val}`;
          }
        }
      }

      // Also handle bgFillStyleRef (common in theme-based backgrounds)
      if (!background) {
        const bgFillRef = this.getElements(bgEl, 'bgFillStyleRef')[0];
        if (bgFillRef) {
          const srgbClr = this.getElements(bgFillRef, 'srgbClr')[0];
          if (srgbClr) {
            const val = srgbClr.getAttribute('val');
            if (val && val !== '000000') background = `#${val}`;
          }
        }
      }
    }

    console.log(`[PPT Viewer] Slide ${slideFile}: bg element exists=${!!bgEl}, background resolved=${!!background}`);

    // If no background found on slide, check slide layout/master
    if (!background) {
      background = await this.getLayoutOrMasterBackground(slideFile);
    }

    // If still no background, try theme
    if (!background) {
      background = await this.getThemeBackground(slideFile);
    }
  
    // Parse shape tree
    const spTree = this.getElements(doc, 'spTree')[0];
    if (!spTree) return { elements, background };
  
    // Parse shapes (text boxes and shapes)
    const shapes = this.getElements(spTree, 'sp');
    for (let i = 0; i < shapes.length; i++) {
      const el = this.parseShapeElement(shapes[i]);
      if (el) elements.push(el);
    }
  
    // Parse pictures
    const pics = this.getElements(spTree, 'pic');
    for (let i = 0; i < pics.length; i++) {
      const el = await this.parsePictureElement(pics[i], slideFile);
      if (el) elements.push(el);
    }
  
    // Parse graphic frames (tables, charts, etc.)
    const graphicFrames = this.getElements(spTree, 'graphicFrame');
    for (let i = 0; i < graphicFrames.length; i++) {
      const el = await this.parseGraphicFrame(graphicFrames[i], slideFile);
      if (el) elements.push(el);
    }

    // Parse group shapes - get shapes and pics inside groups
    const grpSps = this.getElements(spTree, 'grpSp');
    for (let i = 0; i < grpSps.length; i++) {
      const groupElements = await this.parseGroupShape(grpSps[i], slideFile);
      elements.push(...groupElements);
    }

    // Get inherited shapes from layout (middle z-layer) and master (lowest z-layer)
    const masterShapes = await this.getMasterShapes(slideFile);
    const layoutShapes = await this.getLayoutShapes(slideFile);

    // Order: master (back) -> layout (middle) -> slide (front)
    return { elements: [...masterShapes, ...layoutShapes, ...elements], background };
  }

  private hasPlaceholder(spEl: Element): boolean {
    const nvSpPr = this.getElements(spEl, 'nvSpPr')[0];
    if (!nvSpPr) return false;
    const nvPr = this.getElements(nvSpPr, 'nvPr')[0];
    if (!nvPr) return false;
    // Check direct children for <p:ph> (avoid descendants from grandchildren)
    for (let i = 0; i < nvPr.children.length; i++) {
      const child = nvPr.children[i];
      if (child.localName === 'ph') return true;
    }
    return false;
  }

  private async loadRelsFor(fileKey: string): Promise<void> {
    // fileKey is relative to ppt/, like "slideLayouts/slideLayout1.xml"
    if (this.relationships.has(fileKey)) return;
    const basename = fileKey.split('/').pop();
    const dir = fileKey.substring(0, fileKey.lastIndexOf('/'));
    const relsPath = `ppt/${dir}/_rels/${basename}.rels`;
    const relsXml = await this.getFileContent(relsPath);
    if (relsXml) {
      this.parseRelationships(fileKey, relsXml);
    } else {
      // Set empty map so we don't retry
      this.relationships.set(fileKey, new Map());
    }
  }

  private async parseShapeTreeFor(fileKey: string, spTree: Element, skipPlaceholders: boolean): Promise<SlideElement[]> {
    const elements: SlideElement[] = [];

    const shapes = this.getElements(spTree, 'sp');
    for (let i = 0; i < shapes.length; i++) {
      if (skipPlaceholders && this.hasPlaceholder(shapes[i])) continue;
      const el = this.parseShapeElement(shapes[i]);
      if (el) elements.push(el);
    }

    const pics = this.getElements(spTree, 'pic');
    for (let i = 0; i < pics.length; i++) {
      const el = await this.parsePictureElement(pics[i], fileKey);
      if (el) elements.push(el);
    }

    const graphicFrames = this.getElements(spTree, 'graphicFrame');
    for (let i = 0; i < graphicFrames.length; i++) {
      const el = await this.parseGraphicFrame(graphicFrames[i], fileKey);
      if (el) elements.push(el);
    }

    const grpSps = this.getElements(spTree, 'grpSp');
    for (let i = 0; i < grpSps.length; i++) {
      const groupElements = await this.parseGroupShape(grpSps[i], fileKey);
      elements.push(...groupElements);
    }

    return elements;
  }

  private async getLayoutShapes(slideFile: string): Promise<SlideElement[]> {
    const relMap = this.relationships.get(slideFile);
    if (!relMap) return [];

    let layoutPath: string | undefined;
    for (const [_, target] of relMap) {
      if (target.includes('slideLayout')) {
        layoutPath = this.resolvePathFrom(`ppt/${slideFile}`, target);
        break;
      }
    }
    if (!layoutPath) return [];

    const layoutKey = layoutPath.startsWith('ppt/') ? layoutPath.substring(4) : layoutPath;
    await this.loadRelsFor(layoutKey);

    const layoutXml = await this.getFileContent(layoutPath);
    if (!layoutXml) return [];

    const layoutDoc = this.parseXml(layoutXml);
    const spTree = this.getElements(layoutDoc, 'spTree')[0];
    if (!spTree) return [];

    return await this.parseShapeTreeFor(layoutKey, spTree, true);
  }

  private async getMasterShapes(slideFile: string): Promise<SlideElement[]> {
    const relMap = this.relationships.get(slideFile);
    if (!relMap) return [];

    let layoutPath: string | undefined;
    for (const [_, target] of relMap) {
      if (target.includes('slideLayout')) {
        layoutPath = this.resolvePathFrom(`ppt/${slideFile}`, target);
        break;
      }
    }
    if (!layoutPath) return [];

    const layoutKey = layoutPath.startsWith('ppt/') ? layoutPath.substring(4) : layoutPath;
    await this.loadRelsFor(layoutKey);

    const layoutRelMap = this.relationships.get(layoutKey);
    if (!layoutRelMap) return [];

    let masterPath: string | undefined;
    for (const [_, target] of layoutRelMap) {
      if (target.includes('slideMaster')) {
        masterPath = this.resolvePathFrom(layoutPath, target);
        break;
      }
    }
    if (!masterPath) return [];

    const masterKey = masterPath.startsWith('ppt/') ? masterPath.substring(4) : masterPath;
    await this.loadRelsFor(masterKey);

    const masterXml = await this.getFileContent(masterPath);
    if (!masterXml) return [];

    const masterDoc = this.parseXml(masterXml);
    const spTree = this.getElements(masterDoc, 'spTree')[0];
    if (!spTree) return [];

    return await this.parseShapeTreeFor(masterKey, spTree, true);
  }
  
  private async parseGraphicFrame(gfEl: Element, slideFile: string): Promise<SlideElement | null> {
    // Get position
    const position = this.parseGraphicFramePosition(gfEl);
    if (!position) return null;

    // Check if it contains a table
    const tbl = this.getElements(gfEl, 'tbl')[0];
    if (tbl) {
      return this.parseTableElement(tbl, position);
    }

    return null;
  }

  private parseGraphicFramePosition(gfEl: Element): { x: number; y: number; width: number; height: number } | null {
    // graphicFrame uses <p:xfrm> directly, not inside spPr
    const xfrm = this.getElements(gfEl, 'xfrm')[0];
    if (!xfrm) return null;

    const off = this.getElements(xfrm, 'off')[0];
    const ext = this.getElements(xfrm, 'ext')[0];
    if (!off || !ext) return null;

    const x = (parseInt(off.getAttribute('x') || '0') / this.slideWidth) * INTERNAL_WIDTH;
    const y = (parseInt(off.getAttribute('y') || '0') / this.slideHeight) * INTERNAL_HEIGHT;
    const width = (parseInt(ext.getAttribute('cx') || '0') / this.slideWidth) * INTERNAL_WIDTH;
    const height = (parseInt(ext.getAttribute('cy') || '0') / this.slideHeight) * INTERNAL_HEIGHT;

    return { x, y, width, height };
  }

  private parseTableElement(tblEl: Element, position: { x: number; y: number; width: number; height: number }): SlideElement {
    // Parse table grid columns for widths
    const tblGrid = this.getElements(tblEl, 'tblGrid')[0];
    const gridCols = tblGrid ? this.getElements(tblGrid, 'gridCol') : null;

    // Parse rows
    const rows = this.getElements(tblEl, 'tr');
    let tableHtml = '<table class="ppt-table">';

    for (let i = 0; i < rows.length; i++) {
      tableHtml += '<tr>';
      const cells = this.getElements(rows[i], 'tc');

      for (let j = 0; j < cells.length; j++) {
        const cell = cells[j];

        // Get cell text
        const txBody = this.getElements(cell, 'txBody')[0];
        let cellText = '';
        if (txBody) {
          const paragraphs = this.parseParagraphsFromElement(txBody);
          cellText = paragraphs.map(p => p.runs.map(r => r.text).join('')).join('<br>');
        }

        // Get cell fill color
        const tcPr = this.getElements(cell, 'tcPr')[0];
        let cellStyle = '';
        if (tcPr) {
          const solidFill = this.getElements(tcPr, 'solidFill')[0];
          if (solidFill) {
            const srgbClr = this.getElements(solidFill, 'srgbClr')[0];
            if (srgbClr) {
              const val = srgbClr.getAttribute('val');
              if (val) cellStyle = `background-color: #${val};`;
            }
          }
        }

        // Check for row span and col span
        const gridSpan = cell.getAttribute('gridSpan');
        const rowSpan = cell.getAttribute('rowSpan');
        const hMerge = cell.getAttribute('hMerge');
        const vMerge = cell.getAttribute('vMerge');

        // Skip merged cells
        if (hMerge === '1' || vMerge === '1') continue;

        let attrs = '';
        if (gridSpan && parseInt(gridSpan) > 1) attrs += ` colspan="${gridSpan}"`;
        if (rowSpan && parseInt(rowSpan) > 1) attrs += ` rowspan="${rowSpan}"`;
        if (cellStyle) attrs += ` style="${cellStyle}"`;

        tableHtml += `<td${attrs}>${cellText}</td>`;
      }
      tableHtml += '</tr>';
    }
    tableHtml += '</table>';

    return {
      type: "shape" as const,
      ...position,
      content: tableHtml,
      fillColor: undefined,
    };
  }

  private parseShapeElement(spEl: Element): SlideElement | null {
    const position = this.parsePositionFromElement(spEl);
    if (!position) return null;
  
    // Check if it has text
    const txBody = this.getElements(spEl, 'txBody')[0];
    const paragraphs = txBody ? this.parseParagraphsFromElement(txBody) : [];
  
    // Check for shape fill
    let fillColor: string | undefined;
    const spPr = this.getElements(spEl, 'spPr')[0];
    if (spPr) {
      const solidFill = this.getElements(spPr, 'solidFill')[0];
      if (solidFill) {
        const srgbClr = this.getElements(solidFill, 'srgbClr')[0];
        if (srgbClr) {
          const val = srgbClr.getAttribute('val');
          if (val) fillColor = `#${val}`;
        }
      }
    }
  
    const hasText = paragraphs.some((p) => p.runs.some((r) => r.text.trim().length > 0));
  
    if (!hasText && !fillColor) return null;
  
    return {
      type: hasText ? "text" : "shape",
      ...position,
      content: paragraphs
        .map((p) => p.runs.map((r) => r.text).join(""))
        .join("\n"),
      paragraphs,
      fillColor,
    };
  }
  
  private async parsePictureElement(picEl: Element, slideFile: string): Promise<SlideElement | null> {
    const position = this.parsePositionFromElement(picEl);
    if (!position) return null;
  
    // Get image relationship id
    const blipFill = this.getElements(picEl, 'blipFill')[0];
    if (!blipFill) return null;
  
    const blip = this.getElements(blipFill, 'blip')[0];
    if (!blip) return null;
  
    // Namespace-aware attribute access for r:embed
    const rId = blip.getAttribute('r:embed')
      || blip.getAttributeNS('http://schemas.openxmlformats.org/officeDocument/2006/relationships', 'embed');
    if (!rId) return null;
  
    const relMap = this.relationships.get(slideFile);
    console.log(`[PPT Viewer] Looking for image rId=${rId}, relMap has ${relMap?.size || 0} entries`);
    if (relMap) {
      console.log(`[PPT Viewer] Available rIds:`, Array.from(relMap.keys()));
      console.log(`[PPT Viewer] Target for ${rId}:`, relMap.get(rId));
    }
    if (!relMap) return null;
  
    const imagePath = relMap.get(rId);
    if (!imagePath) return null;
  
    // Resolve the full path
    const fullPath = this.resolveMediaPath(slideFile, imagePath);
    console.log(`[PPT Viewer] Resolved image path: ${fullPath}`);
    const imageData = await this.getImageAsBase64(fullPath);
  
    if (!imageData) return null;
  
    return {
      type: "image",
      ...position,
      content: imageData,
    };
  }
  
  private async parseGroupShape(grpEl: Element, slideFile: string): Promise<SlideElement[]> {
    const elements: SlideElement[] = [];
  
    const shapes = this.getElements(grpEl, 'sp');
    for (let i = 0; i < shapes.length; i++) {
      const el = this.parseShapeElement(shapes[i]);
      if (el) elements.push(el);
    }
  
    const pics = this.getElements(grpEl, 'pic');
    for (let i = 0; i < pics.length; i++) {
      const el = await this.parsePictureElement(pics[i], slideFile);
      if (el) elements.push(el);
    }
  
    return elements;
  }
  
  private parsePositionFromElement(el: Element): { x: number; y: number; width: number; height: number } | null {
    // Look for <a:off> and <a:ext> within <p:spPr> or <pic:spPr>
    const spPr = this.getElements(el, 'spPr')[0];
    if (!spPr) return null;
  
    const xfrm = this.getElements(spPr, 'xfrm')[0];
    if (!xfrm) return null;
  
    const off = this.getElements(xfrm, 'off')[0];
    const ext = this.getElements(xfrm, 'ext')[0];
    if (!off || !ext) return null;
  
    const x = (parseInt(off.getAttribute('x') || '0') / this.slideWidth) * INTERNAL_WIDTH;
    const y = (parseInt(off.getAttribute('y') || '0') / this.slideHeight) * INTERNAL_HEIGHT;
    const width = (parseInt(ext.getAttribute('cx') || '0') / this.slideWidth) * INTERNAL_WIDTH;
    const height = (parseInt(ext.getAttribute('cy') || '0') / this.slideHeight) * INTERNAL_HEIGHT;
  
    return { x, y, width, height };
  }
  
  private parseParagraphsFromElement(txBodyEl: Element): ParagraphInfo[] {
    const paragraphs: ParagraphInfo[] = [];
    const pElements = this.getDrawingElements(txBodyEl, 'p');
  
    for (let i = 0; i < pElements.length; i++) {
      const pEl = pElements[i];
      const paragraph: ParagraphInfo = { runs: [] };
  
      // Alignment from <a:pPr>
      const pPr = this.getDrawingElements(pEl, 'pPr')[0];
      if (pPr) {
        const algn = pPr.getAttribute('algn');
        if (algn) paragraph.alignment = algn;
      }
  
      // Runs <a:r>
      const runs = this.getDrawingElements(pEl, 'r');
      for (let j = 0; j < runs.length; j++) {
        const rEl = runs[j];
        const run: RunInfo = { text: '' };
  
        // Text from <a:t>
        const tEl = this.getDrawingElements(rEl, 't')[0];
        if (tEl) {
          run.text = tEl.textContent || '';
        }
  
        // Formatting from <a:rPr>
        const rPr = this.getDrawingElements(rEl, 'rPr')[0];
        if (rPr) {
          if (rPr.getAttribute('b') === '1') run.bold = true;
          if (rPr.getAttribute('i') === '1') run.italic = true;
          const sz = rPr.getAttribute('sz');
          if (sz) run.fontSize = parseInt(sz) / 100;
  
          // Color
          const solidFill = this.getElements(rPr, 'solidFill')[0];
          if (solidFill) {
            const srgbClr = this.getElements(solidFill, 'srgbClr')[0];
            if (srgbClr) {
              const val = srgbClr.getAttribute('val');
              if (val) run.color = `#${val}`;
            }
          }
        }
  
        if (run.text) {
          paragraph.runs.push(run);
        }
      }
  
      // Field elements <a:fld>
      const flds = this.getDrawingElements(pEl, 'fld');
      for (let j = 0; j < flds.length; j++) {
        const tEl = this.getDrawingElements(flds[j], 't')[0];
        if (tEl && tEl.textContent) {
          paragraph.runs.push({ text: tEl.textContent });
        }
      }
  
      paragraphs.push(paragraph);
    }
  
    return paragraphs;
  }

  private scaleSlide(): void {
    const slideWrapper = this.container.querySelector('.ppt-slide-wrapper') as HTMLElement;
    const slideContainer = this.container.querySelector('#ppt-slide-display') as HTMLElement;
    if (!slideWrapper || !slideContainer) return;

    const wrapperRect = slideWrapper.getBoundingClientRect();
    const availW = wrapperRect.width - 48;
    const availH = wrapperRect.height - 48;
    if (availW <= 0 || availH <= 0) return;

    const scale = Math.min(availW / INTERNAL_WIDTH, availH / INTERNAL_HEIGHT);
    slideContainer.style.transform = `scale(${scale})`;
    slideContainer.style.transformOrigin = 'center center';
  }

  private resolveMediaPath(slideFile: string, relativePath: string): string {
    // Normalize backslash separators (Windows-origin PPTX files)
    relativePath = relativePath.replace(/\\/g, '/');

    if (relativePath.startsWith('/')) {
      // Absolute path from zip root
      return relativePath.substring(1);
    }

    // slideFile is relative to ppt/ (e.g., "slides/slide1.xml",
    // "slideLayouts/slideLayout1.xml", or "slideMasters/slideMaster1.xml").
    // Resolve relative to that file's actual directory so layout/master images
    // resolve correctly too.
    return this.resolvePathFrom(`ppt/${slideFile}`, relativePath);
  }

  private resolvePathFrom(basePath: string, relativePath: string): string {
    relativePath = relativePath.replace(/\\/g, '/');
    if (relativePath.startsWith('/')) return relativePath.substring(1);
    if (!relativePath.startsWith('.')) {
      // Not relative - treat as relative to base directory
      const baseDir = basePath.substring(0, basePath.lastIndexOf('/') + 1);
      return baseDir + relativePath;
    }

    // Handle arbitrary ../ depth
    const baseDir = basePath.substring(0, basePath.lastIndexOf('/') + 1);
    const baseParts = baseDir.split('/').filter(p => p.length > 0);
    const relParts = relativePath.split('/');
    const resultParts = [...baseParts];

    for (const part of relParts) {
      if (part === '..') resultParts.pop();
      else if (part !== '.' && part.length > 0) resultParts.push(part);
    }

    return resultParts.join('/');
  }

  private async getThemeBackground(slideFile: string): Promise<string | undefined> {
    // Try to find theme through relationships chain: slide -> layout -> master -> theme
    const relMap = this.relationships.get(slideFile);
    if (!relMap) return undefined;

    // Find layout
    let layoutPath: string | undefined;
    for (const [_, target] of relMap) {
      if (target.includes('slideLayout')) {
        layoutPath = this.resolvePathFrom(`ppt/${slideFile}`, target);
        break;
      }
    }
    if (!layoutPath) return undefined;

    // Get layout rels to find master
    const layoutRelsPath = layoutPath.replace(/([^/]+)$/, '_rels/$1.rels');
    const layoutRels = await this.getFileContent(layoutRelsPath);
    if (!layoutRels) return undefined;

    const layoutRelsDoc = this.parseXml(layoutRels);
    const rels = this.getElements(layoutRelsDoc, 'Relationship');

    let masterPath: string | undefined;
    for (let i = 0; i < rels.length; i++) {
      const target = rels[i].getAttribute('Target');
      if (target && target.includes('slideMaster')) {
        masterPath = this.resolvePathFrom(layoutPath, target);
        break;
      }
    }
    if (!masterPath) return undefined;

    // Get master rels to find theme
    const masterRelsPath = masterPath.replace(/([^/]+)$/, '_rels/$1.rels');
    const masterRels = await this.getFileContent(masterRelsPath);
    if (!masterRels) return undefined;

    const masterRelsDoc = this.parseXml(masterRels);
    const masterRelNodes = this.getElements(masterRelsDoc, 'Relationship');

    let themePath: string | undefined;
    for (let i = 0; i < masterRelNodes.length; i++) {
      const target = masterRelNodes[i].getAttribute('Target');
      const type = masterRelNodes[i].getAttribute('Type');
      if (type && type.includes('theme')) {
        themePath = this.resolvePathFrom(masterPath, target || '');
        break;
      }
    }
    if (!themePath) return undefined;

    // Parse theme for background
    const themeXml = await this.getFileContent(themePath);
    if (!themeXml) return undefined;

    const themeDoc = this.parseXml(themeXml);

    // Look for fill styles in the theme's fmtScheme
    const fmtScheme = this.getElements(themeDoc, 'fmtScheme')[0];
    if (fmtScheme) {
      const bgFillStyleLst = this.getElements(fmtScheme, 'bgFillStyleLst')[0];
      if (bgFillStyleLst) {
        // Usually the last (3rd) fill style is used for backgrounds
        const fills = bgFillStyleLst.children;
        if (fills.length > 0) {
          const lastFill = fills[fills.length - 1];
          // Check for solid fill
          const srgbClr = this.getElements(lastFill as Element, 'srgbClr')[0];
          if (srgbClr) {
            const val = srgbClr.getAttribute('val');
            if (val) return `#${val}`;
          }
          // Check for gradient
          const gsLst = this.getElements(lastFill as Element, 'gs');
          if (gsLst.length >= 2) {
            const colors: string[] = [];
            for (let i = 0; i < gsLst.length; i++) {
              const clr = this.getElements(gsLst[i], 'srgbClr')[0];
              if (clr) {
                const val = clr.getAttribute('val');
                if (val) colors.push(`#${val}`);
              }
            }
            if (colors.length >= 2) {
              return `linear-gradient(180deg, ${colors.join(', ')})`;
            }
          }
        }
      }
    }

    return undefined;
  }

  private async getLayoutOrMasterBackground(slideFile: string): Promise<string | undefined> {
    // Get slide relationships to find layout
    const relMap = this.relationships.get(slideFile);
    if (!relMap) {
      console.log(`[PPT Viewer] getLayoutOrMasterBackground: no relMap for ${slideFile}`);
      return undefined;
    }

    // Find the slide layout relationship
    let layoutPath: string | undefined;
    for (const [_, target] of relMap) {
      if (target.includes('slideLayout')) {
        layoutPath = this.resolvePathFrom(`ppt/${slideFile}`, target);
        break;
      }
    }

    console.log(`[PPT Viewer] getLayoutOrMasterBackground: layoutPath=${layoutPath}`);
    if (!layoutPath) return undefined;

    // Read layout XML
    const layoutXml = await this.getFileContent(layoutPath);
    if (!layoutXml) {
      console.log(`[PPT Viewer] getLayoutOrMasterBackground: could not read layout XML at ${layoutPath}`);
      return undefined;
    }

    const layoutDoc = this.parseXml(layoutXml);

    // Check layout background
    const bgEl = this.getElements(layoutDoc, 'bg')[0];
    console.log(`[PPT Viewer] getLayoutOrMasterBackground: layout bg element exists=${!!bgEl}`);
    if (bgEl) {
      const bgPr = this.getElements(bgEl, 'bgPr')[0];
      if (bgPr) {
        const solidFill = this.getElements(bgPr, 'solidFill')[0];
        if (solidFill) {
          const srgbClr = this.getElements(solidFill, 'srgbClr')[0];
          if (srgbClr) {
            const val = srgbClr.getAttribute('val');
            if (val) return `#${val}`;
          }
        }
        // Layout background image
        const blipFill = this.getElements(bgPr, 'blipFill')[0];
        if (blipFill) {
          const blip = this.getElements(blipFill, 'blip')[0];
          if (blip) {
            const rId = blip.getAttribute('r:embed')
              || blip.getAttributeNS('http://schemas.openxmlformats.org/officeDocument/2006/relationships', 'embed');
            console.log(`[PPT Viewer] getLayoutOrMasterBackground: layout blipFill rId=${rId}`);
            if (rId) {
              // Parse layout relationships
              const layoutRelsPath = layoutPath.replace(/([^/]+)$/, '_rels/$1.rels');
              console.log(`[PPT Viewer] getLayoutOrMasterBackground: layoutRelsPath=${layoutRelsPath}`);
              const layoutRels = await this.getFileContent(layoutRelsPath);
              if (layoutRels) {
                const layoutRelsDoc = this.parseXml(layoutRels);
                const rels = this.getElements(layoutRelsDoc, 'Relationship');
                for (let i = 0; i < rels.length; i++) {
                  if (rels[i].getAttribute('Id') === rId) {
                    const imgTarget = rels[i].getAttribute('Target');
                    if (imgTarget) {
                      const imgFullPath = this.resolvePathFrom(layoutPath, imgTarget);
                      console.log(`[PPT Viewer] getLayoutOrMasterBackground: resolved layout image path=${imgFullPath} (from target=${imgTarget})`);
                      const imgData = await this.getImageAsBase64(imgFullPath);
                      if (imgData) return imgData;
                    }
                  }
                }
              }
            }
          }
        }

        // Layout gradient fill
        const gradFill = this.getElements(bgPr, 'gradFill')[0];
        if (gradFill) {
          const gsLst = this.getElements(gradFill, 'gs');
          if (gsLst.length >= 2) {
            const colors: string[] = [];
            for (let i = 0; i < gsLst.length; i++) {
              const srgb = this.getElements(gsLst[i], 'srgbClr')[0];
              if (srgb) {
                const val = srgb.getAttribute('val');
                if (val) colors.push(`#${val}`);
              }
            }
            if (colors.length >= 2) {
              return `linear-gradient(180deg, ${colors.join(', ')})`;
            }
          }
        }
      }

      // bgRef in layout
      if (!bgEl.querySelector) {
        // fallback check
      }
      const bgRef = this.getElements(bgEl, 'bgRef')[0];
      if (bgRef) {
        const srgbClr = this.getElements(bgRef, 'srgbClr')[0];
        if (srgbClr) {
          const val = srgbClr.getAttribute('val');
          if (val) return `#${val}`;
        }
      }
    }

    // If layout has no background, try slide master
    const layoutRelsPath = layoutPath.replace(/([^/]+)$/, '_rels/$1.rels');
    const layoutRels = await this.getFileContent(layoutRelsPath);
    if (layoutRels) {
      const layoutRelsDoc = this.parseXml(layoutRels);
      const rels = this.getElements(layoutRelsDoc, 'Relationship');
      for (let i = 0; i < rels.length; i++) {
        const target = rels[i].getAttribute('Target');
        if (target && target.includes('slideMaster')) {
          const masterPath = this.resolvePathFrom(layoutPath, target);
          console.log(`[PPT Viewer] getLayoutOrMasterBackground: masterPath=${masterPath}`);
          const masterXml = await this.getFileContent(masterPath);
          if (masterXml) {
            const masterDoc = this.parseXml(masterXml);
            const masterBg = this.getElements(masterDoc, 'bg')[0];
            console.log(`[PPT Viewer] getLayoutOrMasterBackground: master bg element exists=${!!masterBg}`);
            if (masterBg) {
              const masterBgPr = this.getElements(masterBg, 'bgPr')[0];
              if (masterBgPr) {
                const solidFill = this.getElements(masterBgPr, 'solidFill')[0];
                if (solidFill) {
                  const srgbClr = this.getElements(solidFill, 'srgbClr')[0];
                  if (srgbClr) {
                    const val = srgbClr.getAttribute('val');
                    if (val) return `#${val}`;
                  }
                }
                // Master background image
                const blipFill = this.getElements(masterBgPr, 'blipFill')[0];
                if (blipFill) {
                  const blip = this.getElements(blipFill, 'blip')[0];
                  if (blip) {
                    const mRId = blip.getAttribute('r:embed')
                      || blip.getAttributeNS('http://schemas.openxmlformats.org/officeDocument/2006/relationships', 'embed');
                    if (mRId) {
                      const masterRelsPath = masterPath.replace(/([^/]+)$/, '_rels/$1.rels');
                      const masterRels = await this.getFileContent(masterRelsPath);
                      if (masterRels) {
                        const masterRelsDoc = this.parseXml(masterRels);
                        const mRels = this.getElements(masterRelsDoc, 'Relationship');
                        for (let j = 0; j < mRels.length; j++) {
                          if (mRels[j].getAttribute('Id') === mRId) {
                            const mImgTarget = mRels[j].getAttribute('Target');
                            if (mImgTarget) {
                              const mImgPath = this.resolvePathFrom(masterPath, mImgTarget);
                              console.log(`[PPT Viewer] getLayoutOrMasterBackground: resolved master image path=${mImgPath} (from target=${mImgTarget})`);
                              const mImgData = await this.getImageAsBase64(mImgPath);
                              if (mImgData) return mImgData;
                            }
                          }
                        }
                      }
                    }
                  }
                }

                // Master gradient fill
                const gradFill = this.getElements(masterBgPr, 'gradFill')[0];
                if (gradFill) {
                  const gsLst = this.getElements(gradFill, 'gs');
                  if (gsLst.length >= 2) {
                    const colors: string[] = [];
                    for (let i = 0; i < gsLst.length; i++) {
                      const srgb = this.getElements(gsLst[i], 'srgbClr')[0];
                      if (srgb) {
                        const val = srgb.getAttribute('val');
                        if (val) colors.push(`#${val}`);
                      }
                    }
                    if (colors.length >= 2) {
                      return `linear-gradient(180deg, ${colors.join(', ')})`;
                    }
                  }
                }
              }

              // bgRef in master
              const masterBgRef = this.getElements(masterBg, 'bgRef')[0];
              if (masterBgRef) {
                const srgbClr = this.getElements(masterBgRef, 'srgbClr')[0];
                if (srgbClr) {
                  const val = srgbClr.getAttribute('val');
                  if (val) return `#${val}`;
                }
              }
            }
          }
        }
      }
    }

    return undefined;
  }

  private getZipFile(path: string): JSZip.JSZipObject | null {
    if (!this.zip) return null;
    // Try exact match first
    const file = this.zip.file(path);
    if (file) return file;

    // Try case-insensitive match
    const lowerPath = path.toLowerCase();
    let found: JSZip.JSZipObject | null = null;
    this.zip.forEach((relativePath, zipEntry) => {
      if (!found && relativePath.toLowerCase() === lowerPath) {
        found = zipEntry;
      }
    });
    return found;
  }

  private async getImageAsBase64(path: string): Promise<string | null> {
    if (this.mediaCache.has(path)) {
      return this.mediaCache.get(path) || null;
    }

    if (!this.zip) return null;

    // Normalize path
    const normalizedPath = path.replace(/\\/g, '/').replace(/^\//, '');

    // Try multiple strategies
    let file = this.getZipFile(normalizedPath);

    // Try without leading slash (if normalization changed it)
    if (!file && normalizedPath !== path) {
      file = this.getZipFile(path);
    }

    // Try in ppt/media/ by filename
    if (!file) {
      const filename = normalizedPath.split('/').pop();
      if (filename) {
        file = this.getZipFile(`ppt/media/${filename}`);
      }
    }

    // Last resort: search all media files for matching filename
    if (!file) {
      const filename = normalizedPath.split('/').pop()?.toLowerCase();
      if (filename && this.zip) {
        this.zip.forEach((relativePath, zipEntry) => {
          if (!file && relativePath.toLowerCase().endsWith('/' + filename)) {
            file = zipEntry;
          }
        });
      }
    }

    if (!file) {
      console.log(`[PPT Viewer] Image not found in ZIP: ${path} (normalized: ${normalizedPath})`);
      return null;
    }

    try {
      const data = await file.async("base64");
      const ext = path.split(".").pop()?.toLowerCase() || "png";
      const mimeMap: Record<string, string> = {
        png: "image/png",
        jpg: "image/jpeg",
        jpeg: "image/jpeg",
        gif: "image/gif",
        svg: "image/svg+xml",
        emf: "image/x-emf",
        wmf: "image/x-wmf",
        tiff: "image/tiff",
        tif: "image/tiff",
        bmp: "image/bmp",
      };
      const mime = mimeMap[ext] || "image/png";
      const dataUrl = `data:${mime};base64,${data}`;
      this.mediaCache.set(path, dataUrl);
      return dataUrl;
    } catch {
      return null;
    }
  }

  private async getFileContent(path: string): Promise<string | null> {
    if (!this.zip) return null;
    const file = this.getZipFile(path);
    if (!file) return null;
    try {
      return await file.async("string");
    } catch {
      return null;
    }
  }

  private renderUI(): void {
    this.container.empty();
    this.container.addClass("ppt-viewer-root");

    // Main layout
    const layout = this.container.createDiv({ cls: "ppt-layout" });

    // Thumbnail sidebar
    const sidebar = layout.createDiv({ cls: "ppt-sidebar" });
    this.renderThumbnails(sidebar);

    // Sidebar toggle button
    const toggleBtn = layout.createDiv({ cls: 'ppt-sidebar-toggle' });
    toggleBtn.innerHTML = '◀';
    toggleBtn.addEventListener('click', () => {
      const isCollapsed = layout.hasClass('ppt-sidebar-collapsed');
      layout.toggleClass('ppt-sidebar-collapsed', !isCollapsed);
      toggleBtn.innerHTML = !isCollapsed ? '▶' : '◀';
      // Recalculate scale after CSS transition completes
      setTimeout(() => this.scaleSlide(), 350);
    });

    // Main content area
    const mainArea = layout.createDiv({ cls: "ppt-main" });

    // Slide display
    const slideWrapper = mainArea.createDiv({ cls: "ppt-slide-wrapper" });
    const slideContainer = slideWrapper.createDiv({ cls: "ppt-slide-container" });
    slideContainer.setAttribute("id", "ppt-slide-display");

    // ResizeObserver for scale-to-fit
    this.resizeObserver = new ResizeObserver(() => {
      this.scaleSlide();
    });
    this.resizeObserver.observe(slideWrapper);

    // Navigation
    const nav = mainArea.createDiv({ cls: "ppt-navigation" });
    const prevBtn = nav.createEl("button", { text: "\u25C0 Previous", cls: "ppt-nav-btn" });
    const slideCounter = nav.createSpan({ cls: "ppt-slide-counter" });
    const nextBtn = nav.createEl("button", { text: "Next \u25B6", cls: "ppt-nav-btn" });

    // Open with default app button
    const openBtn = nav.createEl("button", { text: "Open External \u2197", cls: "ppt-nav-btn ppt-open-external-btn" });
    openBtn.addEventListener("click", () => this.openWithDefaultApp());

    // Convert to PDF button
    const convertBtn = nav.createEl("button", { text: "Convert PDF \uD83D\uDCC4", cls: "ppt-nav-btn ppt-convert-pdf-btn" });
    convertBtn.addEventListener("click", () => this.convertToPDF());

    prevBtn.addEventListener("click", () => this.goToSlide(this.currentSlide - 1));
    nextBtn.addEventListener("click", () => this.goToSlide(this.currentSlide + 1));

    // Keyboard navigation
    this.containerEl.tabIndex = 0;
    this.containerEl.addEventListener("keydown", (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
        e.preventDefault();
        this.goToSlide(this.currentSlide - 1);
      } else if (e.key === "ArrowRight" || e.key === "ArrowDown" || e.key === " ") {
        e.preventDefault();
        this.goToSlide(this.currentSlide + 1);
      }
    });

    this.renderSlide();
    this.updateCounter(slideCounter);
  }

  private renderThumbnails(sidebar: HTMLElement): void {
    const title = sidebar.createDiv({ cls: "ppt-sidebar-title" });
    title.setText("Slides");

    const thumbList = sidebar.createDiv({ cls: "ppt-thumb-list" });

    this.slides.forEach((_, index) => {
      const thumb = thumbList.createDiv({
        cls: `ppt-thumb ${index === this.currentSlide ? "ppt-thumb-active" : ""}`,
      });
      const thumbNumber = thumb.createSpan({ cls: "ppt-thumb-number" });
      thumbNumber.setText(`${index + 1}`);
      thumb.addEventListener("click", () => this.goToSlide(index));
    });
  }

  private renderSlide(): void {
    const display = this.container.querySelector("#ppt-slide-display") as HTMLElement;
    if (!display) return;

    display.empty();

    const slide = this.slides[this.currentSlide];
    if (!slide) return;

    // Set background
    if (slide.background) {
      if (slide.background.startsWith('data:')) {
        // Background image
        display.style.backgroundImage = `url(${slide.background})`;
        display.style.backgroundSize = 'cover';
        display.style.backgroundPosition = 'center';
        display.style.backgroundColor = '';
      } else if (slide.background.startsWith('linear-gradient')) {
        display.style.background = slide.background;
        display.style.backgroundImage = '';
      } else {
        // Solid color
        display.style.backgroundColor = slide.background;
        display.style.backgroundImage = '';
      }
    } else {
      display.style.backgroundColor = '';
      display.style.backgroundImage = '';
      display.style.background = '';
    }

    // Render elements
    for (const element of slide.elements) {
      this.renderElement(display, element);
    }

    // Update thumbnail active state
    const thumbs = this.container.querySelectorAll(".ppt-thumb");
    thumbs.forEach((thumb, index) => {
      thumb.toggleClass("ppt-thumb-active", index === this.currentSlide);
    });

    // Scroll active thumbnail into view
    const activeThumb = this.container.querySelector(".ppt-thumb-active");
    if (activeThumb) {
      activeThumb.scrollIntoView({ block: "nearest", behavior: "smooth" });
    }
  }

  private renderElement(container: HTMLElement, element: SlideElement): void {
    const el = container.createDiv({ cls: `ppt-element ppt-element-${element.type}` });

    el.style.left = `${element.x}px`;
    el.style.top = `${element.y}px`;
    el.style.width = `${element.width}px`;
    // Only set height for non-text elements to allow text to flow naturally
    if (element.type !== 'text') {
      el.style.height = `${element.height}px`;
    }

    if (element.fillColor) {
      el.style.backgroundColor = element.fillColor;
    }

    switch (element.type) {
      case "text":
        this.renderTextElement(el, element);
        break;
      case "image":
        this.renderImageElement(el, element);
        break;
      case "shape":
        if (element.content && element.content.startsWith('<table')) {
          el.innerHTML = element.content;
        } else if (element.fillColor) {
          el.style.borderRadius = "2px";
        }
        break;
    }
  }

  private renderTextElement(container: HTMLElement, element: SlideElement): void {
    if (element.paragraphs) {
      for (const para of element.paragraphs) {
        const pEl = container.createEl("p", { cls: "ppt-paragraph" });

        if (para.alignment) {
          const alignMap: Record<string, string> = {
            l: "left",
            ctr: "center",
            r: "right",
            just: "justify",
          };
          pEl.style.textAlign = alignMap[para.alignment] || "left";
        }

        for (const run of para.runs) {
          const span = pEl.createEl("span");
          span.textContent = run.text;

          if (run.bold) span.style.fontWeight = "bold";
          if (run.italic) span.style.fontStyle = "italic";
          if (run.fontSize) span.style.fontSize = `${run.fontSize * 0.95}pt`;
          if (run.color) span.style.color = run.color;
        }
      }
    }
  }

  private renderImageElement(container: HTMLElement, element: SlideElement): void {
    const img = container.createEl("img", { cls: "ppt-image" });
    img.src = element.content;
    img.style.width = "100%";
    img.style.height = "100%";
    img.style.objectFit = "contain";
  }

  private goToSlide(index: number): void {
    if (index < 0 || index >= this.slides.length) return;
    this.currentSlide = index;
    this.renderSlide();
    const counter = this.container.querySelector(".ppt-slide-counter") as HTMLElement;
    if (counter) this.updateCounter(counter);
  }

  private updateCounter(counter: HTMLElement): void {
    counter.setText(`Slide ${this.currentSlide + 1} of ${this.slides.length}`);
  }

  private openWithDefaultApp(): void {
    if (!this.file) return;
    const adapter = this.app.vault.adapter as any;
    if (adapter.open) {
      adapter.open(this.file.path);
    } else {
      // Fallback using require
      try {
        const { exec } = require('child_process');
        const vaultPath = adapter.basePath || adapter.getBasePath?.();
        const fullPath = `${vaultPath}/${this.file.path}`;
        if (process.platform === 'darwin') {
          exec(`open "${fullPath}"`);
        } else if (process.platform === 'win32') {
          exec(`start "" "${fullPath}"`);
        } else {
          exec(`xdg-open "${fullPath}"`);
        }
      } catch (e) {
        new Notice('Unable to open file with default application');
      }
    }
  }

  private async convertToPDF(): Promise<void> {
    if (!this.file) return;

    const adapter = this.app.vault.adapter as any;
    const vaultPath = adapter.basePath || adapter.getBasePath?.();
    if (!vaultPath) {
      new Notice('Cannot determine vault path');
      return;
    }

    const fullPath = `${vaultPath}/${this.file.path}`;
    const outputDir = fullPath.substring(0, fullPath.lastIndexOf('/'));
    const pdfPath = fullPath.replace(/\.(pptx?|ppt)$/i, '.pdf');
    const pdfName = this.file.basename + '.pdf';

    // Show progress status
    const statusEl = this.container.createDiv({ cls: 'ppt-convert-status' });
    statusEl.setText('Converting to PDF... Please wait.');
    statusEl.style.cssText = 'position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);background:#333;color:#fff;padding:16px 32px;border-radius:8px;z-index:9999;font-size:14px;box-shadow:0 4px 12px rgba(0,0,0,0.3);';

    try {
      const { exec } = require('child_process');
      const { promisify } = require('util');
      const execAsync = promisify(exec);
      const { existsSync, writeFileSync, unlinkSync } = require('fs');
      const path = require('path');
      const os = require('os');

      let converted = false;

      // Read file content via Node.js and write to temp .zip to avoid macOS Launch Services
      const tmpInput = path.join(os.tmpdir(), `ppt_convert_${Date.now()}.zip`);
      const fileBuffer = require('fs').readFileSync(fullPath);
      require('fs').writeFileSync(tmpInput, fileBuffer);

      // Method 1: LibreOffice headless (faithful, non-destructive conversion)
      if (!converted) {
        const sofficePaths = [
          '/Applications/LibreOffice.app/Contents/MacOS/soffice',
          '/usr/local/bin/soffice',
          '/opt/homebrew/bin/soffice',
        ];
        let sofficePath = '';
        for (const sp of sofficePaths) {
          if (existsSync(sp)) { sofficePath = sp; break; }
        }
        if (sofficePath) {
          try {
            const outDir = path.dirname(pdfPath);
            await execAsync(
              `"${sofficePath}" --headless --convert-to pdf --outdir "${outDir}" "${tmpInput}"`,
              { timeout: 120000 }
            );
            // LibreOffice outputs with the input filename's base + .pdf
            const loOutput = path.join(outDir, path.basename(tmpInput, '.zip') + '.pdf');
            if (existsSync(loOutput)) {
              // Rename to desired output name
              require('fs').renameSync(loOutput, pdfPath);
              converted = true;
            }
          } catch (e: any) {
            console.log('LibreOffice conversion failed, trying fallback:', e.message);
          }
        }
      }

      // Method 2 (fallback): Pure Python conversion with python-pptx + reportlab
      if (!converted) {
        try {
          const pyScript = path.join(os.tmpdir(), 'ppt_to_pdf.py');
          const pythonCode = `
import subprocess
import sys
import os

# Ensure required packages
def install_if_missing(import_name, pip_name=None):
    try:
        __import__(import_name)
    except ImportError:
        subprocess.check_call([sys.executable, '-m', 'pip', 'install', pip_name or import_name, '-q'])

install_if_missing('pptx', 'python-pptx')
install_if_missing('PIL', 'Pillow')
install_if_missing('reportlab')

from pptx import Presentation
from pptx.util import Inches, Pt, Emu
from reportlab.lib.pagesizes import landscape, A4
from reportlab.pdfgen import canvas
from reportlab.lib.units import inch
from PIL import Image
import io
import tempfile
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont

# Register CJK fonts from macOS system
import platform
cjk_font_registered = False
cjk_font_name = 'Helvetica'
cjk_font_bold_name = 'Helvetica-Bold'

if platform.system() == 'Darwin':
    font_paths = [
        ('/System/Library/Fonts/PingFang.ttc', 'PingFang SC'),
        ('/System/Library/Fonts/STHeiti Medium.ttc', 'STHeiti'),
        ('/Library/Fonts/Arial Unicode.ttf', 'ArialUnicode'),
        ('/System/Library/Fonts/Hiragino Sans GB.ttc', 'HiraginoSansGB'),
    ]
    for font_path, font_name in font_paths:
        if os.path.exists(font_path):
            try:
                pdfmetrics.registerFont(TTFont(font_name, font_path, subfontIndex=0))
                cjk_font_name = font_name
                cjk_font_bold_name = font_name
                cjk_font_registered = True
                break
            except Exception:
                continue

if not cjk_font_registered:
    try:
        from reportlab.pdfbase.cidfonts import UnicodeCIDFont
        pdfmetrics.registerFont(UnicodeCIDFont('STSong-Light'))
        cjk_font_name = 'STSong-Light'
        cjk_font_bold_name = 'STSong-Light'
        cjk_font_registered = True
    except Exception:
        pass

input_file = sys.argv[1]
output_file = sys.argv[2]

prs = Presentation(input_file)
slide_width = prs.slide_width
slide_height = prs.slide_height

# Convert EMU to points (1 inch = 914400 EMU = 72 points)
page_width = slide_width / 914400 * 72
page_height = slide_height / 914400 * 72

c = canvas.Canvas(output_file, pagesize=(page_width, page_height))

for slide_num, slide in enumerate(prs.slides):
    if slide_num > 0:
        c.showPage()

    # Draw background
    try:
        if slide.background and slide.background.fill:
            fill = slide.background.fill
            if fill.type is not None:
                if hasattr(fill, 'fore_color') and fill.fore_color and fill.fore_color.type is not None:
                    color = fill.fore_color.rgb
                    if color:
                        hex_color = str(color)
                        r = int(hex_color[0:2], 16) / 255
                        g = int(hex_color[2:4], 16) / 255
                        b = int(hex_color[4:6], 16) / 255
                        c.setFillColorRGB(r, g, b)
                        c.rect(0, 0, page_width, page_height, fill=1, stroke=0)
    except Exception:
        pass

    for shape in slide.shapes:
        # Convert position from EMU to points
        left = shape.left / 914400 * 72 if shape.left else 0
        top = shape.top / 914400 * 72 if shape.top else 0
        width = shape.width / 914400 * 72 if shape.width else 0
        height = shape.height / 914400 * 72 if shape.height else 0

        # Flip Y coordinate (PDF origin is bottom-left)
        y = page_height - top - height

        if shape.has_text_frame:
            tf = shape.text_frame
            text_y = page_height - top
            for para in tf.paragraphs:
                text = para.text
                if not text.strip():
                    text_y -= 14
                    continue

                # Get font properties
                font_size = 12
                font_bold = False
                if para.runs:
                    run = para.runs[0]
                    if run.font.size:
                        font_size = run.font.size.pt
                    font_bold = run.font.bold

                try:
                    c.setFont(cjk_font_bold_name if font_bold else cjk_font_name, min(font_size, 48))
                except Exception:
                    c.setFont("Helvetica-Bold" if font_bold else "Helvetica", min(font_size, 48))

                # Set color
                try:
                    if para.runs and para.runs[0].font.color and para.runs[0].font.color.rgb:
                        hex_color = str(para.runs[0].font.color.rgb)
                        r_c = int(hex_color[0:2], 16) / 255
                        g_c = int(hex_color[2:4], 16) / 255
                        b_c = int(hex_color[4:6], 16) / 255
                        c.setFillColorRGB(r_c, g_c, b_c)
                    else:
                        c.setFillColorRGB(0, 0, 0)
                except Exception:
                    c.setFillColorRGB(0, 0, 0)

                text_y -= font_size * 1.2
                try:
                    c.drawString(left + 2, text_y, text)
                except Exception:
                    pass

        elif shape.shape_type == 13:  # Picture
            try:
                image_stream = io.BytesIO(shape.image.blob)
                img = Image.open(image_stream)

                # Save to temp file for reportlab
                tmp_img = tempfile.NamedTemporaryFile(suffix='.png', delete=False)
                if img.mode in ('RGBA', 'P'):
                    img = img.convert('RGB')
                img.save(tmp_img.name)
                tmp_img.close()

                c.drawImage(tmp_img.name, left, y, width, height, preserveAspectRatio=True)
                os.unlink(tmp_img.name)
            except Exception:
                pass

c.save()
print("SUCCESS")
`;
          writeFileSync(pyScript, pythonCode);
          const result = await execAsync(
            `python3 "${pyScript}" "${tmpInput}" "${pdfPath}"`,
            { timeout: 120000 }
          );
          try { unlinkSync(pyScript); } catch {}
          try { unlinkSync(tmpInput); } catch {}

          if (result.stdout && result.stdout.includes('SUCCESS') && existsSync(pdfPath)) {
            converted = true;
          } else {
            console.log('[PPT Viewer] Python PDF conversion output:', result.stdout, result.stderr);
          }
        } catch (e: any) {
          console.log('[PPT Viewer] Python PDF conversion failed:', e.message, e.stderr || '');
        }
      }

      // Clean up temp input file
      try { unlinkSync(tmpInput); } catch {}

      // Remove status overlay
      statusEl.remove();

      if (!converted) {
        new Notice('PDF conversion failed. Install LibreOffice: brew install --cask libreoffice');
        return;
      }

      new Notice(`Converted successfully: ${pdfName}`);

      // Refresh vault to detect the new file
      setTimeout(() => {
        const newPath = this.file!.path.replace(/\.(pptx?|ppt)$/i, '.pdf');
        (this.app.vault as any).adapter?.reconcileInternalFile?.(newPath);
      }, 1000);

    } catch (e: any) {
      statusEl.remove();
      new Notice(`Conversion failed: ${e.message || 'Unknown error'}`);
      console.log('[PPT Viewer] PDF conversion error:', e);
    }
  }

  private renderError(error: Error): void {
    this.container.empty();
    const errorDiv = this.container.createDiv({ cls: "ppt-error" });
    errorDiv.createEl("h3", { text: "Error loading presentation" });
    errorDiv.createEl("p", { text: error.message });
    errorDiv.createEl("p", {
      text: "This file may be corrupted or use an unsupported format.",
      cls: "ppt-error-hint",
    });
    new Notice(`PPT Viewer: ${error.message}`);
  }
}
