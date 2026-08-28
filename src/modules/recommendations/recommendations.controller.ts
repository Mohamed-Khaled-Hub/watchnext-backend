// Core
import { Controller, Get, UseGuards } from '@nestjs/common'
// Decorators
import { GetUser } from '../auth/decorators/get-user.decorator'
// Guards
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
// Services
import { RecommendationsService } from './recommendations.service'
// Types
import { RecommendedMovieResponse } from '../../common/types/api-responses.types'

@UseGuards(JwtAuthGuard)
@Controller('recommendations')
export class RecommendationsController {
    constructor(
        private readonly recommendationsService: RecommendationsService
    ) {}

    // GET /recommendations
    @Get()
    async getRecommendations(
        @GetUser('id') userId: string
    ): Promise<RecommendedMovieResponse[]> {
        return this.recommendationsService.getRecommendations(userId)
    }
}
