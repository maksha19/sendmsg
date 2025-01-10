import React, { useState, useEffect, useRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import axios from "axios";
import { useUser } from '../context/userState';
import { RUN_ENGINE_URL } from '../components/util';

interface QrCodeProps {
    updateWhatsAppStatus: (value: boolean) => void;
    updateInstanceURL: (value: string) => void;
}


const QrCode: React.FC<QrCodeProps> = ({ updateWhatsAppStatus, updateInstanceURL }) => {
    const [value, setValue] = useState('');
    const [showModel, setShowModel] = useState(false)
    const [instanceStatus, setInstanceStatus] = useState<"Online" | "Offline" | "Processing">('Offline')
    const [instanceURL, setInstanceURL] = useState('')
    const instanceURLRef = useRef(instanceURL);
    const [isEngineStarted, setIsEngineStarted] = useState(false)
    const { user } = useUser()

    useEffect(() => {
        instanceURLRef.current = instanceURL;
    }, [instanceURL]);

    const fetchQrCode = async () => {
        const getMsgQrCode = async () => {
            console.log("publicUrl", instanceURLRef.current)
            if (instanceURLRef.current === "") return
            try {
                const response = await axios.post(`${RUN_ENGINE_URL}/dev/message`, {
                    "action": "qrcode",
                    "publicUrl": instanceURLRef.current
                });
                const data = response.data;
                if (response.status === 200 && data.statusCode === 202) {
                    if (data.qrCode !== "") {
                        console.log('QR Code set state:', data.qrCode);
                        setValue(data.qrCode);
                        return true;
                    } else {
                        return false;
                    }

                } else {
                    console.log('QR Code set state:', data);
                    return false
                }
            } catch (err) {
                console.log(err)
                return false
            }
        }
        const pollQrCode = async () => {
            let attempts = 0; // Track the number of attempts
            const maxAttempts = 5; // Optional: Limit the number of retries

            while (attempts < maxAttempts) {
                const isOnline = await getMsgQrCode();
                if (isOnline) {
                    console.log("Got QRCode confirmed. Exiting loop.");
                    return; // Exit the loop once login status is confirmed
                }
                attempts++;
                await new Promise(resolve => setTimeout(resolve, 5000)); // Wait before retrying
            }
            // TODO: show error message
            startStopEngine()
            console.warn("Max attempts reached. get QRCode status could not be confirmed.");
        }
        pollQrCode(); // Start polling
    }


    const fetchLoginStatus = async () => {
        setShowModel(false);
        const checkLoginStatus = async () => {
            try {
                const response = await axios.post(`${RUN_ENGINE_URL}/dev/message`, {
                    "action": "loginStatus",
                    "userId": user.email,
                    "publicUrl": instanceURLRef.current
                });
                if (response.status === 200 && response.data.loginStatus) {
                    console.log("Login status confirmed.");
                    return true; // Login status confirmed
                }
                console.log("Login status not confirmed.");
                return false; // Login status not confirmed
            } catch (error) {
                console.error('Error checking login status:', error);
                return false; // Default to false on error
            }
        };

        const pollLoginStatus = async () => {
            let attempts = 0; // Track the number of attempts
            const maxAttempts = 15; // Optional: Limit the number of retries

            while (attempts < maxAttempts) {
                const isOnline = await checkLoginStatus();
                if (isOnline) {
                    updateWhatsAppStatus(true)
                    console.log("Login status confirmed. Exiting loop.");
                    return; // Exit the loop once login status is confirmed
                }

                attempts++;
                await new Promise(resolve => setTimeout(resolve, 10000)); // Wait before retrying
            }

            // TODO: show error message
            startStopEngine()
            console.warn("Max attempts reached. Login status could not be confirmed.");
        };

        pollLoginStatus(); // Start polling
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
                setInstanceStatus("Online")
                setIsEngineStarted(false);
                setInstanceURL(response.data.publicUrl)
                updateInstanceURL(response.data.publicUrl)
                setShowModel(true)
                setTimeout(() => fetchQrCode(), 45000);
            }
        }
    }

    const startInstance = async () => {
        try {
            const response = await axios.post(`${RUN_ENGINE_URL}/dev/message`, {
                "action": "create",
                "userId": user.email
            });

            if (response.status === 200 && response.data) {
                const { statusCode, instanceId } = response.data;
                if (statusCode === 200) {
                    console.log("Successfully started instance:", instanceId);
                    setInstanceStatus("Processing");
                    setTimeout(() => getInstanceStatus(instanceId), 5000);
                }
            }
        } catch (error) {
            console.error('Error starting/stopping instance:', error);
        }
    }

    const startStopEngine = async () => {

        if (instanceStatus === "Offline") {
            setIsEngineStarted(true);
            await startInstance()
            return
        }
        const response = await axios.post(`${RUN_ENGINE_URL}/dev/message`, {
            "action": "logout",
            "userId": user.email,
            "publicUrl": instanceURLRef.current
        });
        if (response.status === 200 && !response.data.loginStatus) {
            setInstanceStatus("Offline")
            setValue("")
            setInstanceURL('')
        }

    }

    return (
        <div className="">
            <div className='flex justify-between items-center '>
                <h1 className="text-xl  font-bold">Status: {instanceStatus} </h1>
                <button
                    className={`text-white m-2 font-bold py-2 px-4 rounded-full ${instanceStatus === "Offline" ? "bg-green-500 hover:bg-green-700" : "bg-red-500 hover:bg-red-700"}`}
                    onClick={() => startStopEngine()}
                    disabled={isEngineStarted}
                >
                    {instanceStatus === "Offline" ? "START" : "LOGOUT"}
                </button>
            </div>

            {showModel &&
                <>
                    <div className="fixed inset-0 z-10 bg-gray-500 bg-opacity-75 transition-opacity">
                        <div className="flex flex-col items-center justify-center h-screen">
                            <div id='Qrcode' className='flex justify-center items-center'>
                                <div className={`flex justify-center items-center ${value && "border-4"} w-100 h-100`}>
                                    {value !== "" ?
                                        <div className='flex flex-col items-center '>
                                            <div>
                                                <div className="flex items-center justify-center h-full">
                                                    <p className="ml-2 text-lg font-semibold">Scan this QR code using your whatsapp</p>
                                                </div>
                                            </div>
                                            <div>
                                                <QRCodeSVG
                                                    value={value}
                                                    size={300}
                                                    bgColor="#ffffff"
                                                    fgColor="#000000"
                                                    level="Q"
                                                    marginSize={4}
                                                />
                                            </div>
                                            <div className="flex space-x-4 mt-4">
                                                <button
                                                    className="bg-green-500 text-white font-bold py-2 px-4 rounded-full hover:bg-green-700 "
                                                    onClick={() => fetchLoginStatus()}
                                                >
                                                    Click me, After scanning QR code
                                                </button>
                                            </div>
                                        </div>
                                        : <div>
                                            <div className="flex items-center justify-center h-full">
                                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"></div>
                                                <p className="ml-2 text-lg font-semibold">Processing...</p>
                                            </div>
                                        </div>
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            }
        </div >
    );
};

export default QrCode;