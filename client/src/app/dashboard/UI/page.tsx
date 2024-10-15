"use client"
import axios from "axios";
import React, { useState, FormEvent, useEffect } from "react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Banner from '../../components/dashboard/Banner';
import styles from './Page.module.scss';

interface RegisterFormState {
    images: string[];
}

export default function Page() {
    const notify = (message: string) => {
        toast(`${message}`);
    };
    
    const [formData, setFormData] = useState<RegisterFormState>({
        images: [] // Ensure initial state has images as an array
    });
    const [loading, setLoading] = useState(false);

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

    const uploadImages = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (!files || files.length === 0) return;

        // Convert each file to base64 and update the state
        const base64Promises = Array.from(files).map((file) => convertBase64(file));
        const base64Images = await Promise.all(base64Promises);

        // Update the formData with the new images
        setFormData((prev) => ({
            ...prev,
            images: [...prev.images, ...base64Images.map(img => img as string)] // Use 'images' here
        }));
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        setLoading(true);
        try {
            const response = await axios.post(`http://localhost:8686/ui/upload-banners`, {
                image: formData.images // Ensure you're sending the 'images' array
            });

            if (response.status === 200) {
                notify("Created a new hotel!");
            } else {
                notify("Failed to create a new hotel!");
            }
        } catch (error) {
            console.error("Error creating hotel:", error);
            notify("Error creating hotel");
        } finally {
            setLoading(false);
        }
    };

    const [imageList, setImageList] = useState<string[]>([]);

    useEffect(() => {
        const fetchBanners = async () => {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_EXPRESS_ORIGIN}/ui/get-banners`, {
                    method: 'GET',
                });
                const data = await response.json();
                if (data.message.metadata.length > 0) {
                    const bannerImages = data.message.metadata[0].image;
                    setImageList(bannerImages);  // Cập nhật với list ảnh từ API
                }
                console.log(data.message.metadata[0].image);    
                
            } catch (error) {
                console.error('Error fetching banners:', error);
            }
        };
    
        fetchBanners();
    }, []);
    return (
        <div className={styles.create}>
            <ToastContainer />
            <Banner
                images={imageList}
                title="CHANGE BANNERS"
                subtitle=""
            />
            <form className={styles.form_create} onSubmit={handleSubmit}>
                <div className={styles.form}>
                    <div className="flex items-center justify-center w-full">
                        <label
                            htmlFor="dropzone-file"
                            className="flex flex-col items-center justify-center w-full h-15 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
                        >
                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                <svg
                                    aria-hidden="true"
                                    className="w-10 h-5 mb-3 text-gray-400"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                                    ></path>
                                </svg>
                                <p className="mb-1 text-xs text-gray-500 dark:text-gray-400">
                                    <span className="font-semibold">Click to upload avatar</span> or drag and drop
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                    SVG, PNG, JPG or GIF (MAX. 800x400px)
                                </p>
                            </div>
                            <input
                                onChange={uploadImages}
                                id="dropzone-file"
                                type="file"
                                className="hidden"
                                accept="image/*"
                                multiple
                            />
                        </label>
                    </div>
                </div>

                <div className={styles.button}>
                    <button type="submit" className={styles.submit}>
                        Submit
                    </button>
                </div>
            </form>
        </div>
    );
}
