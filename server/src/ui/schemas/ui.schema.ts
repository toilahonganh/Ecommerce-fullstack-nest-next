import {Schema, Prop, SchemaFactory} from "@nestjs/mongoose";
import { Document } from "mongoose";

@Schema({timestamps: true})
export class UI extends Document {
    @Prop({required: true, trim: true})
    banners: string[]
}
export const UISchema = SchemaFactory.createForClass(UI); 