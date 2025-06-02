import { useState } from "react";
import {  Send, Clock  } from "lucide-react";
import axios from "axios";
import { Card } from "../Card";
import { useUser } from '../../context/userState';
import { QRCodeSVG } from "qrcode.react";
import { RUN_ENGINE_URL } from '../../components/util';
import Details from "./Details";


export default function Dashboard() {
    const { user } = useUser()
    const [numberList, setNumberList] = useState<string[] | null>(null);
    const [value, setValue] = useState('QRCODE');
    const [isEngineStarted, setIsEngineStarted] = useState(false)
    const [instanceId, setInstanceId] = useState("")
    const [engineStatus, setEngineStatus] = useState("")
    const [selectedMessage, setSelectedMessage] = useState<string | null>("");
    const [isDetailsPage, setIsDetailsPage] = useState(false); // Track if on details page
    const [detailsData, setDetailsData] = useState<any>(null); // Store details data
    const [loading, setLoading] = useState(false); // Track loading state
    const whatsappLinkDetails = [
        "Open WhatsApp on your phone",
        "Tap Menu on Android, or Settings on iPhone",
        "Tap Linked devices and then Link a device",
        "Point your phone at this screen to scan the QR code"
    ]

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
        chatMessage: `Sample message ${index + 1} - This is a detailed message for chat ${index + 1}. It contains information about the chat, including the purpose, context, and any relevant details that might be useful for the user. The message is designed to provide clarity and ensure that the recipient understands the intent behind the communication. Additionally, this message serves as a placeholder for more specific content that can be customized based on the user's needs or preferences.`,
        numberList: Array.from({ length: 500 }, (_, i) => ({ "number": `+91 98765${i.toString().padStart(4, '0')}`, "name": `User dsadsaddfsfcsdf dsadsaddfsfcsdfdsadsaddfsfcsdf dsadsaddfsfcsdf${i + 1}` })),
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
                setEngineStatus(response.data.publicUrl)
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
                    setInstanceId(instanceId)
                    setTimeout(() => getInstanceStatus(instanceId), 5000);
                }
            }
        } catch (error) {
            console.error('Error starting/stopping instance:', error);
        }
    }

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
                <Details handleBackToDashboard={handleBackToDashboard} detailsData={detailsData}/>
            ) : (
                // Dashboard Page

                <div>
                    <h1 className="text-3xl font-bold text-gray-800">📊 Dashboard</h1>
                    {/* Usage Information */}
                    <section>
                        <h2 className="text-2xl font-semibold text-gray-700 mb-4">Usage Information</h2>
                        <div className="flex justify-center flex-row space-x-16 mb-6">
                            <div className="grid  grid-cols-2 md:grid-cols-2 gap-x-10 gap-y-6">
                                <Card className="flex" >
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-3">
                                            <Send className="text-indigo-500 w-5 h-5" />
                                            <div>
                                                <p className="font-semibold text-xl text-gray-700">Message Sent</p>
                                                <p className="text-lg font-semibold text-gray-500">150</p>
                                            </div>
                                        </div>
                                    </div>
                                </Card>
                                <Card className="flex" >
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-3">
                                            <Clock className="text-yellow-500 w-5 h-5" />
                                            <div>
                                                <p className="font-semibold text-xl text-gray-700">Hours Used</p>
                                                <p className="text-lg font-semibold text-gray-500">12 hrs</p>
                                            </div>
                                        </div>
                                    </div>
                                </Card>
                                <Card className="flex" >
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-3">
                                            <Send className="text-red-500 w-5 h-5" />
                                            <div>
                                                <p className="font-semibold text-xl text-gray-700">Message Balance </p>
                                                <p className="text-lg font-semibold text-gray-500">850 left</p>
                                            </div>
                                        </div>
                                    </div>
                                </Card>
                                <Card className="flex" >
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-3">
                                            <Clock className="text-teal-500 w-5 h-5" />
                                            <div>
                                                <p className="font-semibold text-xl text-gray-700">Hours Left</p>
                                                <p className="text-lg font-semibold text-gray-500">8 hrs</p>
                                            </div>
                                        </div>
                                    </div>

                                </Card>
                            </div>
                            <div>
                                <Card>
                                    <div className="space-y-2 flex flex-row">
                                        <div className="flex flex-col space-y-4">
                                            <h2 className="text-lg font-semibold text-gray-700">WhatsApp Link</h2>
                                            {
                                                whatsappLinkDetails.map((step, index) => (
                                                    <div key={index} className="flex items-center space-x-3">
                                                        <div className="flex items-center justify-center min-w-10 min-h-10 rounded-full bg-blue-100 text-blue-600">
                                                            {index + 1}
                                                        </div>
                                                        <p className="text-gray-700 font-medium">{step}</p>
                                                    </div>
                                                ))
                                            }
                                        </div>
                                        <div className="flex justify-center items-center">
                                            {value === "QRCODE" ?
                                                <>
                                                    <button
                                                        onClick={() => startInstance()}
                                                        disabled={isEngineStarted}
                                                        className={`ml-4 px-4 py-2 w-full ${isEngineStarted ? "bg-gray-400 cursor-not-allowed" : "bg-green-500 text-white"} font-semibold rounded-lg shadow-md hover:bg-green-700 transition`}
                                                    >
                                                        {isEngineStarted ? <div className="flex text-white"><svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                        </svg>Processing...</div> : "Get WhatsApp QR Code"}
                                                    </button>
                                                </> : <QRCodeSVG
                                                    value={value}
                                                    size={250}
                                                    bgColor="#ffffff"
                                                    fgColor="#000000"
                                                    level="Q"
                                                    marginSize={4}
                                                />}
                                        </div>
                                    </div>

                                </Card>
                            </div>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-gray-700 mb-4">Broadcast History</h2>
                        <Card>
                            <div className="overflow-x-auto max-h-[40vh] overflow-y-auto">
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
