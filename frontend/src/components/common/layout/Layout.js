import React from 'react';
import NavigationBar from '../navigation/NavigationBar';

const Layout = ({ children, className = "" }) => {
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <NavigationBar />
            <main className={`flex-1 ${className}`}>
                {children}
            </main>
        </div>
    );
};

export default Layout;