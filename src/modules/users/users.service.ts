// Core
import { Injectable } from '@nestjs/common'
// Services
import { CognodbService } from '../cognodb/cognodb.service'

@Injectable()
export class UsersService {
    constructor(private readonly db: CognodbService) {}

    /**
     * Check whether a User node exists in the database by ID (0 Hops)
     */
    async exists(userId: string): Promise<boolean> {
        const cypher = `
            MATCH (u:User {id: $userId}) 
            RETURN u.id AS id 
            LIMIT 1
        `
        const records = await this.db.read<{ id: string }>(cypher, { userId })

        return records.length > 0
    }
}
