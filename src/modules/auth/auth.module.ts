// Core
import { Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { PassportModule } from '@nestjs/passport'
// Controller
import { AuthController } from './auth.controller'
// Services
import { AuthService } from './auth.service'
// Strategies
import { JwtStrategy } from './strategies/jwt.strategy'

@Module({
    imports: [PassportModule, JwtModule.register({})],
    controllers: [AuthController],
    providers: [AuthService, JwtStrategy],
    exports: [AuthService, JwtStrategy, PassportModule],
})
export class AuthModule {}
