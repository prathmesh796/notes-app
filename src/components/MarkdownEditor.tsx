import type { FC } from "react";
import { Crepe } from "@milkdown/crepe";
import { Milkdown, useEditor } from "@milkdown/react";
import { collab,collabServiceCtx  } from "@milkdown/plugin-collab";
import { Doc } from "yjs";
import { WebsocketProvider } from "y-websocket";
import "@milkdown/crepe/theme/common/style.css";
import "@milkdown/crepe/theme/frame.css";

const markdown = `# Milkdown React Crepe

> You're scared of a world where you're needed.

This is a demo for using Crepe with **React**.`;

const setupCollab = (crepe : Crepe) => {
  const doc = new Doc();
  const wsProvider = new WebsocketProvider(
    "ws://localhost:1234",
    "milkdown-demo",
    doc
  );
  console.log("[CLIENT] Connected to WebSocket:", wsProvider.url);
  console.log("[CLIENT] Milkdown ready, initializing collab...");
  crepe.editor.action((ctx) => {
    const collabService = ctx.get(collabServiceCtx);
    collabService
      .bindDoc(doc)
      .setAwareness(wsProvider.awareness)
      .connect();

    console.log("[CLIENT] Collab service bound to doc");
  });
}

export const MarkdownEditor: FC = () => {
  useEditor((root) => {
    const crepe = new Crepe({
      root,
      defaultValue: markdown,
    });
    crepe.editor.use(collab);
    setupCollab(crepe);
    return crepe;
  }, []);

  return <Milkdown />;
};