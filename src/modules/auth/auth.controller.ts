// Core
import { Controller, Post, Body } from '@nestjs/common'
// DTOs
import { LoginDto } from './dto/login.dto'
import { RegisterDto } from './dto/register.dto'
// Services
import { AuthService } from './auth.service'

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    // POST /auth/register
    @Post('register')
    async register(@Body() dto: RegisterDto) {
        return this.authService.register(dto)
    }

    // POST /auth/login
    @Post('login')
    async login(@Body() dto: LoginDto) {
        return this.authService.login(dto)
    }
}
