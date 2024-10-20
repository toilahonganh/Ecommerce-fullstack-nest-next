"use client";
import { usePathname } from "next/navigation";
import Header from "../components/site/Header";
import styles from './Layout.module.scss';
import Footer from "../components/site/Footer";
import BackToTop from "../components/site/BackToTop";
import ChatBox from "../components/site/ChatBox";

export default function Layout({
    children,
}: {
    children: React.ReactNode
}) {
    const pathname = usePathname();
    // const images = [
    //     "https://d-themes.com/wordpress/riode/elements/wp-content/uploads/sites/3/2021/05/banner-5.png"
    // ]
    return (
        <div>
            <Header />
            <div className={styles.management_outlet}>
                {children}
                <BackToTop />
                <ChatBox />
            </div>
            <Footer />
        </div>
    )
}
