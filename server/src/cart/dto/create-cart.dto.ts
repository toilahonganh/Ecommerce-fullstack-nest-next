import { IsNotEmpty, IsMongoId, IsNumber, Min } from 'class-validator';
import {Document} from "mongoose";

export class CreateCartDto extends Document{
    @IsNotEmpty()
    @IsMongoId()
    user_id: string;

    @IsNotEmpty()
    @IsMongoId()
    product_id: string;
    
    @IsNotEmpty()
    size: string;

    @IsNotEmpty()
    color: string[];


    @IsNotEmpty()
    @IsNumber()
    @Min(1)
    quantity: number;
}

export class UpdateCartDto {
    @IsMongoId()
    product_id?: string;

    @IsNumber()
    @Min(1)
    quantity?: number;
}
