// src/components/Editor.tsx
import React, { useState, useEffect } from "react";
import { renderPreview } from "./util";
import * as XLSX from "xlsx";
import axios from "axios";
import { useUser } from '../context/userState';
import { RUN_ENGINE_URL } from '../components/util';

interface JsonRecord {
    SerialNo: number;
    [key: string]: any;
    preview: string; // Added preview field
}
interface supportingFile {
    fileName: string;
    fileType: string;
    file: string;
}
interface EditorProps {
    updatePreview: (value: string) => void;
    updateEngineStatus: (value: string) => void;
    updateJsonData: (value: JsonRecord[]) => void;
    updateSupportingDocs: (value: supportingFile) => void;
    updateInstanceId: (value: string) => void;
}



const Editor: React.FC<EditorProps> = ({ updatePreview, updateEngineStatus, updateJsonData, updateSupportingDocs, updateInstanceId }) => {
    const [editorValue, setEditorValue] = useState("");
    const [expandAll, setExpandAll] = useState<boolean>(false);
    const [fileName, setFileName] = useState<string>("");
    const [supportingFile, setSupportingFile] = useState<supportingFile>();
    const [jsonData, setJsonData] = useState<JsonRecord[]>([]);
    const [supportingFileError, setSupportingFileError] = useState<string | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [showSupportingFilePreview, setShowSupportingFilePreview] = useState<boolean>(false);
    const [showContactFileName, setShowContactFileName] = useState<boolean>(false)
    const [isEngineStarted, setIsEngineStarted] = useState(false)
    const { user } = useUser()

    useEffect(() => {
        updateValuePreview(editorValue);
        // eslint-disable-next-line
    }, [editorValue]);

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
        updateValuePreview(newValue);
    };

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
                    const fileinfo = {
                        fileName: file.name,
                        fileType: file.type,
                        file: base64String
                    }
                    setSupportingFile(fileinfo);
                    updateSupportingDocs(fileinfo)
                }
            };
            reader.readAsDataURL(file);
        }
        else {
            setSupportingFileError('Only Image and PDF files are allowed.');
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
        try {
            handleParsedData(rows);
        } catch (e) {
            setErrorMessage('Error reading csv file. ')
        }

    };

    // Handle parsed data from file
    const handleParsedData = (rows: any[][]) => {
        if (rows.length === 0) {
            setErrorMessage('The file is empty or invalid.');
            return;
        }

        const headers = rows[0].map((header) => header.trim());
        const dataRows = rows.slice(1);
        console.log("headers", headers)

        // Check if headers are valid
        if (!headers.includes('isSend')) {
            const data = dataRows.map((row) => {
                const json: JsonRecord = row.reduce((acc, value, index) => {
                    acc[headers[index]] = value;
                    return acc;
                }, {} as JsonRecord);

                // Add default isSend value
                json.preview = editorValue || ""; // Initialize preview field
                json.number = isNaN(json['number']) ? json['number'].replace(/\s/g, "") : json['number'];
                return json;
            });

            const validData = data.filter((row) => !isNaN(row['number']))
            const invalidData = data.filter((row) => isNaN(row['number']))
            console.log("row from file", data);
            console.log("invalid data", invalidData)
            console.log("validData", validData);
            setJsonData(validData);
            updateJsonData(validData);
            setErrorMessage(null);
        } else {
            setErrorMessage('Missing required headers.');
        }
    };
    // Update preview based on editor value and replace placeholders
    const updateValuePreview = (editorValue: string) => {
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
        updateJsonData(updatedData);
    };

    const getInstanceStatus = async (instanceId: string) => {

        const response = await axios.post(`${RUN_ENGINE_URL}/dev/message`, {
            "action": "status",
            "userId": user.email,
            instanceId
        });

        if (response.status === 200 && response.data) {
            const { statusCode } = response.data
            if (statusCode === 201) {
                console.log('got getInstanceStatus and publicUrl', response.data.publicUrl)
                updateEngineStatus(response.data.publicUrl)
            }
        }
    }

    const startInstance = async () => {
        setIsEngineStarted(true);
        try {
            const response = await axios.post(`${RUN_ENGINE_URL}/dev/message`, {
                "action": "create",
                "userId": user.email
            });

            if (response.status === 200 && response.data) {
                const { statusCode, instanceId } = response.data;
                if (statusCode === 200) {
                    console.log("Successfully started instance:", instanceId);
                    updateInstanceId(instanceId)
                    setTimeout(() => getInstanceStatus(instanceId), 5000);
                }
            }
        } catch (error) {
            console.error('Error starting/stopping instance:', error);
        }
    }

    return (
        <div className="bg-white m-auto mt-4 p-8 pb-4 rounded-xl shadow-lg w-5/6">
            <h1 className="text-2xl font-bold mb-6 text-center ">Create Broadcast</h1>


            {/* Event Title */}
            <div className="mb-4">
                <label htmlFor="eventTitle" className="block text-gray-700 font-semibold mb-2">
                    Title
                </label>
                <input
                    type="text"
                    id="eventTitle"
                    className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter event title"
                    required
                />
            </div>

            {/* Event Description */}
            <div className="mb-4">
                <label htmlFor="eventDescription" className="block text-gray-700 font-semibold mb-2">
                    Description (optional)
                </label>
                <input
                    type="text"
                    id="eventDescription"
                    className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter event description (max 250 characters)"
                    maxLength={250}
                />
            </div>

            {/* Formatting buttons */}
            <div className="mb-4">
                <label htmlFor="eventDescription" className="block text-gray-700 font-semibold mb-2">
                    Broadcast Message
                </label>

                <div className="flex  mb-6 space-x-4">
                    <button
                        onClick={() => applyFormatting("bold")}
                        className="px-4 py-1 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition"
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
                        className="w-full h-60 p-4 border border-gray-300 rounded-lg shadow-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                        className="w-full h-60 p-4 overflow-auto bg-gray-50 border whitespace-pre-wrap  border-gray-300 rounded-lg shadow-inner preview text-gray-800"
                        dangerouslySetInnerHTML={renderPreview(editorValue)}
                    />
                </div>
            </div>

            {/* File Upload Section */}
            <div className="flex flex-col space-y-4">
                {/* contact file Upload Section */}
                <div className="flex flex-col space-y-2">
                    <div className="flex justify-between items-center">
                        <label htmlFor="eventDescription" className="block text-gray-700 font-semibold mb-2">
                            Upload Contact Number File
                        </label>
                        {jsonData.length > 0 && (
                            <button
                                onClick={() => setShowContactFileName(true)}
                                className="flex items-center space-x-1 text-blue-500 hover:text-blue-700 transition"
                            >
                                <span>Preview</span>
                                <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24">
                                    <path d="M0 0h24v24H0z" fill="none" />
                                    <path d="M12 4.5C7.05 4.5 2.73 7.61 1 12c1.73 4.39 6.05 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6.05-7.5-11-7.5zm0 13c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" />
                                </svg>
                            </button>
                        )}
                    </div>
                    <div
                        className="flex flex-col items-center border-dashed border-2 border-blue-400 rounded-lg p-1 cursor-pointer transition hover:bg-blue-50"
                        onDrop={handleFileDrop}
                        onClick={() => document.getElementById('fileInput')?.click()}
                    >
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
                        <div className="w-full flex items-center justify-center h-16 text-gray-600">
                            {fileName ? <p>{fileName}</p> : <p>Drag and drop a CSV or Excel file here</p>}
                        </div>
                        {errorMessage && <p className="mt-4 text-red-500">{errorMessage}</p>}
                    </div>
                </div>
                {/* Image/PDF Upload Section */}
                <div className="flex flex-col space-y-2">
                    <div className="flex justify-between items-center">
                        <label htmlFor="eventDescription" className="block text-gray-700 font-semibold mb-2">
                            Upload Image/PDF (Optional)
                        </label>
                        {supportingFile && (
                            <button
                                onClick={() => setShowSupportingFilePreview(true)}
                                className="flex items-center space-x-1 text-blue-500 hover:text-blue-700 transition"
                            >
                                <span>Preview</span>
                                <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24">
                                    <path d="M0 0h24v24H0z" fill="none" />
                                    <path d="M12 4.5C7.05 4.5 2.73 7.61 1 12c1.73 4.39 6.05 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6.05-7.5-11-7.5zm0 13c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" />
                                </svg>
                            </button>)}
                    </div>
                    <div
                        className="flex flex-col items-center border-dashed border-2 border-green-400 rounded-lg p-1 cursor-pointer transition hover:bg-green-50"
                        onClick={() => document.getElementById('imagePdfInput')?.click()}
                    >
                        <input
                            id="imagePdfInput"
                            type="file"
                            accept=".jpg, .jpeg, .png, .pdf"
                            style={{ display: 'none' }}
                            onChange={(e) => handleFileUpload(e)}
                        />
                        <div className="w-full flex items-center justify-center h-16 text-gray-600">
                            {supportingFile?.fileName ? <p>{supportingFile.fileName}</p> : <p>Click to upload an Image or PDF file</p>}
                        </div>
                        {supportingFileError && <p className="mt-4 text-red-500">{supportingFileError}</p>}
                    </div>
                </div>

            </div>
            <div className="flex mt-4 justify-center space-y-2">
                <div className="flex items-center">
                    {/* <button
                        onClick={() => console.log('Save as Draft')}
                        disabled={isEngineStarted}
                        className={`px-4 py-2 ${isEngineStarted ? "bg-gray-400 cursor-not-allowed" : "bg-yellow-500 text-white"} font-semibold rounded-lg shadow-md hover:bg-yellow-700 transition`}
                    >
                        Save as Draft
                    </button> */}
                    <button
                        onClick={() => startInstance()}
                        disabled={isEngineStarted}
                        className={`ml-4 px-4 py-2 w-full ${isEngineStarted ? "bg-gray-400 cursor-not-allowed" : "bg-green-500 text-white"} font-semibold rounded-lg shadow-md hover:bg-green-700 transition`}
                    >
                        {isEngineStarted ? <div className="flex text-white"><svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>Processing...</div> : "Create"}
                    </button>
                </div>
            </div>

            {/* Table Section */}
            {(showContactFileName && jsonData.length > 0) && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-white p-4 rounded-lg shadow-lg max-w-3xl w-full relative">
                        <button
                            onClick={() => setShowContactFileName(false)}
                            className="absolute -top-10 right-0 text-gray-500 hover:text-gray-700 transition bg-white rounded-full p-1">
                            <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24" className="fill-current text-gray-500 hover:text-gray-700 transition">
                                <path d="M0 0h24v24H0z" fill="none" />
                                <path d="M18.3 5.71L12 12l6.3 6.29-1.42 1.42L12 14.41l-6.29 6.3-1.42-1.42L10.59 12 4.29 5.71 5.71 4.29 12 10.59l6.29-6.3z" />
                                <path d="M6 18L18 6M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </button>
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
                    </div>
                </div>
            )}
            {(showSupportingFilePreview && supportingFile?.file) && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-white p-4 rounded-lg shadow-lg max-w-3xl w-full relative">
                        {supportingFile?.fileType === 'application/pdf' ? (
                            <embed src={`data:application/pdf;base64,${supportingFile.file}`} type="application/pdf" width="100%" height="600px" />
                        ) : (
                            <img src={`data:${supportingFile?.fileType};base64,${supportingFile?.file}`} alt="Preview" className="w-full h-[700px]" />
                        )}
                        <button
                            onClick={() => setShowSupportingFilePreview(false)}
                            className="absolute -top-10 right-0 text-gray-500 hover:text-gray-700 transition bg-white rounded-full p-1">
                            <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24" className="fill-current text-gray-500 hover:text-gray-700 transition">
                                <path d="M0 0h24v24H0z" fill="none" />
                                <path d="M18.3 5.71L12 12l6.3 6.29-1.42 1.42L12 14.41l-6.29 6.3-1.42-1.42L10.59 12 4.29 5.71 5.71 4.29 12 10.59l6.29-6.3z" />
                                <path d="M6 18L18 6M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Editor;
