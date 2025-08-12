import { useState, useRef, useEffect } from "react";
import { useInstance } from "@milkdown/react";
import { editorViewCtx } from "@milkdown/kit/core";
import { collab, collabServiceCtx } from "@milkdown/plugin-collab";
import { MarkdownEditor } from "./MarkdownEditor";
import { Doc } from "yjs";
import { WebsocketProvider } from "y-websocket";

export function Editor() {
  const [isEditing, setIsEditing] = useState(false);
  const editorRef = useRef<HTMLDivElement>(null);

  const [isLoading, getInstance] = useInstance();

  useEffect(() => {
    const setupCollab = async () => {
      console.log("[CLIENT] Waiting for Milkdown editor instance...");
      const editor = await getInstance();
  
      if (!editor) {
        console.warn("[CLIENT] No editor instance found");
      }
      else {
      console.log("[CLIENT] Editor instance:", editor);
  
      const doc = new Doc();
      const wsProvider = new WebsocketProvider(
        "ws://localhost:1234",
        "milkdown-demo",
        doc
      );
      console.log("[CLIENT] Connected to WebSocket:", wsProvider.url);
      console.log("[CLIENT] Milkdown ready, initializing collab...");
      editor.action((ctx) => {
        const collabService = ctx.get(collabServiceCtx);
        collabService
          .bindDoc(doc)
          .setAwareness(wsProvider.awareness)
          .connect();
  
        console.log("[CLIENT] Collab service bound to doc");
  
        const view = ctx.get(editorViewCtx);
        console.log("[CLIENT] EditorView ready:", view);
      });
    }
    };
  
    setupCollab();
  }, [getInstance]);
  

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