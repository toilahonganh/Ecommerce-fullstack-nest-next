'use client'; // Đảm bảo Card cũng là Client Component
import styles from "./Card.module.scss";

interface CardProps {
    imageUrl: string[]; // Mảng ảnh
    hotelName: string;
    hotelAdress: string;
    hotelPhoneNumber: string;
    hotelDescription: string;
    onViewDetails: () => void; // Hàm xử lý sự kiện
}

export default function Card({
    imageUrl, 
    hotelName, 
    hotelAdress, 
    hotelPhoneNumber, 
    hotelDescription, 
    onViewDetails 
}: CardProps) {
    return (
        <div className={styles.card}>
            <div className={styles.image}>
                {/* Chỉ hiển thị ảnh đầu tiên trong mảng imageUrl */}
                <img src={imageUrl[0]} alt={hotelName} />
            </div>
            <div className={styles.content}>
                <h2 className={styles.name}>{hotelName}</h2>
                <p className={styles.address}>{hotelAdress}</p>
                <button onClick={onViewDetails}>View hotel</button> {/* Nút xem chi tiết */}
            </div>
        </div>
    );
}
