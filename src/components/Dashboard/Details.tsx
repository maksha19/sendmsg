import React from 'react';
import { Card } from "../Card";
import { renderPreview } from "../util";
import { ArrowLeft, Paperclip } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface DetailedProps {
    handleBackToDashboard: () => void;
    detailsData: {
        chatTitle: string;
        chatDescription: string;
        chatMessage: string;
        numberList?: {}[];
        chatId?: string;
        attachment?: string;
    }
}
const Details: React.FC<DetailedProps> = ({ handleBackToDashboard, detailsData }) => {
    return (
        <div>
            <button
                onClick={handleBackToDashboard}
                className="inline-flex items-center gap-2 mb-4 px-5 py-2.5 rounded-full bg-white text-blue-600 border border-blue-600 shadow-sm hover:bg-blue-50 hover:text-blue-700 transition-all duration-200"
            >
                <ArrowLeft className="w-4 h-4" />
                Back to Dashboard
            </button>

            <h2 className="text-2xl font-semibold text-gray-700 mb-4">Details Page</h2>
            <Card>
                <div className="p-4">
                    <h3 className="text-lg font-bold text-gray-800">{detailsData.chatTitle}</h3>
                    <p className="text-gray-600">{detailsData.chatDescription}</p>
                    <div className="flex justify-between items-center">
                        <h3 className="text-lg font-semibold">📨 Chat Message</h3>
                    </div>
                    <div className="flex  gap-6">
                        <div className="max-h-[60vh] w-1/2 p-4 overflow-auto bg-gray-50 border whitespace-pre-wrap  border-gray-300 rounded-lg shadow-inner preview text-gray-800"
                            dangerouslySetInnerHTML={renderPreview(detailsData["chatMessage"])}
                        />
                        <div className='flex w-1/2 justify-center '>
                            {detailsData.numberList && detailsData.numberList.length > 0 && (
                                <>
                                    <div className="overflow-x-auto max-h-[60vh]">
                                        <table className="border-collapse border border-gray-300">
                                            <thead className="sticky top-0 bg-blue-100">
                                                <tr className=''>
                                                    {Object.keys(detailsData.numberList[0]).map((header) => (
                                                        <th key={header} className="px-4 py-2  text-blue-600 font-semibold border">
                                                            {header}
                                                        </th>
                                                    ))}
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {detailsData.numberList.map((row, rowIndex) => (
                                                    <tr key={rowIndex} className="hover:bg-blue-50 transition">
                                                        {Object.values(row).map((value: any, colIndex) =>
                                                            <td key={colIndex} className="px-4 py-2 border">
                                                                {value.toString()}
                                                            </td>
                                                        )}
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>

                                    {/* Expand/Collapse and Footer Section */}
                                    {/* <div className="mt-6 flex justify-between items-center">
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
                                    </div> */}
                                </>
                            )}
                        </div>
                    </div>
                    <div className="flex mt-8 items-center space-x-4 cursor-pointer">
                        {
                            detailsData.attachment ?
                                <>
                                    <Paperclip className="text-purple-500 w-6 h-6" />
                                    <p className="font-medium text-gray-700">{detailsData.attachment}</p>
                                </>
                                : <p className="text-gray-500">No attachment</p>
                        }

                    </div>
                </div>
            </Card>
        </div>
    );
}
export default Details;