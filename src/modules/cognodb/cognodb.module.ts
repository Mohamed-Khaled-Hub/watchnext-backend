// Core
import { Module, Global } from '@nestjs/common'
// Services
import { CognodbService } from './cognodb.service'

@Global()
@Module({
    providers: [CognodbService],
    exports: [CognodbService],
})
export class CognodbModule {}
