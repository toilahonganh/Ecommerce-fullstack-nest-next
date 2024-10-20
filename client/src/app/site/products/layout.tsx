"use client";
import { usePathname } from "next/navigation";
import styles from './Layout.module.scss';
import Footer from "../../components/site/Footer";

export default function Layout({
    children,
}: {
    children: React.ReactNode
}) {
    const pathname = usePathname();

    return (
        <div>
            <div className={styles.management_outlet}>
                {children}
            </div>
        </div>
    )
}
