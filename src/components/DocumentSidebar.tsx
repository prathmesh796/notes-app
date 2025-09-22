import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Input } from "../components/ui/input";
import {
  FileText,
  Plus,
  Search,
  MoreVertical,
  Clock,
  Star,
} from "lucide-react";
import { useState, useEffect } from "react";

interface Document {
  id: string;
  title: string;
  lastModified: string;
  starred: boolean;
}

export function DocumentSidebar({
  setRoom,
}: {
  setRoom: (room: string) => void;
}) {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch documents from API
  useEffect(() => {
    const fetchDocs = async () => {
      try {
        const res = await fetch("/api/active-docs");
        if (!res.ok) throw new Error("Failed to fetch documents");

        const data = await res.json(); // { rooms: [...] }
        const docs: Document[] = data.rooms.map((room: string, i: number) => ({
          id: String(i + 1),
          title: room,
          lastModified: new Date().toLocaleString(), // 🔹 Server doesn’t send timestamp, so use now
          starred: false,
        }));

        setDocuments(docs);
      } catch (err) {
        console.error("Error fetching documents:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDocs();
  }, []);

  const createDoc = () => {
    let newDocTitle = `New_Document_${documents.length + 1}`;
    const newDoc: Document = {
      id: String(documents.length + 1),
      title: newDocTitle,
      lastModified: new Date().toLocaleString(),
      starred: false,
    };

    setDocuments((prev) => [...prev, newDoc]);
    console.log("Created new document", newDocTitle);
  };

  const openDoc = (doc: Document) => {
    setRoom(doc.title);
    console.log(`Open document: ${doc.title}`);
  };

  return (
    <div className="h-full w-full bg-editor-sidebar border-r border-border flex flex-col">
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
          <Input placeholder="Search documents..." className="pl-9 h-9" />
        </div>
      </div>

      {/* Documents list */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {loading ? (
          <p className="text-sm text-muted-foreground">Loading documents...</p>
        ) : documents.length === 0 ? (
          <p className="text-sm text-muted-foreground">No documents found</p>
        ) : (
          documents.map((doc) => (
            <Card
              key={doc.id}
              className="doc-card p-3 cursor-pointer hover:bg-accent/50 transition-colors"
              onClick={() => openDoc(doc)}
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
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0"
                      >
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
          ))
        )}
      </div>

      {/* Footer actions */}
      <div className="p-4 border-t border-border">
        <Button
          variant="outline"
          className="w-full"
          size="sm"
          onClick={createDoc}
        >
          <Plus className="w-4 h-4 mr-2" />
          New Document
        </Button>
      </div>
    </div>
  );
}
