import ClassicEditor from "@ckeditor/ckeditor5-editor-classic/src/classiceditor";
import Essentials from "@ckeditor/ckeditor5-essentials/src/essentials";
import Paragraph from "@ckeditor/ckeditor5-paragraph/src/paragraph";
import Heading from "@ckeditor/ckeditor5-heading/src/heading";
import List from "@ckeditor/ckeditor5-list/src/list";
import Bold from "@ckeditor/ckeditor5-basic-styles/src/bold";
import Italic from "@ckeditor/ckeditor5-basic-styles/src/italic";
import CKEditorInspector from "@ckeditor/ckeditor5-inspector";
import Typos from "../src/typos";

const classicEditor = ClassicEditor.create(document.querySelector("#editor"), {
  plugins: [Essentials, Paragraph, Heading, List, Bold, Italic, Typos],
  toolbar: ["heading", "bold", "italic", "numberedList", "bulletedList"],
});

classicEditor
  .then((editor) => {
    // 附加编辑器
    CKEditorInspector.attach(editor);

    // 查找错别字
    document.querySelector("#importContent").addEventListener("click", () => {
      editor.execute("Typos", { source: "百毒", target: "百度", find: true });
    });

    // 替换错别字
    document.querySelector("#replaceContent").addEventListener("click", () => {
      editor.execute("Typos", {
        source: "百毒",
        target: "百度",
        replace: true,
      });
    });

    // 替换错别字
    document.querySelector("#out").addEventListener("click", () => {
      editor.execute("Typos", { source: "百毒", target: "百度", abort: true });
    });

    // 获取内容
    document.querySelector("#getContent").addEventListener("click", () => {
      console.log(editor.getData());
    });
  })
  .catch((error) => {
    console.error(error);
  });
