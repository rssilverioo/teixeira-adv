'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import Link from '@tiptap/extension-link';
import ImageExtension from '@tiptap/extension-image';
import Placeholder from '@tiptap/extension-placeholder';
import Highlight from '@tiptap/extension-highlight';
import { TextStyle } from '@tiptap/extension-text-style';
import { Color } from '@tiptap/extension-color';
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Strikethrough,
  Code,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Minus,
  Undo,
  Redo,
  Link as LinkIcon,
  Unlink,
  Image as ImageIcon,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Highlighter,
  RemoveFormatting,
} from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';

interface RichTextEditorProps {
  content: string;
  onChange: (html: string) => void;
  placeholder?: string;
}

function ToolbarButton({
  onClick,
  active,
  disabled,
  title,
  children,
}: {
  onClick: () => void;
  active?: boolean;
  disabled?: boolean;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={`p-1.5 rounded transition-colors ${
        active
          ? 'bg-gray-800 text-white'
          : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
      } ${disabled ? 'opacity-30 cursor-not-allowed' : ''}`}
    >
      {children}
    </button>
  );
}

function ToolbarSeparator() {
  return <div className="w-px h-6 bg-gray-200 mx-1" />;
}

export default function RichTextEditor({ content, onChange, placeholder }: RichTextEditorProps) {
  const [linkUrl, setLinkUrl] = useState('');
  const [showLinkInput, setShowLinkInput] = useState(false);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
      }),
      Underline,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-blue-600 underline cursor-pointer',
        },
      }),
      ImageExtension.configure({
        HTMLAttributes: {
          class: 'rounded-lg max-w-full mx-auto',
        },
      }),
      Placeholder.configure({
        placeholder: placeholder ?? 'Comece a escrever seu artigo...',
      }),
      Highlight.configure({
        multicolor: false,
      }),
      TextStyle,
      Color,
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class:
          'prose prose-sm sm:prose-base max-w-none focus:outline-none min-h-[400px] px-4 py-3 text-gray-900',
      },
    },
  });

  useEffect(() => {
    if (editor && content && editor.getHTML() !== content) {
      editor.commands.setContent(content);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [content]);

  const addImage = useCallback(() => {
    const url = window.prompt('URL da imagem:');
    if (url && editor) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  }, [editor]);

  const setLink = useCallback(() => {
    if (!editor) return;

    if (showLinkInput) {
      if (linkUrl) {
        editor
          .chain()
          .focus()
          .extendMarkRange('link')
          .setLink({ href: linkUrl })
          .run();
      }
      setShowLinkInput(false);
      setLinkUrl('');
    } else {
      const previousUrl = editor.getAttributes('link').href ?? '';
      setLinkUrl(previousUrl);
      setShowLinkInput(true);
    }
  }, [editor, linkUrl, showLinkInput]);

  const removeLink = useCallback(() => {
    if (!editor) return;
    editor.chain().focus().unsetLink().run();
  }, [editor]);

  if (!editor) return null;

  const iconSize = 16;

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden bg-white">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-0.5 p-2 border-b border-gray-200 bg-gray-50">
        {/* Undo/Redo */}
        <ToolbarButton
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          title="Desfazer"
        >
          <Undo size={iconSize} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
          title="Refazer"
        >
          <Redo size={iconSize} />
        </ToolbarButton>

        <ToolbarSeparator />

        {/* Headings */}
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          active={editor.isActive('heading', { level: 1 })}
          title="Título 1"
        >
          <Heading1 size={iconSize} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          active={editor.isActive('heading', { level: 2 })}
          title="Título 2"
        >
          <Heading2 size={iconSize} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          active={editor.isActive('heading', { level: 3 })}
          title="Título 3"
        >
          <Heading3 size={iconSize} />
        </ToolbarButton>

        <ToolbarSeparator />

        {/* Text formatting */}
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBold().run()}
          active={editor.isActive('bold')}
          title="Negrito"
        >
          <Bold size={iconSize} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleItalic().run()}
          active={editor.isActive('italic')}
          title="Itálico"
        >
          <Italic size={iconSize} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          active={editor.isActive('underline')}
          title="Sublinhado"
        >
          <UnderlineIcon size={iconSize} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleStrike().run()}
          active={editor.isActive('strike')}
          title="Tachado"
        >
          <Strikethrough size={iconSize} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHighlight().run()}
          active={editor.isActive('highlight')}
          title="Destacar"
        >
          <Highlighter size={iconSize} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleCode().run()}
          active={editor.isActive('code')}
          title="Código"
        >
          <Code size={iconSize} />
        </ToolbarButton>

        <ToolbarSeparator />

        {/* Alignment */}
        <ToolbarButton
          onClick={() => editor.chain().focus().setTextAlign('left').run()}
          active={editor.isActive({ textAlign: 'left' })}
          title="Alinhar à esquerda"
        >
          <AlignLeft size={iconSize} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().setTextAlign('center').run()}
          active={editor.isActive({ textAlign: 'center' })}
          title="Centralizar"
        >
          <AlignCenter size={iconSize} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().setTextAlign('right').run()}
          active={editor.isActive({ textAlign: 'right' })}
          title="Alinhar à direita"
        >
          <AlignRight size={iconSize} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().setTextAlign('justify').run()}
          active={editor.isActive({ textAlign: 'justify' })}
          title="Justificar"
        >
          <AlignJustify size={iconSize} />
        </ToolbarButton>

        <ToolbarSeparator />

        {/* Lists */}
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          active={editor.isActive('bulletList')}
          title="Lista"
        >
          <List size={iconSize} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          active={editor.isActive('orderedList')}
          title="Lista numerada"
        >
          <ListOrdered size={iconSize} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          active={editor.isActive('blockquote')}
          title="Citação"
        >
          <Quote size={iconSize} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
          title="Linha horizontal"
        >
          <Minus size={iconSize} />
        </ToolbarButton>

        <ToolbarSeparator />

        {/* Link */}
        <ToolbarButton
          onClick={setLink}
          active={editor.isActive('link')}
          title="Link"
        >
          <LinkIcon size={iconSize} />
        </ToolbarButton>
        {editor.isActive('link') && (
          <ToolbarButton onClick={removeLink} title="Remover link">
            <Unlink size={iconSize} />
          </ToolbarButton>
        )}

        {/* Image */}
        <ToolbarButton onClick={addImage} title="Imagem">
          <ImageIcon size={iconSize} />
        </ToolbarButton>

        <ToolbarSeparator />

        {/* Clear formatting */}
        <ToolbarButton
          onClick={() => editor.chain().focus().clearNodes().unsetAllMarks().run()}
          title="Limpar formatação"
        >
          <RemoveFormatting size={iconSize} />
        </ToolbarButton>
      </div>

      {/* Link input */}
      {showLinkInput && (
        <div className="flex items-center gap-2 p-2 border-b border-gray-200 bg-blue-50">
          <input
            type="url"
            value={linkUrl}
            onChange={(e) => setLinkUrl(e.target.value)}
            placeholder="https://exemplo.com"
            className="flex-1 px-3 py-1.5 text-sm border border-gray-200 rounded bg-white text-gray-900"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                setLink();
              }
              if (e.key === 'Escape') {
                setShowLinkInput(false);
                setLinkUrl('');
              }
            }}
            autoFocus
          />
          <button
            type="button"
            onClick={setLink}
            className="px-3 py-1.5 text-sm bg-gray-800 text-white rounded hover:bg-gray-700"
          >
            Aplicar
          </button>
          <button
            type="button"
            onClick={() => {
              setShowLinkInput(false);
              setLinkUrl('');
            }}
            className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900"
          >
            Cancelar
          </button>
        </div>
      )}

      {/* Editor */}
      <EditorContent editor={editor} />
    </div>
  );
}
