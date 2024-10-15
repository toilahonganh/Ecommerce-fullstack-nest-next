"use client";
import axios from "axios";
import { useEffect, useState } from "react";
import styles from "./ManageUser.module.scss";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

export default function ManageUsers() {
    const notify = (message: string) => {
        toast(message, { autoClose: 1000 });
    };
    const [userInfo, setUserInfo] = useState<any[]>([]);
    const [editingUser, setEditingUser] = useState<any | null>(null);
    const [overlayVisible, setOverlayVisible] = useState(false);
    const [searchQuery, setSearchQuery] = useState(""); // New state for search query

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`${process.env.NEXT_PUBLIC_ORIGIN}/auth/get-all-users`);
                setUserInfo(response.data);
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };

        fetchData();
    }, []);

    const handleEdit = (user: any) => {
        setEditingUser(user);
        setOverlayVisible(true); 
    };

    const handleDelete = async (id: string) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this user?");
        if (!confirmDelete) {
            return; 
        }

        try {
            const response = await axios.delete(`${process.env.NEXT_PUBLIC_ORIGIN}/auth/delete/${id}`);
            console.log("User deleted:", response.data); 
            
            notify(`Deleted user with ID = ${id}`);
            setUserInfo(userInfo.filter((user) => user._id !== id));
        } catch (error) {
            console.error("Error deleting user:", error);
        }
    };

    const handleSave = async () => {
        if (!editingUser) return;

        try {
            const response = await axios.put(`${process.env.NEXT_PUBLIC_ORIGIN}/auth/edit/${editingUser._id}`, editingUser);
            console.log("User updated:", response.data);

            setUserInfo(userInfo.map((user) => (user._id === editingUser._id ? response.data : user))); 
            notify(`Updated successfully user ID = ${editingUser._id}`);
            setOverlayVisible(false);
            setEditingUser(null);
        } catch (error) {
            console.error("Error updating user:", error);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setEditingUser((prev: any) => ({ ...prev, [name]: value }));
    };

    const filteredUsers = userInfo.filter(user =>
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className={styles.userContainer}>
            <ToastContainer />
            <input
                type="text"
                placeholder="Search by name or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={styles.searchInput}
            />
            {filteredUsers.length > 0 ? (
                <table className={styles.userTable}>
                    <thead>
                        <tr>
                            <th>Avatar</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Phone</th>
                            <th>Address</th>
                            <th>Role</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredUsers.map((user) => (
                            <tr key={user._id}>
                                <td><img src={user.avatar} alt={`${user.name}'s avatar`} className={styles.avatar}/></td>
                                <td>{user.name}</td>
                                <td>{user.email}</td>
                                <td>{user.phone_number}</td>
                                <td>{user.address}</td>
                                <td>{user.role}</td>
                                <td>
                                    <button className={styles.editButton} onClick={() => handleEdit(user)}>Edit</button>
                                    <button className={styles.deleteButton} onClick={() => handleDelete(user._id)}>Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p>No users found</p>
            )}

            {overlayVisible && editingUser && (
                <div className={styles.overlay}>
                    <div className={styles.overlayContent}>
                        <div>
                            <label>Name:</label>
                            <input
                                type="text"
                                name="name"
                                value={editingUser.name}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div>
                            <label>Email:</label>
                            <input
                                type="email"
                                name="email"
                                value={editingUser.email}
                                onChange={handleInputChange}
                                readOnly
                            />
                        </div>
                        <div>
                            <label>Phone:</label>
                            <input
                                type="text"
                                name="phone_number"
                                value={editingUser.phone_number}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div>
                            <label>Address:</label>
                            <input
                                type="text"
                                name="address"
                                value={editingUser.address}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div>
                            <label>Role:</label>
                            <input
                                type="text"
                                name="role"
                                value={editingUser.role}
                                onChange={handleInputChange}
                            />
                        </div>
                        <button onClick={handleSave}>Save Changes</button>
                        <button onClick={() => setOverlayVisible(false)}>Cancel</button>
                    </div>
                </div>
            )}
        </div>
    );
}
