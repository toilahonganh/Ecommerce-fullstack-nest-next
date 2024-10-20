
import { IsMongoId, IsNotEmpty } from "class-validator";
import {Document} from "mongoose";
export class CreateBlogDto extends Document {
    @IsNotEmpty()
    @IsMongoId()
    user_id: string

    @IsNotEmpty()
    title: string

    @IsNotEmpty()
    content: string

    @IsNotEmpty()
    images: string[]
}