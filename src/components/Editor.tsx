import { useState, useRef, useEffect } from "react";
import React from 'react'
import {MarkdownEditor} from "./MarkdownEditor";

export function Editor({ fileContent }: { fileContent: string }) {
  const [markdown, setMarkdown] = useState("");

  const editorRef = useRef<HTMLDivElement>(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
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
          <div>
            <MarkdownEditor />  
          </div>
        </div>
      </div>
    </div>
  );
}