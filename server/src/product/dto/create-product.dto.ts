// src/product/dto/create-product.dto.ts
import { IsArray, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateProductDto {
  @IsNotEmpty()
  name: string;

  @IsOptional()
  description?: string;

  @IsNumber()
  price: number;

  @IsNumber()
  stock: number;

  @IsEnum(['shoes', 'shirts', 'pants'])
  category: string;

  @IsArray()
  color: string[];

  @IsArray()
  images: string[];

  @IsOptional()
  size?: string; // Chỉ cần cho shirt

  @IsOptional()
  material?: string; // Chỉ cần cho shirt
}
