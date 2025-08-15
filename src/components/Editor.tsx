import { useState, useRef, useEffect } from "react";
import { MarkdownEditor } from "./MarkdownEditor";

export function Editor() {
  const [isEditing, setIsEditing] = useState(false);
  const editorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const editorEl = editorRef.current;
    if (!editorEl) return;

    const handleFocus = () => setIsEditing(true);
    const handleBlur = () => setIsEditing(false);

    editorEl.addEventListener("focusin", handleFocus);
    editorEl.addEventListener("focusout", handleBlur);

    return () => {
      editorEl.removeEventListener("focusin", handleFocus);
      editorEl.removeEventListener("focusout", handleBlur);
    };
  }, []);

  return (
    <div className="flex-1 flex justify-center p-8 organic-bg">
      <div className="w-full max-w-4xl">
        <div
          ref={editorRef}
          tabIndex={0}
          className={`editor-content min-h-[700px] p-12 rounded-xl ${
            isEditing ? "ring-2 ring-primary/20" : ""
          }`}
        >
          <MarkdownEditor />
        </div>
      </div>
    </div>
  );
}