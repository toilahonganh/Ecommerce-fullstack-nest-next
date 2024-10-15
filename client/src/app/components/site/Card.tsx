'use client'; // Đảm bảo Card cũng là Client Component
import styles from "./Card.module.scss";

interface CardProps {
    images: string[];
    name: string; 
    price: number; 
}

export default function Card({
    images, 
    name, 
    price
}: CardProps) {
    return (
        <div className={styles.card}>
            <div className={styles.image}>
                <img src={images[0]} alt={name} /> {/* Thêm thuộc tính alt */}
            </div>
            <div className={styles.content}>
                <h2>{name}</h2> 
                <p className={styles.price}>
                    ${price.toFixed(2)} {/* Hiển thị giá theo định dạng tiền tệ */}
                </p> 
            </div>
        </div>
    );
}
