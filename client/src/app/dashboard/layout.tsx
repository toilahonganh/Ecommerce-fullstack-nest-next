import Header from '../components/dashboard/Header';
import styles from './Layout.module.scss';
export default function DashBoardLayout({
    children, //will be a page or nested layout
}:{
    children: React.ReactNode
}) {
    return (
        <section>
            {/* Include shared UI here e.g. a header or sidebar */}
            <Header />
            <nav></nav>
            <div className={styles.chidren}>
                {children}
            </div>
        </section>
    )
}