"use client";
import axios from 'axios';
import { useEffect, useState } from 'react';
import BlogCard from '../../components/dashboard/BlogCard';
import Banner from '../../components/site/Banner';

import styles from "./Blog.module.scss";


export default function Page() {
    const [blogs, setBlogs] = useState<any[]>([]); 

    useEffect(() => {
        const fetchBlogs = async () => {
            try {
                const response = await axios.get(`${process.env.NEXT_PUBLIC_ORIGIN}/blog/get-blogs`);
                setBlogs(response.data); 
            } catch (error) {
                console.error("Error fetching blogs:", error);
            }
        };

        fetchBlogs();
    }, []);

    return (
        <>
        <Banner title="RIODE BLOGS" subtitle="/ Riode blogs" images=""/>
            <div className={styles.blog_container}>
                {blogs.length > 0 ? (
                    <div className={styles.blog}>
                        {blogs.map(blog => (
                            <BlogCard key={blog._id} blog={blog} />
                        ))}
                    </div>
                ) : (
                    <p>No blogs available.</p>
                )}
            </div>
        </>
    );
}
