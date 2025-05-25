// components/NumberListModal.tsx
import React from "react";
import { CircleX } from "lucide-react";

type NumberListModalProps = {
    numberList: string[];
    onClose: () => void;
};

export const NumberListModal: React.FC<NumberListModalProps> = ({ numberList, onClose }) => {
    return (
        <div className="fixed h-screen flex flex-col inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg max-w-lg w-full max-h-[80vh] overflow-y-auto shadow-xl">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold">📋 Number List ({numberList.length} numbers)</h3>
                    <CircleX size={32} onClick={onClose} />
                </div>
                <ul className="space-y-1 text-sm">
                    {numberList.map((num, idx) => (
                        <li key={idx}>{num}</li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

