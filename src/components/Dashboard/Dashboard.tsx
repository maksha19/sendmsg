// Dashboard.tsx
import { MessageCircle, ListOrdered, Paperclip, Send, Clock, CircleX ,Eye, ChevronDown ,CircleChevronDown,CircleChevronUp} from "lucide-react";
import { Card } from "../Card";
import { NumberListModal } from "./NumberListModal";
import { useState } from "react";
import { renderPreview } from "../util";

export default function Dashboard() {
    const [numberList, setNumberList] = useState<string[] | null>(null);
    const [selectedMessage, setSelectedMessage] = useState<string | null>(null);
    const [isOpenChatDetails,setIsOpenChatDetails] = useState(false)


    const broadcastRows = [
        {
            chatId:"1",
            chatTitle: "Welcome Message",
            chatDescription: "Initial greeting to new users",
            chatDate: new Date().toLocaleDateString(),
        },
        {
            chatId:"1",
            chatTitle: "Reminder Alert",
            chatDescription: "Follow-up reminder for event",
            chatDate: new Date().toLocaleDateString(),
        },
        {
            chatTitle: "Welcome Message",
            chatDescription: "Initial greeting to new users",
            chatDate: new Date().toLocaleDateString(),
            chatId:"1",
        },
        {
            chatTitle: "Reminder Alert",
            chatDescription: "Follow-up reminder for event",
            chatDate: new Date().toLocaleDateString(),
            chatId:"1",
        },
        {
            chatTitle: "Welcome Message",
            chatDescription: "Initial greeting to new users",
            chatDate: new Date().toLocaleDateString(),
            chatId:"1",
        },
        {
            chatTitle: "Reminder Alert",
            chatDescription: "Follow-up reminder for event",
            chatDate: new Date().toLocaleDateString(),
            chatId:"1",
        },
        {
            chatTitle: "Welcome Message",
            chatDescription: "Initial greeting to new users",
            chatDate: new Date().toLocaleDateString(),
            chatId:"1",
        },
        {
            chatTitle: "Reminder Alert",
            chatDescription: "Follow-up reminder for event",
            chatDate: new Date().toLocaleDateString(),
            chatId:"1",
        },
        {
            chatTitle: "Welcome Message",
            chatDescription: "Initial greeting to new users",
            chatDate: new Date().toLocaleDateString(),
            chatId:"1",
        },
        {
            chatTitle: "Reminder Alert",
            chatDescription: "Follow-up reminder for event",
            chatDate: new Date().toLocaleDateString(),
            chatId:"1",
        },
        {
            chatTitle: "Welcome Message",
            chatDescription: "Initial greeting to new users",
            chatDate: new Date().toLocaleDateString(),
            chatId:"1",
        },
        {
            chatTitle: "Reminder Alert",
            chatDescription: "Follow-up reminder for event",
            chatDate: new Date().toLocaleDateString(),
            chatId:"1",
        },
        {
            chatTitle: "Welcome Message",
            chatDescription: "Initial greeting to new users",
            chatDate: new Date().toLocaleDateString(),
            chatId:"1",
        },
        {
            chatTitle: "Reminder Alert",
            chatDescription: "Follow-up reminder for event",
            chatDate: new Date().toLocaleDateString(),
            chatId:"1",
        },
    ];

    const chatDetails = Array.from({ length: 20 }, (_, index) => ({
        chatId: (index + 1).toString(),
        chatMessage: `Sample message ${index + 1} - This is a detailed message for chat ${index + 1}.`,
        numberList: Array.from({ length: 500 }, (_, i) => `+91 98765${i.toString().padStart(4, '0')}`),
        attachment: `attachment_${index + 1}.pdf`
    }));

    const openChatDetails =(chatId:string)=>{
        setIsOpenChatDetails(true)
    }

    return (
        <div className="p-6  bg-gray-100 min-h-screen">
            <h1 className="text-3xl font-bold text-gray-800">📊 Dashboard</h1>

            {/* Usage Information */}
            <section>
                <h2 className="text-2xl font-semibold text-gray-700 mb-4">Usage Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <Card>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                                <Send className="text-indigo-500 w-5 h-5" />
                                <div>
                                    <p className="font-semibold text-gray-700">Message Sent</p>
                                    <p className="text-sm text-gray-500">150</p>
                                </div>
                            </div>
                        </div>
                    </Card>

                    <Card>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                                <Clock className="text-yellow-500 w-5 h-5" />
                                <div>
                                    <p className="font-semibold text-gray-700">Hours Used</p>
                                    <p className="text-sm text-gray-500">12 hrs</p>
                                </div>
                            </div>
                        </div>
                    </Card>

                    <Card>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                                <Send className="text-red-500 w-5 h-5" />
                                <div>
                                    <p className="font-semibold text-gray-700">Balance Count</p>
                                    <p className="text-sm text-gray-500">850 left</p>
                                </div>
                            </div>
                        </div>
                    </Card>

                    <Card>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                                <Clock className="text-teal-500 w-5 h-5" />
                                <div>
                                    <p className="font-semibold text-gray-700">Hours Left</p>
                                    <p className="text-sm text-gray-500">8 hrs</p>
                                </div>
                            </div>
                        </div>
                    </Card>
                </div>
            </section>

            {/* Broadcast History */}
            <section>
                <h2 className="text-2xl font-semibold text-gray-700 mb-4">Broadcast History</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card>
                        <div className="flex items-center space-x-4">
                            <MessageCircle className="text-blue-500 w-6 h-6" />
                            <p className="font-medium text-gray-700">Chat Message</p>
                        </div>
                    </Card>

                    <Card>
                        <div className="flex items-center space-x-4">
                            <ListOrdered className="text-green-500 w-6 h-6" />
                            <p className="font-medium text-gray-700">Number List</p>
                        </div>
                    </Card>

                    <Card>
                        <div className="flex items-center space-x-4">
                            <Paperclip className="text-purple-500 w-6 h-6" />
                            <p className="font-medium text-gray-700">Attachment</p>
                        </div>
                    </Card>
                </div>
            </section>
            <section >
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
                                                onClick={() => setSelectedMessage(row.chatDescription)}
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
            <section >
                <h2 className="text-2xl font-semibold text-gray-700 mb-4">Chat details</h2>
                <Card>
                    <div className="overflow-x-auto max-h-[50vh] overflow-y-auto">
                        <table className="min-w-full text-sm text-gray-700">
                            <thead className="bg-gray-200 text-left">
                                <tr>
                                    <th className="px-4 py-2 font-medium">Chat Message</th>
                                    <th className="px-4 py-2 font-medium">Number List</th>
                                    <th className="px-4 py-2 font-medium">Attachment</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {chatDetails.map((row, i) => (
                                    <tr key={i}>
                                        <td className="px-4 py-2 max-w-xs">
                                            <div className="line-clamp-2 text-gray-800">
                                                {row.chatMessage.length > 20 ? row.chatMessage.slice(0, 20) + "..." : row.chatMessage}
                                            </div>
                                            {row.chatMessage.length > 50 && (
                                                <button
                                                    onClick={() => setSelectedMessage(row.chatMessage)}
                                                    className="text-blue-600 text-sm underline hover:text-blue-800 mt-1"
                                                >
                                                    Read More
                                                </button>
                                            )}
                                        </td>
                                        <td className="px-4 py-2">
                                            {row.numberList.length} numbers
                                            <button
                                                onClick={() => setNumberList(row.numberList)}
                                                className="ml-2 text-blue-600 underline text-sm hover:text-blue-800"
                                            >
                                                View
                                            </button>
                                        </td>
                                        <td className="px-4 py-2">{row.attachment}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </Card>
            </section>

            {numberList && (
                <NumberListModal numberList={numberList} onClose={() => setNumberList(null)} />
            )}
            {selectedMessage && (
                <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg max-w-xl w-full shadow-lg">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-semibold ">📨 Full Chat Message</h3>
                            <CircleX size={32} onClick={() => setSelectedMessage(null)} />
                        </div>
                        <div
                            className="w-full h-60 p-4 overflow-auto bg-gray-50 border whitespace-pre-wrap  border-gray-300 rounded-lg shadow-inner preview text-gray-800"
                            dangerouslySetInnerHTML={renderPreview(selectedMessage)}
                        />

                    </div>
                </div>
            )}
        </div>
    );
}

