import Plugin from "@ckeditor/ckeditor5-core/src/plugin";
import TyposCommand from "./typosCommand";
import "../theme/typos.css";

const TYPOS = "typos";

/**
 * The {@code TyposEditing} plugin. It introduces all {@code Typos} commands.
 */
export default class TyposEditing extends Plugin {
  /**
   * @inheritDoc
   */
  static get pluginName() {
    return "TyposEditing";
  }

  /**
   * Initializes the {@code TyposEditing} plugin.
   * @public
   */
  init() {
    const editor = this.editor;

    editor.model.schema.extend("$text", { allowAttributes: TYPOS });
    editor.model.schema.setAttributeProperties(TYPOS, {
      isFormatting: true,
      copyOnEnter: false,
    });

    // 转换节点
    this._addConversions();

    // 添加命令
    this._addCommands();
  }

  _addCommands() {
    this.editor.commands.add("Typos", new TyposCommand(this.editor, TYPOS));
  }

  _addConversions() {
    this.editor.conversion.for("downcast").markerToHighlight({
      model: TYPOS,
      view: () => ({ classes: "search-item" }),
    });
  }
}
