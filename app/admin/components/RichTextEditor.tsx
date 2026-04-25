'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import TextAlign from '@tiptap/extension-text-align';
import Underline from '@tiptap/extension-underline';
import { Color } from '@tiptap/extension-color';
import { TextStyle } from '@tiptap/extension-text-style';
import { Table } from '@tiptap/extension-table';
import { TableRow } from '@tiptap/extension-table-row';
import { TableCell } from '@tiptap/extension-table-cell';
import { TableHeader } from '@tiptap/extension-table-header';
import { useEffect, useState } from 'react';
import {
  Bold, Italic, Underline as UnderlineIcon, List, ListOrdered,
  Heading1, Heading2, Heading3, AlignLeft, AlignCenter, AlignRight,
  Link as LinkIcon, Undo2, Redo2, RemoveFormatting, Minus, Palette,
  Table as TableIcon
} from 'lucide-react';

interface RichTextEditorProps {
  label: string;
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  rows?: number;
}

// Definición de colores premium corporativos
const BRAND_COLORS = [
  { name: 'Negro Base', value: '#1a1a1a' },
  { name: 'Azul Acrópolis', value: '#4661F6' }, // Color principal
  { name: 'Azul Secundario', value: '#1A2952' }, // Un azul más oscuro
  { name: 'Amarillo', value: '#FFD25E' }, 
  { name: 'Gris Texto', value: '#4b5563' },
  { name: 'Fucsia', value: '#FF5289' },
  { name: 'Cian', value: '#13C5B5' },
];

export default function RichTextEditor({
  label,
  value,
  onChange,
  placeholder = 'Escribe aquí...',
  rows = 6,
}: RichTextEditorProps) {
  const editor = useEditor({
    immediatelyRender: false,
    parseOptions: {
      preserveWhitespace: 'full',
    },
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3, 4] },
      }),
      Table.configure({
        resizable: true,
        HTMLAttributes: {
          class: 'w-full border-collapse border border-gray-300 my-4',
        },
      }),
      TableRow,
      TableHeader.configure({
        HTMLAttributes: {
          class: 'bg-gray-100 font-semibold border border-gray-300 p-2 text-left',
        },
      }),
      TableCell.configure({
        HTMLAttributes: {
          class: 'border border-gray-300 p-2',
        },
      }),
      Underline,
      TextStyle,
      Color,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: { class: 'text-azul-acropolis underline' },
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
    ],
    content: value || '',
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm max-w-none focus:outline-none min-h-[120px] px-4 py-3 text-negro whitespace-pre-wrap',
        style: `min-height: ${rows * 24}px`,
      },
    },
  });

  // Sync external value changes (e.g. when initialData changes)
  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value || '');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  const [showColorMenu, setShowColorMenu] = useState(false);

  if (!editor) return null;


  const addLink = () => {
    const url = window.prompt('URL del enlace:', 'https://');
    if (url) {
      editor.chain().focus().setLink({ href: url }).run();
    }
  };

  const ToolbarBtn = ({
    onClick,
    active = false,
    children,
    title,
  }: {
    onClick: () => void;
    active?: boolean;
    children: React.ReactNode;
    title: string;
  }) => (
    <button
      type="button"
      onClick={onClick}
      title={title}
      className={`flex h-7 w-7 items-center justify-center rounded transition-all ${
        active
          ? 'bg-azul-acropolis text-white shadow-sm'
          : 'text-gris-texto hover:bg-gray-200 hover:text-negro'
      }`}
    >
      {children}
    </button>
  );

  return (
    <div className="w-full">
      <label className="mb-1.5 block text-sm font-medium text-negro">
        {label}
      </label>

      <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
        {/* Toolbar */}
        <div className="flex flex-wrap items-center gap-0.5 border-b border-gray-100 bg-gray-50/80 px-2 py-1.5">
          {/* Formato de texto */}
          <div className="flex items-center gap-0.5 border-r border-gray-200 pr-1.5 mr-1">
            <ToolbarBtn onClick={() => editor.chain().focus().toggleBold().run()} active={editor.isActive('bold')} title="Negrita">
              <Bold size={14} />
            </ToolbarBtn>
            <ToolbarBtn onClick={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive('italic')} title="Cursiva">
              <Italic size={14} />
            </ToolbarBtn>
            <ToolbarBtn onClick={() => editor.chain().focus().toggleUnderline().run()} active={editor.isActive('underline')} title="Subrayado">
              <UnderlineIcon size={14} />
            </ToolbarBtn>
          </div>

          {/* Encabezados */}
          <div className="flex items-center gap-0.5 border-r border-gray-200 pr-1.5 mr-1">
            <ToolbarBtn onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} active={editor.isActive('heading', { level: 2 })} title="Título H2">
              <Heading1 size={14} />
            </ToolbarBtn>
            <ToolbarBtn onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} active={editor.isActive('heading', { level: 3 })} title="Subtítulo H3">
              <Heading2 size={14} />
            </ToolbarBtn>
            <ToolbarBtn onClick={() => editor.chain().focus().toggleHeading({ level: 4 }).run()} active={editor.isActive('heading', { level: 4 })} title="Encabezado H4">
              <Heading3 size={14} />
            </ToolbarBtn>
          </div>

          {/* Listas & Tablas */}
          <div className="flex items-center gap-0.5 border-r border-gray-200 pr-1.5 mr-1">
            <ToolbarBtn onClick={() => editor.chain().focus().toggleBulletList().run()} active={editor.isActive('bulletList')} title="Lista con viñetas">
              <List size={14} />
            </ToolbarBtn>
            <ToolbarBtn onClick={() => editor.chain().focus().toggleOrderedList().run()} active={editor.isActive('orderedList')} title="Lista numerada">
              <ListOrdered size={14} />
            </ToolbarBtn>
            <ToolbarBtn 
              onClick={() => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()} 
              active={editor.isActive('table')} 
              title="Insertar Tabla"
            >
              <TableIcon size={14} />
            </ToolbarBtn>
          </div>

          {/* Color del texto */}
          <div className="relative border-r border-gray-200 pr-1.5 mr-1 flex items-center">
            <button
              type="button"
              onClick={() => setShowColorMenu(!showColorMenu)}
              className="flex h-7 w-7 items-center justify-center rounded text-gris-texto hover:bg-gray-200 hover:text-negro transition-all"
              title="Color del texto"
            >
              <Palette size={14} />
            </button>
            
            {showColorMenu && (
              <div className="absolute top-full left-0 mt-1 z-50 bg-white border border-gray-200 shadow-lg rounded-xl p-2 w-48 flex flex-col gap-1">
                <div className="text-[10px] font-semibold text-gray-400 mb-1 px-1 uppercase tracking-wider">Colores Institucionales</div>
                <div className="grid grid-cols-5 gap-1.5">
                  {BRAND_COLORS.map((color) => (
                    <button
                      key={color.value}
                      type="button"
                      onClick={() => {
                        editor.chain().focus().setColor(color.value).run();
                        setShowColorMenu(false);
                      }}
                      className={`w-6 h-6 rounded-full border border-gray-200 transition-transform hover:scale-110 flex items-center justify-center ${editor.isActive('textStyle', { color: color.value }) ? 'ring-2 ring-blue-500 ring-offset-1' : ''}`}
                      style={{ backgroundColor: color.value }}
                      title={color.name}
                    />
                  ))}
                </div>
                <button
                  type="button"
                  onClick={() => {
                    editor.chain().focus().unsetColor().run();
                    setShowColorMenu(false);
                  }}
                  className="mt-2 text-xs text-center text-gray-500 hover:text-red-500 transition-colors w-full border-t pt-1"
                >
                  Restablecer color
                </button>
              </div>
            )}
          </div>

          {/* Alineación */}
          <div className="flex items-center gap-0.5 border-r border-gray-200 pr-1.5 mr-1">
            <ToolbarBtn onClick={() => editor.chain().focus().setTextAlign('left').run()} active={editor.isActive({ textAlign: 'left' })} title="Alinear izquierda">
              <AlignLeft size={14} />
            </ToolbarBtn>
            <ToolbarBtn onClick={() => editor.chain().focus().setTextAlign('center').run()} active={editor.isActive({ textAlign: 'center' })} title="Centrar">
              <AlignCenter size={14} />
            </ToolbarBtn>
            <ToolbarBtn onClick={() => editor.chain().focus().setTextAlign('right').run()} active={editor.isActive({ textAlign: 'right' })} title="Alinear derecha">
              <AlignRight size={14} />
            </ToolbarBtn>
          </div>

          {/* Extras */}
          <div className="flex items-center gap-0.5">
            <ToolbarBtn onClick={addLink} active={editor.isActive('link')} title="Insertar enlace">
              <LinkIcon size={14} />
            </ToolbarBtn>
            <ToolbarBtn onClick={() => editor.chain().focus().setHorizontalRule().run()} title="Línea separadora">
              <Minus size={14} />
            </ToolbarBtn>
            <ToolbarBtn onClick={() => editor.chain().focus().clearNodes().unsetAllMarks().run()} title="Limpiar formato">
              <RemoveFormatting size={14} />
            </ToolbarBtn>
          </div>

          {/* Undo/Redo */}
          <div className="ml-auto flex items-center gap-0.5">
            <ToolbarBtn onClick={() => editor.chain().focus().undo().run()} title="Deshacer">
              <Undo2 size={14} />
            </ToolbarBtn>
            <ToolbarBtn onClick={() => editor.chain().focus().redo().run()} title="Rehacer">
              <Redo2 size={14} />
            </ToolbarBtn>
          </div>
        </div>

        {/* Editor Area */}
        <EditorContent editor={editor} />
      </div>

      <p className="mt-1 text-[10px] text-gris-texto">
        Usa la barra de herramientas para dar formato. Soporta negritas, cursivas, listas, encabezados y enlaces.
      </p>
    </div>
  );
}
