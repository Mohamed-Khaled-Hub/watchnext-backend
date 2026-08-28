// Enums
import { PersonRole } from '../enums/graph-schemas.enums'
// Types
import {
    UserProperties,
    MovieProperties,
    PersonProperties,
    GenreProperties,
} from './graph-schemas.types'

export type UserResponse = Omit<UserProperties, 'passwordHash'>

export type AuthResponse = {
    user: UserResponse
    accessToken: string
}

export type MovieResponse = MovieProperties

export type PersonResponse = PersonProperties & {
    roles: PersonRole[]
}

export type CrewResponse = PersonResponse

export type CrewMoviesResponse = {
    directedMovies: MovieResponse[]
    actedMovies: MovieResponse[]
}

export type CrewDetailsResponse = PersonResponse & {
    directedMovies: MovieResponse[]
    actedMovies: MovieResponse[]
}

export type MovieDetailsResponse = {
    movie: MovieResponse
    directors: PersonResponse[]
    actors: PersonResponse[]
    genres: GenreProperties[]
}

export type MovieConnectionPath = {
    source: string
    target: string
    relationship: string
}

export type MovieConnectionResponse = {
    path: MovieConnectionPath[]
}

export type TasteResponse = GenreProperties & {
    count: number
}

export type RecommendedMovieResponse = MovieResponse & {
    score: number
}

export type MessageResponse = {
    message: string
}
