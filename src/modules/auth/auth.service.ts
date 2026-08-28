// Core
import * as bcrypt from 'bcrypt'
import { v4 as uuid } from 'uuid'
import {
    Injectable,
    ConflictException,
    UnauthorizedException,
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
// DTOs
import { RegisterDto } from './dto/register.dto'
import { LoginDto } from './dto/login.dto'
// Services
import { CognodbService } from '../cognodb/cognodb.service'
// Types
import {
    UserResponse,
    AuthResponse,
} from '../../common/types/api-responses.types'
import { UserProperties } from '../../common/types/graph-schemas.types'

@Injectable()
export class AuthService {
    constructor(
        private readonly db: CognodbService,
        private readonly jwtService: JwtService
    ) {}

    /**
     * Helper: Generate JWT payload token
     */
    private generateToken(userId: string, email: string): string {
        return this.jwtService.sign({ sub: userId, email })
    }

    /**
     * POST /auth/register
     * Create a new user node and issue access token
     */
    async register(dto: RegisterDto): Promise<AuthResponse> {
        const existingUser = await this.db.read(
            `MATCH (u:User {email: $email}) RETURN u`,
            { email: dto.email }
        )

        if (existingUser.length > 0) {
            throw new ConflictException('Email is already registered')
        }

        const userId = uuid()
        const passwordHash = await bcrypt.hash(dto.password, 10)

        const cypher = `
            CREATE (u:User {
                id: $id,
                name: $name,
                email: $email,
                passwordHash: $passwordHash
            })
            RETURN u.id AS id, u.name AS name, u.email AS email
        `

        const result = await this.db.write<UserResponse>(cypher, {
            id: userId,
            name: dto.name,
            email: dto.email,
            passwordHash,
        })

        const user = result[0]
        const token = this.generateToken(user.id, user.email)

        return {
            user: { id: user.id, name: user.name, email: user.email },
            accessToken: token,
        }
    }

    /**
     * POST /auth/login
     * Authenticate user credentials and issue access token
     */
    async login(dto: LoginDto): Promise<AuthResponse> {
        const cypher = `
            MATCH (u:User {email: $email}) 
            RETURN 
                u.id AS id, 
                u.name AS name, 
                u.email AS email, 
                u.passwordHash AS passwordHash
        `
        const result = await this.db.read<UserProperties>(cypher, {
            email: dto.email,
        })

        if (result.length === 0) {
            throw new UnauthorizedException('Invalid credentials')
        }

        const user = result[0]

        const isPasswordValid = await bcrypt.compare(
            dto.password,
            user.passwordHash
        )

        if (!isPasswordValid) {
            throw new UnauthorizedException('Invalid credentials')
        }

        const token = this.generateToken(user.id, user.email)

        return {
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
            },
            accessToken: token,
        }
    }
}
