// auth.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from "@nestjs/mongoose";
import { Auth, AuthSchema } from './schemas/auth.schema';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: Auth.name, schema: AuthSchema }]),
        PassportModule.register({ defaultStrategy: 'jwt' }),
        JwtModule.register({
            secret: process.env.JWT_SECRET || '123456abc',
            signOptions: { expiresIn: '15m' }, // Thời gian sống của access token
        }),
        JwtModule.register({
            secret: process.env.JWT_REFRESH_SECRET || 'your-refresh-secret',
            signOptions: { expiresIn: '7d' }, // Thời gian sống của refresh token
        }),
    ],
    controllers: [AuthController],
    providers: [AuthService],
    exports: [AuthService],
})
export class AuthModule {}
