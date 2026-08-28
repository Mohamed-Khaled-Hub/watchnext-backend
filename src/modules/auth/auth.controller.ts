// Core
import { Controller, Post, Body, Patch, UseGuards } from '@nestjs/common'
// Decorators
import { GetUser } from './decorators/get-user.decorator'
// DTOs
import { LoginDto } from './dto/login.dto'
import { RegisterDto } from './dto/register.dto'
import { ChangePasswordDto } from './dto/change-password.dto'
// Guards
import { JwtAuthGuard } from './guards/jwt-auth.guard'
// Services
import { AuthService } from './auth.service'
// Types
import {
    AuthResponse,
    MessageResponse,
} from '../../common/types/api-responses.types'

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    // POST /auth/register
    @Post('register')
    async register(@Body() dto: RegisterDto): Promise<AuthResponse> {
        return this.authService.register(dto)
    }

    // POST /auth/login
    @Post('login')
    async login(@Body() dto: LoginDto): Promise<AuthResponse> {
        return this.authService.login(dto)
    }

    // PATCH /auth/change-password
    @UseGuards(JwtAuthGuard)
    @Patch('change-password')
    async changePassword(
        @GetUser('id') userId: string,
        @Body() dto: ChangePasswordDto
    ): Promise<MessageResponse> {
        return this.authService.changePassword(userId, dto)
    }
}
