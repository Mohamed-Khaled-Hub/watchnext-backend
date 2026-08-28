// Core
import { NestFactory } from '@nestjs/core'
import { ValidationPipe } from '@nestjs/common'
// Modules
import { AppModule } from './app.module'

async function bootstrap() {
    const app = await NestFactory.create(AppModule)

    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,
            forbidNonWhitelisted: true,
            transform: true,
        })
    )

    app.enableCors()

    await app.listen(process.env.PORT ?? 3000)
}

bootstrap().catch((e) => console.error(e))
