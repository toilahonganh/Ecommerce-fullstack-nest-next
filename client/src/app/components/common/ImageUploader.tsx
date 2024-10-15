// components/ImageUploader.tsx
import React from 'react';

interface ImageUploaderProps {
    onImageUpload: (base64: string) => void;
    content: string; // Add content here
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageUpload, content }) => {
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
        const files = event.target.files;
        if (!files || files.length === 0) return;

        const base64 = await convertBase64(files[0]);
        onImageUpload(base64 as string);
    };

    return (
        <div className="flex items-center justify-center w-6/12">
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
                        <span className="font-semibold">{content}</span> or drag and drop
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
    );
};

export default ImageUploader;
