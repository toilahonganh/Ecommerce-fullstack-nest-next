"use client"
import React from 'react';
import { BlogCardProps } from "../../utils/interface.util";
import styles from './BlogCard.module.scss';

const BlogCard: React.FC<BlogCardProps> = ({ blog }) => {
    return (
        <div className={styles.blogCard}>
            <div className={styles.title_container}>
                <h3 className={styles.blogTitle}>{blog.title}</h3>
            </div>
            <img src={blog.images[0]} alt={blog.title} className={styles.blogImage} />
            <p className={styles.blogContent}>{blog.content}</p>
            <a href={`/blog/${blog._id}`} className={styles.blogReadMore}>Read more</a>
        </div>
    );
};

export default BlogCard;
