import {Schema, Prop, SchemaFactory} from "@nestjs/mongoose";
import {Document, Types} from "mongoose";

@Schema({timestamps: true})
export class Blog extends Document {
    @Prop({ type: Types.ObjectId, required: true, ref: 'Auth' }) 
    user_id: Types.ObjectId;

    @Prop({required: true})
    title: string;

    @Prop({required: true})
    content: string;

    @Prop({required: true})
    images: string[]
}
export const BlogSchema = SchemaFactory.createForClass(Blog);