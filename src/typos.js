import Plugin from "@ckeditor/ckeditor5-core/src/plugin";
import TyposEditing from "./typosEditing";

/**
 * Initializes and creates instances of the {@code TYPOS}.
 */
export default class Typos extends Plugin {
  /**
   * @inheritdoc
   */
  static get requires() {
    return [TyposEditing];
  }

  /**
   * @inheritdoc
   */
  static get pluginName() {
    return "Typos";
  }

  /**
   * @inheritDoc
   */
  constructor(editor) {
    super(editor);

    this._instances = [];
  }

  /**
   * {@inheritdoc}
   *
   * Destroys the {@code Typos} plugin.
   * @public
   */
  destroy() {
    super.destroy();
    this._instances.forEach((instance) => instance.destroy());
    this._instances = null;
  }
}
