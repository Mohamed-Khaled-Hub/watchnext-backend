// Core
import { Injectable, NotFoundException } from '@nestjs/common'
// DTOs
import { CrewQueryDto } from './dto/crew-query.dto'
// Enums
import { PersonRole } from '../../common/enums/graph-schemas.enums'
// Services
import { CognodbService } from '../cognodb/cognodb.service'
// Types
import {
    CrewResponse,
    CrewMoviesResponse,
    CrewDetailsResponse,
} from '../../common/types/api-responses.types'
import { PersonProperties } from '../../common/types/graph-schemas.types'

@Injectable()
export class CrewService {
    constructor(private readonly db: CognodbService) {}

    /**
     * GET /crew
     * Search or browse actors and directors by name with inferred roles (1 Hop)
     */
    async findAll(query: CrewQueryDto): Promise<CrewResponse[]> {
        const search = query?.search ?? ''
        const whereClause = search
            ? 'WHERE toLower(p.name) CONTAINS toLower($name)'
            : ''

        const cypher = `
            MATCH (p:Person)
            ${whereClause}
            OPTIONAL MATCH (p)<-[:DIRECTED_BY]-(dm:Movie)
            OPTIONAL MATCH (p)<-[:ACTED_IN]-(am:Movie)
            RETURN 
                p.id AS id, 
                p.name AS name,
                toInteger(count(DISTINCT dm)) > 0 AS isDirector,
                toInteger(count(DISTINCT am)) > 0 AS isActor
            ORDER BY p.name ASC
        `

        const records = await this.db.read<
            PersonProperties & {
                isDirector: boolean
                isActor: boolean
            }
        >(cypher, { name: search })

        if (records.length === 0) {
            throw new NotFoundException(
                search
                    ? `No crew members found matching search query "${search}"`
                    : 'No crew members found'
            )
        }

        return records.map((record) => {
            const roles: PersonRole[] = []
            if (record.isDirector) roles.push(PersonRole.DIRECTOR)
            if (record.isActor) roles.push(PersonRole.ACTOR)

            return {
                id: record.id,
                name: record.name,
                roles,
            }
        })
    }

    /**
     * GET /crew/:id
     * Retrieve a Person's metadata, infer roles, and retrieve directed/acted movies (1 Hop)
     */
    async findOne(id: string): Promise<CrewDetailsResponse> {
        const cypher = `
            MATCH (p:Person {id: $id})

            OPTIONAL MATCH (p)<-[:DIRECTED_BY]-(dm:Movie)
            OPTIONAL MATCH (p)<-[:ACTED_IN]-(am:Movie)

            RETURN 
                p.id AS id,
                p.name AS name,
                collect(DISTINCT dm {
                    .id,
                    .title,
                    year: toInteger(dm.year),
                    rating: toFloat(dm.rating),
                    .poster
                }) AS directedMovies,
                collect(DISTINCT am {
                    .id,
                    .title,
                    year: toInteger(am.year),
                    rating: toFloat(am.rating),
                    .poster
                }) AS actedMovies
        `

        const records = await this.db.read<{
            id: string
            name: string
            directedMovies: CrewDetailsResponse['directedMovies']
            actedMovies: CrewDetailsResponse['actedMovies']
        }>(cypher, { id })

        if (records.length === 0 || !records[0].id) {
            throw new NotFoundException(`Person with ID "${id}" not found`)
        }

        const record = records[0]

        const directedMovies = record.directedMovies.filter((m) => m.id)
        const actedMovies = record.actedMovies.filter((m) => m.id)

        const roles: PersonRole[] = []
        if (directedMovies.length > 0) roles.push(PersonRole.DIRECTOR)
        if (actedMovies.length > 0) roles.push(PersonRole.ACTOR)

        return {
            id: record.id,
            name: record.name,
            roles,
            directedMovies,
            actedMovies,
        }
    }

    /**
     * GET /crew/:id/movies
     * Retrieve all movies separated into directed and acted collections (1 Hop)
     */
    async getMovies(id: string): Promise<CrewMoviesResponse> {
        const details = await this.findOne(id)

        if (
            details.directedMovies.length === 0 &&
            details.actedMovies.length === 0
        ) {
            throw new NotFoundException(
                `No movies found for person with ID "${id}"`
            )
        }

        return {
            directedMovies: details.directedMovies,
            actedMovies: details.actedMovies,
        }
    }
}
