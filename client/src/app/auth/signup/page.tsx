"use client"
import axios from "axios";
import { useState } from "react";
import { ToastContainer } from 'react-toastify';
import {notifyToastSuccess, notifyToastError} from '../../utils/NotifyToast';
import 'react-toastify/dist/ReactToastify.css';
import { MdOutlineEmail } from "react-icons/md";
import { RiLockPasswordLine } from "react-icons/ri";
import {SignupInterface} from "../interface";
import { useRouter } from 'next/navigation'; 
import styles from "./Signup.module.scss";


export default function LoginPage() {
    const [loginData, setLoginData] = useState<SignupInterface>({ name: "", email: "", password: "", phone_number: "", address: ""});
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
            const response = await axios.post(`${process.env.NEXT_PUBLIC_ORIGIN}/auth/sign-up`, loginData);

            notifyToastSuccess(`Signed up!`);
            router.push('/auth/login');
        } catch (error) {
            notifyToastError("Sign up error");
            console.error(error);
        }
    };

    return (
        <div className={styles.container}>
            <ToastContainer />
            <div className={styles.formContainer}>
                <form className={styles.registrationForm} onSubmit={handleSubmit}>
                    <h2>Register</h2>
                    <div className={styles.formGroup}>
                        <MdOutlineEmail />
                        <input
                            type="text"
                            id="name"
                            name='name'
                            value={loginData.name}
                            onChange={handleChange}
                            placeholder='Your name'
                            required
                        />
                    </div>
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
                    
                    <div className={styles.formGroup}>
                        <RiLockPasswordLine />
                        <input
                            type="text"
                            id="phone_number"
                            name='phone_number'
                            value={loginData.phone_number}
                            onChange={handleChange}
                            placeholder='Phone Number'
                            required
                        />
                    </div>
                    <div className={styles.formGroup}>
                        <RiLockPasswordLine />
                        <input
                            type="text"
                            id="address"
                            name='address'
                            value={loginData.address}
                            onChange={handleChange}
                            placeholder='Address'
                            required
                        />
                    </div>
                    <button type="submit" className={styles.submitBtn}>Register</button>
                    {error && <p className={styles.error}>{error}</p>} {/* Hiển thị thông báo lỗi nếu có */}
                </form>
            </div>
        </div>
    );
}
