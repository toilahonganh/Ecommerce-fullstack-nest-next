"use client";
import Link from 'next/link';
import { usePathname } from "next/navigation";
import styles from './Layout.module.scss';
import { SiBloglovin } from "react-icons/si";

export default function BlogLayout({
    children, 
}: {
    children: React.ReactNode
}) {
    const pathname = usePathname();
    return (
        <div>
            <section>
                <div className={styles.management}>
                    <div className={styles.management_navbar}>
                        <div className={styles.navbar_title}>
                            <div className={styles.icon}>
                                <SiBloglovin />
                            </div>
                            <span className={styles.title}>BLOGS</span>
                        </div>
                        <div className={styles.navbar_list}>
                            <ul className={styles.ul}>
                                <li className={styles.li_collections}>
                                    
                                    <ul className={styles.ul_collections}>
                                        <li>
                                            <Link
                                                href="/dashboard/blogs/create"
                                                className={pathname === '/dashboard/blogs/create' ? styles.active : ''}>
                                                CREATE A NEW BLOG
                                            </Link>
                                        </li>
                                        <li>
                                            <Link
                                                href="/dashboard/blogs/manage-blogs"
                                                className={pathname === '/dashboard/blogs/manage-blogs' ? styles.active : ''}>
                                                    MANAGE BLOGS
                                            </Link>
                                        </li>
                                    </ul>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div className={styles.management_outlet}>
                        {children}
                    </div>
                </div>
            </section>
        </div>
    )
}
