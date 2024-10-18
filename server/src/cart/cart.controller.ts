import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CartService } from './cart.service';
import { Cart } from './schemas/cart.schema';
import { CreateCartDto } from './dto/create-cart.dto'; //  DTO

@Controller('cart')
export class CartController {
    constructor(private cartService: CartService) {}

    @Post()
    async createCart(
        @Body() createCartDto: CreateCartDto
    ): Promise<Cart> {
        return this.cartService.createCart(createCartDto);
    }

    @Get(':userId') 
    async getCart(
        @Param('userId') userId: string // Lấy userId từ URL
    ): Promise<Cart[]> {
        return this.cartService.getCartItems(userId);
    }

        @Get('get-all-carts')
        async getAllCarts(): Promise<Cart[]> {
            return await this.cartService.getAllCarts();
        }
}
