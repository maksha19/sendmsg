import React, { useState, useEffect, useRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import axios from "axios";



const QrCode = () => {
    const [value, setValue] = useState('');
    const [staus, setStatus] = useState<"Online" | "Offline" | "Processing">("Offline")
    const isFetching = useRef(false); // Track if the loop is already running
    const isCancelled = useRef(false); // To handle cleanup

    useEffect(() => {
        const fetchData = async () => {
            while (value === "" && !isCancelled.current) {
                if (isFetching.current) return; // Prevent overlapping fetch calls
                isFetching.current = true; // Set fetching flag

                console.log("Fetching QR Code...");
                await fetchQrCode();
                isFetching.current = false; // Reset fetching flag after fetching

                // Wait for 14 seconds before the next loop
                await new Promise((resolve) => setTimeout(resolve, 14000));
            }
        };

        fetchData();

        // Cleanup to stop the loop if the component unmounts
        return () => {
            isCancelled.current = true;
        };
        // Only re-run when `value` changes
    }, [value]);

    const fetchQrCode = async () => {
        try {
            const response = await axios.get('http://localhost:3001/qrCode');
            const data = response.data;
            if (response.status === 200) {
                console.log('QR Code set state:', data.qrCode);
                setValue(data.qrCode);
                setTimeout(() => fetchLoginStatus(), 3000);
            }
        } catch (err) {
            console.log(err)
        }

    };

    const fetchLoginStatus = async () => {
        const checkLoginStatus = async () => {
            try {
                const response = await axios.get('http://localhost:3001/loginStatus');
                if (response.status === 200 && response.data.loginStatus) {
                    return true; // Login status confirmed
                }
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
                    setStatus("Online");
                    return; // Exit the loop once login status is confirmed
                }

                attempts++;
                await new Promise(resolve => setTimeout(resolve, 5000)); // Wait before retrying
            }

            console.warn("Max attempts reached. Login status could not be confirmed.");
        };

        pollLoginStatus(); // Start polling
    };


    const logout = async () => {
        const response = await axios.get('http://localhost:3001/logout');
        if (response.status === 200 && !response.data.loginStatus) {
            setStatus("Offline")
            setValue("")
        }

    }
    return (
        <div className="">
            <div className='flex justify-between items-center p-4'>
                <h1 className="text-2xl  font-bold">QrCode Status: {staus} </h1>
                <button
                    className={`bg-red-500  text-white font-bold py-2 px-4 rounded-full ${staus === "Offline" ? " opacity-50 cursor-not-allowed" : "hover:bg-red-700"}`}
                    onClick={() => logout()}
                    disabled={staus === "Offline"}
                >
                    Logout
                </button>
            </div>

            {staus === "Offline" &&
                <div className='flex justify-center items-center'>
                    <div className=" flex justify-center items-center border-4 w-80 h-80">
                        {value !== "" ?
                            <QRCodeSVG
                                value={value}
                                size={300}
                                bgColor="#ffffff"
                                fgColor="#000000"
                                level="Q"
                                marginSize={4}
                            />
                            : <div>
                                <div className="flex items-center justify-center h-full">
                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"></div>
                                    <p className="ml-2 text-lg font-semibold">Processing...</p>
                                </div>
                            </div>

                        }

                    </div>
                </div>
            }

        </div>
    );
};

export default QrCode;