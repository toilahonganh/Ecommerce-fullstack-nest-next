"use client";
import axios from "axios";
import { useEffect, useState } from "react";
import styles from "./ManageProduct.module.scss";
import { ToastContainer } from "react-toastify";
import {notifyToastSuccess, notifyToastError} from "../../../utils/NotifyToast";
import { uploadImages } from '../../../utils/UploadImages'; 

export default function ManageProducts() {
    const [productInfo, setProductInfo] = useState<any[]>([]);
    const [editingProduct, setEditingProduct] = useState<any | null>(null);
    const [overlayVisible, setOverlayVisible] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const limit = 5;

    const fetchProducts = async (page: number) => {
        try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_ORIGIN}/product/get-all-products`, {
                params: { page, limit },
            });
            setProductInfo(response.data.products);
            setTotalPages(response.data.totalPages);
        } catch (error) {
            notifyToastError('Error fetching products');
            console.error('Error fetching products:', error);
        }
    };

    const handleEdit = (product: any) => {
        setEditingProduct(product);
        setOverlayVisible(true);
    };

    const handleImageDelete = (index: number) => {
        const updatedImages = editingProduct.images.filter((_: any, i: number) => i !== index);
        setEditingProduct((prev: any) => ({ ...prev, images: updatedImages }));
    };

    const handleDelete = async (id: string) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this product?");
        if (!confirmDelete) return;

        try {
            const response = await axios.delete(`${process.env.NEXT_PUBLIC_ORIGIN}/product/${id}`);
            notifyToastSuccess(`Deleted product with ID = ${id}`);
            setProductInfo(productInfo.filter((product) => product._id !== id));
        } catch (error) {
            notifyToastError("Error deleting product");
            console.error("Error deleting product:", error);
        }
    };

    const handleSave = async () => {
        if (!editingProduct) return;

        if (editingProduct.price < 0 || !editingProduct.name.trim() || !editingProduct.category.trim()) {
            notifyToastError("Please fill in all required fields with valid values.");
            return;
        }

        try {
            const response = await axios.put(`${process.env.NEXT_PUBLIC_ORIGIN}/product/${editingProduct._id}`, editingProduct);
            setProductInfo(productInfo.map((product) => (product._id === editingProduct._id ? response.data : product)));
            notifyToastSuccess(`Updated ${editingProduct.name}`);
            setOverlayVisible(false);
            setEditingProduct(null);
        } catch (error) {
            notifyToastError("Error updating product");
            console.error("Error updating product:", error);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setEditingProduct((prev: any) => ({ ...prev, [name]: value }));
    };

    const filteredProducts = productInfo.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.category.toLowerCase().includes(searchQuery.toLowerCase())
    );

    useEffect(() => {
        fetchProducts(currentPage);
    }, [currentPage]);

    const handlePageChange = (newPage: number) => {
        if (newPage < 1 || newPage > totalPages) return;
        setCurrentPage(newPage);
    };

    const handleUploadImages = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        const base64Images = await uploadImages(files);

        setEditingProduct((prev: { images: any; }) => ({
            ...prev,
            images: [...prev.images, ...base64Images]
        }));
    };
    return (
        <div className={styles.productContainer}>
            <ToastContainer />
            <input
                type="text"
                placeholder="Search by product name or category..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={styles.searchInput}
            />
            {filteredProducts.length > 0 ? (
                <table className={styles.productTable}>
                    <thead>
                        <tr>
                            <th>Image</th>
                            <th>Name</th>
                            <th>Price</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredProducts.map((product) => (
                            <tr key={product._id}>
                                <td>
                                    <img src={product.images[0]} alt={`${product.name}'s image`} className={styles.image} />
                                </td>
                                <td>{product.name}</td>
                                <td>{product.price}.00 $</td>
                                <td>
                                    <button className={styles.editButton} onClick={() => handleEdit(product)}>Edit</button>
                                    <button className={styles.deleteButton} onClick={() => handleDelete(product._id)}>Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p>No products found</p>
            )}

            {overlayVisible && editingProduct && (
                <div className={styles.overlay}>
                    <div className={styles.overlayContent}>
                        <div>
                            <label>Name:</label>
                            <input
                                type="text"
                                name="name"
                                value={editingProduct.name}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div>
                            <label>Description:</label>
                            <input
                                type="text"
                                name="description"
                                value={editingProduct.description}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div>
                            <label>Gender:</label>
                            <input
                                type="text"
                                name="gender"
                                value={editingProduct.gender}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div>
                            <label>Price:</label>
                            <input
                                type="number"
                                name="price"
                                value={editingProduct.price}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div>
                            <label>Stock:</label>
                            <input
                                type="number"
                                name="stock"
                                value={editingProduct.stock}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div>
                            <label>Color:</label>
                            <input
                                type="text"
                                name="color"
                                value={editingProduct.color}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div>
                            <label>Category:</label>
                            <input
                                type="text"
                                name="category"
                                value={editingProduct.category}
                                onChange={handleInputChange}
                                readOnly
                            />
                        </div>
                        <div>
                            <label>Size:</label>
                            <input
                                type="text"
                                name="size"
                                value={editingProduct.size}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div>
                            <label>Material:</label>
                            <input
                                type="text"
                                name="material"
                                value={editingProduct.material}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div>
                            <label>Images:</label>
                            <div className={styles.imageGallery}>
                                {editingProduct.images.map((image: string, index: number) => (
                                    <div key={index} className={styles.imageContainer}>
                                        <img src={image} alt={`Product image ${index + 1}`} className={styles.image} />
                                        <button
                                            onClick={() => handleImageDelete(index)}
                                            className={styles.deleteImageButton}
                                        >
                                            X
                                        </button>
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
                                    <input
                                        id="dropzone-file"
                                        type="file"
                                        multiple
                                        className="hidden"
                                        accept="image/png, image/jpeg"
                                        onChange={handleUploadImages} // Gọi đúng hàm xử lý upload
                                    />
                                </label>
                            </div>
                        </div>
                        <div className={styles.overlayButtons}>
                            <button onClick={handleSave} className={styles.saveButton}>Save</button>
                            <button onClick={() => setOverlayVisible(false)} className={styles.cancelButton}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}

            <div className={styles.pagination}>
                <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>Previous</button>
                <span>{currentPage} / {totalPages}</span>
                <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>Next</button>
            </div>
        </div>
    );
}
