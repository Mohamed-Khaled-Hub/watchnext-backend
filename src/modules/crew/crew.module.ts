// Core
import { Module } from '@nestjs/common'
// Controller
import { CrewController } from './crew.controller'
// Service
import { CrewService } from './crew.service'

@Module({
    controllers: [CrewController],
    providers: [CrewService],
})
export class CrewModule {}
