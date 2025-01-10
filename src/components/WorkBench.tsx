import React, { useState } from 'react';
import FileUpload from "./FileUpload";
import Editor from "./Editor";
import SideNavigation from './SideNavigation';

const WorkBench: React.FC = () => {
    const [editorValue, setEditorValue] = useState("");

    return (
        <div className="flex flex-row justify-center items-center h-screen bg-gray-100">
            <SideNavigation />
            <div className='flex mt-15 flex-col w-full h-full overflow-y-auto'>
                <Editor updatePreview={(value) => setEditorValue(value)} />
                <FileUpload editorValue={editorValue} />
            </div>

        </div>
    );
};

export default WorkBench;