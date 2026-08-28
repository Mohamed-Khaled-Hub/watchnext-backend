// Core
import { Injectable, NotFoundException } from '@nestjs/common'
// DTOs
import { MovieQueryDto } from './dto/movie-query.dto'
// Enums
import { PersonRole } from '../../common/enums/graph-schemas.enums'
// Services
import { CognodbService } from '../cognodb/cognodb.service'
import { UsersService } from '../users/users.service'
// Types
import {
    GenreProperties,
    PersonProperties,
} from '../../common/types/graph-schemas.types'
import {
    MessageResponse,
    MovieConnectionResponse,
    MovieDetailsResponse,
    MovieResponse,
    PersonResponse,
} from '../../common/types/api-responses.types'

@Injectable()
export class MoviesService {
    constructor(
        private readonly db: CognodbService,
        private readonly usersService: UsersService
    ) {}

    /**
     * Helper: Verify user and movie exist before creating/deleting relationships
     */
    private async ensureUserAndMovieExist(
        userId: string,
        movieId: string
    ): Promise<void> {
        await this.findOne(movieId)
        const userExists = await this.usersService.exists(userId)
        if (!userExists) {
            throw new NotFoundException(`User with ID "${userId}" not found`)
        }
    }

    /**
     * GET /movies
     * Search movies by title without pagination (0 Hops)
     */
    async findAll(query: MovieQueryDto): Promise<MovieResponse[]> {
        const search = query?.search ?? ''
        const whereClause = search
            ? 'WHERE toLower(m.title) CONTAINS toLower($title)'
            : ''

        const cypher = `
            MATCH (m:Movie)
            ${whereClause}
            RETURN 
                m.id AS id, 
                m.title AS title, 
                toInteger(m.year) AS year, 
                toFloat(m.rating) AS rating, 
                m.poster AS poster
            ORDER BY year DESC
        `
        const movies = await this.db.read<MovieResponse>(cypher, {
            title: search,
        })

        if (movies.length === 0) {
            throw new NotFoundException(
                search
                    ? `No movies found matching search query "${search}"`
                    : 'No movies found'
            )
        }

        return movies
    }

    /**
     * GET /movies/:id
     * Retrieve basic movie metadata (0 Hops)
     */
    async findOne(id: string): Promise<MovieResponse> {
        const cypher = `
            MATCH (m:Movie {id: $id})
            RETURN 
                m.id AS id, 
                m.title AS title, 
                toInteger(m.year) AS year, 
                toFloat(m.rating) AS rating, 
                m.poster AS poster
        `

        const records = await this.db.read<MovieResponse>(cypher, { id })

        if (records.length === 0) {
            throw new NotFoundException(`Movie with ID "${id}" not found`)
        }

        return records[0]
    }

    /**
     * GET /movies/:id/details
     * Retrieve movie with 1-hop connected Directors, Actors, and Genres
     */
    async getDetails(id: string): Promise<MovieDetailsResponse> {
        const cypher = `
            MATCH (m:Movie {id: $id})
            
            OPTIONAL MATCH (m)-[:DIRECTED_BY]->(d:Person)
            OPTIONAL MATCH (m)-[:ACTED_IN]->(a:Person)
            OPTIONAL MATCH (m)-[:HAS_GENRE]->(g:Genre)

            RETURN 
                {
                    id: m.id,
                    title: m.title,
                    year: toInteger(m.year),
                    rating: toFloat(m.rating),
                    poster: m.poster
                } AS movie,
                collect(DISTINCT d { .id, .name }) AS directors,
                collect(DISTINCT a { .id, .name }) AS actors,
                collect(DISTINCT g { .id, .name }) AS genres
        `

        const records = await this.db.read<{
            movie: MovieResponse
            directors: PersonProperties[]
            actors: PersonProperties[]
            genres: GenreProperties[]
        }>(cypher, { id })

        if (!records[0] || !records[0].movie?.id) {
            throw new NotFoundException(`Movie with ID "${id}" not found`)
        }

        const record = records[0]

        const directors: PersonResponse[] = record.directors
            .filter((d) => d.id)
            .map((d) => ({ ...d, roles: [PersonRole.DIRECTOR] }))

        const actors: PersonResponse[] = record.actors
            .filter((a) => a.id)
            .map((a) => ({ ...a, roles: [PersonRole.ACTOR] }))

        const genres = record.genres.filter((g) => g.id)

        return {
            movie: record.movie,
            directors,
            actors,
            genres,
        }
    }

    /**
     * GET /movies/:id/related
     * Find related movies via shared 2-hop graph entities
     */
    async getRelated(id: string): Promise<MovieResponse[]> {
        await this.findOne(id)

        const cypher = `
            MATCH (m1:Movie {id: $id})-[r1:DIRECTED_BY|ACTED_IN|HAS_GENRE]->(node)<-[r2:DIRECTED_BY|ACTED_IN|HAS_GENRE]-(m2:Movie)
            WHERE m1 <> m2
            RETURN 
                m2.id AS id, 
                m2.title AS title, 
                toInteger(m2.year) AS year, 
                toFloat(m2.rating) AS rating, 
                m2.poster AS poster, 
                toInteger(count(node)) AS sharedCount
            ORDER BY sharedCount DESC, rating DESC
            LIMIT 10
        `

        const relatedMovies = await this.db.read<MovieResponse>(cypher, { id })

        if (relatedMovies.length === 0) {
            throw new NotFoundException(
                `No related movies found for movie with ID "${id}"`
            )
        }

        return relatedMovies
    }

    /**
     * GET /movies/:id/connections/:targetId
     * Shortest path graph traversal between two movies
     */
    async getConnections(
        sourceId: string,
        targetId: string
    ): Promise<MovieConnectionResponse> {
        await this.findOne(sourceId)
        await this.findOne(targetId)

        const cypher = `
            MATCH (m1:Movie {id: $sourceId}), (m2:Movie {id: $targetId})
            MATCH path = shortestPath((m1)-[*..6]-(m2))
            RETURN [r IN relationships(path) | {
                source: startNode(r).name,
                target: endNode(r).name,
                relationship: type(r)
            }] AS connectionPath
        `

        const records = await this.db.read<{
            connectionPath: MovieConnectionResponse['path']
        }>(cypher, { sourceId, targetId })

        if (records.length === 0 || !records[0].connectionPath) {
            throw new NotFoundException(
                `No path found connecting movie "${sourceId}" to movie "${targetId}"`
            )
        }

        return { path: records[0].connectionPath }
    }

    /**
     * POST /movies/:id/like
     * Create a LIKED relationship from User to Movie
     */
    async likeMovie(userId: string, movieId: string): Promise<MessageResponse> {
        await this.ensureUserAndMovieExist(userId, movieId)

        const cypher = `
            MATCH (u:User {id: $userId}), (m:Movie {id: $movieId})
            MERGE (u)-[r:LIKED]->(m)
            RETURN type(r) AS relType
        `
        await this.db.write(cypher, { userId, movieId })
        return { message: 'Movie liked successfully' }
    }

    /**
     * DELETE /movies/:id/like
     * Remove the LIKED relationship between User and Movie
     */
    async unlikeMovie(
        userId: string,
        movieId: string
    ): Promise<MessageResponse> {
        await this.ensureUserAndMovieExist(userId, movieId)

        const cypher = `
            MATCH (u:User {id: $userId})-[r:LIKED]->(m:Movie {id: $movieId})
            DELETE r
        `
        await this.db.write(cypher, { userId, movieId })
        return { message: 'Movie unliked successfully' }
    }

    /**
     * POST /movies/:id/watch
     * Create a WATCHED relationship from User to Movie
     */
    async watchMovie(
        userId: string,
        movieId: string
    ): Promise<MessageResponse> {
        await this.ensureUserAndMovieExist(userId, movieId)

        const cypher = `
            MATCH (u:User {id: $userId}), (m:Movie {id: $movieId})
            MERGE (u)-[r:WATCHED]->(m)
            RETURN type(r) AS relType
        `
        await this.db.write(cypher, { userId, movieId })
        return { message: 'Movie marked as watched' }
    }

    /**
     * DELETE /movies/:id/watch
     * Remove the WATCHED relationship between User and Movie
     */
    async unwatchMovie(
        userId: string,
        movieId: string
    ): Promise<MessageResponse> {
        await this.ensureUserAndMovieExist(userId, movieId)

        const cypher = `
            MATCH (u:User {id: $userId})-[r:WATCHED]->(m:Movie {id: $movieId})
            DELETE r
        `
        await this.db.write(cypher, { userId, movieId })
        return { message: 'Movie removed from watched list' }
    }

    /**
     * POST /movies/:id/watchlist
     * Create a WANT_TO_WATCH relationship from User to Movie
     */
    async addToWatchlist(
        userId: string,
        movieId: string
    ): Promise<MessageResponse> {
        await this.ensureUserAndMovieExist(userId, movieId)

        const cypher = `
            MATCH (u:User {id: $userId}), (m:Movie {id: $movieId})
            MERGE (u)-[r:WANT_TO_WATCH]->(m)
            RETURN type(r) AS relType
        `
        await this.db.write(cypher, { userId, movieId })
        return { message: 'Movie added to watchlist' }
    }

    /**
     * DELETE /movies/:id/watchlist
     * Remove the WANT_TO_WATCH relationship between User and Movie
     */
    async removeFromWatchlist(
        userId: string,
        movieId: string
    ): Promise<MessageResponse> {
        await this.ensureUserAndMovieExist(userId, movieId)

        const cypher = `
            MATCH (u:User {id: $userId})-[r:WANT_TO_WATCH]->(m:Movie {id: $movieId})
            DELETE r
        `
        await this.db.write(cypher, { userId, movieId })
        return { message: 'Movie removed from watchlist' }
    }
}
