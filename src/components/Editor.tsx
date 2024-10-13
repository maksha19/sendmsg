// src/components/Editor.tsx
import React, { useState } from "react";
import { renderPreview } from "./util";

interface EditorProps {
    updatePreview: (value: string) => void;
}

const Editor: React.FC<EditorProps> = ({ updatePreview }) => {
    const [editorValue, setEditorValue] = useState("");
    const applyFormatting = (format: string) => {
        const textarea = document.getElementById("editor") as HTMLTextAreaElement;
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;

        if (start !== end) {
            const selectedText = editorValue.substring(start, end);
            let formattedText = "";

            if (format === "bold") formattedText = `*${selectedText}*`;
            else if (format === "italic") formattedText = `_${selectedText}_`;
            else if (format === "strike") formattedText = `~${selectedText}~`;

            const newValue = editorValue.substring(0, start) + formattedText + editorValue.substring(end);
            setEditorValue(newValue);
            updatePreview(newValue);
        }
    };


    const handleEditorChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const newValue = e.target.value;
        setEditorValue(newValue);
        updatePreview(newValue);
    };

    return (
        <div className="bg-white w-1/2 m-4 p-6 h-5/6 rounded-lg shadow-md ">
            <h1 className="text-2xl font-bold mb-4">Custom Markdown Editor</h1>
            {/* Formatting buttons */}
            <>
                <div className="mb-4 space-x-2">
                    <button
                        onClick={() => applyFormatting("bold")}
                        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-700"
                    >
                        Bold
                    </button>
                    <button
                        onClick={() => applyFormatting("italic")}
                        className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-700"
                    >
                        Italic
                    </button>
                    <button
                        onClick={() => applyFormatting("strike")}
                        className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-700"
                    >
                        Strikethrough
                    </button>
                </div>
                {/* Flex container to show editor and preview side by side */}
                <div className=" w-full ">
                    {/* Textarea for editor input */}
                    <textarea
                        id="editor"
                        className="w-full h-80 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={editorValue}
                        onChange={handleEditorChange}
                        placeholder="Select text and click buttons to format..."
                        onScroll={(e) => {
                            const target = e.target as HTMLTextAreaElement;
                            const previewElement = document.querySelector<HTMLDivElement>('.preview');
                            if (previewElement) {
                                previewElement.scrollTop = target.scrollTop;
                            }
                        }}
                    />
                    {/* Preview */}
                    <div
                        className="w-full mt-4 h-80 p-2 overflow-auto whitespace-pre-wrap bg-gray-100 border rounded-lg preview"
                        dangerouslySetInnerHTML={renderPreview(editorValue)}>
                    </div>
                </div>
            </>
        </div>
    );
};

export default Editor;
