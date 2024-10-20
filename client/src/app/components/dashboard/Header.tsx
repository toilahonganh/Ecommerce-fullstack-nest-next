"use client";
import axios from "axios";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from 'react';
import { useRouter } from "next/navigation";
import Cookies from 'js-cookie';

import { RiLogoutBoxRLine } from "react-icons/ri";
import { notifyToastSuccess } from "@/app/utils/NotifyToast";
import styles from './Header.module.scss';


export default function Header() {
    const pathname = usePathname();
    const [authData, setAuthData] = useState<any>(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const router = useRouter();

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
    const handleLogout = async () => {
        const allCookies = Cookies.get();

        for (const cookie in allCookies) {
            Cookies.remove(cookie);
        }
        notifyToastSuccess(`Loged out successfully!`);
        router.push('/auth/login');
    }

    const avatar = authData?.avatar; 

    return (
        <header className={styles.header}>
            {/* navbar_links */}
            <nav className={styles.navbar_links}>
                <Link href="/dashboard" className={styles.logo}>
                    <img src="https://d-themes.com/wordpress/riode/elements/wp-content/uploads/sites/3/2020/09/logo.png" alt="logo" />
                </Link>
                <nav>
                    <ul className={styles.navList}>
                        <li><Link href="/dashboard" className={pathname === '/dashboard' ? styles.active : ''}>Dashboard</Link></li>
                        <li><Link href="/dashboard/products/manage-products" className={pathname === '/dashboard/products/manage-products' ? styles.active : ''}>Products</Link></li>
                        <li><Link href="/dashboard/users/manage-users" className={pathname === '/dashboard/users' ? styles.active : ''}>Users</Link></li>
                        <li><Link href="/dashboard/blogs/manage-blogs" className={pathname === '/dashboard/blogs/manage-blogs' ? styles.active : ''}>Blogs</Link></li>
                        <li><Link href="/dashboard/management" className={pathname === '/dashboard/management' ? styles.active : ''}>Carts</Link></li>
                        <li><Link href="/dashboard/UI" className={pathname === '/dashboard/UI' ? styles.active : ''}>UI</Link></li>
                    </ul>
                </nav>
            </nav>
            <nav className={styles.nav_nav}></nav>
            {/* navbar_headerButtons */}
            <nav className={styles.navbar_headerButtons}>
                <nav className={styles.navbar_search}>
                </nav>
                <nav className={styles.navbar_profile}>
                        <img src={avatar} alt="Avatar" className={styles.avatar} />
                </nav>
                <nav className={styles.navbar_menu} onClick={handleLogout}>
                    <RiLogoutBoxRLine />
                </nav>
            </nav>
        </header>
    );
}
