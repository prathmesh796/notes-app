import { useState, useEffect } from "react";
import { parseMarkdown } from "./services/markdownParser";
import { renderNode } from "./components/renderNode";
import { unified } from "unified";
import remarkStringify from "remark-stringify";
import "./App.css";

const initialMarkdown = `# Live Markdown Editor

This is a **structured editor** backed by markdown.

## Features

- Parse markdown to AST
- Render React components from AST
- Edit inline and convert back to markdown
- Support for *emphasis* and **strong** text

Try editing this text by clicking on it!`;

function App() {
  const [ast, setAst] = useState<any>(null);

  // Parse initial markdown to AST on mount
  useEffect(() => {
    setAst(parseMarkdown(initialMarkdown));
  }, []);

  // Automatically serialize AST back to markdown whenever it changes
  useEffect(() => {
    if (ast) {
      const serialized = unified().use(remarkStringify).stringify(ast);
      console.log("Auto-serialized markdown:", serialized);
      // You can use this serialized markdown for saving to backend, etc.
    }
  }, [ast]);

  // Function to update a specific node in the AST
  const updateNode = (path: number[], newValue: string) => {
    if (!ast) return;

    // Deep clone the AST to avoid mutations
    const newAst = JSON.parse(JSON.stringify(ast));

    // Navigate to the node using the path
    let current = newAst;
    for (let i = 0; i < path.length - 1; i++) {
      current = current.children[path[i]];
    }

    // Update the target node
    const targetIndex = path[path.length - 1];
    if (current.children && current.children[targetIndex]) {
      current.children[targetIndex].value = newValue;
    }

    // Update AST - this will trigger auto-serialization
    setAst(newAst);
  };

  return (
    <main style={{ maxWidth: "900px", margin: "0 auto", padding: "2rem" }}>
      <div style={{
        marginBottom: "1rem"
      }}>
        <h1 style={{ margin: 0 }}>Live Markdown Editor</h1>
        <p style={{ color: "#666", fontSize: "14px", marginTop: "0.5rem" }}>
          Click on any text to edit. Changes are automatically converted to markdown.
        </p>
      </div>

      <div style={{
        border: "1px solid #ddd",
        borderRadius: "8px",
        padding: "2rem",
        backgroundColor: "#fafafa",
        minHeight: "400px"
      }}>
        {ast &&
          ast.children.map((node: any, i: number) => (
            <div key={i}>{renderNode(node, [i], updateNode)}</div>
          ))}
      </div>
    </main>
  )
}

export default App
