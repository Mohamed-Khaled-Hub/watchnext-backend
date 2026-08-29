# WatchNext Backend

A NestJS backend API backed by **CognoDB** (a managed graph database speaking open Cypher over Bolt) designed to power the WatchNext movie recommendation and social discovery platform.

## Features

* **Graph Data Layer**: Utilizes CognoDB for managing nodes (`User`, `Movie`, `Person`, `Genre`) and typed relationships (such as watched, directed, acted in, and genres).
* **Authentication**: Secure JWT-based authentication workflow (`/auth/register`, `/auth/login`, `/auth/change-password`) using `@nestjs/passport` and `passport-jwt`.
* **Database Indexing & Constraints**: Automated schema constraint and index generation on startup for email uniqueness, IDs, and titles.
* **Parameterized Cypher Queries**: Zero string concatenation; all database queries are fully parameterized via the official Neo4j driver.

## Why a Graph Database?

Relational databases handle movies and relationships (like cast, crew, and recommendations) via heavily joined junction tables (`movie_actors`, `user_favorites`), which become slow and complex when querying deep multi-hop connections.

A graph database natively maps these connections, allowing WatchNext to efficiently execute:

* Multi-hop traversal queries (e.g., finding movies liked by people who share similar favorite genres or directors).
* Recommendations based on graph network proximity that a relational schema would find awkward or performance-intensive.

## Data Model Diagram

```text
(User) --[:WATCHED]-> (Movie)
(Movie) --[:DIRECTED_BY]-> (Person:Director)
(Movie) --[:ACTED_IN]-> (Person:Actor)
(Movie) --[:HAS_GENRE]-> (Genre)

```

## Setup and Run Instructions

### Prerequisites

* Node.js (v18+ recommended)
* A running instance on [CognoDB Cloud](https://www.google.com/search?q=https://console.cognodb.com/)


### 1. Clone and Install Dependencies

```bash
git clone https://github.com/Mohamed-Khaled-Hub/watchnext-backend.git
cd watchnext-backend
npm install

```

### 2. Configure Environment Variables

Create a `.env` file in the root directory:

```env
COGNODB_URI=bolt+s://<your-instance-id>.databases.cognodb.cloud
COGNODB_USERNAME=cognodb
COGNODB_PASSWORD=<your-cognoDB-password>
JWT_SECRET=<your-jwt-secret-key>
PORT=3000

```

### 3. Run the Application

```bash
# Development mode with hot-reload
npm run start:dev

# Production build and run
npm run build
npm run start:prod

```
