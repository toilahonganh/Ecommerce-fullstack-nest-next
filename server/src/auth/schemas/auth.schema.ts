import {Schema, Prop, SchemaFactory} from "@nestjs/mongoose";
import {IsEmail, IsNotEmpty} from "class-validator";
import { Document } from 'mongoose'; 

@Schema({ timestamps: true })
export class Auth extends Document {
    @Prop({ required: true, trim: true })
    @IsNotEmpty()
    name: string;

    @Prop({ required: true })
    @IsEmail()
    email: string;

    @Prop({ required: true })
    password: string;

    @Prop()
    phone_number: string;

    @Prop({ maxlength: 150 })
    address: string;

    @Prop({ default: 'user' })
    role: string;

    @Prop()
    avatar: string;
}

export const AuthSchema = SchemaFactory.createForClass(Auth);
