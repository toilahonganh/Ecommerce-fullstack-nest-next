"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import styles from './Header.module.scss';


// react-icons
import { IoIosMenu } from "react-icons/io";
import { SiPhpmyadmin } from "react-icons/si";
import axios from "axios";


export default function Header() {
    const pathname = usePathname();
    const [authData, setAuthData] = useState<any>(null); // Thay đổi kiểu thành 'any' hoặc định nghĩa kiểu phù hợp
    const [isAuthenticated, setIsAuthenticated] = useState(false);

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
        <header className={styles.header}>
            {/* navbar_links */}
            <nav className={styles.navbar_links}>
                <Link href="/dashboard" className={styles.logo}>
                    <SiPhpmyadmin />
                    {/* <h1 className={styles.title}>#admin</h1> */}
                </Link>
                <nav>
                    <ul className={styles.navList}>
                        <li><Link href="/dashboard" className={pathname === '/dashboard' ? styles.active : ''}>Dashboard</Link></li>
                        <li><Link href="/dashboard/products/manage-products" className={pathname === '/dashboard/products/manage-products' ? styles.active : ''}>Products</Link></li>
                        <li><Link href="/dashboard/users/manage-users" className={pathname === '/dashboard/users' ? styles.active : ''}>Users</Link></li>
                        <li><Link href="/dashboard/management" className={pathname === '/dashboard/management' ? styles.active : ''}>Blogs</Link></li>
                        <li><Link href="/dashboard/management" className={pathname === '/dashboard/management' ? styles.active : ''}>Carts</Link></li>
                        <li><Link href="/dashboard/UI" className={pathname === '/dashboard/UI' ? styles.active : ''}>UI</Link></li>
                    </ul>
                </nav>
            </nav>
            <nav className={styles.nav_nav}></nav>
            {/* navbar_headerButtons */}
            <nav className={styles.navbar_headerButtons}>
                <nav className={styles.navbar_search}>
                    <button type="button">
                        Search
                        <kbd className={styles.navbar_kdb}>CtrlK</kbd>
                    </button>
                </nav>
                <nav className={styles.navbar_profile}>
                        <img src={avatar} alt="Avatar" className={styles.avatar} />
                </nav>
                <nav className={styles.navbar_menu}>
                    <IoIosMenu />
                </nav>
            </nav>
        </header>
    );
}
