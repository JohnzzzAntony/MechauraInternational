"use client";

import * as React from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Heading2,
  Heading3,
  Quote,
  Undo,
  Redo,
  Link as LinkIcon,
  Unlink,
  Code,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface RichTextEditorProps {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  minHeight?: string;
}

export function RichTextEditor({
  value,
  onChange,
  placeholder = "Write detailed description or article content...",
  minHeight = "200px",
}: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-brand underline font-medium",
        },
      }),
      Placeholder.configure({
        placeholder,
      }),
    ],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  // Sync external value updates if changed outside
  React.useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value);
    }
  }, [value, editor]);

  if (!editor) return null;

  const setLink = () => {
    const previousUrl = editor.getAttributes("link").href;
    const url = window.prompt("URL", previousUrl);

    if (url === null) return;
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  };

  return (
    <div className="rounded-xl border border-border/70 bg-card overflow-hidden shadow-sm">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-1 border-b border-border/60 bg-muted/30 p-1.5">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`size-8 p-0 ${editor.isActive("bold") ? "bg-muted text-brand font-bold" : ""}`}
          title="Bold"
        >
          <Bold className="size-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`size-8 p-0 ${editor.isActive("italic") ? "bg-muted text-brand" : ""}`}
          title="Italic"
        >
          <Italic className="size-4" />
        </Button>

        <div className="h-4 w-px bg-border/60 mx-1" />

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={`size-8 p-0 ${editor.isActive("heading", { level: 2 }) ? "bg-muted text-brand font-bold" : ""}`}
          title="Heading 2"
        >
          <Heading2 className="size-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          className={`size-8 p-0 ${editor.isActive("heading", { level: 3 }) ? "bg-muted text-brand font-bold" : ""}`}
          title="Heading 3"
        >
          <Heading3 className="size-4" />
        </Button>

        <div className="h-4 w-px bg-border/60 mx-1" />

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`size-8 p-0 ${editor.isActive("bulletList") ? "bg-muted text-brand" : ""}`}
          title="Bullet List"
        >
          <List className="size-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`size-8 p-0 ${editor.isActive("orderedList") ? "bg-muted text-brand" : ""}`}
          title="Numbered List"
        >
          <ListOrdered className="size-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={`size-8 p-0 ${editor.isActive("blockquote") ? "bg-muted text-brand" : ""}`}
          title="Quote"
        >
          <Quote className="size-4" />
        </Button>

        <div className="h-4 w-px bg-border/60 mx-1" />

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={setLink}
          className={`size-8 p-0 ${editor.isActive("link") ? "bg-muted text-brand" : ""}`}
          title="Add Link"
        >
          <LinkIcon className="size-4" />
        </Button>
        {editor.isActive("link") && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().unsetLink().run()}
            className="size-8 p-0 text-destructive"
            title="Remove Link"
          >
            <Unlink className="size-4" />
          </Button>
        )}

        <div className="ml-auto flex items-center gap-1">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().undo().run()}
            disabled={!editor.can().undo()}
            className="size-8 p-0"
            title="Undo"
          >
            <Undo className="size-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().redo().run()}
            disabled={!editor.can().redo()}
            className="size-8 p-0"
            title="Redo"
          >
            <Redo className="size-4" />
          </Button>
        </div>
      </div>

      {/* Content Area */}
      <div className="p-3 text-sm focus-within:outline-none" style={{ minHeight }}>
        <EditorContent
          editor={editor}
          className="prose prose-sm dark:prose-invert max-w-none focus:outline-none min-h-[160px]"
        />
      </div>
    </div>
  );
}
