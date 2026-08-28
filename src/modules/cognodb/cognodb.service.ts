// Core
import { ConfigService } from '@nestjs/config'
import neo4j, { Driver, Session } from 'neo4j-driver'
import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common'

@Injectable()
export class CognodbService implements OnModuleInit, OnModuleDestroy {
    private driver: Driver

    constructor(private readonly configService: ConfigService) {}

    async onModuleInit() {
        const uri = this.configService.get<string>('COGNODB_URI') as string
        const username = this.configService.get<string>(
            'COGNODB_USERNAME'
        ) as string
        const password = this.configService.get<string>(
            'COGNODB_PASSWORD'
        ) as string

        this.driver = neo4j.driver(uri, neo4j.auth.basic(username, password), {
            disableLosslessIntegers: true,
        })

        await this.initSchema()
    }

    private async initSchema() {
        const constraints = [
            'CREATE CONSTRAINT user_email_unique IF NOT EXISTS FOR (u:User) REQUIRE u.email IS UNIQUE',
            'CREATE CONSTRAINT user_id_unique IF NOT EXISTS FOR (u:User) REQUIRE u.id IS UNIQUE',
            'CREATE CONSTRAINT movie_id_unique IF NOT EXISTS FOR (m:Movie) REQUIRE m.id IS UNIQUE',
            'CREATE CONSTRAINT person_id_unique IF NOT EXISTS FOR (p:Person) REQUIRE p.id IS UNIQUE',
            'CREATE CONSTRAINT genre_id_unique IF NOT EXISTS FOR (g:Genre) REQUIRE g.id IS UNIQUE',
            'CREATE INDEX movie_title_index IF NOT EXISTS FOR (m:Movie) ON (m.title)',
            'CREATE INDEX person_name_index IF NOT EXISTS FOR (p:Person) ON (p.name)',
        ]

        for (const cypher of constraints) {
            await this.write(cypher)
        }
    }

    async read<T = Record<string, any>>(
        cypher: string,
        params: Record<string, any> = {}
    ): Promise<T[]> {
        const session: Session = this.driver.session()
        try {
            const result = await session.executeRead((tx) =>
                tx.run(cypher, params)
            )
            return result.records.map((record) => record.toObject() as T)
        } finally {
            await session.close()
        }
    }

    async write<T = Record<string, any>>(
        cypher: string,
        params: Record<string, any> = {}
    ): Promise<T[]> {
        const session: Session = this.driver.session()
        try {
            const result = await session.executeWrite((tx) =>
                tx.run(cypher, params)
            )
            return result.records.map((record) => record.toObject() as T)
        } finally {
            await session.close()
        }
    }

    async onModuleDestroy() {
        if (this.driver) {
            await this.driver.close()
        }
    }
}
