// src/components/FileUpload.tsx
import React, { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import axios from "axios";
import { renderPreview } from "./util";
import QrCode from "./QrCode";

interface FileUploadProps {
    editorValue: string
}

interface JsonRecord {
    SerialNo: number;
    [key: string]: any;
    preview: string; // Added preview field
    isSend: boolean;
}

const FileUpload: React.FC<FileUploadProps> = ({ editorValue }) => {
    const [fileName, setFileName] = useState<string>("");
    const [jsonData, setJsonData] = useState<JsonRecord[]>([]);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [expandAll, setExpandAll] = useState<boolean>(false);

    useEffect(() => {
        updatePreview(editorValue);
        // eslint-disable-next-line
    }, [editorValue]);

    // Handle file drop
    const handleFileDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        const file = e.dataTransfer.files[0];
        if (file) {
            const fileType = file.name.split('.').pop();
            setFileName(file.name);
            if (fileType === 'csv' || fileType === 'xlsx') {
                parseFile(file);
            } else {
                setErrorMessage('Only CSV and Excel files are allowed.');
            }
        }
    };

    // Parse file based on file type
    const parseFile = (file: File) => {
        const reader = new FileReader();
        const fileType = file.name.split('.').pop();

        reader.onload = (e: ProgressEvent<FileReader>) => {
            const data = e.target?.result;

            if (fileType === 'xlsx' && typeof data === 'string') {
                parseExcelFile(data);
            } else if (fileType === 'csv' && typeof data === 'string') {
                parseCSVFile(data);
            }
        };

        if (fileType === 'xlsx') {
            reader.readAsBinaryString(file);
        } else if (fileType === 'csv') {
            reader.readAsText(file);
        }
    };

    // Parse Excel File
    const parseExcelFile = (binaryStr: string) => {
        setJsonData([]);
        try {
            const workbook = XLSX.read(binaryStr, { type: 'binary' });
            const firstSheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[firstSheetName];
            const rows: any = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

            handleParsedData(rows);
        } catch (error) {
            setErrorMessage('Error reading Excel file.');
        }
    };

    // Parse CSV File
    const parseCSVFile = (csvText: string) => {
        setJsonData([]);
        const rows = csvText.split('\n').map((row) => row.split(',').map((cell) => cell.trim()));
        handleParsedData(rows);
    };

    // Handle parsed data from file
    const handleParsedData = (rows: any[][]) => {
        if (rows.length === 0) {
            setErrorMessage('The file is empty or invalid.');
            return;
        }

        const headers = rows[0].map((header) => header.trim());
        const dataRows = rows.slice(1);

        // Check if headers are valid
        if (!headers.includes('isSend')) {
            const data = dataRows.map((row) => {
                const json: JsonRecord = row.reduce((acc, value, index) => {
                    acc[headers[index]] = value;
                    return acc;
                }, {} as JsonRecord);

                // Add default isSend value

                json.preview = ""; // Initialize preview field
                json.isSend = false;
                console.log("json", json);
                return json;
            });

            const validData = data.filter((row) => !isNaN(row['number']))
            setJsonData(validData);
            setErrorMessage(null);
        } else {
            setErrorMessage('Missing required headers.');
        }
    };

    // Update preview based on editor value and replace placeholders
    const updatePreview = (editorValue: string) => {
        console.log('Editor Value:', editorValue);
        console.log('JSON Data:', jsonData);

        const updatedData = jsonData.map((row) => {
            // Replace each placeholder with the corresponding value from the row
            let preview = editorValue.replace(/{(.*?)}/g, (_, key) => {
                const trimmedKey = key.trim();
                if (row[trimmedKey] !== undefined) {
                    console.log(`Replacing {${trimmedKey}} with ${row[trimmedKey]}`); // Log replacements
                    return row[trimmedKey]; // Replace with the actual value
                }
                console.warn(`Placeholder {${trimmedKey}} not found in row`); // Warn for missing keys
                return `{${trimmedKey}}`; // Return placeholder if key is not found
            });
            return { ...row, preview };
        });
        setJsonData(updatedData);
    };




    const handleSend = async () => {
        console.log("JSON Data:", jsonData);
        try {
            for (const json of jsonData) {
                const response = await axios.post("http://localhost:3001/sendMessage", {
                    messageText: json.preview,
                    senderList: [
                        {
                            name: json.name,
                            number: "65" + json.number
                        }
                    ]
                });
                console.log("Message sent:", response.data);
                const responseData = response.data;
                const { notification_success, notification_failure } = responseData
                if (notification_success.length > 0) {
                    json.isSend = true;
                    setJsonData([...jsonData]); // Update the state with the new isSend value
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
            className="m-4 bg-white p-6 rounded-lg shadow-md h-5/6 w-1/2 overflow-hidden flex flex-col justify-between"
            onDragOver={(e) => e.preventDefault()}
        >
            <div>
                <QrCode />
            </div>
            <div onDrop={handleFileDrop}>
                <h1 className="text-2xl font-bold mb-4">Upload File</h1>
                <div className="border-dashed border-2 border-gray-400 h-24 flex justify-center items-center">
                    {fileName ? <p className="text-gray-600">{fileName}</p> : <p className="text-gray-600">Drag and drop an Excel or CSV file here</p>}
                </div>
                {errorMessage && (
                    <p className="mt-4 text-red-500">{errorMessage}</p>
                )}
            </div>
            {jsonData.length > 0 && (
                <div className="mt-4 h-3/5 overflow-x-auto max-h-[70vh]">
                    <table className="min-w-full border-collapse border border-gray-300">
                        <thead>
                            <tr className="bg-gray-200 sticky top-0">
                                {Object.keys(jsonData[0]).map((header) => (
                                    <th key={header} className="px-4 py-2 border">{header}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {jsonData.map((row, rowIndex) => (
                                <tr key={rowIndex}>
                                    {Object.values(row).map((value, colIndex) => (
                                        colIndex === 2 ? (
                                            <td key={colIndex} className="px-4 py-2 border">
                                                <div
                                                    id='preview'
                                                    className={`w-full min-w-96 h-full overflow-auto whitespace-pre-wrap bg-gray-100 p-2 border rounded-lg transition-all duration-300 ${expandAll ? 'max-h-full' : 'max-h-16'}`}
                                                    dangerouslySetInnerHTML={renderPreview(value.toString())}
                                                ></div>
                                            </td>
                                        ) : colIndex === 3 ?
                                            <td className="px-8  py-8 border">
                                                {row.isSend ? (
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                                    </svg>
                                                ) : (
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-6 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6 1a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                    </svg>
                                                )}
                                            </td> :
                                            (
                                                <td key={colIndex} className="px-4 py-2 border">
                                                    {value.toString()}
                                                </td>
                                            )
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
            {jsonData.length > 0 && (
                <div className="mt-4 flex justify-between items-center">
                    <p className="text-gray-600">
                        Total: {jsonData.length}
                    </p>
                    <div className="flex space-x-1 items-center">
                        <span>{expandAll ? "Collapse All" : "Expand All"}</span>
                        <button onClick={() => setExpandAll(!expandAll)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                            {expandAll ? <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M0 0h24v24H0z" fill="none" /><path d="M12 8l-6 6 1.41 1.41L12 10.83l4.59 4.58L18 14z" /></svg>
                                :
                                <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M0 0h24v24H0z" fill="none" /><path d="M16.59 8.59L12 13.17 7.41 8.59 6 10l6 6 6-6z" /></svg>}
                        </button>
                    </div>
                </div>
            )}
            <div className="mt-4">
                <button
                    onClick={handleSend}
                    className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                >
                    Send
                </button>
            </div>
        </div>
    );
};

export default FileUpload;
