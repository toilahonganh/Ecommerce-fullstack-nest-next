"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { jwtDecode, JwtPayload } from "jwt-decode";
import { usePathname } from "next/navigation";
import styles from './Header.module.scss';

// React icons
import { CiSearch } from "react-icons/ci";
import { GiShoppingCart } from "react-icons/gi";
import { IoMdHeartEmpty } from "react-icons/io";
import { IoIosArrowDown } from "react-icons/io";


interface DecodedToken extends JwtPayload {
    userId: string;
    email: string;
    avatar?: string;
}
export default function Header() {
    const [useInfo, setUserInfo] = useState<DecodedToken | null>(null);

    const pathname = usePathname();

    return (
        <header className={styles.header}>
            <nav className={styles.nav_logo}>
            </nav>
            {/*  */}
            <div className={styles.sticky}>

            </div>

            {/*  */}
            <div className={styles.actions}>
                <div className={styles.logo}>
                    <img src="https://d-themes.com/wordpress/riode/elements/wp-content/uploads/sites/3/2020/09/logo.png" alt="logo" />
                </div>
                <div className={styles.search}>
                    <input
                        type="text"
                        placeholder="Search..."
                    >
                    </input>
                    <CiSearch className={styles.icon} />
                </div>
                <div className={styles.contact}>

                    <div className={styles.favorite}>
                        <IoMdHeartEmpty className={styles.icon} />
                    </div>

                    <div className={styles.carts}>
                        <GiShoppingCart className={styles.icon} />
                    </div>

                </div>
            </div>

            {/*  */}
            <nav className={styles.navbar_links}>
                <nav>
                    <ul className={styles.navList}>
                        <li>
                            <Link href="/site" className={pathname === '/site' ? styles.active : ''}>
                            Home
                        </Link></li>
                        <li className={styles.nav_dropdown}><Link href="/site" className={pathname === '/site/accommodations' ? styles.active : ''}>
                            <p>Categories</p>
                            {/* <IoIosArrowDown /> */}
                        </Link></li>
                        <li><Link href="/site/products" className={pathname === '/site/products' ? styles.active : ''}>
                            Products
                            {/* <IoIosArrowDown /> */}
                        </Link></li>
                        <li><Link href="/site/" className={pathname === '/site/restaurants' ? styles.active : ''}>
                            Pages
                            {/* <IoIosArrowDown /> */}
                        </Link></li>
                        <li><Link href="/site" className={pathname === '/site/blogs' ? styles.active : ''}>
                            Elements
                            {/* <IoIosArrowDown /> */}
                        </Link></li>
                        <li><Link href="/site" className={pathname === '/site/blogs' ? styles.active : ''}>
                            Features
                            {/* <IoIosArrowDown /> */}
                        </Link></li>
                        <li><Link href="/site" className={pathname === '/site/blogs' ? styles.active : ''}>
                            Blogs
                            {/* <IoIosArrowDown /> */}
                        </Link></li>
                    </ul>
                </nav>
            </nav>
        </header>
    );
}
