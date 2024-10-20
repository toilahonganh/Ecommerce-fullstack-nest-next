"use client";
import axios from "axios";
import { useEffect, useState } from "react";
import styles from "./ManageBlog.module.scss"; // Update SCSS if needed
import { ToastContainer } from "react-toastify";
import { notifyToastSuccess, notifyToastError } from "../../../utils/NotifyToast";

export default function ManageBlogs() {
    const [blogInfo, setBlogInfo] = useState<any[]>([]);
    const [editingBlog, setEditingBlog] = useState<any | null>(null);
    const [overlayVisible, setOverlayVisible] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const limit = 5;

    const fetchBlogs = async (page: number) => {
        try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_ORIGIN}/blog/get-all-blogs`, {
                params: { page, limit },
            });
            setBlogInfo(response.data.blogs);
            setTotalPages(response.data.totalPages);
        } catch (error) {
            notifyToastError('Error fetching blogs');
            console.error('Error fetching blogs:', error);
        }
    };

    const handleEdit = (blog: any) => {
        setEditingBlog(blog);
        setOverlayVisible(true);
    };

    const handleDelete = async (id: string) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this blog?");
        if (!confirmDelete) return;

        try {
            await axios.delete(`${process.env.NEXT_PUBLIC_ORIGIN}/blog/${id}`);
            notifyToastSuccess(`Deleted blog with ID = ${id}`);
            setBlogInfo(blogInfo.filter((blog) => blog._id !== id));
        } catch (error) {
            notifyToastError("Error deleting blog");
            console.error("Error deleting blog:", error);
        }
    };

    const handleImageDelete = (index: number) => {
        if (!editingBlog) return;
        const updatedImages = editingBlog.images.filter((_: any, i: number) => i !== index);
        setEditingBlog((prev: any) => ({ ...prev, images: updatedImages }));
    };

    const handleSave = async () => {
        if (!editingBlog) return;

        try {
            const response = await axios.put(`${process.env.NEXT_PUBLIC_ORIGIN}/blog/${editingBlog._id}`, editingBlog);
            setBlogInfo(blogInfo.map((blog) => (blog._id === editingBlog._id ? response.data : blog)));
            notifyToastSuccess(`Updated ${editingBlog.title}`);
            setOverlayVisible(false);
            setEditingBlog(null);
        } catch (error) {
            notifyToastError("Error updating blog");
            console.error("Error updating blog:", error);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setEditingBlog((prev: any) => ({ ...prev, [name]: value }));
    };

    const filteredBlogs = blogInfo.filter(blog =>
        blog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        blog.category.toLowerCase().includes(searchQuery.toLowerCase())
    );

    useEffect(() => {
        fetchBlogs(currentPage);
    }, [currentPage]);

    const handlePageChange = (newPage: number) => {
        if (newPage < 1 || newPage > totalPages) return;
        setCurrentPage(newPage);
    };

    return (
        <div className={styles.blogContainer}>
            <ToastContainer />
            <input
                type="text"
                placeholder="Search by blog title or category..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={styles.searchInput}
            />
            {filteredBlogs.length > 0 ? (
                <table className={styles.blogTable}>
                    <thead>
                        <tr>
                            <th>Images</th>
                            <th>Title</th>
                            <th>Content</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredBlogs.map((blog) => (
                            <tr key={blog._id}>
                                <td>
                                    <img src={blog.images[0]} alt={blog.title} className={styles.blogImage} />
                                </td>
                                <td>{blog.title}</td>
                                <td>{blog.content}</td>
                                <td>
                                    <button className={styles.editButton} onClick={() => handleEdit(blog)}>Edit</button>
                                    <button className={styles.deleteButton} onClick={() => handleDelete(blog._id)}>Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p>No blogs found</p>
            )}

            {overlayVisible && editingBlog && (
                <div className={styles.overlay}>
                    <div className={styles.overlayContent}>
                        <div>
                            <label>Title:</label>
                            <input
                                type="text"
                                name="title"
                                value={editingBlog.title}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div>
                            <label>Content:</label>
                            <input
                                type="text"
                                name="content"
                                value={editingBlog.content}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div>
                            <label>Images:</label>
                            <div className={styles.imageGallery}>
                                {editingBlog.images.map((image: string, index: number) => (
                                    <div key={index} className={styles.imageContainer}>
                                        <img src={image} alt={`Image ${index + 1}`} className={styles.image} />
                                        <button 
                                            className={styles.deleteImageButton}
                                            onClick={() => handleImageDelete(index)}
                                        >
                                            X
                                        </button>
                                    </div>
                                ))}
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
