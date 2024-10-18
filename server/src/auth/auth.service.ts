import { Injectable, UnauthorizedException, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectModel } from "@nestjs/mongoose";
import * as bcrypt from 'bcrypt';
import { Auth } from './schemas/auth.schema';
import mongoose from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import {uploadImage} from '../index';
import { LoginAuthDto } from './dto/login-auth.dto';
import { LoginResponseDto } from './dto/login-response.dto';

@Injectable()
export class AuthService {
    constructor(
        @InjectModel(Auth.name)
        private authModel: mongoose.Model<Auth>,
        private jwtService: JwtService,
    ) { }

    /**
     * Refresh access token
     * @param refreshToken - Refresh token 
     * @returns Access token if refresh token is valid
     * @throws Error if refresh is invalid
     */
    async refreshAccessToken(refreshToken: string): Promise<LoginResponseDto> {
        const payload = this.jwtService.verify(refreshToken, {
            secret: process.env.JWT_REFRESH_SECRET || '123456abc',
        });

        const user = await this.authModel.findById(payload.id).lean();
        if (!user) {
            throw new UnauthorizedException('Refresh token không hợp lệ.');
        }

        const newAccessToken = this.jwtService.sign(
            { id: user._id, email: user.email, name: user.name, role: user.role },
            { expiresIn: '15m' },
        );

        return {
            accessToken: newAccessToken,
            refreshToken: refreshToken,
            name: user.name,
            email: user.email,
            role: user.role,
        };
    }

    /**
     * Signs up a new user by creating an account in the system.
     * @param auth - The authentication details for the new user.
     * @param auth.name - The name of the user.
     * @param auth.email - The email address of the user.
     * @param auth.password - The password for the user (will be hashed before saving).
     * @param auth.phone_number - The phone number of the user.
     * @param auth.address - The address of the user.
     * @returns The created user with the hashed password.
     * @throws Error if the user already exists.
     */
    async signUp(auth: Auth): Promise<Auth> {
        const { name, email, password, phone_number, address, avatar } = auth;
        const existingUser = await this.authModel.findOne({ email: email })

        if (existingUser) {
            throw new BadRequestException(`User already exists!`);
        }
        let avatarUrl = '';
        if (avatar) {
            avatarUrl = await uploadImage(avatar);
        }

        const saltOrRounds = 10;
        const hashedPassword = await bcrypt.hash(auth.password, saltOrRounds);

        const newUser = await this.authModel.create({
            ...auth,
            password: hashedPassword,
            avatar: avatarUrl
        })
        return newUser
    }

    /**
     * Validate user credentials.
     * @param email - The email address of the user.
     * @param password - The password of the user (to be verified).
     * @returns The authenticated user if the credentials are valid.
     * @throws Error if the credentials are invalid or the user does not exist.
     */
    async validateUser(email: string, password: string): Promise<Auth> {
        const existingUser = await this.authModel.findOne({ email }).lean();

        if (!existingUser) {
            throw new UnauthorizedException('User is not registered!');
        }

        const isPasswordValid = await bcrypt.compare(password, existingUser.password);
        if (!isPasswordValid) {
            throw new UnauthorizedException('Invalid password');
        }

        return existingUser;
    }

    /**
    * Login with an account in the system.
    * @param auth - The authentication details for the user attempting to log in.
    * @returns An object containing access and refresh tokens along with user details.
    * @throws Error if the credentials are invalid or the user does not exist.
    */
    async login(auth: LoginAuthDto): Promise<LoginResponseDto> {
        const user = await this.validateUser(auth.email, auth.password);
        const payload = { id: user._id, email: user.email, name: user.name, role: user.role };

        const accessToken = this.jwtService.sign(payload, { expiresIn: '5d' });
        const refreshToken = this.jwtService.sign(payload, { expiresIn: '7d' });

        return {
            accessToken,
            refreshToken,
            name: user.name,
            email: user.email,
            role: user.role
        };
    }
    /*
    * Profile
    * @param id - The ID of the user to find.
    * @returns The user with the specified ID.
    * @throws Error if the user does not exist.
    */
    async profile(id: string): Promise<Auth> {
        const existingUser = await this.authModel.findById(id).lean();
        if (!existingUser) throw new NotFoundException(`User with ID ${id} does not exist.`);

        return existingUser;
    }

    /**
     * Giải mã token JWT.
     * @param token - Token cần được giải mã.
     * @returns Payload đã được giải mã của token.
     * @throws UnauthorizedException nếu token không hợp lệ.
     */
    async decode(accessToken: string): Promise<any> {
        try {
            const payload = this.jwtService.verify(accessToken, {
                secret: process.env.JWT_ACCESS_SECRET || '123456abc',
            });
            return payload;
        } catch (error) {
            throw new UnauthorizedException('Invalid token');
        }
    }
    async getUserFromToken(accessToken: string): Promise<Auth> {
        const payload = await this.decode(accessToken);
        const userId = payload.id;
    
        const user = await this.authModel.findById(userId).select('-password -email -phone_number -address').lean(); 
        if (!user) {
            throw new UnauthorizedException('User not found');
        }
    
        return user;
    }
    
    /**
     * 
     */
    async getAllUser(): Promise<Auth[]> {
        const response = await this.authModel.find().lean();
        if(!response) throw new UnauthorizedException('Users not found');
        return response;
    }

    /**
     * 
     */
    async deleteUser(id: string): Promise<Auth> {
        const response = await this.authModel.findByIdAndDelete({_id: id}).lean();
        if(!response) throw new BadRequestException(`Bad request`);
        return response;
    }

    /**
     * 
     */
    async editUser(id: string, updateData: Partial<Auth>): Promise<Auth> {
        if (updateData.password) {
            const salt = await bcrypt.genSalt();
            updateData.password = await bcrypt.hash(updateData.password, salt);
        }

        const response = await this.authModel.findByIdAndUpdate(id, updateData, { new: true });
        if (!response) throw new UnauthorizedException('User not found');
        
        return response;
    }
    
}
