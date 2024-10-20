"use client";

import { Key, useEffect, useState } from "react";
import axios from "axios";
import Banner from "../../components/site/Banner";
import Cookies from 'js-cookie';
import { ToastContainer } from "react-toastify";
import { notifyToastError, notifyToastSuccess } from "@/app/utils/NotifyToast";
import { CiHeart } from "react-icons/ci";
import { RiCloseLargeFill } from "react-icons/ri";
import styles from "./Products.module.scss";
import Link from "next/link";


export default function ProductPage() {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [productInfo, setProductInfo] = useState<any[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [authData, setAuthData] = useState<any>(null);
    const [cartItems, setCartItems] = useState<any[]>([]);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    const [quickView, setQuickView] = useState<any | null>(null);
    const [overlayVisible, setOverlayVisible] = useState(false);

    const [productData, setProductData] = useState({
        color: [],
        size: ""  // Thêm thuộc tính size
    });

    const [quantity, setQuantity] = useState(1);

    useEffect(() => {
        fetchProducts(currentPage);

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
    }, [currentPage]);

    const handleFavourite = () => {
        notifyToastSuccess(`Added to Favourite!`);
    };

    const handleColorChange = (color: string) => {
        setProductData((prev: any) => {
            const isSelected = prev.color.includes(color);
            return {
                ...prev,
                color: [color], // Cập nhật màu được chọn
            };
        });
    };

    const handleSizeChange = (size: string) => {
        setProductData((prev: any) => ({
            ...prev,
            size: prev.size === size ? "" : size,  // Chọn hoặc bỏ chọn size
        }));
    };

    const handleQuickView = (id: string) => {
        const product = productInfo.find(p => p._id === id);
        if (product) {
            console.log(product.color)
            setQuickView(product);
            setOverlayVisible(true);
            setQuantity(1);
        }
    };

    const handleAddCart = async (userId: string, productId: string, color: string[], size: string, quantity: number) => {
        if (!userId) {
            notifyToastError('Please login to add products to the cart.');
            return;
        }

        // Kiểm tra giá trị của color và size
        console.log("Selected Color:", color);
        console.log("Selected Size:", size);

        if (!size) {
            notifyToastError('Please select a size.');
            return;
        }

        try {
            const response = await axios.post(`${process.env.NEXT_PUBLIC_ORIGIN}/cart`, {
                user_id: userId,
                product_id: productId,
                size: size,
                color: color,
                quantity,
            });

            setCartItems((prevItems) => [
                ...prevItems,
                {
                    productId,
                    size,
                    color,
                    quantity,
                    productDetails: quickView  // Thêm chi tiết sản phẩm vào giỏ hàng
                }
            ]);
            notifyToastSuccess(`Added successfully ${quickView.name}`);
        } catch (error) {
            notifyToastError('Error adding product to the cart');
            console.error('Error adding to cart:', error);
        }
    };


    const fetchProducts = async (page: number) => {
        try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_ORIGIN}/product/get-all`);
            setProductInfo(response.data.products);
            setTotalPages(response.data.totalPages);
        } catch (error) {
            notifyToastError('Error fetching products');
            console.error('Error fetching products:', error);
        }
    };

    const filteredProducts = productInfo.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.category.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleQuantityChange = (type: "increase" | "decrease") => {
        setQuantity(prev => {
            if (type === "increase") return prev + 1;
            if (type === "decrease" && prev > 1) return prev - 1;
            return prev;
        });
    };

    return (
        <div className={styles.container}>
            <Banner title="RIODE PRODUCTS" subtitle="/ Riode products" images={""} />

            <ToastContainer />
            <div className={styles.product}>
                {filteredProducts.map((product) => (
                    <div className={styles.product_container} key={product._id}>
                            <div className={styles.image}>
                                <div className={styles.favourite} onClick={handleFavourite}>
                                    <p><CiHeart className={styles.icon} /></p>
                                </div>
                                <img src={product.images[0]} alt={`${product.name}'s image`} />
                                <div className={styles.quick_view} onClick={() => handleQuickView(product._id)}>
                                    <p>Quick view</p>
                                </div>
                            </div>
                        <Link href={`/site/products/${product._id}`}>
                            <div className={styles.product_info}>
                                <div className={styles.category}>
                                    <p>{product.category}</p>
                                </div>
                                <div className={styles.name}>
                                    <p>{product.name}</p>
                                </div>
                                <div className={styles.price}>
                                    <p>{product.price}.00 $</p>
                                </div>
                            </div>
                        </Link>
                    </div>
                ))}
            </div>

            {overlayVisible && quickView && (
                <div className={styles.overlay}>
                    <div className={styles.overlayContent}>
                        <div className={styles.product_info_over}>
                            <div className={styles.product_images}>
                                {quickView.images && quickView.images.length > 0 ? (
                                    <div className={styles.imageContainer}>
                                        <img
                                            src={quickView.images[currentImageIndex]}
                                            alt={`Additional image ${currentImageIndex + 1}`}
                                            className={styles.additionalImage}
                                        />

                                        <div className={styles.arrows}>
                                            <button
                                                onClick={() => setCurrentImageIndex((prev) => (prev > 0 ? prev - 1 : quickView.images.length - 1))}
                                                className={styles.arrowButton}
                                            >
                                                &lt;
                                            </button>
                                            <button
                                                onClick={() => setCurrentImageIndex((prev) => (prev < quickView.images.length - 1 ? prev + 1 : 0))}
                                                className={styles.arrowButton}
                                            >
                                                &gt;
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <p>No additional images available</p>
                                )}
                            </div>

                            <div className={styles.product_details}>
                                <div className={styles.product_name}>
                                    <p>{quickView.name}</p>
                                    <RiCloseLargeFill
                                        className={styles.btn_close}
                                        onClick={() => setOverlayVisible(false)}
                                    />
                                </div>
                                <div className={styles.product_category}>
                                    <p>{quickView.category}</p>
                                </div>
                                <div className={styles.product_price}>
                                    <p>${quickView.price}.00</p>
                                </div>
                                <div className={styles.product_description}>
                                    <p>{quickView.description}</p>
                                </div>
                                <div className={styles.colorOptions}>
                                    {quickView.color.map((color: string) => (
                                        <div
                                            key={color}
                                            className={`${styles.colorOption} ${productData.color.includes(color) ? styles.selected : ''}`}
                                            style={{ backgroundColor: color.toLowerCase() }}
                                            onClick={() => handleColorChange(color.toLowerCase())}
                                        />
                                    ))}
                                      {productData.color.length > 0 && (
                                        <span className={styles.colorLabel}>
                                            {productData.color[0] } {/* Hiển thị màu đầu tiên trong mảng màu đã chọn */}
                                        </span>
                                    )}
                                    
                                </div>
                              

                                <div className={styles.product_size}>
                                    <p>Sizes:</p>
                                    {quickView.size && quickView.size.length > 0 ? (
                                        <div className={styles.sizeOptions}>
                                            {quickView.size.map((size: string, index: Key) => (
                                                <span
                                                    key={index}
                                                    className={`${styles.sizeOption} ${productData.size === size ? styles.selected : ''}`}
                                                    onClick={() => handleSizeChange(size)} // Gọi hàm chọn size
                                                >
                                                    {size}
                                                </span>
                                            ))}
                                        </div>
                                    ) : (
                                        <p>No sizes available</p>
                                    )}
                                </div>

                                <div className={styles.quantityControl}>
                                    <button onClick={() => handleQuantityChange("decrease")}>-</button>
                                    <p>{quantity}</p>
                                    <button onClick={() => handleQuantityChange("increase")}>+</button>
                                </div>

                                <div className={styles.addCart}>
                                    <div className={styles.addCart}>
                                        <button onClick={() => handleAddCart(`${authData._id}`, quickView._id, productData.color, productData.size, quantity)}>
                                            Add to Cart
                                        </button>
                                    </div>
                                </div>
                                {/* <button onClick={() => setOverlayVisible(false)}>Close</button> */}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
