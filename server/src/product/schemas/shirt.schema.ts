// // src/product/schemas/shirt.schema.ts
// import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
// import { Product } from './product.schema';
// import { Document } from 'mongoose';

// export type ShirtDocument = Shirt & Document;

// @Schema()
// export class Shirt extends Product {
//   @Prop({ required: true })
//   size: string[];

//   @Prop({ required: true })
//   material: string;
// }

// export const ShirtSchema = SchemaFactory.createForClass(Shirt);
