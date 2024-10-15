import { IsNotEmpty } from 'class-validator';

export class LoginResponseDto {
    @IsNotEmpty()
    accessToken: string;

    @IsNotEmpty()
    refreshToken: string;

    @IsNotEmpty()
    name: string;

    @IsNotEmpty()
    email: string;

    @IsNotEmpty()
    role: string;
}
