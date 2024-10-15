import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthService } from './auth.service';
import { Auth } from './schemas/auth.schema';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(private authService: AuthService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: process.env.JWT_SECRET || 'your-secret-key',
        });
    }

    async validate(payload: any): Promise<Auth> {
        const user = await this.authService.profile(payload.id);
        if (!user) {
            // throw new UnauthorizedException();
        }
        return user; // Trả về thông tin người dùng để sử dụng trong các route bảo vệ
    }
}
