// Core
import { IsOptional, IsString } from 'class-validator'

export class MovieQueryDto {
    @IsOptional()
    @IsString()
    search?: string
}
