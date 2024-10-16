"use client";

import { useEffect, useState } from "react";
import styles from "./ShoppingCart.module.scss";
import axios from "axios";
import Cookies from 'js-cookie';
import { ToastContainer } from "react-toastify";

export default function ShoppingCart({ isOpen, toggleCart }: { isOpen: boolean, toggleCart: () => void }) {
    const [cartInfo, setCartInfo] = useState<any[]>([]);

    useEffect(() => {
        const accessToken = Cookies.get('accessToken');

        const fetchData = async () => {
            try {
                const response = await axios.post(`${process.env.NEXT_PUBLIC_ORIGIN}/auth/decode`, { accessToken });
                const userId = response.data._id;

                const carts = await axios.get(`${process.env.NEXT_PUBLIC_ORIGIN}/cart/${userId}`);
                setCartInfo(carts.data);
                console.log(carts.data);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };
        fetchData();
    }, []);

    const calculateTotalPrice = () => {
        return cartInfo.reduce((acc, item) => acc + item.product_id.price * item.quantity, 0);
    };

    return (
        <div className={`${styles.container} ${isOpen ? styles.open : ''}`}>
            <div className={styles.cartHeader}>
                <h5>Shopping Cart</h5>
                <button onClick={toggleCart} className={styles.closeBtn}>X</button>
            </div>
            <div className={styles.cartItems}>
                {cartInfo.length > 0 ? (
                    cartInfo.map((item) => (
                        <div className={styles.cartItem} key={item._id}>
                            <div className={styles.productInfo}>
                                <img src={item.product_id.images[0] || "/default-product.jpg"} alt={item.product_id.name} />
                                <h5>{item.product_id.name}</h5>
                                <div className={styles.price_quantity}>
                                    {item.quantity}
                                    ${item.product_id.price}
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <p>No items in your cart.</p>
                )}
            </div>
            {cartInfo.length > 0 && (
                <div className={styles.cartFooter}>
                    <div className={styles.totalAmount}>Total: ${calculateTotalPrice()}</div>
                    <button className={styles.checkoutBtn}>Proceed to Checkout</button>
                </div>
            )}
        </div>
    );
}
