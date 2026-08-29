// Core
import { Injectable, UnauthorizedException } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'
// Services
import { CognodbService } from '../../cognodb/cognodb.service'
// Types
import { JwtPayload } from '../types/auth.types'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(private readonly db: CognodbService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: process.env.JWT_SECRET as string,
        })
    }

    async validate(payload: JwtPayload) {
        const result = await this.db.read(
            `MATCH (u:User {id: $id}) RETURN u.id AS id, u.email AS email`,
            { id: payload.sub }
        )

        if (result.length === 0) {
            throw new UnauthorizedException('User no longer exists')
        }

        return { id: payload.sub, email: payload.email }
    }
}
