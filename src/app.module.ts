// Core
import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
// Modules
import { CognodbModule } from './modules/cognodb/cognodb.module'
import { AuthModule } from './modules/auth/auth.module'
import { MoviesModule } from './modules/movies/movies.module'
import { MeModule } from './modules/me/me.module'
import { CrewModule } from './modules/crew/crew.module'
// Middlewares
import { LoggerMiddleware } from './common/middlewares/logger.middleware'
import { RecommendationsModule } from './modules/recommendations/recommendations.module';
import { UsersModule } from './modules/users/users.module';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
        }),
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
