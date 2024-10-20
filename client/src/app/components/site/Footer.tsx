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

    const notify = useCallback((message: string) => {
        toast(message, { autoClose: 2000 });
    }, [])

    const handleProfile = async () => {
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
            <div className={styles.footer_header}>
                <div className={styles.logo}>
                    <img src="https://d-themes.com/wordpress/riode/elements/wp-content/uploads/sites/3/2020/09/logo.png" alt="logo" />
                </div>

                <div className={styles.slogan}>
                    <h5>Subscribe to our Newsletter</h5>
                    <p>Get all the latest information, Sales and Offers.</p>
                </div>

                <div className={styles.subscribe}>
                    <div className={styles.input}>
                        <input
                            type="email"
                            placeholder="Email address here..."
                        >
                        </input>
                    </div>

                    <div className={styles.btn}>
                        <p>Subscribe</p>
                    </div>
                </div>
            </div>

            <div className={styles.footer_content}>

            </div>

            <div className={styles.footer_footer}>

            </div>
        </div>
    )
}
