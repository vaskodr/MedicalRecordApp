import React, { createContext, useState, useContext, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [authData, setAuthData] = useState(null);

    // Check if auth data exists in localStorage and set it on load
    useEffect(() => {
        const storedAuthData = localStorage.getItem('accessToken');
        if (storedAuthData) {
            setAuthData(JSON.parse(storedAuthData));
            console.log(storedAuthData); // Assuming stored as JSON
        }
    }, []);

    // Login function that sets the auth data and stores it in localStorage
    const login = (data) => {
        console.log('Setting auth data: ', data);
        setAuthData(data);
        localStorage.setItem('accessToken', JSON.stringify(data)); // Store the auth data in localStorage
    };

    // Logout function that clears the auth data from both state and localStorage
    const logout = () => {
        localStorage.removeItem('accessToken');
        setAuthData(null); // Set to null instead of empty string for consistency
        console.log("Logged Out!");
    };

    return (
        <AuthContext.Provider value={{ authData, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
