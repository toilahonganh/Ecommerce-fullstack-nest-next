// app/dashboard/management/layout.tsx
"use client";
import Link from 'next/link';
import { usePathname } from "next/navigation";
import styles from './Layout.module.scss';
import { FaUserCog } from "react-icons/fa";

export default function ManagementLayout({
    children, // will be a page or nested layout
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
                                <FaUserCog />
                            </div>
                            <span className={styles.title}>USERS</span>
                        </div>
                        <div className={styles.navbar_list}>
                            <ul className={styles.ul}>
                                <li className={styles.li_collections}>
                                    
                                    <ul className={styles.ul_collections}>
                                        <li>
                                            <Link
                                                href="/dashboard/users/create"
                                                className={pathname === '/dashboard/users/create' ? styles.active : ''}>
                                                CREATE A NEW USER
                                            </Link>
                                        </li>
                                        <li>
                                            <Link
                                                href="/dashboard/users/manage-users"
                                                className={pathname === '/dashboard/users/manage-users' ? styles.active : ''}>
                                                    MANAGE USERS
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
