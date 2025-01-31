import React, { useState } from 'react'
import SideNavigation from '../components/SideNavigation'
import Information from '../components/info'
import WorkBench from './WorkBench'
import ContactUs from './ContactUs'

type SideNav = "INFO" | "WORKBENCH" | "CONTACT_US";
const HomePage = () => {
    const [navState, setNavState] = useState<SideNav>("INFO");
    return (
        <div className="flex flex-row justify-center items-center h-screen bg-gray-100">
            <SideNavigation updateNavState={(value) => setNavState(value as SideNav)} />
            <div className="flex mt-15 flex-col w-full h-full overflow-y-auto">
                {
                    navState === "INFO" ? (
                        <Information />
                    ) : navState === "WORKBENCH" ? (
                        <WorkBench />
                    ) : navState === "CONTACT_US" ? (
                        <ContactUs />
                    ) : <Information />
                }
            </div>
        </div>
    )
}

export default HomePage 