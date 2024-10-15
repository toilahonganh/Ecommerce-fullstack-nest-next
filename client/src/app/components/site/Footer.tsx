'use client'
import { useState, useEffect, FormEvent, useCallback } from "react"
import { ToastContainer, toast } from "react-toastify"
import { jwtDecode, JwtPayload } from "jwt-decode"
import { useRouter } from "next/navigation"
import styles from "./Footer.module.scss"

interface DecodedToken extends JwtPayload {
    userId: string;
    email: string;
    avatar?: string;  // avatar có thể không có
}

export default function Footer() {
    const router = useRouter();
    const [useInfo, setUserInfo] = useState<DecodedToken | null>(null);

    // Toast notification
    const notify = useCallback((message: string) => {
        toast(message, { autoClose: 2000 });
    }, [])

    // Handle navigation to profile
    const handleProfile = async() => {
        router.push('/site/profile')
    }

    useEffect(() => {
        const accessToken = localStorage.getItem('accessToken')
        if (accessToken) {
            const decoded: DecodedToken = jwtDecode<DecodedToken>(accessToken)
            setUserInfo(decoded)
        }
    }, [])

    return (
        <div className={styles.footer}>
        </div>
    )
}
