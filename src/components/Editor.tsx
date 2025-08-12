import { useState, useRef, useEffect } from "react";
import { useInstance } from "@milkdown/react";
import { editorViewCtx } from '@milkdown/kit/core'
import { Transform } from "prosemirror-transform";
import {MarkdownEditor} from "./MarkdownEditor";
import { EditorView } from "@milkdown/prose/view";

export function Editor() {
  const [isLoading, getInstance] = useInstance();
  const editorRef = useRef<HTMLDivElement>(null);
  const [isEditing, setIsEditing] = useState(false);
  const editor = getInstance();

  const editDoc = (view: EditorView): void => {
    let tr = new Transform(view.state.doc);
  
    tr.delete(5, 7);
    tr.split(5);
  
    console.log("Modified doc (debug):", tr.doc.toString());
    console.log("Step count:", tr.steps.length); // → 2
  
    view.dispatch(
        view.state.tr
            .step(tr.steps[0])
            .step(tr.steps[1])
    );
  };
  const getUpdates = (view: EditorView) : void => {
    const origDispatch = view.dispatch
    
    view.dispatch = (tr) => {
    if (!tr.docChanged) return origDispatch(tr)
    const steps = tr.steps.map(step => step.toJSON())

    console.log(steps[0], steps[0].slice?.content[0]);

    // Send steps to server
    // sendStepsToServer(steps)

    origDispatch(tr)   

    return () => {
      view.dispatch = origDispatch;
    };
  }
  }
// OT’s job:
// Server tracks a version number (or sequence).
// Each client sends its step with the version number it was based on.
// If the server’s current version > client’s version, the server:
// Transforms the incoming step against all newer steps.
// Applies the transformed step to the canonical document.
// Broadcasts the transformed step to all clients.
// This guarantees:
// Everyone ends up with the same doc.
// Steps never fail due to mismatched positions.

  if (!editor){
    console.log("editor not found")
  }
  else
  {
    editor.action((ctx) => {
          const view = ctx.get(editorViewCtx)
          getUpdates(view);
        }
      )
  }
  useEffect(() => {
    const editor = editorRef.current;
    if (!editor) return;

    const handleInput = () => {
      // setMarkdown(editor.innerHTML);
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