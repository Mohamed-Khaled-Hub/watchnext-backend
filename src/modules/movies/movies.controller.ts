// Core
import {
    Controller,
    Get,
    Post,
    Delete,
    Param,
    Query,
    UseGuards,
} from '@nestjs/common'
// Decorators
import { GetUser } from '../auth/decorators/get-user.decorator'
// DTOs
import { MovieQueryDto } from './dto/movie-query.dto'
// Guards
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
// Services
import { MoviesService } from './movies.service'
// Types
import {
    MovieResponse,
    MessageResponse,
    MovieDetailsResponse,
    MovieConnectionResponse,
    MovieRelatedResponse,
} from '../../common/types/api-responses.types'

@Controller('movies')
export class MoviesController {
    constructor(private readonly moviesService: MoviesService) {}

    // GET /movies?search={string}
    @Get()
    async findAll(@Query() query: MovieQueryDto): Promise<MovieResponse[]> {
        return this.moviesService.findAll(query)
    }

    // GET /movies/:id
    @Get(':id')
    async findOne(@Param('id') id: string): Promise<MovieResponse> {
        return this.moviesService.findOne(id)
    }

    // GET /movies/:id/details
    @Get(':id/details')
    async getDetails(@Param('id') id: string): Promise<MovieDetailsResponse> {
        return this.moviesService.getDetails(id)
    }

    // GET /movies/:id/related
    @Get(':id/related')
    async getRelated(@Param('id') id: string): Promise<MovieRelatedResponse[]> {
        return this.moviesService.getRelated(id)
    }

    // GET /movies/:id/connections/:targetId
    @Get(':id/connections/:targetId')
    async getConnections(
        @Param('id') sourceId: string,
        @Param('targetId') targetId: string
    ): Promise<MovieConnectionResponse> {
        return this.moviesService.getConnections(sourceId, targetId)
    }

    // POST /movies/:id/like
    @UseGuards(JwtAuthGuard)
    @Post(':id/like')
    async likeMovie(
        @GetUser('id') userId: string,
        @Param('id') movieId: string
    ): Promise<MessageResponse> {
        return this.moviesService.likeMovie(userId, movieId)
    }

    // DELETE /movies/:id/like
    @UseGuards(JwtAuthGuard)
    @Delete(':id/like')
    async unlikeMovie(
        @GetUser('id') userId: string,
        @Param('id') movieId: string
    ): Promise<MessageResponse> {
        return this.moviesService.unlikeMovie(userId, movieId)
    }

    // POST /movies/:id/watch
    @UseGuards(JwtAuthGuard)
    @Post(':id/watch')
    async watchMovie(
        @GetUser('id') userId: string,
        @Param('id') movieId: string
    ): Promise<MessageResponse> {
        return this.moviesService.watchMovie(userId, movieId)
    }

    // DELETE /movies/:id/watch
    @UseGuards(JwtAuthGuard)
    @Delete(':id/watch')
    async unwatchMovie(
        @GetUser('id') userId: string,
        @Param('id') movieId: string
    ): Promise<MessageResponse> {
        return this.moviesService.unwatchMovie(userId, movieId)
    }

    // POST /movies/:id/watchlist
    @UseGuards(JwtAuthGuard)
    @Post(':id/watchlist')
    async addToWatchlist(
        @GetUser('id') userId: string,
        @Param('id') movieId: string
    ): Promise<MessageResponse> {
        return this.moviesService.addToWatchlist(userId, movieId)
    }

    // DELETE /movies/:id/watchlist
    @UseGuards(JwtAuthGuard)
    @Delete(':id/watchlist')
    async removeFromWatchlist(
        @GetUser('id') userId: string,
        @Param('id') movieId: string
    ): Promise<MessageResponse> {
        return this.moviesService.removeFromWatchlist(userId, movieId)
    }
}
