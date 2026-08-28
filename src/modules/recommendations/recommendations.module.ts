// Core
import { Module } from '@nestjs/common'
// Controller
import { RecommendationsController } from './recommendations.controller'
// Modules
import { UsersModule } from '../users/users.module'
// Service
import { RecommendationsService } from './recommendations.service'

@Module({
    imports: [UsersModule],
    controllers: [RecommendationsController],
    providers: [RecommendationsService],
})
export class RecommendationsModule {}
