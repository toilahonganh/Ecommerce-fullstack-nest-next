import { extname } from "path";
import { Document } from 'mongoose'; 

export class CreateAuthDto extends Document{
    readonly name: string;
    readonly email: string;
    readonly password: string;
    readonly phone_number: string;
    readonly address: string;
    readonly role: string;
    readonly avatar: string
}