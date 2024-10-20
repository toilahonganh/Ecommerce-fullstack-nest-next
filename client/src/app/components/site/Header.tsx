"use client";
import axios from "axios";
import Link from "next/link";
import Cookies from 'js-cookie';
import ShoppingCart from "./page";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { notifyToastError, notifyToastSuccess } from "@/app/utils/NotifyToast";
import { Product, DecodedToken } from "../../utils/interface.util";
import HeaderScroll from '../../components/site/HeaderScroll';

import { CiSearch } from "react-icons/ci";
import { GiShoppingCart } from "react-icons/gi";
import { IoMdHeartEmpty } from "react-icons/io";
import { IoIosArrowDown } from "react-icons/io";
import styles from './Header.module.scss';


export default function Header() {
    const [authData, setAuthData] = useState<DecodedToken | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [isSearchVisible, setIsSearchVisible] = useState(false);
    const [searchResults, setSearchResults] = useState<Product[]>([]);
    const [quantity, setQuantity] = useState(1);
    const [isVisible, setIsVisible] = useState(false);

    const pathname = usePathname();
    const router = useRouter();

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

    const handleSearchChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const query = e.target.value;
        setSearchQuery(query);
        setIsSearchVisible(query.length > 0);

        if (query.trim() === '') {
            setSearchResults([]);
            return;
        }

        try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_ORIGIN}/product`, {
                params: { query },
            });
            setSearchResults(response.data);
        } catch (error) {
            console.error('Error fetching search results:', error);
        }
    };

    const handleAddCart = async (userId: string, productId: string) => {
        if (!userId) {
            notifyToastError('Please login to add products to the cart.');
            return;
        }

        try {
            const response = await axios.post(`${process.env.NEXT_PUBLIC_ORIGIN}/cart`, {
                user_id: userId,
                product_id: productId,
                quantity,
            });
            notifyToastSuccess(`Added ${searchResults.find(item => item._id === productId)?.name} to cart`);
        } catch (error) {
            notifyToastError('Error adding product to the cart');
            console.error('Error adding to cart:', error);
        }
    }

    const handleLogout = async () => {
        const allCookies = Cookies.get();

        for (const cookieName in allCookies) {
            Cookies.remove(cookieName);
        }
        notifyToastSuccess(`Logout successfully!`);
        router.push('/auth/login');
    };

    const toggleCart = () => {
        setIsCartOpen(prev => !prev);
    };

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 100) {
                setIsVisible(true);
            } else {
                setIsVisible(false);
            }
        }
        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        }
    }, []);

    const avatar = authData?.avatar;
    const name = authData?.name;

    return (
        <header className={styles.header}>
            <HeaderScroll />
            <nav className={styles.nav_logo}></nav>
            <div className={styles.sticky}>
                <div className={styles.auth}>
                    <span onClick={handleLogout}>Logout</span>
                </div>
            </div>

            <div className={styles.actions}>
                <div className={styles.logo}>
                    <Link href="/site">
                        <img src="https://d-themes.com/wordpress/riode/elements/wp-content/uploads/sites/3/2020/09/logo.png" alt="logo" />
                    </Link>
                </div>
                <div className={styles.search_container}>
                    <div className={styles.search}>
                        <input
                            type="text"
                            placeholder="Search..."
                            value={searchQuery}
                            onChange={handleSearchChange}
                        />
                        <CiSearch className={styles.icon} />
                    </div>
                    <div className={`${styles.searchDiv} ${isSearchVisible ? styles.visible : ''}`}>
                        {searchResults.length > 0 ? (
                            <ul>
                                {searchResults.map(product => (
                                    <div key={product._id} className={styles.product_search}>
                                        <div className={styles.product_image}>
                                            <img src={product.images[0]} alt={`${product.name}'s image`} />
                                        </div>
                                        <div className={styles.product_detail}>
                                            <div className={styles.info}>
                                                <p>{product.name}</p>
                                                <span>${product.price}.00</span>
                                            </div>
                                            <div className={styles.action}>
                                                <button
                                                    className={styles.add_cart}
                                                    onClick={() => handleAddCart(authData?._id, product._id)}
                                                >
                                                    Add to cart
                                                </button>
                                                <button className={styles.quick_view}>Quick view</button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </ul>
                        ) : (
                            <p>No results found.</p>
                        )}
                    </div>
                </div>
                <div className={styles.contact}>
                    <div className={styles.favorite}>
                        <IoMdHeartEmpty className={styles.icon} />
                    </div>
                    <div className={styles.title}>
                        <p>Favorite</p>
                    </div>
                    <div className={styles.carts} onClick={toggleCart}>
                        <GiShoppingCart className={styles.icon} />
                    </div>
                    <div className={styles.title}>
                        <p>Shopping cart</p>
                    </div>
                    <nav className={styles.navbar_profile}>
                        <img src={avatar} alt="Avatar" className={styles.avatar} />
                        <span>{name}</span>
                    </nav>
                </div>
            </div>
            <nav className={styles.navbar_links}>
                <nav>
                    <ul className={styles.navList}>
                        <li>
                            <Link href="/site" className={pathname === '/site' ? styles.active : ''}>
                                Home
                            </Link>
                        </li>
                        <li className={styles.nav_dropdown}>
                            <Link href="/site" className={pathname === '/site/accommodations' ? styles.active : ''}>
                                <p>Categories</p>
                            </Link>
                        </li>
                        <li>
                            <Link href="/site/products" className={pathname === '/site/products' ? styles.active : ''}>
                                Products
                                <IoIosArrowDown className={styles.icon} />
                                <div className={styles.product_dropdown}>
                                    <ul className={styles.product_dropdown_actions}>
                                        <li>
                                            <Link href="">T-shirts</Link>
                                        </li>
                                        <li>
                                            <Link href="">T-shirts</Link>
                                        </li>
                                        <li>
                                            <Link href="">T-shirts</Link>
                                        </li>
                                    </ul>

                                    <ul className={styles.product_dropdown_link}>
                                        <li>
                                            <Link href="">T-shirts</Link>
                                        </li>
                                        <li>
                                            <Link href="">T-shirts</Link>
                                        </li>
                                        <li>
                                            <Link href="">T-shirts</Link>
                                        </li>

                                    </ul>
                                </div>

                            </Link>
                        </li>
                        <li>
                            <Link href="/site/" className={pathname === '/site/restaurants' ? styles.active : ''}>
                                Pages
                                <IoIosArrowDown className={styles.icon} />
                            </Link>
                        </li>
                        <li>
                            <Link href="/site/blogs" className={pathname === '/site/blogs' ? styles.active : ''}>
                                Blogs
                                <IoIosArrowDown className={styles.icon} />
                            </Link>
                        </li>
                        <li>
                            <Link href="/site/contact" className={pathname === '/site/contact' ? styles.active : ''}>
                                About us
                            </Link>
                        </li>
                    </ul>
                </nav>
            </nav>
            <ShoppingCart isOpen={isCartOpen} toggleCart={toggleCart} /> {/* Render ShoppingCart component */}
        </header>
    );
}
