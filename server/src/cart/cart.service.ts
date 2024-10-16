import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Cart } from './schemas/cart.schema';
import { CreateCartDto } from './dto/create-cart.dto'; 

@Injectable()
export class CartService {
    constructor(@InjectModel(Cart.name) private cartModel: Model<Cart>) {}

    async createCart(createCartDto: CreateCartDto) {
        const { user_id, product_id, quantity } = createCartDto;

        const cartItem = new this.cartModel({
            user_id,
            product_id,
            quantity,
        });

        return await cartItem.save();
    }

    async getCartItems(userId: string): Promise<Cart[]> {
        return this.cartModel
            .find({ user_id: userId })
            .populate('product_id')
            .exec();
    }
}
