// Core
import { Injectable, NotFoundException } from '@nestjs/common'
// Services
import { CognodbService } from '../cognodb/cognodb.service'
import { UsersService } from '../users/users.service'
// Types
import {
    MessageResponse,
    MovieResponse,
    TasteResponse,
    UserResponse,
} from '../../common/types/api-responses.types'

@Injectable()
export class MeService {
    constructor(
        private readonly db: CognodbService,
        private readonly usersService: UsersService
    ) {}

    /**
     * GET /me
     * Retrieve authenticated user profile metadata (0 Hops)
     */
    async getMe(userId: string): Promise<UserResponse> {
        const cypher = `
            MATCH (u:User {id: $userId})
            RETURN 
                u.id AS id, 
                u.name AS name, 
                u.email AS email
        `

        const records = await this.db.read<UserResponse>(cypher, {
            userId,
        })

        if (records.length === 0) {
            throw new NotFoundException(`User with ID "${userId}" not found`)
        }

        return records[0]
    }

    /**
     * GET /me/liked
     * Retrieve all movies liked by the authenticated user (1 Hop)
     */
    async getLikedMovies(userId: string): Promise<MovieResponse[]> {
        const userExists = await this.usersService.exists(userId)
        if (!userExists) {
            throw new NotFoundException(`User with ID "${userId}" not found`)
        }

        const cypher = `
            MATCH (u:User {id: $userId})-[:LIKED]->(m:Movie)
            RETURN 
                m.id AS id, 
                m.title AS title, 
                toInteger(m.year) AS year, 
                toFloat(m.rating) AS rating, 
                m.poster AS poster
            ORDER BY year DESC
        `
        return await this.db.read<MovieResponse>(cypher, { userId })
    }

    /**
     * GET /me/watched
     * Retrieve all movies watched by the authenticated user (1 Hop)
     */
    async getWatchedMovies(userId: string): Promise<MovieResponse[]> {
        const userExists = await this.usersService.exists(userId)
        if (!userExists) {
            throw new NotFoundException(`User with ID "${userId}" not found`)
        }

        const cypher = `
            MATCH (u:User {id: $userId})-[:WATCHED]->(m:Movie)
            RETURN 
                m.id AS id, 
                m.title AS title, 
                toInteger(m.year) AS year, 
                toFloat(m.rating) AS rating, 
                m.poster AS poster
            ORDER BY year DESC
        `

        return await this.db.read<MovieResponse>(cypher, { userId })
    }

    /**
     * GET /me/watchlist
     * Retrieve all movies saved in the user's watchlist (1 Hop)
     */
    async getWatchlist(userId: string): Promise<MovieResponse[]> {
        const userExists = await this.usersService.exists(userId)
        if (!userExists) {
            throw new NotFoundException(`User with ID "${userId}" not found`)
        }

        const cypher = `
            MATCH (u:User {id: $userId})-[:WANT_TO_WATCH]->(m:Movie)
            RETURN 
                m.id AS id, 
                m.title AS title, 
                toInteger(m.year) AS year, 
                toFloat(m.rating) AS rating, 
                m.poster AS poster
            ORDER BY year DESC
        `
        return await this.db.read<MovieResponse>(cypher, { userId })
    }

    /**
     * GET /me/taste
     * Determine user's favorite genres ranked by count from liked movies (2 Hops)
     */
    async getUserTaste(userId: string): Promise<TasteResponse[]> {
        const userExists = await this.usersService.exists(userId)
        if (!userExists) {
            throw new NotFoundException(`User with ID "${userId}" not found`)
        }

        const cypher = `
            MATCH (u:User {id: $userId})-[:LIKED]->(m:Movie)-[:HAS_GENRE]->(g:Genre)
            RETURN 
                g.id AS id, 
                g.name AS name, 
                toInteger(count(m)) AS count
            ORDER BY count DESC, name ASC
        `
        return await this.db.read<TasteResponse>(cypher, { userId })
    }

    /**
     * DELETE /me
     * Delete the authenticated user and detach all associated relationships
     */
    async deleteMe(userId: string): Promise<MessageResponse> {
        const userExists = await this.usersService.exists(userId)
        if (!userExists) {
            throw new NotFoundException(`User with ID "${userId}" not found`)
        }

        const cypher = `
            MATCH (u:User {id: $userId})
            DETACH DELETE u
        `

        await this.db.write(cypher, { userId })

        return {
            message:
                'User account and all associated relationships deleted successfully',
        }
    }
}
