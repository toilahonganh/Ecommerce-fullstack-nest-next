"use client";

import { useEffect, useState } from "react";
import styles from "./Products.module.scss";
import axios from "axios";
import { notifyToastError } from "@/app/utils/NotifyToast";

import { MdOutlineKeyboardArrowRight } from "react-icons/md";

export default function ProductPage() {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [productInfo, setProductInfo] = useState<any[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const limit = 5;

    const [quickView, setQuickView] = useState<any | null>(null);
    const [overlayVisible, setOverlayVisible] = useState(false);

    const colors = ["Black", "White"];

    const [productData, setProductData] = useState({
        color: []
    });
    const handleColorChange = (color: string) => {
        setProductData((prev: any) => {
            const isSelected = prev.color.includes(color);
            return {
                ...prev,
                color: isSelected ? prev.color.filter((c: string) => c !== color) : [...prev.color, color]
            };
        });
    };

    const handleQuickView = (id: string) => {
        const product = productInfo.find(p => p._id === id);
        if (product) {
            setQuickView(product);
            setOverlayVisible(true);
        }
    };

    const fetchProducts = async (page: number) => {
        try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_ORIGIN}/product/get-all-products`, {
                params: { page, limit },
            });
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

    useEffect(() => {
        fetchProducts(currentPage);
    }, [currentPage]);

    return (
        <div>
            <div className={styles.product}>
                {filteredProducts.map((product) => (
                    <div className={styles.product_container} key={product._id}>
                        <div className={styles.image}>
                            <img src={product.images[0]} alt={`${product.name}'s image`} />
                            <div className={styles.quick_view} onClick={() => handleQuickView(product._id)}>
                                <p>Quick view</p>
                            </div>
                        </div>
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
                                                &lt; {/* Mũi tên trái */}
                                            </button>
                                            <button
                                                onClick={() => setCurrentImageIndex((prev) => (prev < quickView.images.length - 1 ? prev + 1 : 0))}
                                                className={styles.arrowButton}
                                            >
                                                &gt; {/* Mũi tên phải */}
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
                                </div>
                                <div className={styles.product_category}>
                                    <p>{quickView.category}</p>
                                </div>
                                <div className={styles.product_price}>
                                    <p>${quickView.price}.00 </p>
                                </div>
                                <div className={styles.product_description}>
                                    <p>{quickView.description}</p>
                                </div>
                                <div className={styles.colorOptions}>
                                    {colors.map((color) => (
                                        <div
                                            key={color}
                                            className={`${styles.colorOption} ${productData.color.includes(color) ? styles.selected : ''}`}
                                            style={{ backgroundColor: color.toLowerCase() }}
                                            onClick={() => handleColorChange(color)}
                                        >
                                        </div>
                                    ))}
                                </div>
                                <div className={styles.product_size}>
                                    <p>Sizes:</p>
                                    {quickView.size && quickView.size.length > 0 ? (
                                        <div className={styles.sizeOptions}>
                                            {quickView.size.map((size, index) => (
                                                <span key={index} className={styles.sizeOption}>
                                                    {size}
                                                </span>
                                            ))}
                                        </div>
                                    ) : (
                                        <p>No sizes available</p>
                                    )}
                                </div>

                                <div className={styles.addCart}>
                                    <p>1</p>
                                    <button onClick={() => setOverlayVisible(false)}>Add to cart</button>
                                </div>
                                <button onClick={() => setOverlayVisible(false)}>Close</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

        </div>
    )
}
