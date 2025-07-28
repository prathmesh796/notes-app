import { useState } from "react";

export default function useFileContent(){
    const [fileContent, setFileContent] = useState<string>("");

    return { fileContent, setFileContent };
}