import { useState, useRef, useEffect } from "react";
import { MarkdownEditor } from "./MarkdownEditor";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

export function Editor() {
  const [isEditing, setIsEditing] = useState(false);
  const [room, setRoom] = useState("hwlloww");
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
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const newRoom = new FormData(e.currentTarget).get("room") as string;
          if (newRoom.trim()) setRoom(newRoom.trim());
        }}
        className="flex items-center mb-4"
      >
        <Input name="room" placeholder="Enter Room ID" defaultValue={room} />
        <Button type="submit" className="mx-4">Change Room</Button>
      </form>
        <div
          ref={editorRef}
          tabIndex={0}
          className={`editor-content min-h-[700px] p-12 rounded-xl ${
            isEditing ? "ring-2 ring-primary/20" : ""
          }`}
        >
          <MarkdownEditor roomId={room} />
        </div>
      </div>
    </div>
  );
}