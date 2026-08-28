// Core
import { IsOptional, IsString } from 'class-validator'

export class CrewQueryDto {
    @IsOptional()
    @IsString()
    search?: string
}
