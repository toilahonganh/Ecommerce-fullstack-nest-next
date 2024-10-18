import { Schema, SchemaFactory, Prop } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";

@Schema({ timestamps: true })
export class Cart extends Document {
    @Prop({ type: Types.ObjectId, required: true, ref: 'Auth' }) 
    user_id: Types.ObjectId;

    @Prop({ type: Types.ObjectId, required: true, ref: 'Product' }) 
    product_id: Types.ObjectId;

    @Prop({ required: true})
    size: string;

    @Prop({ required: true})
    color: string[];

    @Prop({ required: true, default: 1 })
    quantity: number;

}

export const CartSchema = SchemaFactory.createForClass(Cart);
