import { Header } from "../components/Header";
import { Toolbar } from "../components/Toolbar";
import { DocumentSidebar } from "../components/DocumentSidebar";
import { Editor } from "../components/Editor";
import { useState } from "react";
import { MilkdownProvider } from "@milkdown/react";
import { StrictMode } from "react";

const Index = () => {
  const [currentFile, setCurrentFile] = useState<string | null>(null);

  return (
    <StrictMode>
      <MilkdownProvider>
        <div className="h-screen flex flex-col bg-background">
          <Header />
          <div className="flex flex-1 overflow-hidden">
            {/* Sidebar - only visible on xl */}
            <div className="hidden xl:flex xl:w-64 border-r min-w-0">
              <DocumentSidebar setRoom={setCurrentFile} />
            </div>

            {/* Main area */}
            <div className="flex-1 flex flex-col min-w-0">
              <Toolbar />
              <div className="flex-1 overflow-auto">
                <Editor room={currentFile} />
              </div>
            </div>
          </div>
        </div>
      </MilkdownProvider>
    </StrictMode>
  );
};

export default Index;
