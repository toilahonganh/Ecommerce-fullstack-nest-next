'use client'
import React from 'react';
import {BannerProp} from "../../utils/interface.util";
import styles from './Banner.module.scss';


const Banner: React.FC<BannerProp> = ({ title, subtitle }) => {
    return (
        <div className={styles.banner}>
            <div className={styles.overlay}>
                <h1>{title}</h1>
                {subtitle && <p>{subtitle}</p>} {/* Chỉ hiển thị nếu subtitle có */}
                <a className={styles.ctaButton}></a>
            </div>
        </div>
    );
};

export default Banner;
