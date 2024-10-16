"use client";
import axios from 'axios';
import Cookies from 'js-cookie';
import { useEffect, useState } from 'react';
import Banner from '../components/dashboard/Banner';

export default function Page() {
    const [userInfo, setUserInfor] = useState<string[]>([]);
    const [authData, setAuthData] = useState<any>(null); // Thay đổi kiểu thành 'any' hoặc định nghĩa kiểu phù hợp
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    const images = [
        "https://d-themes.com/wordpress/riode/elements/wp-content/uploads/sites/3/2021/05/banner-5.png"
    ]


    useEffect(() => {
        const accessToken = Cookies.get('accessToken');

        const fetchData = async () => {
            try {
                const response = await axios.post(`${process.env.NEXT_PUBLIC_ORIGIN}/auth/decode`, {
                    accessToken,
                });
                console.log(response.data);
                
                const { password, ...userData } = response.data; 
                setAuthData(userData);
                setIsAuthenticated(!!userData); // Chuyển đổi sang true/false
            } catch (error) {
                console.error("Error decoding token:", error);
                setIsAuthenticated(false); // Nếu có lỗi, không xác thực
            }
        };

        fetchData(); 
    }, []);

    const avatar = authData?.avatar; 

    return (
        <>
            <Banner images={images} title="" />

            {/* {isAuthenticated ? (
                <div>
                    <div>Authenticated: {JSON.stringify(authData)}</div>
                    {avatar && <img src={avatar} alt="User Avatar" />} 
                </div>
            ) : (
                <div>Not Authenticated</div>
            )} */}
        </>
    );
}
