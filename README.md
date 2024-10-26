# MyChat

<p align="center">
  <img src="https://github.com/RedheadRusskie/mychat/blob/develop/public/assets/logo.png" alt="Logo" width="200" />
</p>

<p align="center">
  A real-time, encrypted chat application featuring Next.js, React, PrismaORM, PostgreSQL, Socket.IO, Cryptr, React Query, ChakraUI, unit testing with Vitest and more.
</p>

## Table of Contents

- [Installation](#installation)
- [Database](#database)
- [Environment](#environment)
- [Usage](#usage)

## Installation

1. Clone the repository:

```bash
git clone https://github.com/RedheadRusskie/server-todos.git
```

2. Install dependencies:

```bash
yarn install
```

## Database

1. Assuming your database has been set up, initialise the database schema:

```bash
yarn prisma generate
```

## Environment

1. Enter the required environment variables (an example is provided [here](https://github.com/RedheadRusskie/mychat/blob/develop/.env.example)):

```
DATABASE_URL="postgresql://user@localhost:5432/your_db?schema=public"
NEXTAUTH_SECRET="your_secret"
GITHUB_ID="your_github_id"
GITHUB_SECRET="your_github_secret"
NEXT_PUBLIC_BASE_URL="http://localhost:3000"
NEXT_PUBLIC_SOCKET_URL="http://localhost:4000"
CRYPTR_SECRET="your_cryptr_secret"
```

## Usage

1. Run web socket server:

```bash
yarn server
```

2. Run the application:

```bash
yarn dev
```

3. Run unit tests:

```bash
yarn test
```
