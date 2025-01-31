import React, { useState } from 'react';
import FileUpload from "../components/FileUpload";
import Editor from "../components/Editor";


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
const WorkBench: React.FC = () => {
    const [editorValue, setEditorValue] = useState("");
    const [instanceURL, setInstanceURL] = useState("")
    const [jsonData, setJsonData] = useState<JsonRecord[]>([]);
    const [supportingFiles, setSupportingFiles] = useState<supportingFile>();
    const [instanceId, setInstanceId] = useState<string>("");
    console.log("instanceURL-worker", instanceId)
    return (
        <>
            {
                instanceURL === "" ?
                    <Editor updatePreview={(value) => setEditorValue(value)}
                        updateJsonData={(value => setJsonData(value))}
                        updateSupportingDocs={(value) => setSupportingFiles(value)}
                        updateEngineStatus={(value) => setInstanceURL(value)}
                        updateInstanceId={(value) => setInstanceId(value)} /> :
                    <FileUpload editorValue={editorValue} instanceURL={instanceURL} instanceId={instanceId} jsonData={jsonData} supportingFile={supportingFiles} />
            }
        </>
    );
};

export default WorkBench;