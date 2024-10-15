import * as dotenv from 'dotenv';
dotenv.config();
import { v2 as cloudinary, UploadApiOptions } from 'cloudinary';

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME, 
    api_key: process.env.API_KEY, 
    api_secret: process.env.API_SECRET 
});

const uploadOptions: UploadApiOptions = {
    overwrite: true,
    invalidate: true,
    resource_type: "auto",
};

/**
 * Tải lên một hình ảnh lên Cloudinary
 * @param {string} image - Chuỗi Base64 hoặc URL của hình ảnh
 * @returns {Promise<string>} - Trả về URL bảo mật của hình ảnh đã tải lên
 */
const uploadImage = (image: string): Promise<string> => {
    return new Promise((resolve, reject) => {
        cloudinary.uploader.upload(image, uploadOptions, (error, result) => {
            if (error) {
                console.error("Error uploading image:", error.message);
                return reject(new Error("Image upload failed. Please try again later."));
            }
            console.log("Uploaded Image URL:", result.secure_url);
            resolve(result.secure_url);
        });
    });
};

/**
 * Tải lên nhiều hình ảnh lên Cloudinary
 * @param {Array<string>} images - Mảng các chuỗi base64 hoặc URL hình ảnh
 * @returns {Promise<Array<string>>} - Trả về mảng các URL bảo mật của các hình ảnh đã tải lên
 */
const uploadMultipleImages = (images: string[]): Promise<string[]> => {
    return new Promise((resolve, reject) => {
        if (!Array.isArray(images) || images.length === 0) {
            return reject(new Error("Images must be a non-empty array."));
        }

        const uploadPromises = images.map(uploadImage);

        Promise.all(uploadPromises)
            .then((uploadedUrls) => {
                console.log("Uploaded all images successfully:", uploadedUrls);
                resolve(uploadedUrls);
            })
            .catch((error) => {
                console.error("Error uploading multiple images:", error);
                reject(new Error("Failed to upload multiple images."));
            });
    });
};

// Xuất các hàm tải lên
export {
    uploadImage,
    uploadMultipleImages,
};
