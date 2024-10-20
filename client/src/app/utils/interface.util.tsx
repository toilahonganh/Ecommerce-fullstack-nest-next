import { JwtPayload } from "jwt-decode";

export interface LoginInterface{
    email: string,
    password: string
}
export interface SignupInterface {
    name: string,
    email: string,
    password: string,
    phone_number: string,
    address: string
}
export interface BannerProps {
    images: string[]; 
    title: string;
    subtitle?: string; 
}

export interface BannerProp {
    images: string; 
    title: string;
    subtitle?: string; 
}
export interface BlogCardProps {
    blog: {
        _id: string;
        title: string;
        content: string;
        images: string[];
    };
}

export interface CardProps {
    images: string[];
    name: string; 
    price: number; 
}
export interface DecodedToken extends JwtPayload {
    userId: string;
    email: string;
    avatar?: string; // Optional avatar property
    name?: string;
}
export interface Product {
    _id: string;
    name: string;
    price: number;
    images: string[];
}
