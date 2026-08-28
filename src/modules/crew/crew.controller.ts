// Core
import { Controller, Get, Param, Query } from '@nestjs/common'
// DTOs
import { CrewQueryDto } from './dto/crew-query.dto'
// Services
import { CrewService } from './crew.service'
// Types
import {
    PersonResponse,
    CrewMoviesResponse,
    CrewDetailsResponse,
} from '../../common/types/api-responses.types'

@Controller('crew')
export class CrewController {
    constructor(private readonly crewService: CrewService) {}

    // GET /crew
    @Get()
    async findAll(@Query() query: CrewQueryDto): Promise<PersonResponse[]> {
        return this.crewService.findAll(query)
    }

    // GET /crew/:id
    @Get(':id')
    async findOne(@Param('id') id: string): Promise<CrewDetailsResponse> {
        return this.crewService.findOne(id)
    }

    // GET /crew/:id/movies
    @Get(':id/movies')
    async getMovies(@Param('id') id: string): Promise<CrewMoviesResponse> {
        return this.crewService.getMovies(id)
    }
}
