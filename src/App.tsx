// src/WhatsApp.tsx
import React, { useState } from "react";
import Editor from "./components/Editor";
import FileUpload from "./components/FileUpload";

const WhatsApp: React.FC = () => {
  const [editorValue, setEditorValue] = useState("");

  return (
    <div className="flex flex-row justify-center items-center h-screen bg-gray-100">
      <Editor updatePreview={(value) => setEditorValue(value)} />
      <FileUpload editorValue={editorValue} />
    </div>
  );
};

export default WhatsApp;
