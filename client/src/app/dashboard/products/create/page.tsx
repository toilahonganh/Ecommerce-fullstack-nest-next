"use client";
import { useState } from "react";
import { ProductInterface } from "../interfaces";
import axios from "axios";
import styles from "./Page.module.scss";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

export default function CreateUser() {
    const notify = (message: string) => {
        toast(message, { autoClose: 1000 });
    };

    const sizes = ["S", "M", "L", "XL"];
    const genders = ["Man", "Woman"];
    const sizesShoes = ["39", "40", "41", "42", "43", "44", "45"];
    const bagSize = ["10L", "20L", "30L"];
    const colors = ["Red", "Green", "Blue", "Black", "White"];
    const [productData, setProductData] = useState<ProductInterface>({
        name: "",
        description: "",
        gender: [],
        price: 0,
        stock: 0,
        category: "",
        images: [],
        size: [],
        material: "",
        color: []
    });

    const handleOnChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = event.target;
        setProductData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSizeChange = (size: string) => {
        setProductData((prev) => {
            const isSelected = prev.size.includes(size);
            return {
                ...prev,
                size: isSelected ? prev.size.filter(s => s !== size) : [...prev.size, size]
            };
        });
    };

    const handleGenderChange = (gender: string) => {
        setProductData((prev) => {
            const isSelected = prev.gender.includes(gender);
            return {
                ...prev,
                gender: isSelected ? prev.gender.filter((g: string) => g !== gender) : [...prev.gender, gender]
            };
        });
    };

    const handleColorChange = (color: string) => {
        setProductData((prev) => {
            const isSelected = prev.color.includes(color);
            return {
                ...prev,
                color: isSelected ? prev.color.filter(c => c !== color) : [...prev.color, color]
            };
        });
    };

    const convertBase64 = (file: File) => {
        return new Promise<string | ArrayBuffer | null>((resolve, reject) => {
            const fileReader = new FileReader();
            fileReader.readAsDataURL(file);
            fileReader.onload = () => resolve(fileReader.result);
            fileReader.onerror = (error) => reject(error);
        });
    };

    const uploadImages = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (!files || files.length === 0) return;

        const base64Promises = Array.from(files).map((file) => convertBase64(file));
        const base64Images = await Promise.all(base64Promises);

        setProductData((prev) => ({
            ...prev,
            images: [...prev.images, ...base64Images.map(img => img as string)]
        }));
    };

    const handleOnSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        try {
            const response = await axios.post(
                `${process.env.NEXT_PUBLIC_ORIGIN}/product`,
                productData
            );
            notify(`Created successfully!`);
            clearInputs(); // Clear inputs after successful creation
            console.log(response);
        } catch (error) {
            notify(`Register error!`);
            console.error(error);
        }
    };

    const clearInputs = () => {
        setProductData({
            name: "",
            description: "",
            gender: [],
            price: 0,
            stock: 0,
            category: "",
            images: [],
            size: [],
            material: "",
            color: [] // Reset color to an empty array
        });
    };

    return (
        <div className={styles.create}>
            <ToastContainer />
            <div className={styles.heading}>
                <span>CREATE A NEW PRODUCT</span>
            </div>
            <form className={styles.form_create} onSubmit={handleOnSubmit}>
                <div className={styles.form}>
                    <div>
                        <span>Name</span>
                    </div>
                    <input
                        type="text"
                        name="name"
                        value={productData.name}
                        placeholder="Name"
                        onChange={handleOnChange}
                    />
                </div>

                <div className={styles.form}>
                    <div>
                        <span>Description</span>
                    </div>
                    <input
                        type="text"
                        name="description"
                        value={productData.description}
                        placeholder="Description"
                        onChange={handleOnChange}
                    />
                </div>
                <div className={styles.form}>
                    <div>
                        <span>Gender</span>
                    </div>
                    <div className={styles.genderOption}>
                        {genders.map((gender) => (
                            <div
                                key={gender}
                                className={`${styles.sizeOption} ${productData.gender.includes(gender) ? styles.selected : ''}`}
                                onClick={() => handleGenderChange(gender)}
                            >
                                <p>{gender}</p>
                            </div>
                        ))}
                    </div>
                </div>

                <div className={styles.form}>
                    <div>
                        <span>Price</span>
                    </div>
                    <input
                        type="number"
                        name="price"
                        value={productData.price}
                        placeholder="Price"
                        onChange={handleOnChange}
                    />
                </div>

                <div className={styles.form}>
                    <div>
                        <span>Stock</span>
                    </div>
                    <input
                        type="number"
                        name="stock"
                        value={productData.stock}
                        placeholder="Stock"
                        onChange={handleOnChange}
                    />
                </div>

                <div className={styles.form}>
                    <div>
                        <span>Category</span>
                    </div>
                    <select
                        name="category"
                        value={productData.category}
                        onChange={handleOnChange}
                    >
                        <option value="">Select a category</option>
                        <option value="shirts">Shirts</option>
                        <option value="shoes">Shoes</option>
                        <option value="backpacks">Backpacks</option>
                        <option value="caps">Caps</option>
                    </select>
                </div>

                {productData.category === "shirts" && (
                    <>
                        <div className={styles.form}>
                            <div>
                                <span>Size</span>
                            </div>
                            <div className={styles.sizeOptions}>
                                {sizes.map((size) => (
                                    <div
                                        key={size}
                                        className={`${styles.sizeOption} ${productData.size.includes(size) ? styles.selected : ''}`}
                                        onClick={() => handleSizeChange(size)}
                                    >
                                        <p>{size}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className={styles.form}>
                            <div>
                                <span>Material</span>
                            </div>
                            <input
                                type="text"
                                name="material"
                                value={productData.material}
                                placeholder="Material"
                                onChange={handleOnChange}
                            />
                        </div>
                    </>
                )}
                {productData.category === "caps" && (
                    <>
                        <div className={styles.form}>
                            <div>
                                <span>Size cap</span>
                            </div>
                            <div className={styles.sizeOptions}>
                                {sizes.map((size) => (
                                    <div
                                        key={size}
                                        className={`${styles.sizeOption} ${productData.size.includes(size) ? styles.selected : ''}`}
                                        onClick={() => handleSizeChange(size)}
                                    >
                                        <p>{size}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className={styles.form}>
                            <div>
                                <span>Material</span>
                            </div>
                            <input
                                type="text"
                                name="material"
                                value={productData.material}
                                placeholder="Material"
                                onChange={handleOnChange}
                            />
                        </div>
                    </>
                )}

                {productData.category === "shoes" && (
                    <>
                        <div className={styles.form}>
                            <div>
                                <span>Size</span>
                            </div>
                            <div className={styles.sizeOptions}>
                                {sizesShoes.map((size) => (
                                    <div
                                        key={size}
                                        className={`${styles.sizeOption} ${productData.size.includes(size) ? styles.selected : ''}`}
                                        onClick={() => handleSizeChange(size)}
                                    >
                                        <p>{size}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className={styles.form}>
                            <div>
                                <span>Material</span>
                            </div>
                            <input
                                type="text"
                                name="material"
                                value={productData.material}
                                placeholder="Material"
                                onChange={handleOnChange}
                            />
                        </div>
                    </>
                )}
                {productData.category === "backpacks" && (
                    <>
                        <div className={styles.form}>
                            <div>
                                <span>Size backpacks</span>
                            </div>
                            <div className={styles.sizeOptions}>
                                {bagSize.map((size) => (
                                    <div
                                        key={size}
                                        className={`${styles.sizeOption} ${productData.size.includes(size) ? styles.selected : ''}`}
                                        onClick={() => handleSizeChange(size)}
                                    >
                                        <p>{size}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className={styles.form}>
                            <div>
                                <span>Material</span>
                            </div>
                            <input
                                type="text"
                                name="material"
                                value={productData.material}
                                placeholder="Material"
                                onChange={handleOnChange}
                            />
                        </div>
                    </>
                )}

                <div className={styles.form}>
                    <div>
                        <span>Color</span>
                    </div>
                    <div className={styles.colorOptions}>
                        {colors.map((color) => (
                            <div
                                key={color}
                                className={`${styles.colorOption} ${productData.color.includes(color) ? styles.selected : ''}`}
                                style={{ backgroundColor: color.toLowerCase() }}
                                onClick={() => handleColorChange(color)}
                            >
                                <p>{color}</p>
                            </div>
                        ))}
                    </div>
                </div>

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
    );
}
