'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { useEffect } from 'react'
import {
  Bold,
  Italic,
  Strikethrough,
  List,
  ListOrdered,
  Heading2,
  Heading3,
  Quote,
  Minus,
  Undo,
  Redo,
} from 'lucide-react'

interface TiptapEditorProps {
  content: string
  onChange: (html: string) => void
  placeholder?: string
}

export function TiptapEditor({ content, onChange, placeholder }: TiptapEditorProps): React.JSX.Element {
  const editor = useEditor({
    extensions: [StarterKit],
    content,
    editorProps: {
      attributes: {
        class: 'prose prose-invert prose-sm max-w-none min-h-[320px] p-5 focus:outline-none text-vma-text',
        ...(placeholder ? { 'data-placeholder': placeholder } : {}),
      },
    },
    onUpdate({ editor: ed }) {
      onChange(ed.getHTML())
    },
  })

  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content)
    }
  }, [content, editor])

  if (!editor) return <div className="h-80 animate-pulse rounded-b-xl bg-vma-surface" />

  const ToolbarButton = ({
    onClick,
    active,
    disabled,
    label,
    children,
  }: {
    onClick: () => void
    active?: boolean
    disabled?: boolean
    label: string
    children: React.ReactNode
  }): React.JSX.Element => (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      aria-pressed={active}
      className={`p-1.5 rounded transition-colors disabled:opacity-40 ${
        active
          ? 'bg-vma-violet text-white'
          : 'text-vma-text-muted hover:text-vma-text hover:bg-vma-surface-2'
      }`}
    >
      {children}
    </button>
  )

  return (
    <div className="rounded-xl border border-vma-border overflow-hidden bg-vma-surface">
      {/* Toolbar */}
      <div className="flex items-center gap-0.5 flex-wrap px-3 py-2 border-b border-vma-border bg-vma-surface">
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBold().run()}
          active={editor.isActive('bold')}
          label="Bold"
        >
          <Bold className="h-3.5 w-3.5" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleItalic().run()}
          active={editor.isActive('italic')}
          label="Italic"
        >
          <Italic className="h-3.5 w-3.5" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleStrike().run()}
          active={editor.isActive('strike')}
          label="Strikethrough"
        >
          <Strikethrough className="h-3.5 w-3.5" />
        </ToolbarButton>
        <div className="w-px h-5 bg-vma-border mx-1" />
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          active={editor.isActive('heading', { level: 2 })}
          label="Heading 2"
        >
          <Heading2 className="h-3.5 w-3.5" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          active={editor.isActive('heading', { level: 3 })}
          label="Heading 3"
        >
          <Heading3 className="h-3.5 w-3.5" />
        </ToolbarButton>
        <div className="w-px h-5 bg-vma-border mx-1" />
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          active={editor.isActive('bulletList')}
          label="Bullet list"
        >
          <List className="h-3.5 w-3.5" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          active={editor.isActive('orderedList')}
          label="Ordered list"
        >
          <ListOrdered className="h-3.5 w-3.5" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          active={editor.isActive('blockquote')}
          label="Blockquote"
        >
          <Quote className="h-3.5 w-3.5" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
          label="Horizontal rule"
        >
          <Minus className="h-3.5 w-3.5" />
        </ToolbarButton>
        <div className="w-px h-5 bg-vma-border mx-1" />
        <ToolbarButton
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          label="Undo"
        >
          <Undo className="h-3.5 w-3.5" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
          label="Redo"
        >
          <Redo className="h-3.5 w-3.5" />
        </ToolbarButton>
      </div>

      {/* Editor body */}
      <EditorContent editor={editor} />
    </div>
  )
}
