// Core
import { Injectable, NotFoundException } from '@nestjs/common'
// Services
import { UsersService } from '../users/users.service'
import { CognodbService } from '../cognodb/cognodb.service'
// Types
import { RecommendedMovieResponse } from '../../common/types/api-responses.types'

@Injectable()
export class RecommendationsService {
    constructor(
        private readonly db: CognodbService,
        private readonly usersService: UsersService
    ) {}

    /**
     * GET /recommendations
     *
     * Generates personalized recommendations starting from movies liked by the user.
     * Traverses 3 hops in the graph to find connected movies through shared actors, directors, or genres.
     * Scores candidates by adding 3 points for shared directors, 3 points for shared actors, and 2 points for shared genres.
     * Excludes movies the user has already liked or watched using set filtering.
     * Ranks final results by their total connection score and rating.
     */
    async getRecommendations(
        userId: string
    ): Promise<RecommendedMovieResponse[]> {
        const userExists = await this.usersService.exists(userId)
        if (!userExists) {
            throw new NotFoundException(`User with ID "${userId}" not found`)
        }

        const excludedMoviesCypher = `
            MATCH (u:User {id: $userId})
            OPTIONAL MATCH (u)-[:LIKED]->(liked:Movie)
            OPTIONAL MATCH (u)-[:WATCHED]->(watched:Movie)
            RETURN 
                collect(DISTINCT liked.id) AS likedIds,
                collect(DISTINCT watched.id) AS watchedIds
        `

        const [userInteractions] = await this.db.read<{
            likedIds: string[]
            watchedIds: string[]
        }>(excludedMoviesCypher, { userId })

        const excludedIds = new Set([
            ...(userInteractions?.likedIds || []),
            ...(userInteractions?.watchedIds || []),
        ])

        const candidateCypher = `
            MATCH (u:User {id: $userId})-[:LIKED]->(liked:Movie)
            MATCH (candidate:Movie)
            WHERE liked.id <> candidate.id

            OPTIONAL MATCH (liked)-[:DIRECTED_BY]->(director:Person)<-[:DIRECTED_BY]-(candidate)
            WITH liked, candidate, count(DISTINCT director) * 3 AS directorScore

            OPTIONAL MATCH (liked)-[:ACTED_IN]->(actor:Person)<-[:ACTED_IN]-(candidate)
            WITH liked, candidate, directorScore, count(DISTINCT actor) * 3 AS actorScore

            OPTIONAL MATCH (liked)-[:HAS_GENRE]->(genre:Genre)<-[:HAS_GENRE]-(candidate)
            WITH liked, candidate, directorScore, actorScore, count(DISTINCT genre) * 2 AS genreScore

            WITH candidate, sum(directorScore + actorScore + genreScore) AS totalScore
            WHERE totalScore > 0

            RETURN
                candidate.id AS id,
                candidate.title AS title,
                coalesce(candidate.type, 'Movie') AS type,
                toInteger(coalesce(candidate.year, 0)) AS year,
                toFloat(coalesce(candidate.rating, 0.0)) AS rating,
                coalesce(candidate.poster, '') AS poster,
                toInteger(totalScore) AS score
            ORDER BY score DESC, rating DESC
        `

        const candidates = await this.db.read<RecommendedMovieResponse>(
            candidateCypher,
            { userId }
        )

        const recommendations = candidates
            .filter((movie) => !excludedIds.has(movie.id))
            .slice(0, 10)

        if (recommendations.length === 0) {
            throw new NotFoundException(
                'No movie recommendations found. Try liking more movies to expand your recommendations.'
            )
        }

        return recommendations
    }
}
