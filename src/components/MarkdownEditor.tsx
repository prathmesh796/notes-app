import { Crepe } from "@milkdown/crepe";
import { Milkdown, useEditor } from "@milkdown/react";
import { collab, collabServiceCtx } from "@milkdown/plugin-collab";
import { Doc } from "yjs";
import { WebsocketProvider } from "y-websocket";
import "@milkdown/crepe/theme/common/style.css";
import "@milkdown/crepe/theme/frame.css";
import React, { useEffect, useMemo } from "react";

export const MarkdownEditor = ({roomId}:{roomId: string}) => {
  const [crepe, setCrepe] = React.useState<Crepe | null>(null);
  
  const doc = useMemo(() => new Doc(), [roomId]);
  const wsProvider = useMemo(
    () =>
      { 
        const wsp = new WebsocketProvider("ws://localhost:1234", roomId, doc)
        console.log(wsp);
        return wsp;
      },
    [roomId, doc]
  );

  useEditor((root) => {
    const editorInstance = new Crepe({
      root,
      defaultValue: "",
    });
    editorInstance.editor.use(collab);
    setCrepe(editorInstance);
    return editorInstance;
  }, [roomId, wsProvider, doc]);

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
