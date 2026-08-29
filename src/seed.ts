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
            // ============================================================
            // GENRES
            // ============================================================
            
            CREATE (g1:Genre {
                id: 'g-scifi',
                name: 'Sci-Fi'
            })
            
            CREATE (g2:Genre {
                id: 'g-action',
                name: 'Action'
            })
            
            CREATE (g3:Genre {
                id: 'g-thriller',
                name: 'Thriller'
            })
            
            CREATE (g4:Genre {
                id: 'g-mystery',
                name: 'Mystery'
            })
            
            CREATE (g5:Genre {
                id: 'g-adventure',
                name: 'Adventure'
            })
            
            CREATE (g6:Genre {
                id: 'g-crime',
                name: 'Crime'
            })
            
            CREATE (g7:Genre {
                id: 'g-drama',
                name: 'Drama'
            })
            
            CREATE (g8:Genre {
                id: 'g-fantasy',
                name: 'Fantasy'
            })
            
            CREATE (g9:Genre {
                id: 'g-biography',
                name: 'Biography'
            })
            
            CREATE (g10:Genre {
                id: 'g-history',
                name: 'History'
            })
        
            // ============================================================
            // DIRECTORS
            // ============================================================
            
            CREATE (p1:Person {
                id: 'p-christopher-nolan',
                name: 'Christopher Nolan',
                image: 'https://image.tmdb.org/t/p/original/xuAIuYSmsUzKlUMBFGVZaWsY3DZ.jpg'
            })
            
            CREATE (p2:Person {
                id: 'p-denis-villeneuve',
                name: 'Denis Villeneuve',
                image: 'https://image.tmdb.org/t/p/original/zdDx9Xs93UIrJFWYApYR28J8M6b.jpg'
            })
            
            CREATE (p3:Person {
                id: 'p-destin-daniel-cretton',
                name: 'Destin Daniel Cretton',
                image: 'https://image.tmdb.org/t/p/original/wtA2EtkvCyxu4oWECzqAF7G8IZH.jpg'
            })
            
            CREATE (p4:Person {
                id: 'p-david-fincher',
                name: 'David Fincher',
                image: 'https://image.tmdb.org/t/p/original/tpEczFclQZeKAiCeKZZ0adRvtfz.jpg'
            })
            
            
            // ============================================================
            // ACTORS
            // ============================================================
            
            // Inception
            CREATE (p5:Person {
                id: 'p-leonardo-dicaprio',
                name: 'Leonardo DiCaprio',
                image: 'https://image.tmdb.org/t/p/original/wo2hJpn04vbtmh0B9utCFdsQhxM.jpg'
            })
            
            CREATE (p6:Person {
                id: 'p-joseph-gordon-levitt',
                name: 'Joseph Gordon-Levitt',
                image: 'https://image.tmdb.org/t/p/original/z2FA8js799xqtfiFjBTicFYdfk.jpg'
            })
            
            CREATE (p7:Person {
                id: 'p-elliot-page',
                name: 'Elliot Page',
                image: 'https://image.tmdb.org/t/p/original/nXO8DE4biVXY4UDYP0NdIY1zvXS.jpg'
            })
            
            CREATE (p8:Person {
                id: 'p-tom-hardy',
                name: 'Tom Hardy',
                image: 'https://image.tmdb.org/t/p/original/d81K0RH8UX7tZj49tZaQhZ9ewH.jpg'
            })
            
            CREATE (p9:Person {
                id: 'p-cillian-murphy',
                name: 'Cillian Murphy',
                image: 'https://image.tmdb.org/t/p/original/2lKs67r7FI4bPu0AXxMUJZxmUXn.jpg'
            })
            
            
            // Interstellar
            CREATE (p10:Person {
                id: 'p-matthew-mcconaughey',
                name: 'Matthew McConaughey',
                image: 'https://image.tmdb.org/t/p/original/g2tIutzv1bNEHDQQMR6RZXR96bC.jpg'
            })
            
            CREATE (p11:Person {
                id: 'p-anne-hathaway',
                name: 'Anne Hathaway',
                image: 'https://image.tmdb.org/t/p/original/s6tflSD20MGz04ZR2R1lZvhmC4Y.jpg'
            })
            
            CREATE (p12:Person {
                id: 'p-timothee-chalamet',
                name: 'Timothée Chalamet',
                image: 'https://image.tmdb.org/t/p/original/dFxpwRpmzpVfP1zjluH68DeQhyj.jpg'
            })
            
            CREATE (p13:Person {
                id: 'p-michael-caine',
                name: 'Michael Caine',
                image: 'https://image.tmdb.org/t/p/original/bVZRMlpjTAO2pJK6v90buFgVbSW.jpg'
            })
            
            CREATE (p14:Person {
                id: 'p-matt-damon',
                name: 'Matt Damon',
                image: 'https://image.tmdb.org/t/p/original/2o1x0zvL8AgssJeRkl3zrOX9Usa.jpg'
            })
            
            
            // The Dark Knight
            CREATE (p15:Person {
                id: 'p-christian-bale',
                name: 'Christian Bale',
                image: 'https://image.tmdb.org/t/p/original/wxt0NX2tnbAQm0eqeN1l7cXTfGX.jpg'
            })
            
            CREATE (p16:Person {
                id: 'p-heath-ledger',
                name: 'Heath Ledger',
                image: 'https://image.tmdb.org/t/p/original/6voMp5X5g7GENVhdG2C7i9kH2Hh.jpg'
            })
            
            CREATE (p17:Person {
                id: 'p-morgan-freeman',
                name: 'Morgan Freeman',
                image: 'https://image.tmdb.org/t/p/original/905k0RFzH0Kd6gx8oSxRdnr6FL.jpg'
            })
            
            CREATE (p18:Person {
                id: 'p-gary-oldman',
                name: 'Gary Oldman',
                image: 'https://image.tmdb.org/t/p/original/yhaSM5habNNI1Tf4ALRwRk3VvSZ.jpg'
            })
            
            
            // Dune: Part One
            CREATE (p19:Person {
                id: 'p-zendaya',
                name: 'Zendaya',
                image: 'https://image.tmdb.org/t/p/original/1qup8tSt95HLbcy2c2xrx4iJNxv.jpg'
            })
            
            CREATE (p20:Person {
                id: 'p-oscar-isaac',
                name: 'Oscar Isaac',
                image: 'https://image.tmdb.org/t/p/original/dW5U5yrIIPmMjRThR9KT2xH6nTz.jpg'
            })
            
            CREATE (p21:Person {
                id: 'p-javier-bardem',
                name: 'Javier Bardem',
                image: 'https://image.tmdb.org/t/p/original/zfRID0jx8DKBluPGU9xtk9sZWUt.jpg'
            })
            
            CREATE (p22:Person {
                id: 'p-jason-momoa',
                name: 'Jason Momoa',
                image: 'https://image.tmdb.org/t/p/original/3troAR6QbSb6nUFMDu61YCCWLKa.jpg'
            })
            
            
            // Spider-Man: Brand New Day
            CREATE (p23:Person {
                id: 'p-tom-holland',
                name: 'Tom Holland',
                image: 'https://image.tmdb.org/t/p/original/xKBAaPIa1c7tzZD3Y0MhBLv4hPE.jpg'
            })
            
            CREATE (p24:Person {
                id: 'p-jon-bernthal',
                name: 'Jon Bernthal',
                image: 'https://image.tmdb.org/t/p/original/aSH27tGD4PJoCO54RQnARSSSIQy.jpg'
            })
            
            CREATE (p25:Person {
                id: 'p-florence-pugh',
                name: 'Florence Pugh',
                image: 'https://image.tmdb.org/t/p/original/1Uvfh7xL4U2evkhs0M3C7BbBYFf.jpg'
            })
            
            CREATE (p26:Person {
                id: 'p-mark-ruffalo',
                name: 'Mark Ruffalo',
                image: 'https://image.tmdb.org/t/p/original/5GilHMOt5PAQh6rlUKZzGmaKEI7.jpg'
            })
            
            
            // Oppenheimer
            CREATE (p27:Person {
                id: 'p-emily-blunt',
                name: 'Emily Blunt',
                image: 'https://image.tmdb.org/t/p/original/5nCSG5TL1bP1geD8aaBfaLnLLCD.jpg'
            })
            
            CREATE (p28:Person {
                id: 'p-robert-downey-jr',
                name: 'Robert Downey Jr.',
                image: 'https://image.tmdb.org/t/p/original/m7kBCnWLTUpB34s2lUx2AbrgbC5.jpg'
            })
            
            
            // Seven
            CREATE (p29:Person {
                id: 'p-brad-pitt',
                name: 'Brad Pitt',
                image: 'https://image.tmdb.org/t/p/original/dtjUmQPplX7O9QBjBnRWwK0zCGw.jpg'
            })
            
            CREATE (p30:Person {
                id: 'p-kevin-spacey',
                name: 'Kevin Spacey',
                image: 'https://image.tmdb.org/t/p/original/dlVRkUYKyZdJ39AN55cY1LoyXAP.jpg'
            })
            
            CREATE (p31:Person {
                id: 'p-gwyneth-paltrow',
                name: 'Gwyneth Paltrow',
                image: 'https://image.tmdb.org/t/p/original/x040uB0CDrHjVAUSONw8bbWMvDC.jpg'
            })
            
            
            // The Odyssey
            CREATE (p32:Person {
                id: 'p-robert-pattinson',
                name: 'Robert Pattinson',
                image: 'https://image.tmdb.org/t/p/original/9CbfQHyUhJZxWjlVqsdS3I4j9t5.jpg'
            })
            
            
            // ============================================================
            // MOVIES
            // ============================================================
            
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
                poster: 'https://image.tmdb.org/t/p/original/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg'
            })
            
            CREATE (m3:Movie {
                id: 'm-the-dark-knight',
                title: 'The Dark Knight',
                year: 2008,
                rating: 9.1,
                poster: 'https://image.tmdb.org/t/p/original/qJ2tW6WMUDux911r6m7haRef0WH.jpg'
            })
            
            CREATE (m4:Movie {
                id: 'm-dune-part-one',
                title: 'Dune: Part One',
                year: 2021,
                rating: 8.0,
                poster: 'https://image.tmdb.org/t/p/original/v1tRXZ4JtD2Iv6fjkPvT4GiwslV.jpg'
            })
            
            CREATE (m5:Movie {
                id: 'm-spider-man-brand-new-day',
                title: 'Spider-Man: Brand New Day',
                year: 2026,
                rating: 8.0,
                poster: 'https://image.tmdb.org/t/p/original/bjiS5ipwxb9JFy3XRRN4OAilSeX.jpg'
            })
            
            CREATE (m6:Movie {
                id: 'm-oppenheimer',
                title: 'Oppenheimer',
                year: 2023,
                rating: 8.2,
                poster: 'https://image.tmdb.org/t/p/original/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg'
            })
            
            CREATE (m7:Movie {
                id: 'm-seven',
                title: 'Seven',
                year: 1995,
                rating: 8.6,
                poster: 'https://image.tmdb.org/t/p/original/6yoghtyTpznpBik8EngEmJskVUO.jpg'
            })
            
            CREATE (m8:Movie {
                id: 'm-the-odyssey',
                title: 'The Odyssey',
                year: 2026,
                rating: 8.5,
                poster: 'https://image.tmdb.org/t/p/original/krVa7rKCQb4OBfsr2LTJv4rTz5q.jpg'
            })
            
            
            // ============================================================
            // MOVIE → DIRECTOR
            // ============================================================
            
            CREATE (m1)-[:DIRECTED_BY]->(p1)
            CREATE (m2)-[:DIRECTED_BY]->(p1)
            CREATE (m3)-[:DIRECTED_BY]->(p1)
            CREATE (m4)-[:DIRECTED_BY]->(p2)
            CREATE (m5)-[:DIRECTED_BY]->(p3)
            CREATE (m6)-[:DIRECTED_BY]->(p1)
            CREATE (m7)-[:DIRECTED_BY]->(p4)
            CREATE (m8)-[:DIRECTED_BY]->(p1)
            
            
            // ============================================================
            // MOVIE → ACTOR
            // ============================================================
            
            // Inception
            CREATE (m1)-[:ACTED_IN]->(p5)   // Leonardo DiCaprio
            CREATE (m1)-[:ACTED_IN]->(p6)   // Joseph Gordon-Levitt
            CREATE (m1)-[:ACTED_IN]->(p7)   // Elliot Page
            CREATE (m1)-[:ACTED_IN]->(p8)   // Tom Hardy
            CREATE (m1)-[:ACTED_IN]->(p9)   // Cillian Murphy
            
            // Interstellar
            CREATE (m2)-[:ACTED_IN]->(p10)  // Matthew McConaughey
            CREATE (m2)-[:ACTED_IN]->(p11)  // Anne Hathaway
            CREATE (m2)-[:ACTED_IN]->(p12)  // Timothée Chalamet
            CREATE (m2)-[:ACTED_IN]->(p13)  // Michael Caine
            CREATE (m2)-[:ACTED_IN]->(p14)  // Matt Damon
            
            // The Dark Knight
            CREATE (m3)-[:ACTED_IN]->(p15)  // Christian Bale
            CREATE (m3)-[:ACTED_IN]->(p16)  // Heath Ledger
            CREATE (m3)-[:ACTED_IN]->(p13)  // Michael Caine
            CREATE (m3)-[:ACTED_IN]->(p17)  // Morgan Freeman
            CREATE (m3)-[:ACTED_IN]->(p9)   // Cillian Murphy
            CREATE (m3)-[:ACTED_IN]->(p18)  // Gary Oldman
            
            // Dune: Part One
            CREATE (m4)-[:ACTED_IN]->(p12)  // Timothée Chalamet
            CREATE (m4)-[:ACTED_IN]->(p19)  // Zendaya
            CREATE (m4)-[:ACTED_IN]->(p20)  // Oscar Isaac
            CREATE (m4)-[:ACTED_IN]->(p21)  // Javier Bardem
            CREATE (m4)-[:ACTED_IN]->(p22)  // Jason Momoa
            
            // Spider-Man: Brand New Day
            CREATE (m5)-[:ACTED_IN]->(p23)  // Tom Holland
            CREATE (m5)-[:ACTED_IN]->(p19)  // Zendaya
            CREATE (m5)-[:ACTED_IN]->(p24)  // Jon Bernthal
            CREATE (m5)-[:ACTED_IN]->(p25)  // Florence Pugh
            CREATE (m5)-[:ACTED_IN]->(p26)  // Mark Ruffalo
            
            // Oppenheimer
            CREATE (m6)-[:ACTED_IN]->(p9)   // Cillian Murphy
            CREATE (m6)-[:ACTED_IN]->(p27)  // Emily Blunt
            CREATE (m6)-[:ACTED_IN]->(p14)  // Matt Damon
            CREATE (m6)-[:ACTED_IN]->(p25)  // Florence Pugh
            CREATE (m6)-[:ACTED_IN]->(p28)  // Robert Downey Jr.
            CREATE (m6)-[:ACTED_IN]->(p18)  // Gary Oldman
            
            // Seven
            CREATE (m7)-[:ACTED_IN]->(p17)  // Morgan Freeman
            CREATE (m7)-[:ACTED_IN]->(p29)  // Brad Pitt
            CREATE (m7)-[:ACTED_IN]->(p30)  // Kevin Spacey
            CREATE (m7)-[:ACTED_IN]->(p31)  // Gwyneth Paltrow
            
            // The Odyssey
            CREATE (m8)-[:ACTED_IN]->(p14)  // Matt Damon
            CREATE (m8)-[:ACTED_IN]->(p23)  // Tom Holland
            CREATE (m8)-[:ACTED_IN]->(p11)  // Anne Hathaway
            CREATE (m8)-[:ACTED_IN]->(p32)  // Robert Pattinson
            CREATE (m8)-[:ACTED_IN]->(p7)   // Elliot Page
            CREATE (m8)-[:ACTED_IN]->(p19)  // Zendaya
            CREATE (m8)-[:ACTED_IN]->(p24)  // Jon Bernthal
            
            // ============================================================
            // MOVIE → GENRE
            // ============================================================
            
            // Inception
            CREATE (m1)-[:HAS_GENRE]->(g1) // Sci-Fi
            CREATE (m1)-[:HAS_GENRE]->(g2) // Action
            CREATE (m1)-[:HAS_GENRE]->(g3) // Thriller
            CREATE (m1)-[:HAS_GENRE]->(g4) // Mystery
            CREATE (m1)-[:HAS_GENRE]->(g5) // Adventure
            
            // Interstellar
            CREATE (m2)-[:HAS_GENRE]->(g1) // Sci-Fi
            CREATE (m2)-[:HAS_GENRE]->(g5) // Adventure
            CREATE (m2)-[:HAS_GENRE]->(g7) // Drama
            
            // The Dark Knight
            CREATE (m3)-[:HAS_GENRE]->(g2) // Action
            CREATE (m3)-[:HAS_GENRE]->(g6) // Crime
            CREATE (m3)-[:HAS_GENRE]->(g3) // Thriller
            
            // Dune: Part One
            CREATE (m4)-[:HAS_GENRE]->(g1) // Sci-Fi
            CREATE (m4)-[:HAS_GENRE]->(g5) // Adventure
            CREATE (m4)-[:HAS_GENRE]->(g2) // Action
            CREATE (m4)-[:HAS_GENRE]->(g8) // Fantasy
            CREATE (m4)-[:HAS_GENRE]->(g7) // Drama
            
            // Spider-Man: Brand New Day
            CREATE (m5)-[:HAS_GENRE]->(g1) // Sci-Fi
            CREATE (m5)-[:HAS_GENRE]->(g2) // Action
            CREATE (m5)-[:HAS_GENRE]->(g5) // Adventure
            CREATE (m5)-[:HAS_GENRE]->(g8) // Fantasy
            
            // Oppenheimer
            CREATE (m6)-[:HAS_GENRE]->(g9)  // Biography
            CREATE (m6)-[:HAS_GENRE]->(g10) // History
            CREATE (m6)-[:HAS_GENRE]->(g7)  // Drama
            CREATE (m6)-[:HAS_GENRE]->(g3)  // Thriller
            
            // Seven
            CREATE (m7)-[:HAS_GENRE]->(g4) // Mystery
            CREATE (m7)-[:HAS_GENRE]->(g3) // Thriller
            CREATE (m7)-[:HAS_GENRE]->(g6) // Crime
            CREATE (m7)-[:HAS_GENRE]->(g7) // Drama
            
            // The Odyssey
            CREATE (m8)-[:HAS_GENRE]->(g2) // Action
            CREATE (m8)-[:HAS_GENRE]->(g5) // Adventure
            CREATE (m8)-[:HAS_GENRE]->(g8) // Fantasy
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
