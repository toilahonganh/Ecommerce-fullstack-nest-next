"use client"
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { ToastContainer } from "react-toastify";
import { BlogInterface, DecodedToken } from "../interface";
import styles from "./Blog.module.scss";
import axios from "axios";
import { notifyToastError, notifyToastSuccess } from "@/app/utils/NotifyToast";

export default function BlogPage() {
    const [authData, setAuthData] = useState<DecodedToken | null>(null); 
    const [blog, setBlog] = useState<BlogInterface>({ user_id: "", title: "", content: "", images: [] });

    useEffect(() => {
        const accessToken = Cookies.get('accessToken');
        const fetchData = async() => {
            try {
                const response = await axios.post(`${process.env.NEXT_PUBLIC_ORIGIN}/auth/decode`, {
                    accessToken,
                });
                const { password, ...userData } = response.data; 
                setAuthData(userData); 
            } catch (error) {
                console.error("Error decoding token:", error); 
            }
        }
        fetchData();
    }, []);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = event.target;
        setBlog((prev) => ({ ...prev, [name]: value }));
    }

    const convertBase64 = (file: File) => {
        return new Promise<string | ArrayBuffer | null>((resolve, reject) => {
            const fileReader = new FileReader();
            fileReader.readAsDataURL(file);
            fileReader.onload = () => resolve(fileReader.result);
            fileReader.onerror = (error) => reject(error);
        });
    };

    const clearInputs = () => {
        setBlog({user_id: "", title: "", content: "", images: [] });
    }

    const uploadImages = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (!files || files.length === 0) return;

        const base64Promises = Array.from(files).map((file) => convertBase64(file));
        const base64Images = await Promise.all(base64Promises);

        setBlog((prev) => ({
            ...prev,
            images: [...prev.images, ...base64Images.map(img => img as string)]
        }));
    };

    const handleSubmit = async(event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        try {
            await axios.post(`${process.env.NEXT_PUBLIC_ORIGIN}/blog`, 
                {
                    ...blog, 
                    user_id: authData?._id 
                }
            );
            notifyToastSuccess(`Create a new blog`);
            clearInputs();
        } catch (error) {
            notifyToastError(`Error create blog!`);
        }
    }

    return (
        <>
            <div className={styles.create}>
                <ToastContainer />
                <div className={styles.heading}>
                    <span>CREATE A NEW BLOG</span>
                </div>

                <form className={styles.form_create} onSubmit={handleSubmit}>
                    {/* Title */}
                    <div className={styles.form}>
                        <div>
                            <span>Title</span>
                        </div>
                        <input
                            type="text"
                            name="title"
                            value={blog.title}
                            placeholder="Title"
                            onChange={handleChange}
                        />
                    </div>
                    {/* Content */}
                    <div className={styles.form}>
                        <div>
                            <span>Content</span>
                        </div>
                        <input
                            type="text"
                            name="content"
                            value={blog.content}
                            placeholder="Content"
                            onChange={handleChange}
                        />
                    </div>

                    {/* Images */}
                    <div className={styles.form}>
                        <div className="flex items-center justify-center w-full">
                            <label
                                htmlFor="dropzone-file"
                                className="flex flex-col items-center justify-center w-full h-15 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
                            >
                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                    <p className="mb-1 text-xs text-gray-500 dark:text-gray-400">
                                        <span className="font-semibold">Click to upload images</span>
                                    </p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                        SVG, PNG, JPG or GIF (MAX. 800x400px).
                                    </p>
                                </div>
                                <input
                                    id="dropzone-file"
                                    type="file"
                                    className="hidden"
                                    multiple
                                    onChange={uploadImages}
                                />
                            </label>
                        </div>
                    </div>

                    <div className={styles.form}>
                        <button type="submit">Create Product</button>
                    </div>
                </form>
            </div>
        </>
    );
}
