import React from 'react';

const SideNavigation: React.FC = () => {
    return (
        <div className="h-screen w-64 bg-gray-800 text-white">
            <div className="p-4 text-xl font-bold">Logo</div>
            <nav className="mt-10">
                <a href="#" className="flex items-center py-2.5 px-4 rounded transition duration-200 hover:bg-gray-700 hover:text-white">
                    Home
                </a>
                <a href="#" className="flex items-center py-2.5 px-4 rounded transition duration-200 hover:bg-gray-700 hover:text-white">

                    About
                </a>
                <a href="#" className="flex items-center py-2.5 px-4 rounded transition duration-200 hover:bg-gray-700 hover:text-white">

                    Services
                </a>
                <a href="#" className="flex items-center py-2.5 px-4 rounded transition duration-200 hover:bg-gray-700 hover:text-white">

                    Contact
                </a>
            </nav>
        </div>
    );
};

export default SideNavigation;