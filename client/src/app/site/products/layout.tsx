"use client";
import { usePathname } from "next/navigation";
import Header from "../../components/site/Header";
import styles from './Layout.module.scss';
import Banner from "../../components/site/common/Banner";
import Footer from "../../components/site/Footer";

export default function Layout({
    children,
}: {
    children: React.ReactNode
}) {
    const pathname = usePathname();

    return (
        <div>
            <Header />
            <div className={styles.management_outlet}>
                {children}
            </div>
            <Footer />
        </div>
    )
}
