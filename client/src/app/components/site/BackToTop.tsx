"use client";
import { useState, useEffect } from "react";
import { MdKeyboardArrowUp } from "react-icons/md";
import styles from "./BackToTop.module.scss";

export default function BackToTop() {
    const [isVisible, setIsVisible] = useState<boolean>(false);

    // Hàm để cuộn lên đầu trang
    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // Hiện/ẩn nút khi cuộn
    const handleScroll = () => {
        if (window.scrollY > 300) { // Hiện nút khi cuộn xuống hơn 300px
            setIsVisible(true);
        } else {
            setIsVisible(false);
        }
    };

    useEffect(() => {
        window.addEventListener('scroll', handleScroll); // Thêm event listener cho scroll
        return () => {
            window.removeEventListener('scroll', handleScroll); // Xóa event listener khi component bị gỡ bỏ
        };
    }, []);

    return (
        <div>
            {isVisible && (
                <div className={styles.back_to_top} onClick={scrollToTop}>
                    <MdKeyboardArrowUp className={styles.icon} />
                </div>
            )}
        </div>
    );
}
