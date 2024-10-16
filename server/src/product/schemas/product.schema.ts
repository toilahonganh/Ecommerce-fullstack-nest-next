import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ProductDocument = Product & Document;

@Schema({ discriminatorKey: 'category' })
export class Product {
  @Prop({ required: true })
  name: string;

  @Prop()
  description: string;

  @Prop()
  gender: string[];

  @Prop({ required: true })
  price: number;

  @Prop({ default: 0 })
  stock: number;

  @Prop({ required: true, enum: ['shoes', 'shirts', 'backpacks', 'caps'] })
  category: string;

  @Prop({ required: true })
  color: string[];

  @Prop()
  images: string[];

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ required: false }) // Có thể không cần thiết cho tất cả sản phẩm
  size?: string[]; // Thuộc tính riêng cho shirt

  @Prop({ required: false }) // Có thể không cần thiết cho tất cả sản phẩm
  material?: string; // Thuộc tính riêng cho shirt

  @Prop({ required: true }) // Specific to pants
  waistSize?: string[]; // Waist size for pants

  @Prop({ required: true }) // Optional property
  lengthSize?: string[]; 
}

export const ProductSchema = SchemaFactory.createForClass(Product);
