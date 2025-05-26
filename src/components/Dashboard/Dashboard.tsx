import { useState } from "react";
import { MessageCircle, ListOrdered, Paperclip, Send, Clock, CircleX, Eye, ChevronDown, CircleChevronDown, CircleChevronUp, ArrowLeft } from "lucide-react";

import { Card } from "../Card";
import { renderPreview } from "../util";
import { NumberListModal } from "./NumberListModal";

export default function Dashboard() {
    const [numberList, setNumberList] = useState<string[] | null>(null);
    const [selectedMessage, setSelectedMessage] = useState<string | null>("");
    const [isDetailsPage, setIsDetailsPage] = useState(false); // Track if on details page
    const [detailsData, setDetailsData] = useState<any>(null); // Store details data
    const [loading, setLoading] = useState(false); // Track loading state

    const broadcastRows = [
        {
            chatId: "1",
            chatTitle: "Welcome Message",
            chatDescription: "Initial greeting to new users",
            chatDate: new Date().toLocaleDateString(),
        },
        {
            chatId: "2",
            chatTitle: "Reminder Alert",
            chatDescription: "Follow-up reminder for event",
            chatDate: new Date().toLocaleDateString(),
        },
        {
            chatTitle: "Welcome Message",
            chatDescription: "Initial greeting to new users",
            chatDate: new Date().toLocaleDateString(),
            chatId: "1",
        },
        {
            chatTitle: "Reminder Alert",
            chatDescription: "Follow-up reminder for event",
            chatDate: new Date().toLocaleDateString(),
            chatId: "1",
        },
        {
            chatTitle: "Welcome Message",
            chatDescription: "Initial greeting to new users",
            chatDate: new Date().toLocaleDateString(),
            chatId: "1",
        },
        {
            chatTitle: "Reminder Alert",
            chatDescription: "Follow-up reminder for event",
            chatDate: new Date().toLocaleDateString(),
            chatId: "1",
        },
        {
            chatTitle: "Welcome Message",
            chatDescription: "Initial greeting to new users",
            chatDate: new Date().toLocaleDateString(),
            chatId: "1",
        },
        {
            chatTitle: "Reminder Alert",
            chatDescription: "Follow-up reminder for event",
            chatDate: new Date().toLocaleDateString(),
            chatId: "1",
        },
        {
            chatTitle: "Welcome Message",
            chatDescription: "Initial greeting to new users",
            chatDate: new Date().toLocaleDateString(),
            chatId: "1",
        },
        {
            chatTitle: "Reminder Alert",
            chatDescription: "Follow-up reminder for event",
            chatDate: new Date().toLocaleDateString(),
            chatId: "1",
        },
        {
            chatTitle: "Welcome Message",
            chatDescription: "Initial greeting to new users",
            chatDate: new Date().toLocaleDateString(),
            chatId: "1",
        },
        {
            chatTitle: "Reminder Alert",
            chatDescription: "Follow-up reminder for event",
            chatDate: new Date().toLocaleDateString(),
            chatId: "1",
        },
        {
            chatTitle: "Welcome Message",
            chatDescription: "Initial greeting to new users",
            chatDate: new Date().toLocaleDateString(),
            chatId: "1",
        },
        {
            chatTitle: "Reminder Alert",
            chatDescription: "Follow-up reminder for event",
            chatDate: new Date().toLocaleDateString(),
            chatId: "1",
        },
    ];

    const chatDetails = Array.from({ length: 20 }, (_, index) => ({
        chatId: (index + 1).toString(),
        chatMessage: `Sample message ${index + 1} - This is a detailed message for chat ${index + 1}.`,
        numberList: Array.from({ length: 500 }, (_, i) => `+91 98765${i.toString().padStart(4, '0')}`),
        attachment: `attachment_${index + 1}.pdf`
    }));

    const handleViewDetails = (chatId: any) => {
        setLoading(true); // Start loading
        setTimeout(() => {
            setDetailsData(chatDetails[chatId]);
            setIsDetailsPage(true);
            setLoading(false); // Stop loading
        }, 2000); // Simulate 2 seconds delay
    };

    const handleBackToDashboard = () => {
        setIsDetailsPage(false);
        setDetailsData(null);
    };

    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            {loading ? (
                // Modern Loading Screen
                <div className="flex items-center justify-center min-h-screen">
                    <div className="flex flex-col items-center">
                        <svg
                            className="animate-spin h-10 w-10 text-blue-600"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                        >
                            <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                            ></circle>
                            <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8v8H4z"
                            ></path>
                        </svg>
                        <p className="mt-4 text-lg font-semibold text-gray-700">Loading, please wait...</p>
                    </div>
                </div>
            ) : (isDetailsPage && detailsData) ? (
                // Details Page
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
                            <div className="p-3 rounded-lg max-w-xl w-full ">
                                <div
                                    className="w-full min-h-96 p-4 overflow-auto bg-gray-50 border whitespace-pre-wrap  border-gray-300 rounded-lg shadow-inner preview text-gray-800"
                                    dangerouslySetInnerHTML={renderPreview(detailsData["chatMessage"])}
                                />
                            </div>
                            <div className="flex mt-2 items-center space-x-4">
                                <Paperclip className="text-purple-500 w-6 h-6" />
                                <p className="font-medium text-gray-700">Attachment</p>
                            </div>
                        </div>
                    </Card>
                </div>
            ) : (
                // Dashboard Page
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">📊 Dashboard</h1>
                    <section>
                        <h2 className="text-2xl font-semibold text-gray-700 mb-4">Broadcast History</h2>
                        <Card>
                            <div className="overflow-x-auto max-h-[50vh] overflow-y-auto">
                                <table className="min-w-full text-sm text-gray-700">
                                    <thead className="bg-gray-200 text-left">
                                        <tr>
                                            <th className="px-4 py-2 font-medium">Chat Title</th>
                                            <th className="px-4 py-2 font-medium">Description</th>
                                            <th className="px-4 py-2 font-medium">Date</th>
                                            <th className="px-4 py-2 font-medium">View details</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {broadcastRows.map((row, i) => (
                                            <tr key={i}>
                                                <td className="px-4 py-2 font-semibold text-gray-800">{row.chatTitle}</td>
                                                <td className="px-4 py-2 text-gray-600">{row.chatDescription}</td>
                                                <td className="px-4 py-2">{row.chatDate}</td>
                                                <td className="px-4 py-2">
                                                    <button
                                                        onClick={() => handleViewDetails(row.chatId)}
                                                        className="ml-2 text-blue-600 underline text-sm hover:text-blue-800"
                                                    >
                                                        View more
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </Card>
                    </section>
                </div>
            )}
        </div>
    );
}
