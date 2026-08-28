// Core
import { Controller, Get, Delete, UseGuards } from '@nestjs/common'
// Decorators
import { GetUser } from '../auth/decorators/get-user.decorator'
// Guards
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
// Services
import { MeService } from './me.service'
// Types
import {
    UserResponse,
    MovieResponse,
    TasteResponse,
    MessageResponse,
} from '../../common/types/api-responses.types'

@UseGuards(JwtAuthGuard)
@Controller('me')
export class MeController {
    constructor(private readonly meService: MeService) {}

    // GET /me
    @Get()
    async getMe(@GetUser('id') userId: string): Promise<UserResponse> {
        return this.meService.getMe(userId)
    }

    // GET /me/liked
    @Get('liked')
    async getLikedMovies(
        @GetUser('id') userId: string
    ): Promise<MovieResponse[]> {
        return this.meService.getLikedMovies(userId)
    }

    // GET /me/watched
    @Get('watched')
    async getWatchedMovies(
        @GetUser('id') userId: string
    ): Promise<MovieResponse[]> {
        return this.meService.getWatchedMovies(userId)
    }

    // GET /me/watchlist
    @Get('watchlist')
    async getWatchlist(
        @GetUser('id') userId: string
    ): Promise<MovieResponse[]> {
        return this.meService.getWatchlist(userId)
    }

    // GET /me/taste
    @Get('taste')
    async getUserTaste(
        @GetUser('id') userId: string
    ): Promise<TasteResponse[]> {
        return this.meService.getUserTaste(userId)
    }

    // DELETE /me
    @Delete()
    async deleteMe(@GetUser('id') userId: string): Promise<MessageResponse> {
        return this.meService.deleteMe(userId)
    }
}
