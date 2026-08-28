// Core
import { Module } from '@nestjs/common'
// Controller
import { MoviesController } from './movies.controller'
// Modules
import { UsersModule } from '../users/users.module'
// Services
import { MoviesService } from './movies.service'

@Module({
    imports: [UsersModule],
    controllers: [MoviesController],
    providers: [MoviesService],
})
export class MoviesModule {}
