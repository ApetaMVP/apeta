import { Link, RichTextEditor, RichTextEditorProps } from "@mantine/tiptap";
import Underline from "@tiptap/extension-underline";
import { useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useEffect } from "react";

interface TextEditorProps extends Partial<RichTextEditorProps> {
  comment: string;
  handleChange: (e: string) => void;
}

export default function TextEditor(props: TextEditorProps) {
  const { comment } = props;
  const editor = useEditor({
    extensions: [StarterKit, Link, Underline],
    content: comment,
  });

  useEffect(() => {
    if (comment === "") {
      editor?.commands.clearContent();
    }
  }, [comment]);

  return (
    <RichTextEditor
      editor={editor}
      onInput={(_e) => props.handleChange(editor?.getHTML()!)}
    >
      <RichTextEditor.Toolbar sticky stickyOffset={60}>
        <RichTextEditor.ControlsGroup>
          <RichTextEditor.Bold />
          <RichTextEditor.Italic />
          <RichTextEditor.Underline />
          <RichTextEditor.Strikethrough />
          <RichTextEditor.ClearFormatting />
          <RichTextEditor.Code />
        </RichTextEditor.ControlsGroup>

        <RichTextEditor.ControlsGroup>
          <RichTextEditor.Blockquote />
          <RichTextEditor.Hr />
          <RichTextEditor.BulletList />
          <RichTextEditor.OrderedList />
        </RichTextEditor.ControlsGroup>

        <RichTextEditor.ControlsGroup>
          <RichTextEditor.Link />
          <RichTextEditor.Unlink />
        </RichTextEditor.ControlsGroup>
      </RichTextEditor.Toolbar>

      <RichTextEditor.Content />
    </RichTextEditor>
  );
}
