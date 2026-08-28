// Core
import { config } from 'dotenv'
import neo4j, { Driver } from 'neo4j-driver'

config()

// Env Variables
const uri = process.env.COGNODB_URI as string
const username = process.env.COGNODB_USERNAME as string
const password = process.env.COGNODB_PASSWORD as string

const driver: Driver = neo4j.driver(uri, neo4j.auth.basic(username, password))

async function seed() {
    const session = driver.session()
    console.log('Starting CognoDB seeding...')

    try {
        console.log('Cleaning existing graph nodes (excluding Users)...')
        await session.executeWrite((tx) =>
            tx.run('MATCH (n) WHERE NOT n:User DETACH DELETE n')
        )

        const seedCypher = `
            // 1. Create Genres
            CREATE (g1:Genre {id: 'g-scifi', name: 'Sci-Fi'})
            CREATE (g2:Genre {id: 'g-action', name: 'Action'})
            CREATE (g3:Genre {id: 'g-drama', name: 'Drama'})
            CREATE (g4:Genre {id: 'g-thriller', name: 'Thriller'})

            // 2. Create Crew / Persons
            CREATE (p1:Person {
                id: 'p-nolan', 
                name: 'Christopher Nolan', 
                image: 'https://image.tmdb.org/t/p/original/xuAIuYSmsUzKlUMBFGVZaWsY3DZ.jpg'
            })
            CREATE (p2:Person {
                id: 'p-dicaprio', 
                name: 'Leonardo DiCaprio', 
                image: 'https://image.tmdb.org/t/p/original/wo2hJpn04vbtmh0B9utCFdsQhxM.jpg'
            })
            CREATE (p3:Person {
                id: 'p-mcconaughey', 
                name: 'Matthew McConaughey', 
                image: 'https://image.tmdb.org/t/p/original/lCySuYjhXix3FzQdS4oceDDrXKI.jpg'
            })
            CREATE (p4:Person {
                id: 'p-bale', 
                name: 'Christian Bale', 
                image: 'https://image.tmdb.org/t/p/original/7Pxez9J8fuPd2Mn9kex13YALrCQ.jpg'
            })
            CREATE (p5:Person {
                id: 'p-villeneuve', 
                name: 'Denis Villeneuve', 
                image: 'https://image.tmdb.org/t/p/original/zdDx9Xs93UIrJFWYApYR28J8M6b.jpg'
            })
            CREATE (p6:Person {
                id: 'p-chalamet', 
                name: 'Timothée Chalamet', 
                image: 'https://image.tmdb.org/t/p/original/dFxpwRpmzpVfP1zjluH68DeQhyj.jpg'
            })

            // 3. Create Movies
            CREATE (m1:Movie {
                id: 'm-inception',
                title: 'Inception',
                year: 2010,
                rating: 8.8,
                poster: 'https://image.tmdb.org/t/p/original/xlaY2zyzMfkhk0HSC5VUwzoZPU1.jpg'
            })
            CREATE (m2:Movie {
                id: 'm-interstellar',
                title: 'Interstellar',
                year: 2014,
                rating: 8.7,
                poster: 'https://image.tmdb.org/t/p/original/nrSaXF39nDfAAeLKksRCyvSzI2a.jpg'
            })
            CREATE (m3:Movie {
                id: 'm-dark-knight',
                title: 'The Dark Knight',
                year: 2008,
                rating: 9.0,
                poster: 'https://image.tmdb.org/t/p/original/qJ2tW6WMUDux911r6m7haRef0WH.jpg'
            })
            CREATE (m4:Movie {
                id: 'm-dune',
                title: 'Dune: Part One',
                year: 2021,
                rating: 8.0,
                poster: 'https://image.tmdb.org/t/p/original/v1tRXZ4JtD2Iv6fjkPvT4GiwslV.jpg'
            })

            // 4. Connect Movie -> Genre
            CREATE (m1)-[:HAS_GENRE]->(g1)
            CREATE (m1)-[:HAS_GENRE]->(g2)
            CREATE (m2)-[:HAS_GENRE]->(g1)
            CREATE (m2)-[:HAS_GENRE]->(g3)
            CREATE (m3)-[:HAS_GENRE]->(g2)
            CREATE (m3)-[:HAS_GENRE]->(g4)
            CREATE (m4)-[:HAS_GENRE]->(g1)
            CREATE (m4)-[:HAS_GENRE]->(g2)

            // 5. Connect Movie -> Person (DIRECTED_BY / ACTED_IN)
            CREATE (m1)-[:DIRECTED_BY]->(p1)
            CREATE (m1)-[:ACTED_IN]->(p2)
            CREATE (m2)-[:DIRECTED_BY]->(p1)
            CREATE (m2)-[:ACTED_IN]->(p3)
            CREATE (m3)-[:DIRECTED_BY]->(p1)
            CREATE (m3)-[:ACTED_IN]->(p4)
            CREATE (m4)-[:DIRECTED_BY]->(p5)
            CREATE (m4)-[:ACTED_IN]->(p6)
        `

        await session.executeWrite((tx) => tx.run(seedCypher))
        console.log('CognoDB movies seeded successfully (Users preserved)!')
    } catch (error) {
        console.error('Seeding failed:', error)
    } finally {
        await session.close()
        await driver.close()
    }
}

seed().catch((err) => console.error(err))
