"use client";
import axios from "axios";
import Cookies from 'js-cookie';
import ShoppingCart from "./page";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { DecodedToken, Product } from "@/app/utils/interface.util";

import { GiShoppingCart } from "react-icons/gi";
import { IoMdHeartEmpty } from "react-icons/io";
import { CiSearch } from "react-icons/ci";
import styles from "./HeaderScoll.module.scss"; // Đảm bảo tên file là HeaderScroll.module.scss
import { notifyToastError, notifyToastSuccess } from "@/app/utils/NotifyToast";

export default function HeaderScroll() {
    const pathname = usePathname(); 
    const [authData, setAuthData] = useState<DecodedToken | null>(null); 
    const [searchQuery, setSearchQuery] = useState('');
    const [isCartOpen, setIsCartOpen] = useState(false); 
    const [isAuthenticated, setIsAuthenticated] = useState(false); 
    const [isHeaderVisible, setIsHeaderVisible] = useState<boolean>(false);
    const [searchResults, setSearchResults] = useState<Product[]>([]);
    const [isSearchVisible, setIsSearchVisible] = useState(false); 

    useEffect(() => {
        const handleScroll = () => {
            setIsHeaderVisible(window.scrollY > 100); // Cập nhật trạng thái hiển thị header
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll); // Dọn dẹp sự kiện
    }, []); // Chỉ gọi một lần khi component được gắn

    useEffect(() => {
        const fetchData = async () => {
            const accessToken = Cookies.get('accessToken');
            if (!accessToken) return;

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
                quantity: 1, // Đặt số lượng mặc định là 1
            });
            notifyToastSuccess(`Added ${searchResults.find(item => item._id === productId)?.name} to cart`);
        } catch (error) {
            notifyToastError('Error adding product to the cart'); 
            console.error('Error adding to cart:', error); 
        }
    }

    const toggleCart = () => {
        setIsCartOpen(prev => !prev);
    };

    const avatar = authData?.avatar;
    const name = authData?.name;

    return (
        <div className={`${styles.container} ${isHeaderVisible ? styles.smallHeader : ''}`}>
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
            <ShoppingCart isOpen={isCartOpen} toggleCart={toggleCart} /> {/* Render ShoppingCart component */}
        </div>
    );
}
