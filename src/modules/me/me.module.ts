// Core
import { Module } from '@nestjs/common'
// Controller
import { MeController } from './me.controller'
// Modules
import { UsersModule } from '../users/users.module'
// Services
import { MeService } from './me.service'

@Module({
    imports: [UsersModule],
    controllers: [MeController],
    providers: [MeService],
})
export class MeModule {}
