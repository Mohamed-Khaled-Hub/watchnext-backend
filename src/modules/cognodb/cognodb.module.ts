// Core
import { Module, Global } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
// Services
import { CognodbService } from './cognodb.service'

@Global()
@Module({
    imports: [ConfigModule],
    providers: [CognodbService],
    exports: [CognodbService],
})
export class CognodbModule {}
