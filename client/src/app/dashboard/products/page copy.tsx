"use client";
import { useState } from "react";
import { SignupInterface } from "../interfaces";
import axios from "axios";
import styles from "./Page.module.scss";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

export default function CreateUser() {
    const notify = (message: string) => {
        toast(message, { autoClose: 1000 });
    };

    const [registerData, setRegisterData] = useState<SignupInterface>({
        name: "",
        email: "",
        password: "",
        address: "",
        phone_number: "",
        avatar: "",
    });

    const handleOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setRegisterData((prev) => ({ ...prev, [name]: value }));
    };

    const convertBase64 = (file: File) => {
        return new Promise<string | ArrayBuffer | null>((resolve, reject) => {
            const fileReader = new FileReader();
            fileReader.readAsDataURL(file);
            fileReader.onload = () => {
                resolve(fileReader.result);
            };
            fileReader.onerror = (error) => {
                reject(error);
            };
        });
    };

    const uploadImage = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]; // Chỉ lấy file đầu tiên
        if (!file) return;

        // Convert file to base64 and update the state
        const base64Image = (await convertBase64(file)) as string;

        // Update the formData with the new image
        setRegisterData((prev) => ({
            ...prev,
            avatar: base64Image, // Cập nhật avatar với ảnh đã chuyển đổi
        }));
    };

    const handleOnSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        try {
            const response = await axios.post(
                `${process.env.NEXT_PUBLIC_ORIGIN}/auth/sign-up`,
                registerData
            );
            notify(`Registered successfully!`);
            console.log(response);
        } catch (error) {
            notify(`Register error!`);
            console.error(error);
        }
    };

    const clearInputs = () => {
        setRegisterData({
            name: "",
            email: "",
            password: "",
            address: "",
            phone_number: "",
            avatar: "",
        });
    };

    return (
        <div className={styles.create}>
            <ToastContainer />

            <div className={styles.heading}>
                <span>Create A New User</span>
            </div>
            <form className={styles.form_create} onSubmit={handleOnSubmit}>
                <div className={styles.form}>
                    <div>
                        <span>Name</span>
                    </div>
                    <input
                        type="text"
                        name="name"
                        value={registerData.name}
                        placeholder="Name"
                        onChange={handleOnChange}
                    />
                </div>

                <div className={styles.form}>
                    <div>
                        <span>Email</span>
                    </div>
                    <input
                        type="email"
                        name="email"
                        value={registerData.email}
                        placeholder="Email"
                        onChange={handleOnChange}
                    />
                </div>

                <div className={styles.form}>
                    <div>
                        <span>Password</span>
                    </div>
                    <input
                        type="password"
                        name="password"
                        value={registerData.password}
                        placeholder="Password"
                        onChange={handleOnChange}
                    />
                </div>

                <div className={styles.form}>
                    <div>
                        <span>Address</span>
                    </div>
                    <input
                        type="text"
                        name="address"
                        value={registerData.address}
                        placeholder="Address"
                        onChange={handleOnChange}
                    />
                </div>

                <div className={styles.form}>
                    <div>
                        <span>Phone number</span>
                    </div>
                    <input
                        type="text"
                        name="phone_number"
                        value={registerData.phone_number}
                        placeholder="Phone Number"
                        onChange={handleOnChange}
                    />
                </div>

                <div className={styles.form}>
                    <div className="flex items-center justify-center w-full">
                        <label
                            htmlFor="dropzone-file"
                            className="flex flex-col items-center justify-center w-full h-15 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
                        >
                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                <p className="mb-1 text-xs text-gray-500 dark:text-gray-400">
                                    <span className="font-semibold">Click to upload avatar</span>
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                    SVG, PNG, JPG or GIF (MAX. 800x400px)
                                </p>
                            </div>
                            <input
                                onChange={uploadImage}
                                id="dropzone-file"
                                type="file"
                                className="hidden"
                                accept="image/*"
                            />
                        </label>
                    </div>
                </div>

                <div className={styles.button}>
                    <button type="submit" className={styles.submit}>
                        Submit
                    </button>
                    <button type="button" className={styles.clearButton} onClick={clearInputs}>
                        Clear
                    </button>
                </div>
            </form>
        </div>
    );
}
