// app/dashboard/management/layout.tsx
"use client";
import Link from 'next/link';
import { usePathname } from "next/navigation";
import styles from './Layout.module.scss';
import { FaProductHunt } from "react-icons/fa";

export default function ManagementLayout({
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
                                <FaProductHunt />
                            </div>
                            <span className={styles.title}>PRODUCTS</span>
                        </div>
                        <div className={styles.navbar_list}>
                            <ul className={styles.ul}>
                                <li className={styles.li_collections}>
                                    
                                    <ul className={styles.ul_collections}>
                                        <li>
                                            <Link
                                                href="/dashboard/products/create"
                                                className={pathname === '/dashboard/products/create' ? styles.active : ''}>
                                                CREATE A NEW PRODUCT
                                            </Link>
                                        </li>
                                        <li>
                                            <Link
                                                href="/dashboard/products/manage-products"
                                                className={pathname === '/dashboard/products/manage-products' ? styles.active : ''}>
                                                    MANAGE PRODUCTS
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
