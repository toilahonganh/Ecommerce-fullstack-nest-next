"use client";
import { useState } from "react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaPhoneAlt } from "react-icons/fa";

import styles from "./HotLine.module.scss";


interface ChatForm {
    message: string;
}

export default function HotLine() {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [message, setMessage] = useState<string>(""); // Trạng thái để lưu trữ tin nhắn

    const clickChatBox = async () => {
        console.log("On click");
        setIsOpen(!isOpen);
    };



    return (
        <div>
            <div className={styles.hotline} onClick={clickChatBox}>
                <FaPhoneAlt className={styles.icon} />
            </div>
            {isOpen && (
                <div className={styles.chatbox_content}>
                    <div className={styles.dialog_message}>
                        <div className={styles.avatar}>
                            <img src="https://res.cloudinary.com/dykq6w3m5/image/upload/v1728231738/qkwinfzdyi2x5bqnygtp.jpg" />
                            <span>Đinh Hồng Anh</span>
                            {/* Bạn có thể thêm các tin nhắn đã gửi ở đây */}
                        </div>
                        <div className={styles.maintain_chat}>
                            {/* Bạn có thể thêm các tin nhắn đã gửi ở đây */}
                        </div>
                        <div className={styles.input_message}>
                            <input
                                type="text"
                                placeholder="Type message..."
                                value={message} // Đặt giá trị cho ô nhập
                                onChange={(e) => setMessage(e.target.value)} // Cập nhật trạng thái khi người dùng nhập
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
