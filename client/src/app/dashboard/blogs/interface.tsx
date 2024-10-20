import { JwtPayload } from "jwt-decode";

export interface BlogInterface {
    user_id: string;
    title: string;
    content: string;
    images: string[];
}
export interface DecodedToken extends JwtPayload {
    userId: string;
    email: string;
    avatar?: string; // Optional avatar property
    name?: string
}
