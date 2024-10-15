import { Body, Controller, Post, UseGuards, Get, Param, Delete, Patch, Put } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { LoginAuthDto } from './dto/login-auth.dto';
import { Auth } from './schemas/auth.schema';
import { LoginResponseDto } from './dto/login-response.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';  // Import guard đã tạo

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @Post('refresh')
    async refresh(@Body('refreshToken') refreshToken: string): Promise<LoginResponseDto> {
        return await this.authService.refreshAccessToken(refreshToken);
    }

    @Post('sign-up')
    async signUp(@Body() signup: CreateAuthDto): Promise<Auth> {
        return await this.authService.signUp(signup);
    }

    @Post('login')
    async login(@Body() login: LoginAuthDto): Promise<LoginResponseDto> {
        return await this.authService.login(login);
    }

    // @UseGuards(JwtAuthGuard)
    @Get('profile/:id')
    async profile(@Param('id') id: string): Promise<Auth> {
        return await this.authService.profile(id);
    }

    @Post('decode')
    async decode(@Body('accessToken') accessToken: string): Promise<Auth> {
        return await this.authService.getUserFromToken(accessToken);
    }

    @Get('get-all-users')
    async getAllUsers(): Promise<Auth[]> {
        return await this.authService.getAllUser()
    }
    @Delete('delete/:id')
    async deleteUser(@Param('id') id: string): Promise<Auth> {
        return await this.authService.deleteUser(id);
    }

    @Put('edit/:id')
    async editUser(
        @Param('id') id: string,
        @Body() updateData: Partial<Auth>
    ): Promise<Auth> {
        return await this.authService.editUser(id, updateData);
    }
}
