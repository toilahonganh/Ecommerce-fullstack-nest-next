import { IsEmail, IsNotEmpty } from 'class-validator';
import {Prop} from "@nestjs/mongoose";

export class LoginAuthDto {
    @Prop({required: true, trim: true})
    @IsEmail()
    email: string;

    @Prop()
    @IsNotEmpty()
    password: string;
}
