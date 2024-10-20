import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { ProductModule } from './product/product.module';
import {ChatGateway} from './socketio/chat.gateway';
import { UiModule } from './ui/ui.module';
import { CartModule } from './cart/cart.module';
import { BannerModule } from './banner/banner.module';
import { BlogModule } from './blog/blog.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    MongooseModule.forRoot(`mongodb://localhost:27017/nest-next`),
    AuthModule,
    ProductModule,
    UiModule,
    CartModule,
    BannerModule,
    BlogModule,
  ],
  // providers: [ChatGateway]
})
export class AppModule {}