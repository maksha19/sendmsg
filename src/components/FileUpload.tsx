// src/components/FileUpload.tsx
import React, { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import axios from "axios";
import { renderPreview } from "./util";
import QrCode from "./QrCode";
import QRCodeGenerator from 'qrcode';

interface FileUploadProps {
    editorValue: string
}

interface JsonRecord {
    SerialNo: number;
    [key: string]: any;
    preview: string; // Added preview field
    isSend: boolean;
}

interface supportingFile {
    fileName: string;
    fileType: string;
    file: string;
}

const FileUpload: React.FC<FileUploadProps> = ({ editorValue }) => {
    const [whatsAppStatus, setWhatsAppStatus] = useState<boolean>(false)
    const [fileName, setFileName] = useState<string>("");
    const [supportingFile, setSupportingFile] = useState<supportingFile>();
    const [jsonData, setJsonData] = useState<JsonRecord[]>([]);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [supportingFileError, setSupportingFileError] = useState<string | null>(null);
    const [expandAll, setExpandAll] = useState<boolean>(false);
    const [instanceURL, setInstanceURL] = useState('')

    useEffect(() => {
        updatePreview(editorValue);
        // eslint-disable-next-line
    }, [editorValue]);

    // TODO: start timer when whatsAppStatus is true and infor to backend

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
                json.preview = editorValue || ""; // Initialize preview field
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

    // Handle image or PDF file upload and convert to base64
    const handleFileUpload = (e: any) => {

        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                if (reader.result) {
                    const base64String = reader.result.toString().split(',')[1];
                    console.log("Base64 String:", base64String);
                    // Save file name, mime type, and base64 string to state
                    setSupportingFile({
                        fileName: file.name,
                        fileType: file.type,
                        file: base64String
                    });
                }
            };
            reader.readAsDataURL(file);
        }
        else {
            setSupportingFileError('Only Image and PDF files are allowed.');
        }
    };

    const getQRcode = async (mobile: string) => {
        const dataUrl = await QRCodeGenerator.toDataURL(mobile, { type: 'image/jpeg', width:512,margin: 2 });
        return dataUrl.split(',')[1]
    }

    function sleep(ms: any) {
        return new Promise((resolve) => {
            setTimeout(resolve, ms);
        });
    }

    const handleSend = async () => {
        console.log("JSON Data:", jsonData);
        setWhatsAppStatus(true)
        try {
            let fileInfo = {};
            if (supportingFile) {
                fileInfo = { ...supportingFile }
            }
            // TODO: send total data information
            for (const json of jsonData) {
                await sleep(500)
                const ticketQR =  await getQRcode(json.number)
                let ticketInfo = {
                    fileName: "ticket.jpeg",
                    fileType: "image/jpeg",
                    file: ticketQR
                }
                // TODO: batch data info successfully and failure information to backend
                const response = await axios.post("http://localhost:3001/sendMessage", {

                    messageText: json.preview,
                    senderList: [
                        {
                            name: json.name,
                            number: "65" + json.number
                        }
                    ],
                    ...ticketInfo
                });
                const responseData = response.data;
                console.log("Message sent:", responseData);
                const { notification_success, notification_failure } = responseData
                if (notification_success.length > 0) {
                    json.isSend = true;
                    setJsonData([...jsonData]); // Update the state with the new isSend value
                } else {
                    console.log("notification_failure for:", notification_failure)
                }
            }
            setWhatsAppStatus(false)
        } catch (error) {
            console.error("Error sending message:", error);
            setWhatsAppStatus(false)
        }
    };

    return (
        <div
            className="m-4 bg-white p-8 rounded-lg shadow-lg flex flex-col"
            onDragOver={(e) => e.preventDefault()}
        >
            {/* QR Code Section */}
            {/* <div className="flex  mb-6">
                <QrCode updateInstanceURL={(value: string) => setInstanceURL(value)} updateWhatsAppStatus={(value: boolean) => setWhatsAppStatus(value)} />
            </div> */}

            {/* File Upload Section */}
            <div className="flex justify-between space-x-4">
                <div
                    className="flex flex-col items-center border-dashed border-2 border-blue-400 rounded-lg p-6 cursor-pointer transition hover:bg-blue-50 w-1/2"
                    onDrop={handleFileDrop}
                    onClick={() => document.getElementById('fileInput')?.click()}
                >
                    <h1 className="text-2xl font-semibold text-blue-600 mb-4">Upload Contact Number File</h1>
                    <input
                        id="fileInput"
                        type="file"
                        accept=".csv, .xlsx"
                        style={{ display: 'none' }}
                        onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                                const fileType = file.name.split('.').pop();
                                setFileName(file.name);
                                if (fileType === 'csv' || fileType === 'xlsx') {
                                    parseFile(file);
                                } else {
                                    setErrorMessage('Only CSV and Excel files are allowed.');
                                }
                            }
                        }}
                    />
                    <div className="w-full flex items-center justify-center h-24 text-gray-600">
                        {fileName ? <p>{fileName}</p> : <p>Drag and drop a CSV or Excel file here</p>}
                    </div>
                    {errorMessage && <p className="mt-4 text-red-500">{errorMessage}</p>}
                </div>
                {/* Image/PDF Upload Section */}
                <div
                    className="flex flex-col items-center border-dashed border-2 border-green-400 rounded-lg p-6 cursor-pointer transition hover:bg-green-50 w-1/2"
                    onClick={() => document.getElementById('imagePdfInput')?.click()}
                >
                    <h1 className="text-2xl font-semibold text-green-600 mb-4">Upload Image/PDF<span className="text-lg">(Optional)</span></h1>
                    <input
                        id="imagePdfInput"
                        type="file"
                        accept=".jpg, .jpeg, .png, .pdf"
                        style={{ display: 'none' }}
                        onChange={(e) => handleFileUpload(e)}
                    />
                    <div className="w-full flex items-center justify-center h-24 text-gray-600">
                        {supportingFile?.fileName ? <p>{supportingFile.fileName}</p> : <p>Click to upload an Image or PDF file</p>}
                    </div>
                    {supportingFileError && <p className="mt-4 text-red-500">{supportingFileError}</p>}
                </div>
            </div>

            {/* Table Section */}
            {jsonData.length > 0 && (
                <>
                    <div className="mt-6 overflow-x-auto max-h-[70vh]">
                        <table className="min-w-full border-collapse border border-gray-300">
                            <thead className="sticky top-0 bg-blue-100">
                                <tr>
                                    {Object.keys(jsonData[0]).map((header) => (
                                        <th key={header} className="px-4 py-2 text-blue-600 font-semibold border">
                                            {header}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {jsonData.map((row, rowIndex) => (
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
                    className={`w-full py-3 rounded-lg transition ${whatsAppStatus ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600 text-white"}`}
                    disabled={whatsAppStatus}
                >
                    Send
                </button>
            </div>
        </div>
    );
};

export default FileUpload;
