import { useState, useRef, useEffect } from "react";
import React from 'react'
import { createRoot } from 'react-dom/client'
import Markdown from 'react-markdown'

export function Editor({ fileContent }: { fileContent: string }) {
  const [markdown, setMarkdown] = useState("");

  const editorRef = useRef<HTMLDivElement>(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    // Initialize the editor with the file content
    if (fileContent) {
      setMarkdown(fileContent);
    }
  }, [fileContent]);

  useEffect(() => {
    const editor = editorRef.current;
    if (!editor) return;

    const handleInput = () => {
      setMarkdown(editor.innerHTML);
    };

    const handleFocus = () => setIsEditing(true);
    const handleBlur = () => setIsEditing(false);

    editor.addEventListener('input', handleInput);
    editor.addEventListener('focus', handleFocus);
    editor.addEventListener('blur', handleBlur);

    return () => {
      editor.removeEventListener('input', handleInput);
      editor.removeEventListener('focus', handleFocus);
      editor.removeEventListener('blur', handleBlur);
    };
  }, []);

  return (
    <div className="flex-1 flex justify-center p-8 organic-bg">
      <div className="w-full max-w-4xl">
        <div
          className={`editor-content min-h-[700px] p-12 rounded-xl ${isEditing ? 'ring-2 ring-primary/20' : ''
            }`}
        >
          {/* <div
            ref={editorRef}
            contentEditable
            suppressContentEditableWarning
            className="outline-none prose prose-lg max-w-none"
            style={{
              minHeight: '600px',
              fontFamily: 'Inter, system-ui, sans-serif',
              lineHeight: '1.6',
              color: 'hsl(var(--foreground))'
            }}
            onPaste={(e) => {
              e.preventDefault();
              const text = e.clipboardData.getData('text/plain');
              document.execCommand('insertText', false, text);
            }}
          /> */}
          <div>
            <textarea
              value={markdown}
              onChange={(e) => setMarkdown(e.target.value)}
              placeholder="Type your Markdown here..."
              style={{ width: '100%', height: '150px' }}
            />
            <div style={{ marginTop: 16 }}>
              <Markdown>{markdown}</Markdown>
            </div>
          </div>

          {/* Collaboration cursors placeholder */}
          {/* <div className="absolute top-16 left-16 collab-cursor bg-blue-500" style={{ display: 'none' }}>
            <div className="absolute -top-6 left-0 bg-blue-500 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
              Alex is editing
            </div>
          </div> */}
        </div>

        {/* Document stats */}
        <div className="mt-4 flex justify-between text-sm text-muted-foreground">
          <span>Last saved: Just now</span>
          <div className="flex gap-4">
            {/* <span>Words: {content.replace(/<[^>]*>/g, '').split(/\s+/).filter(Boolean).length}</span>
            <span>Characters: {content.replace(/<[^>]*>/g, '').length}</span> */}
          </div>
        </div>
      </div>
    </div>
  );
}