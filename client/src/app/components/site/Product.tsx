'use client';
import React from 'react';
import styles from './Banner.module.scss';

interface BannerProps {
    image: string; // Chỉ truyền một ảnh duy nhất
}

const Product: React.FC<BannerProps> = ({ image }) => {
    return (
        <div className={styles.banner} style={{ backgroundImage: `url(${image})` }}>
            <div className={styles.overlay}>
            </div>
        </div>
    );
};

export default Product;
