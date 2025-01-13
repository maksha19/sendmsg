import React, { useState } from 'react';
import FileUpload from "./FileUpload";
import Editor from "./Editor";
import SideNavigation from './SideNavigation';

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

    return (
        <div className="flex flex-row justify-center items-center h-screen bg-gray-100">
            <SideNavigation />
            <div className='flex  mt-15 flex-col w-full h-full overflow-y-auto'>
                {
                    instanceURL === "" ?
                        <Editor updatePreview={(value) => setEditorValue(value)}
                            updateJsonData={(value => setJsonData(value))}
                            updateSupportingDocs={(value) => setSupportingFiles(value)}
                            updateEngineStatus={(value) => setInstanceURL(value)} /> :
                        <FileUpload editorValue={editorValue} instanceURL={instanceURL} jsonData={jsonData} supportingFile={supportingFiles} />
                }


            </div>
        </div>
    );
};

export default WorkBench;