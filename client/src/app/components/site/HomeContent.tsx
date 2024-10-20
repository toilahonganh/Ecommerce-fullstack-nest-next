'use client';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { IoSearchOutline } from "react-icons/io5";
import { GrFormPrevious } from "react-icons/gr";
import { MdNavigateNext } from "react-icons/md";
import { ToastContainer, toast } from 'react-toastify';
import { JwtPayload, jwtDecode } from 'jwt-decode';

import Card from '../../components/site/Card';
import ChatBox from './ChatBox';
import BackToTop from './BackToTop';
import styles from "./HomeContent.module.scss";
import { Hotel, Search, DecodedToken } from '../../interface/interface';
import { useRouter } from 'next/navigation';

export default function HomeContent() {
    const router = useRouter();
    const [useInfo, setUserInfo] = useState<DecodedToken | null>(null);
    const [hotels, setHotels] = useState<Hotel[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [formData, setFormData] = useState<Search>({ search: "", districts: [] });
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [totalHotels, setTotalHotels] = useState<number>(0);

    const notify = (message: string) => toast(message, { autoClose: 1000 });

    useEffect(() => {
        const accessToken = localStorage.getItem('accessToken');
        if (accessToken) {
            const decoded: DecodedToken = jwtDecode<DecodedToken>(accessToken);
            console.log("Access Token:: ", decoded);
            setUserInfo(decoded);
        }
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            districts: checked
                ? [...prev.districts, value]
                : prev.districts.filter((district) => district !== value),
        }));
    };

    const fetchHotels = async (page: number = 1) => {
        try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_EXPRESS_ORIGIN}/hotel/get-hotels`);
            if (response.data.message.metadata.code === 200) {
                setHotels(response.data.message.metadata.metadata);
                setTotalHotels(response.data.message.metadata.total);
            }
        } catch (error) {
            console.error("Lỗi khi lấy danh sách khách sạn:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchHotels(currentPage);
    }, [currentPage, formData]);

    const handleViewDetails =  async(hotelId: string) => {
        console.log('Xem chi tiết khách sạn với ID:', hotelId);
        const response = await axios.get(`${process.env.NEXT_PUBLIC_EXPRESS_ORIGIN}/hotel/${hotelId}`);
        console.log(`DATA`, response.data)
            if (response.data.message.metadata.code === 200) {
                // router.push(`/site/accommondations/${hotelId}`)
            }
    };

    return (
        <div>
            <title>Homepage | Sai Gon Hotels</title>
            <meta name="description" content="Welcome to my homepage" />

            <ChatBox />
            <BackToTop />
            <ToastContainer />

            {/* <iframe
                width="100%"
                height="640"
                src="https://kuula.co/share/h41Jh?logo=1&info=1&fs=1&vr=0&sd=1&thumbs=1"
            ></iframe> */}
            <div className={styles.content}>
                {/* RIGHT */}
                <div className={styles.content_right}>
                    <div className={styles.hotel}>
                        {loading ? (
                            <div>Loading...</div>
                        ) : (
                            <div className={styles.hotelCards}>
                                {hotels.length > 0 ? (
                                    hotels.map((hotel) => (
                                        <Card
                                            key={hotel._id}
                                            imageUrl={hotel.image}
                                            hotelName={hotel.name}
                                            hotelAdress={hotel.address}
                                            hotelPhoneNumber={hotel.phone_number}
                                            hotelDescription={hotel.description}
                                            onViewDetails={() => router.push(`/site/accommodations/${hotel._id}`)}
                                            />
                                    ))
                                ) : (
                                    <div>Không có khách sạn nào được tìm thấy.</div>
                                )}
                            </div>
                        )}
                    </div>

                    <div className={styles.divide_page}>
                        <button
                            className={styles.previous}
                            onClick={() => currentPage > 1 && setCurrentPage(currentPage - 1)}
                            disabled={currentPage === 1}
                        >
                            <GrFormPrevious />
                            Previous
                        </button>
                        <button
                            className={styles.next}
                            onClick={() => setCurrentPage(currentPage + 1)}
                        >
                            Next
                            <MdNavigateNext />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
