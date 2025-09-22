import { Crepe } from "@milkdown/crepe";
import { Milkdown, useEditor } from "@milkdown/react";
import { collab, collabServiceCtx } from "@milkdown/plugin-collab";
import { Doc } from "yjs";
import { WebsocketProvider } from "y-websocket";
import "@milkdown/crepe/theme/common/style.css";
import "@milkdown/crepe/theme/frame.css";
import { useEffect, useMemo, useState } from "react";

export const MarkdownEditor = ({ roomId }: { roomId: string }) => {
  const [crepe, setCrepe] = useState<Crepe | null>(null);
  const [status, setStatus] = useState<"Connecting" | "Connected" | "Disconnected">("Connecting");

  // Create Yjs Doc + Provider
  const doc = useMemo(() => new Doc(), [roomId]);
  const wsProvider = useMemo(() => {
    console.log("Connecting to WebSocket with room:", roomId);
    const wsp = new WebsocketProvider(
      "ws://ec2-13-62-104-125.eu-north-1.compute.amazonaws.com:1234",
      roomId,
      doc
    );

    wsp.on("status", (event) => {
      console.log("[CLIENT] WS status:", event.status);
      if (event.status === "connected") setStatus("Connected");
      else setStatus("Disconnected");
    });

    return wsp;
  }, [roomId, doc]);

  // Attach a debug observer to the Y.Doc
  useEffect(() => {
    const ytext = doc.getText("content");
    const observer = (event: any) => {
      console.log("[CLIENT] Local Y.Text changed:", ytext.toString(), event);
    };
    ytext.observe(observer);

    return () => ytext.unobserve(observer);
  }, [doc]);

  // Setup Milkdown editor
  useEditor(
    (root) => {
      const editorInstance = new Crepe({
        root,
        defaultValue: "",
      });
      editorInstance.editor.use(collab);
      setCrepe(editorInstance);
      return editorInstance;
    },
    [roomId, wsProvider, doc]
  );

  // Bind collab when editor is created
  useEffect(() => {
    if (!crepe) return;
    if (crepe.editor.status === "Created") {
      crepe.editor.action((ctx) => {
        const collabService = ctx.get(collabServiceCtx);
        collabService
          .bindDoc(doc) // connect Y.Doc to Milkdown
          .setAwareness(wsProvider.awareness)
          .connect();
        console.log("[CLIENT] Collab service bound to shared doc");
      });
    }
  }, [crepe, doc, wsProvider]);

  return (
    <div>
      <div style={{ marginBottom: "6px", fontSize: "14px" }}>
        Status:{" "}
        <span
          style={{
            color: status === "Connected" ? "green" : status === "Disconnected" ? "red" : "orange",
            fontWeight: "bold",
          }}
        >
          {status}
        </span>
      </div>
      <Milkdown />
    </div>
  );
};
