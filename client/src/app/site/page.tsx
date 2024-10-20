"use client";
import axios from 'axios';
import Cookies from 'js-cookie';
import { useEffect, useState } from 'react';
import Banner from '../components/site/Banner';

export default function Page() {
    const [authData, setAuthData] = useState<any>(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    const images = [process.env.NEXT_PUBLIC_HOME];

    useEffect(() => {
        const accessToken = Cookies.get('accessToken');
        
        const fetchData = async () => {
            try {
                const response = await axios.post(`${process.env.NEXT_PUBLIC_ORIGIN}/auth/decode`, {
                    accessToken,
                });
                
                const { password, ...userData } = response.data; 
                setAuthData(userData);
                setIsAuthenticated(!!userData);
            } catch (error) {
                console.error("Error decoding token:", error);
                setIsAuthenticated(false);
            }
        };
        fetchData(); 
    }, []);

    const avatar = authData?.avatar; 

    return (
        <>
            <Banner title="RIODE HOME" subtitle='/ Riode home'/>
            <div>
             </div>   
        </>
    );
}
