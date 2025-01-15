// src/components/FileUpload.tsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { renderPreview } from "./util";
import QrCode from "./QrCode";

interface FileUploadProps {
    editorValue: string
    instanceURL: string
    jsonData: JsonRecord[]
    supportingFile: supportingFile | undefined
    instanceId: string
}

interface JsonRecord {
    SerialNo: number;
    [key: string]: any;
    preview: string; // Added preview field
    isSend?: boolean;
}

interface supportingFile {
    fileName: string;
    fileType: string;
    file: string;
}

const FileUpload: React.FC<FileUploadProps> = ({ editorValue, instanceURL, jsonData, supportingFile, instanceId }) => {
    const [whatsAppStatus, setWhatsAppStatus] = useState<boolean>(false)
    const [updatedJsonData, setUpdatedJsonData] = useState<JsonRecord[]>([]);
    const [expandAll, setExpandAll] = useState<boolean>(false);

    useEffect(() => {
        updatePreview(editorValue);
        // eslint-disable-next-line
    }, [editorValue]);

    // TODO: start timer when whatsAppStatus is true and infor to backend

    // Update preview based on editor value and replace placeholders
    const updatePreview = (editorValue: string) => {
        console.log('Editor Value:', editorValue);
        console.log('JSON Data:', jsonData);

        const updatedData = jsonData.map((row) => {
            // Replace each placeholder with the corresponding value from the row
            // let preview = editorValue.replace(/{(.*?)}/g, (_, key) => {
            //     const trimmedKey = key.trim();
            //     if (row[trimmedKey] !== undefined) {
            //         console.log(`Replacing {${trimmedKey}} with ${row[trimmedKey]}`); // Log replacements
            //         return row[trimmedKey]; // Replace with the actual value
            //     }
            //     console.warn(`Placeholder {${trimmedKey}} not found in row`); // Warn for missing keys
            //     return `{${trimmedKey}}`; // Return placeholder if key is not found
            // });
            return { ...row, isSend: false };
        });
        setUpdatedJsonData(updatedData);
    };


    const handleSend = async () => {
        console.log("JSON Data:", updatedJsonData);
        try {
            let fileInfo = {};
            if (supportingFile) {
                fileInfo = { ...supportingFile }
            }
            // TODO: send total data information
            for (const json of updatedJsonData) {
                // TODO: batch data info successfully and failure information to backend
                const response = await axios.post("https://t3bavo6jfpyryiceh7cpxuo2uu0xlwix.lambda-url.ap-southeast-1.on.aws//dev/message", {
                    "action": "sendMessage",
                    "publicUrl": instanceURL,
                    "message": {
                        messageText: json.preview,
                        senderList: [
                            {
                                name: json.name,
                                number: "65" + json.number
                            }
                        ],
                        ...fileInfo
                    }
                });
                const responseData = response.data;
                console.log("Message sent:", responseData);
                const { notification_success, notification_failure } = responseData.messageResponse
                if (notification_success.length > 0) {
                    json.isSend = true;
                    setUpdatedJsonData([...updatedJsonData]); // Update the state with the new isSend value
                } else {
                    console.log("notification_failure for:", notification_failure)
                }
            }
        } catch (error) {
            console.error("Error sending message:", error);
        }
    };

    return (
        <div
            className="m-4 bg-white p-8 rounded-lg shadow-lg flex flex-col"
            onDragOver={(e) => e.preventDefault()}
        >
            {/* QR Code Section */}
            <div className="flex w-full  mb-6">
                <QrCode instanceURL={instanceURL} instanceId={instanceId} updateWhatsAppStatus={(value: boolean) => setWhatsAppStatus(value)} />
            </div>


            {/* Table Section */}
            {updatedJsonData.length > 0 && (
                <>
                    <div className="mt-6 overflow-x-auto max-h-[70vh]">
                        <table className="min-w-full border-collapse border border-gray-300">
                            <thead className="sticky top-0 bg-blue-100">
                                <tr>
                                    {Object.keys(updatedJsonData[0]).map((header) => (
                                        <th key={header} className="px-4 py-2 text-blue-600 font-semibold border">
                                            {header}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {updatedJsonData.map((row, rowIndex) => (
                                    <tr key={rowIndex} className="hover:bg-blue-50 transition">
                                        {Object.values(row).map((value, colIndex) =>
                                            colIndex === 2 ? (
                                                <td key={colIndex} className="px-4 py-2 border">
                                                    <div
                                                        id="preview"
                                                        className={`w-full min-w-96 h-full overflow-auto whitespace-pre-wrap bg-gray-100 p-2 border rounded-lg transition-all duration-300 ${expandAll ? 'max-h-full' : 'max-h-16'}`}
                                                        dangerouslySetInnerHTML={renderPreview(value.toString())}
                                                    ></div>
                                                </td>
                                            ) : colIndex === 3 ? (
                                                <td key={colIndex} className="px-6 py-6 border flex justify-center text-center">
                                                    {row.isSend ? (
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                                        </svg>
                                                    ) : (
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-500" fill="none" viewBox="0 0 32 32" stroke="currentColor" strokeWidth={2}>
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6 1a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                        </svg>
                                                    )}
                                                </td>
                                            ) : (
                                                <td key={colIndex} className="px-4 py-2 border">
                                                    {value.toString()}
                                                </td>
                                            )
                                        )}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Expand/Collapse and Footer Section */}
                    <div className="mt-6 flex justify-between items-center">
                        <p className="text-gray-600">Total: {jsonData.length}</p>
                        <button
                            onClick={() => setExpandAll(!expandAll)}
                            className="flex items-center space-x-1 text-blue-500 hover:text-blue-700 transition"
                        >
                            <span>{expandAll ? 'Collapse All' : 'Expand All'}</span>
                            {expandAll ? (
                                <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24">
                                    <path d="M0 0h24v24H0z" fill="none" />
                                    <path d="M12 8l-6 6 1.41 1.41L12 10.83l4.59 4.58L18 14z" />
                                </svg>
                            ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24">
                                    <path d="M0 0h24v24H0z" fill="none" />
                                    <path d="M16.59 8.59L12 13.17 7.41 8.59 6 10l6 6 6-6z" />
                                </svg>
                            )}
                        </button>
                    </div>
                </>
            )}

            {/* Send Button */}
            <div className="mt-6">
                <button
                    onClick={() => handleSend()}
                    className={`w-full py-3 rounded-lg transition ${!whatsAppStatus ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600 text-white"}`}
                    disabled={!whatsAppStatus}
                >
                    Send
                </button>
            </div>
        </div>
    );
};

export default FileUpload;
