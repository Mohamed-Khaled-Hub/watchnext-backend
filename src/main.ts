// Core
import 'dotenv/config'
import { NestFactory } from '@nestjs/core'
import { ValidationPipe, Logger } from '@nestjs/common'
import { ExpressAdapter } from '@nestjs/platform-express'
import express, { Request, Response } from 'express'
// Modules
import { AppModule } from './app.module'

// API Name
export const apiName = 'WatchNext'

// Logger
const logger = new Logger(`${apiName} API`)

// Express Server
const server = express()
let isInitialized = false

// Configs for App Setup
function configureApp(
    app: ReturnType<typeof NestFactory.create> extends Promise<infer T>
        ? T
        : never
) {
    app.enableCors({
        origin: [
            process.env.FRONTEND_SERVER_VERCEL,
            process.env.FRONTEND_SERVER_LOCAL,
        ].filter(Boolean) as string[],
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
        credentials: true,
    })

    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,
            forbidNonWhitelisted: true,
            transform: true,
        })
    )
}

// Bootstrap (Vercel)
async function bootstrapServerless(): Promise<express.Express> {
    if (!isInitialized) {
        const app = await NestFactory.create(
            AppModule,
            new ExpressAdapter(server)
        )

        configureApp(app)
        await app.init()

        isInitialized = true
        logger.log(`${apiName} serverless instance initialized`)
    }
    return server
}

// Bootstrap (npm run start:dev)
async function bootstrapLocal() {
    const app = await NestFactory.create(AppModule)
    configureApp(app)

    const port = process.env.PORT ?? 5000
    await app.listen(port, '0.0.0.0')
    logger.log(`Application is running on port ${port}`)
}

// Run Vercel
export default async function handler(
    req: Request,
    res: Response
): Promise<void> {
    const expressApp = await bootstrapServerless()
    expressApp(req, res)
}

// Run Locally
if (!process.env.VERCEL) {
    bootstrapLocal().catch((err: unknown) => console.error(err))
}
