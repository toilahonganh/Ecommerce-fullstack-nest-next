"use client";
import { useState } from "react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { IoIosSend } from "react-icons/io";
import { IoChatbubbleOutline } from "react-icons/io5";
import styles from "./ChatBox.module.scss";
import { notifyToastSuccess } from "@/app/utils/NotifyToast";


interface ChatForm {
    message: string;
}

export default function ChatBox() {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [message, setMessage] = useState<string>("");


    const clickChatBox = async () => {
        console.log("On click");
        setIsOpen(!isOpen);
    };

    const handleSendMessage = () => {
        if (message.trim() === "") return; // Không gửi tin nhắn rỗng
        notifyToastSuccess(message); // Hiển thị thông báo với tin nhắn
        setMessage(""); // Xóa ô nhập sau khi gửi tin nhắn
    };

    // Hàm kiểm tra phím nhấn
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleSendMessage();
        }
    };

    return (
        <div>
            <ToastContainer /> {/* Thêm ToastContainer để hiển thị thông báo */}
            <div className={styles.chatbox} onClick={clickChatBox}>
                <IoChatbubbleOutline className={styles.chatbox_icon} />
            </div>
            {isOpen && (
                <div className={styles.chatbox_content}>
                    <div className={styles.dialog_message}>
                        <div className={styles.avatar}>
                            <img src="https://d-themes.com/wordpress/riode/elements/wp-content/uploads/sites/3/2020/09/logo.png" />
                        </div>
                        <div className={styles.maintain_chat}>
                        </div>
                        <div className={styles.input_message}>
                            <input
                                type="text"
                                placeholder="Type message..."
                                value={message} // Đặt giá trị cho ô nhập
                                onChange={(e) => setMessage(e.target.value)} // Cập nhật trạng thái khi người dùng nhập
                                onKeyDown={handleKeyDown} // Thêm sự kiện khi nhấn phím
                            />
                            <button onClick={handleSendMessage}>
                                <IoIosSend className={styles.send_icon} />
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
