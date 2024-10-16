"use client";

import axios from "axios";
import { useState } from "react";
import { ToastContainer } from 'react-toastify';
import {notifyToastSuccess, notifyToastError} from "../../utils/NotifyToast";
import { LoginInterface } from "../interface";
import { MdOutlineEmail } from "react-icons/md";
import { RiLockPasswordLine } from "react-icons/ri";
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation'; 
import styles from "./Login.module.scss";

export default function LoginPage() {
    const [loginData, setLoginData] = useState<LoginInterface>({ email: "", password: "" });
    const [error, setError] = useState<string>("");
    const router = useRouter(); 

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setLoginData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setError("");

        try {
            const response = await axios.post(`${process.env.NEXT_PUBLIC_ORIGIN}/auth/login`, loginData);

            Cookies.set('accessToken', response.data.accessToken, { expires: 7, secure: true, sameSite: 'Strict' });
            Cookies.set('refreshToken', response.data.refreshToken, { expires: 7, secure: true, sameSite: 'Strict' });
            
            notifyToastSuccess(`Login successfully!`);
            setTimeout(() => {
                router.push('/site/products'); 
            }, 1200)

        } catch (error) {
            notifyToastError("Login error");
            console.error(error);
        }
    };

    return (
        <div className={styles.container}>
            <ToastContainer />
            <div className={styles.formContainer}>
                <form className={styles.registrationForm} onSubmit={handleSubmit}>
                    <h2>Login</h2>
                    <div className={styles.formGroup}>
                        <MdOutlineEmail />
                        <input
                            type="email"
                            id="email"
                            name='email'
                            value={loginData.email}
                            onChange={handleChange}
                            placeholder='Your Email'
                            required
                        />
                    </div>
                    <div className={styles.formGroup}>
                        <RiLockPasswordLine />
                        <input
                            type="password"
                            id="password"
                            name='password'
                            value={loginData.password}
                            onChange={handleChange}
                            placeholder='Password'
                            required
                        />
                    </div>
                    <div className={styles.formGroup_checkbox}>
                        <input
                            type="checkbox"
                            id="terms"
                            defaultChecked
                            required
                        />
                        <span>Remember me</span>
                    </div>
                    <button type="submit" className={styles.submitBtn}>Login</button>
                    {error && <p className={styles.error}>{error}</p>} {/* Hiển thị thông báo lỗi nếu có */}
                </form>
            </div>
        </div>
    );
}
