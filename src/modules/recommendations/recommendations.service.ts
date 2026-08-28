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
     * Excludes any movies the user has already liked or watched.
     * Scores candidates by adding 3 points for shared directors, 3 points for shared actors, and 2 points for shared genres.
     * Ranks final results by their total connection score and rating.
     */
    async getRecommendations(
        userId: string
    ): Promise<RecommendedMovieResponse[]> {
        const userExists = await this.usersService.exists(userId)
        if (!userExists) {
            throw new NotFoundException(`User with ID "${userId}" not found`)
        }

        const cypher = `
            MATCH (u:User {id: $userId})-[:LIKED]->(m1:Movie)-[r1:DIRECTED_BY|ACTED_IN|HAS_GENRE]->(connected)<-[r2:DIRECTED_BY|ACTED_IN|HAS_GENRE]-(m2:Movie)
            WHERE m1 <> m2
              AND NOT (u)-[:LIKED]->(m2)
              AND NOT (u)-[:WATCHED]->(m2)
            
            WITH m2,
                 sum(CASE WHEN type(r1) = 'DIRECTED_BY' AND type(r2) = 'DIRECTED_BY' THEN 3 ELSE 0 END) AS directorScore,
                 sum(CASE WHEN type(r1) = 'ACTED_IN' AND type(r2) = 'ACTED_IN' THEN 3 ELSE 0 END) AS actorScore,
                 sum(CASE WHEN type(r1) = 'HAS_GENRE' AND type(r2) = 'HAS_GENRE' THEN 2 ELSE 0 END) AS genreScore
            
            WITH m2, (directorScore + actorScore + genreScore) AS totalScore
            WHERE totalScore > 0
            
            RETURN 
                m2.id AS id,
                m2.title AS title,
                toInteger(m2.year) AS year,
                toFloat(m2.rating) AS rating,
                m2.poster AS poster,
                toInteger(totalScore) AS score
            ORDER BY score DESC, rating DESC
            LIMIT 10
        `

        const recommendations = await this.db.read<RecommendedMovieResponse>(
            cypher,
            { userId }
        )

        if (recommendations.length === 0) {
            throw new NotFoundException(
                'No movie recommendations found. Try liking more movies to expand your recommendations.'
            )
        }

        return recommendations
    }
}
