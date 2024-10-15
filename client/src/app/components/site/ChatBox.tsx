"use client";
import { useState } from "react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { IoChatboxOutline } from "react-icons/io5";
import { FiSend } from "react-icons/fi";
import { MdKeyboardArrowUp } from "react-icons/md";
import styles from "./ChatBox.module.scss";


interface ChatForm {
    message: string;
}

export default function ChatBox() {
    const notify = (message: string) => {
        toast(`${message}`);
    };

    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [message, setMessage] = useState<string>(""); // Trạng thái để lưu trữ tin nhắn

    const clickChatBox = async () => {
        console.log("On click");
        setIsOpen(!isOpen);
    };

    const handleSendMessage = () => {
        if (message.trim() === "") return; // Không gửi tin nhắn rỗng
        notify(message); // Hiển thị thông báo với tin nhắn
        setMessage(""); // Xóa ô nhập sau khi gửi tin nhắn
    };

    return (
        <div>
            <ToastContainer /> {/* Thêm ToastContainer để hiển thị thông báo */}
            <div className={styles.chatbox} onClick={clickChatBox}>
                <IoChatboxOutline className={styles.chatbox_icon} />
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
                            <button onClick={handleSendMessage}>
                                <FiSend />
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
