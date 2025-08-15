import type { FC } from "react";
import { Crepe } from "@milkdown/crepe";
import { Milkdown, useEditor } from "@milkdown/react";
import { collab, collabServiceCtx } from "@milkdown/plugin-collab";
import { Doc, XmlFragment } from "yjs";
import { WebsocketProvider } from "y-websocket";
import "@milkdown/crepe/theme/common/style.css";
import "@milkdown/crepe/theme/frame.css";
import React, { useEffect } from "react";

export const MarkdownEditor: FC = () => {
  const [crepe, setCrepe] = React.useState<Crepe | null>(null);
  const doc = new Doc();
  const wsProvider = new WebsocketProvider(
    "ws://localhost:1234",
    "milkdown-demo",
    doc
  );
  
  useEditor((root) => {
    const editorInstance = new Crepe({
      root,
      defaultValue: "",
    });

    editorInstance.editor.use(collab);
    setCrepe(editorInstance);
    return editorInstance;
  }, []);

  useEffect(() => {
    if (!crepe) return;

    const setup = () => {
      if (crepe.editor.status === "Created") {
        crepe.editor.action((ctx) => {
          const collabService = ctx.get(collabServiceCtx);
          collabService.bindDoc(doc).setAwareness(wsProvider.awareness).connect();
          console.log("[CLIENT] Collab service bound to shared doc");
        });
      }
    };

    setup();
  }, [crepe]); 

  return <Milkdown />;
};
