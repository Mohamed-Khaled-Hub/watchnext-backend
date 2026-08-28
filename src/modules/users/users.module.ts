// Core
import { Module } from '@nestjs/common'
// Service
import { UsersService } from './users.service'

@Module({
    providers: [UsersService],
    exports: [UsersService],
})
export class UsersModule {}
