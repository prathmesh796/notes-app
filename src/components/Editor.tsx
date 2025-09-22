import { useState, useRef, useEffect } from "react";
import { MarkdownEditor } from "./MarkdownEditor";

export function Editor({ room }: { room: string | null }) {
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
    <div className="flex-1 flex justify-center p-4 md:p-8 overflow-auto">
      <div className="w-full max-w-4xl h-full">
        <div
          ref={editorRef}
          tabIndex={0}
          className={`editor-content h-full min-h-[500px] md:min-h-[700px] p-6 md:p-12 rounded-xl bg-card ${
            isEditing ? "ring-2 ring-primary/20" : ""
          }`}
        >
          {room ? (
            <MarkdownEditor roomId={room} />
          ) : (
            <p className="text-muted-foreground">
              Select a document from the sidebar to start editing
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
