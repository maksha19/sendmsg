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
        <div className="bg-white m-4 p-8 rounded-xl shadow-lg">
            <h1 className="text-2xl font-bold mb-6 text-center ">Message Editor</h1>

            {/* Formatting buttons */}
            <div className="flex  mb-6 space-x-4">
                <button
                    onClick={() => applyFormatting("bold")}
                    className="px-6 py-3 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition"
                >
                    Bold
                </button>
                <button
                    onClick={() => applyFormatting("italic")}
                    className="px-6 py-3 bg-green-500 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 transition"
                >
                    Italic
                </button>
                <button
                    onClick={() => applyFormatting("strike")}
                    className="px-6 py-3 bg-red-500 text-white font-semibold rounded-lg shadow-md hover:bg-red-700 transition"
                >
                    Strikethrough
                </button>
            </div>

            {/* Editor and preview section */}
            <div className="flex flex-col md:flex-row gap-6">
                {/* Editor */}
                <textarea
                    id="editor"
                    className="w-full h-80 p-4 border border-gray-300 rounded-lg shadow-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={editorValue}
                    onChange={handleEditorChange}
                    placeholder="Write your message here... Select text and click buttons to format."
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
                    className="w-full h-80 p-4 overflow-auto bg-gray-50 border whitespace-pre-wrap  border-gray-300 rounded-lg shadow-inner preview text-gray-800"
                    dangerouslySetInnerHTML={renderPreview(editorValue)}
                />
            </div>
        </div>
    );
};

export default Editor;
