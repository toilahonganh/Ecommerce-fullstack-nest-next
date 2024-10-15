// app/components/Banner.tsx
'use client'
import React, { useEffect, useState } from 'react';
import styles from './Banner.module.scss';

interface BannerProps {
    images: string[]; 
    title: string;
    subtitle?: string; 
}

const Banner: React.FC<BannerProps> = ({ images, title, subtitle }) => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    useEffect(() => {
        const intervalId = setInterval(() => {
            setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
        }, 5000);

        return () => clearInterval(intervalId); // Dọn dẹp khi component unmount
    }, [images.length]);

    return (
        <div className={styles.banner} style={{ backgroundImage: `url(${images[currentImageIndex]})` }}>
            <div className={styles.overlay}>
                <h1>{title}</h1>
                {subtitle && <p>{subtitle}</p>} {/* Chỉ hiển thị nếu subtitle có */}
            </div>
        </div>
    );
};

export default Banner;
