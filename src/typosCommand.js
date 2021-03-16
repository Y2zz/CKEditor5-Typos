import { Command } from "@ckeditor/ckeditor5-core";

const TYPOS = 'typos';

export default class TyposCommand extends Command {
  constructor(editor, attributeKey) {
    super(editor);

    this.attributeKey = attributeKey;
  }

  refresh() {
    const model = this.editor.model;
    const doc = model.document;

    this.value = this._getValueFromFirstAllowedNode();
    this.isEnabled = model.schema.checkAttributeInSelection(
      doc.selection,
      this.attributeKey
    );
  }

  execute(options = {}) {

    // console.log('options:', options);

    // 搜索
    if (options.find) {
      this._find(options.source);
    }
    // 替换
    else if (options.replace) {
      this._replace(options.source, options.target);
    }
    // 中止
    else if (options.abort) {
      this._abort();
    } else {
      console.error("命令参数错误");
    }
  }

  /**
   * 查找错别字并高亮
   * @param findText
   * @private
   */
  _find(findText) {
    const editor = this.editor;
    const model = editor.model;
    const root = model.document.getRoot();
    const markers = Array.from(model.markers.getMarkersGroup(TYPOS));

    // 重复操作
    if (isRepeat(findText, markers)) {
      console.log("重复查找：", findText);
    } else {
      let counter = 0;

      model.change((writer) => {
        // 在所有段落中寻找
        for (const element of root.getChildren()) {
          const text = getText(element);
          const indices = getIndicesOf(findText, text, "mark");

          for (const index of indices) {
            const label = TYPOS + ":" + findText + ":" + counter++;

            // 内容定位
            const start = writer.createPositionAt(element, index);
            const end = writer.createPositionAt(
              element,
              index + findText.length
            );
            const range = writer.createRange(start, end);

            // 添加标记
            writer.addMarker(label, { range, usingOperation: false });
          }
        }
      });
    }
  }

  /**
   * 替换错别字
   * @param sourceText
   * @param targetText
   * @private
   */
  _replace(sourceText, targetText) {
    const model = this.editor.model;

    model.change((writer) => {
      const markers = Array.from(model.markers.getMarkersGroup(TYPOS));
      for (const marker of markers) {
        model.insertContent(writer.createText(targetText), marker.getRange());
      }
    });
  }

  /**
   * 中止并取消高亮
   * @private
   */
  _abort() {
    const model = this.editor.model;
    model.change((writer) => {
      const markers = Array.from(model.markers.getMarkersGroup(TYPOS));
      for (const marker of markers) {
        writer.removeMarker(marker.name);
      }
    });
  }

  _getValueFromFirstAllowedNode() {
    const model = this.editor.model;
    const schema = model.schema;
    const selection = model.document.selection;

    if (selection.isCollapsed) {
      return selection.hasAttribute(this.attributeKey);
    }

    for (const range of selection.getRanges()) {
      for (const item of range.getItems()) {
        if (schema.checkAttribute(item, this.attributeKey)) {
          return item.hasAttribute(this.attributeKey);
        }
      }
    }

    return false;
  }
}

function getText(node) {
  let str = "";
  if (node.is("text")) {
    str += node.data;
  } else {
    const children = Array.from(node.getChildren());
    for (const child of children) {
      str += getText(child);
    }
  }
  return str;
}

/**
 * 是否重复
 * @param text
 * @param markers
 * @returns {boolean}
 */
function isRepeat(text, markers) {
  const firstMarker = markers[0];
  const term =
    firstMarker && firstMarker.name ? firstMarker.name.split(":")[1] : "";
  return term === text;
}

function getIndicesOf(searchStr, str, caseSensitive) {
  const searchStrLen = searchStr.length;
  if (searchStrLen === 0) {
    return [];
  }
  let startIndex = 0;
  let index;
  const indices = [];
  if (!caseSensitive) {
    str = str.toLowerCase();
    searchStr = searchStr.toLowerCase();
  }
  while ((index = str.indexOf(searchStr, startIndex)) > -1) {
    indices.push(index);
    startIndex = index + searchStrLen;
  }
  return indices;
}
