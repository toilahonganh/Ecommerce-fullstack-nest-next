import { Injectable, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { JwtService } from '@nestjs/jwt';
import { Reflector } from '@nestjs/core';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
    constructor(private reflector: Reflector, private jwtService: JwtService) {
        super();
    }

    canActivate(context: ExecutionContext) {
        const request = context.switchToHttp().getRequest();
        const token = this.extractTokenFromRequest(request);
        console.log('Extracted Token:', token); // Log token để kiểm tra
    
        if (!token) {
            throw new UnauthorizedException('Token not found');
        }
    
        try {
            const payload = this.jwtService.verify(token, {
                secret: process.env.JWT_ACCESS_SECRET || 'your-access-secret',
            });
            console.log('Token Payload:', payload); // Log payload để kiểm tra
            request.user = payload;
        } catch (error) {
            console.error('Token verification error:', error); // Log lỗi nếu có
            throw new UnauthorizedException('Invalid token');
        }
    
        return super.canActivate(context);
    }
    
    /**
     * Extract JWT token from the request's Authorization header.
     * @param request - The request object.
     * @returns The JWT token or null if not found.
     */
    private extractTokenFromRequest(request: any): string | null {
        const authHeader = request.headers['authorization'];
        if (authHeader && authHeader.startsWith('Bearer ')) {
            return authHeader.split(' ')[1];
        }
        return null;
    }
}
