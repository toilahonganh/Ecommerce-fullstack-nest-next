export default function AuthLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div style={{
            backgroundColor: "#f8f8f8", 
            width: "100%", 
            height: "100vh", // Đảm bảo chiều cao toàn màn hình
            display: "flex", 
            justifyContent: "center", // Canh giữa theo chiều ngang
            alignItems: "center" // Canh giữa theo chiều dọc
        }}>
            {children}
        </div>
    )
}
