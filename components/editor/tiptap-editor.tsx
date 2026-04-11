'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Link from '@tiptap/extension-link'
import Image from '@tiptap/extension-image'
import Placeholder from '@tiptap/extension-placeholder'
import { EditorToolbar } from './editor-toolbar'

interface TiptapEditorProps {
  content?: string
  onChange?: (content: string) => void
  placeholder?: string
}

export function TiptapEditor({
  content = '',
  onChange,
  placeholder = 'Tell your story...',
}: TiptapEditorProps) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-primary underline underline-offset-4 cursor-pointer',
        },
      }),
      Image.configure({
        HTMLAttributes: {
          class: 'rounded-lg max-w-full mx-auto my-8',
        },
      }),
      Placeholder.configure({
        placeholder,
        emptyEditorClass:
          'before:content-[attr(data-placeholder)] before:text-muted-foreground before:float-left before:h-0 before:pointer-events-none',
      }),
    ],
    content,
    editorProps: {
      attributes: {
        class:
          'prose-article min-h-[400px] w-full focus:outline-none font-serif text-lg leading-relaxed',
      },
    },
    onUpdate: ({ editor }) => {
      onChange?.(editor.getHTML())
    },
  })

  return (
    <div className="space-y-4">
      <EditorToolbar editor={editor} />
      <EditorContent editor={editor} className="px-4 sm:px-0" />
    </div>
  )
}
