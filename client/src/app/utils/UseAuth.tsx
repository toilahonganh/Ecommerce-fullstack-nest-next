import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import jwtDecode, { JwtPayload } from 'jwt-decode';

interface DecodedToken extends JwtPayload {
    userId: string;
    email: string;
    avatar?: string;
}

export const useAuth = () => {
    const [authData, setAuthData] = useState<DecodedToken | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const accessToken = Cookies.get('accessToken');

        if (!accessToken) {
            setIsAuthenticated(false);
            return;
        }

        try {
            const decoded: DecodedToken = jwtDecode(accessToken);
            setAuthData(decoded);
            setIsAuthenticated(true);
        } catch (error) {
            console.error("Error decoding token:", error);
            setIsAuthenticated(false);
        }
    }, []);

    return { authData, isAuthenticated };
};
