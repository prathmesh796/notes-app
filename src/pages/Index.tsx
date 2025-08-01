import { Header } from "../components/Header";
import { Toolbar } from "../components/Toolbar";
import { DocumentSidebar } from "../components/DocumentSidebar";
import { Editor } from "../components/Editor";
import { useState } from "react";


const Index = () => {
  //Shared State
  const [fileContent, setFileContent] = useState<string>("");

  return (
    <div className="h-screen flex flex-col bg-background">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <DocumentSidebar  setFileContent = {setFileContent}   />
        <div className="flex-1 flex flex-col">
          <Toolbar/>
          <Editor fileContent = {fileContent} />
        </div>
      </div>
    </div>
  );
};

export default Index;
