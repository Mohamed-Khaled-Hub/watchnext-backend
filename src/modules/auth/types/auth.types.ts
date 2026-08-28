// Core
import { Request } from 'express'
// Types
import { UserProperties } from '../../../common/types/graph-schemas.types'

export type JwtPayload = {
    sub: string
    email: string
}

export type AuthUser = Pick<UserProperties, 'id' | 'email'>

export type AuthRequest = Request & {
    user: AuthUser
}
