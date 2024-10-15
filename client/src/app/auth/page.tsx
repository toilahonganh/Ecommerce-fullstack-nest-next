"use client";
import Cookies from 'js-cookie';
import { useEffect, useState } from 'react';

export default function Page() {
    const [authData, setAuthData] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const accessToken = Cookies.get('accessToken');
        const refreshToken = Cookies.get('refreshToken');

        console.log('Access Token:', accessToken);
        console.log('Refresh Token:', refreshToken);
    }, []);

    return (
        <>
        hahd
            {/* {isAuthenticated ? (
                <div>
                    <h1>Authenticated</h1>
                    <p>Access Token: {authData.accessToken}</p>
                    <p>Refresh Token: {authData.refreshToken}</p>
                </div>
            ) : (
                <div>Not Authenticated</div>
            )} */}
        </>
    );
}
