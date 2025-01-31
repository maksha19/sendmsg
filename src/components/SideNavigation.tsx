import React from 'react';

interface SideNavigationProps {
    updateNavState: (value: string) => void;
}
const SideNavigation: React.FC<SideNavigationProps> = ({ updateNavState }) => {
    return (
        <div className="h-screen w-[300px] bg-gray-800 text-white">
            <div className='flex w-[300px] mt-10 justify-center'>
                <svg height="100" viewBox="0 -2 23 25" width="100" xmlns="http://www.w3.org/2000/svg">
                    <path fill="#FFF" d="M20.108743,2.56698557 C21.9041909,4.52460368 23,7.13433188 23,10 C23,12.8656681 21.9041909,15.4753963 20.108743,17.4330144 L18.6344261,16.0815573 C20.103429,14.4798697 21,12.3446376 21,10 C21,7.65536245 20.103429,5.52013028 18.6344261,3.91844274 L20.108743,2.56698557 Z M17.1601092,5.26989991 C18.302667,6.51565689 19,8.17639301 19,10 C19,11.823607 18.302667,13.4843431 17.1601092,14.7301001 L15.6857923,13.3786429 C16.501905,12.4888165 17,11.3025764 17,10 C17,8.69742358 16.501905,7.51118349 15.6857923,6.62135708 L17.1601092,5.26989991 Z M3.89125699,2.56665655 L5.3655739,3.91811372 C3.89657104,5.51980126 3,7.65503343 3,9.99967098 C3,12.3443085 3.89657104,14.4795407 5.3655739,16.0812282 L3.89125699,17.4326854 C2.09580905,15.4750673 1,12.8653391 1,9.99967098 C1,7.13400286 2.09580905,4.52427466 3.89125699,2.56665655 Z M6.83989081,5.26957089 L8.31420772,6.62102806 C7.49809502,7.51085447 7,8.69709456 7,9.99967098 C7,11.3022474 7.49809502,12.4884875 8.31420772,13.3783139 L6.83989081,14.7297711 C5.69733303,13.4840141 5,11.823278 5,9.99967098 C5,8.17606399 5.69733303,6.51532787 6.83989081,5.26957089 Z" fill-rule="evenodd" />
                </svg>
                <div className='flex -ml-[74px] items-center h-[100px]'>
                    <svg
                        xmlns="http:</div>//www.w3.org/2000/svg"
                        viewBox="0 0 200 200"
                        width="50"
                        height="50"
                    >
                        <circle cx="63" cy="90" r="8" fill="none" stroke="#FFF" stroke-width="6">
                            <animate
                                attributeName="cy"
                                values="90;85;90;95;90"
                                keyTimes="0;0.25;0.5;0.75;1"
                                dur="1.5s"
                                repeatCount="indefinite"
                            />
                        </circle>
                        <circle cx="95" cy="90" r="12" fill="none" stroke="#FFF" stroke-width="8">
                            <animate
                                attributeName="cy"
                                values="90;85;90;95;90"
                                keyTimes="0;0.25;0.5;0.75;1"
                                dur="1.5s"
                                repeatCount="indefinite"
                                begin="0.2s"
                            />
                        </circle>
                        <circle cx="135" cy="90" r="16" fill="none" stroke="#FFF" stroke-width="8">
                            <animate
                                attributeName="cy"
                                values="90;85;90;95;90"
                                keyTimes="0;0.25;0.5;0.75;1"
                                dur="1.5s"
                                repeatCount="indefinite"
                                begin="0.4s"
                            />
                        </circle>
                    </svg>
                </div>
            </div>
            <nav className="mt-10">
                <a href="#" onClick={() => updateNavState("INFO")} className="flex text-lg items-center py-2.5 px-4 rounded transition duration-200 hover:bg-gray-700 hover:text-white cursor-pointer">
                    Home
                </a>
                <a href="#" onClick={() => updateNavState("WORKBENCH")} className="flex text-lg items-center py-2.5 px-4 rounded transition duration-200 hover:bg-gray-700 hover:text-white cursor-pointer">
                    Broadcast
                </a>
                <a href="#" onClick={() => updateNavState("CONTACT_US")} className="flex text-lg items-center py-2.5 px-4 rounded transition duration-200 hover:bg-gray-700 hover:text-white cursor-pointer">

                    Contact Us
                </a>
            </nav>
        </div >
    );
};

export default SideNavigation;