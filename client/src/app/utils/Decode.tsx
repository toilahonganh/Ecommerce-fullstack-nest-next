// components/DecodeToken.tsx
import { useEffect, useState } from "react";
import Cookies from 'js-cookie';
import axios from "axios";
import { DecodedToken } from "../utils/interface.util";

interface DecodeTokenProps {
    onDecode: (authData: DecodedToken | null, isAuthenticated: boolean) => void;
}

const DecodeToken: React.FC<DecodeTokenProps> = ({ onDecode }) => {
    useEffect(() => {
        const accessToken = Cookies.get('accessToken');
        const fetchData = async () => {
            try {
                const response = await axios.post(`${process.env.NEXT_PUBLIC_ORIGIN}/auth/decode`, {
                    accessToken,
                });
                const { password, ...userData } = response.data;
                onDecode(userData, !!userData);
            } catch (error) {
                console.error("Error decoding token:", error);
                onDecode(null, false);
            }
        };
        fetchData();
    }, [onDecode]);

    return null; // Component này chỉ dùng để thực hiện side effect
};

export default DecodeToken;
