"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { JwtPayload } from "jwt-decode";
import { usePathname } from "next/navigation";
import Cookies from 'js-cookie';
import ShoppingCart from "./page";
import styles from './Header.module.scss';

// Importing React icons for the header
import { CiSearch } from "react-icons/ci";
import { GiShoppingCart } from "react-icons/gi";
import { IoMdHeartEmpty } from "react-icons/io";
import axios from "axios";
import { notifyToastError, notifyToastSuccess } from "@/app/utils/NotifyToast";
import {useRouter} from "next/navigation";

// Define the structure of the decoded JWT token
interface DecodedToken extends JwtPayload {
    userId: string;
    email: string;
    avatar?: string; // Optional avatar property
    name?: string
}

// Define the structure of a product
interface Product {
    _id: string;
    name: string;
    price: number;
    images: string[];
}

export default function Header() {
    const [authData, setAuthData] = useState<DecodedToken | null>(null); // State for authentication data
    const [isAuthenticated, setIsAuthenticated] = useState(false); // State for authentication status
    const [isCartOpen, setIsCartOpen] = useState(false); // State to toggle cart visibility
    const [searchQuery, setSearchQuery] = useState(''); // State for search query
    const [isSearchVisible, setIsSearchVisible] = useState(false); // State to control search result visibility
    const [searchResults, setSearchResults] = useState<Product[]>([]); // State for search results
    const [quantity, setQuantity] = useState(1); // Quantity state

    const pathname = usePathname(); // Get the current path name
    const router = useRouter();
    // Fetch authentication data from cookies on component mount
    useEffect(() => {
        const accessToken = Cookies.get('accessToken'); // Get the access token from cookies
        const fetchData = async () => {
            try {
                const response = await axios.post(`${process.env.NEXT_PUBLIC_ORIGIN}/auth/decode`, {
                    accessToken,
                });
                const { password, ...userData } = response.data; // Exclude password from user data
                setAuthData(userData); // Set authentication data
                setIsAuthenticated(!!userData); // Check if user data exists
            } catch (error) {
                console.error("Error decoding token:", error); // Log error
                setIsAuthenticated(false); // Set authenticated state to false on error
            }
        };
        fetchData(); // Call the fetch function
    }, []); // Empty dependency array to run on mount only

    // Handle search input change
    const handleSearchChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const query = e.target.value; // Get the search query
        setSearchQuery(query); // Update search query state
        setIsSearchVisible(query.length > 0); // Show search results if there's input

        if (query.trim() === '') {
            setSearchResults([]); // Clear search results if input is empty
            return;
        }

        try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_ORIGIN}/product`, {
                params: { query }, // Send query as a parameter
            });
            setSearchResults(response.data); // Update search results
        } catch (error) {
            console.error('Error fetching search results:', error); // Log error
        }
    };

    // Handle adding a product to the cart
    const handleAddCart = async (userId: string, productId: string) => {
        if (!userId) {
            notifyToastError('Please login to add products to the cart.'); // Notify if user is not logged in
            return;
        }

        try {
            const response = await axios.post(`${process.env.NEXT_PUBLIC_ORIGIN}/cart`, {
                user_id: userId,
                product_id: productId,
                quantity, // Include quantity in the request
            });
            notifyToastSuccess(`Added ${searchResults.find(item => item._id === productId)?.name} to cart`); // Notify success
        } catch (error) {
            notifyToastError('Error adding product to the cart'); // Notify error
            console.error('Error adding to cart:', error); // Log error
        }
    }
    // Handle logout
    const handleLogout = async () => {
        const allCookies = Cookies.get();
        
        for (const cookieName in allCookies) {
            Cookies.remove(cookieName);
        }
        notifyToastSuccess(`Logout successfully!`);
        router.push('/auth/login')
    };

    // Toggle cart visibility
    const toggleCart = () => {
        setIsCartOpen(prev => !prev); // Switch cart open/close state
    };

    const avatar = authData?.avatar;
    const name = authData?.name;
    return (
        <header className={styles.header}>
            <nav className={styles.nav_logo}></nav>
            <div className={styles.sticky}>
                <div className={styles.auth}>
                    {/* <span> Welcome {authData.name} to Riode store | </span> */}
                    <span onClick={handleLogout}>Logout</span>
                </div>
            </div>

            <div className={styles.actions}>
                <div className={styles.logo}>
                    <img src="https://d-themes.com/wordpress/riode/elements/wp-content/uploads/sites/3/2020/09/logo.png" alt="logo" />
                </div>
                <div className={styles.search_container}>
                    <div className={styles.search}>
                        <input
                            type="text"
                            placeholder="Search..."
                            value={searchQuery}
                            onChange={handleSearchChange} // Call handleSearchChange on input change
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
                                                    onClick={() => handleAddCart(authData?._id, product._id)} // Call handleAddCart on button click
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
                            </Link>
                        </li>
                        <li>
                            <Link href="/site/" className={pathname === '/site/restaurants' ? styles.active : ''}>
                                Pages
                            </Link>
                        </li>
                        <li>
                            <Link href="/site" className={pathname === '/site/blogs' ? styles.active : ''}>
                                Features
                            </Link>
                        </li>
                        <li>
                            <Link href="/site" className={pathname === '/site/blogs' ? styles.active : ''}>
                                Blogs
                            </Link>
                        </li>
                    </ul>
                </nav>
            </nav>

            <ShoppingCart isOpen={isCartOpen} toggleCart={toggleCart} /> {/* Render ShoppingCart component */}
        </header>
    );
}
