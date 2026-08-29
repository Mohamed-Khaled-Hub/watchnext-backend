// Core
import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common'
// Modules
import { AuthModule } from './modules/auth/auth.module'
import { CognodbModule } from './modules/cognodb/cognodb.module'
import { CrewModule } from './modules/crew/crew.module'
import { MeModule } from './modules/me/me.module'
import { MoviesModule } from './modules/movies/movies.module'
import { RecommendationsModule } from './modules/recommendations/recommendations.module'
import { UsersModule } from './modules/users/users.module'
// Middlewares
import { LoggerMiddleware } from './common/middlewares/logger.middleware'

@Module({
    imports: [
        CognodbModule,
        AuthModule,
        MoviesModule,
        MeModule,
        CrewModule,
        RecommendationsModule,
        UsersModule,
    ],
})
export class AppModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(LoggerMiddleware).forRoutes('*')
    }
}
