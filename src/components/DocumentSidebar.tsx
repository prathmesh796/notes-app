import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Input } from "../components/ui/input";
import {
  FileText,
  Plus,
  Search,
  MoreVertical,
  Clock,
  Star
} from "lucide-react";
import { useState } from "react";
import { create, readTextFile, BaseDirectory } from "@tauri-apps/plugin-fs";

interface Document {
  id: string;
  title: string;
  lastModified: string;
  starred: boolean;
}

export function DocumentSidebar({ onSelectDocument }: { onSelectDocument: (content: string) => void }) {
 
  const [documents, setDocuments] = useState<Document[]>([]);
  const createDoc = async () => {
    // Logic to create a new document
    // This could be a modal or redirect to a new document page
    let newDocTitle = `New Document ${documents.length + 1}`;
    setDocuments([
      ...documents,
      {
        id: String(documents.length + 1),
        title: newDocTitle,
        lastModified: new Date().toLocaleString(),
        starred: false
      }
    ]);

    const file = await create(
      `${newDocTitle}.md`,
      {
        baseDir: BaseDirectory.AppData
      }
    );
    await file.write(new TextEncoder().encode('Hello world'));
    await file.close();

    console.log("Create new document");
  };

  const openDoc = async (doc: Document) => {
    const file = await readTextFile(`${doc.title}.md`, {
      baseDir: BaseDirectory.AppData,
    });
    onSelectDocument(file);
    console.log(`Open document: ${file}`);
  };

  return (
    <div className="w-80 h-full bg-editor-sidebar border-r border-border flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-foreground">Documents</h2>
          <Button size="sm" className="h-8 w-8 p-0" onClick={createDoc}>
            <Plus className="w-4 h-4" />
          </Button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search documents..."
            className="pl-9 h-9"
          />
        </div>
      </div>

      {/* Documents list */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {documents.map((doc) => (
          <button onClick={() => openDoc(doc)} className="w-full" key={doc.id}>
            <Card
              key={doc.id}
              className="doc-card p-3 cursor-pointer hover:bg-accent/50 transition-colors"

            >
              <div className="flex items-start gap-3">
                <div className="mt-1">
                  <FileText className="w-4 h-4 text-muted-foreground" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium text-sm text-foreground truncate">
                      {doc.title}
                    </h3>
                    <div className="flex items-center gap-1 ml-2">
                      {doc.starred && (
                        <Star className="w-3 h-3 text-primary fill-current" />
                      )}
                      <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                        <MoreVertical className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 mt-1">
                    <Clock className="w-3 h-3 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">
                      {doc.lastModified}
                    </span>
                  </div>
                </div>
              </div>
            </Card>
          </button>
        ))}
      </div>

      {/* Footer actions */}
      <div className="p-4 border-t border-border">
        <Button variant="outline" className="w-full" size="sm">
          <Plus className="w-4 h-4 mr-2" />
          New Document
        </Button>
      </div>
    </div>
  );
}