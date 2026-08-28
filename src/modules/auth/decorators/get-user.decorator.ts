// Core
import { createParamDecorator, ExecutionContext } from '@nestjs/common'
// Types
import { AuthRequest, AuthUser } from '../types/auth.types'

export const GetUser = createParamDecorator(
    (data: keyof AuthUser | undefined, ctx: ExecutionContext) => {
        const request = ctx.switchToHttp().getRequest<AuthRequest>()
        const user = request.user

        if (!user) return null

        if (data) {
            return user[data]
        }

        return user
    }
)
