## Init Nestjs, postgres(with psiema) and docker

# Requirments
.  pnpm 8 
.  prisma/
├── subschemas/
│   ├── _config.prisma    # Datasource + generator
│   └── user.prisma       # Models
├── schema.prisma         # Auto-generated
└── seed.ts               # Optional seeding
 

# -config.prisma  ✨NOTE this will be commented by multi-schema

```js
datasource db {
   provider = "postgresql"
   url      = env("DATABASE_URL")
 }

generator client {
  provider        = "prisma-client-js"
  previewFeatures = ["relationJoins"]
}
```

# Docker File 

```Dockerfile
# Use a Debian-based image with full system dependencies
FROM node:18-bullseye

# Set working directory
WORKDIR /app

# Install essential build tools and Prisma dependencies
RUN apt-get update && apt-get install -y \
    openssl \
    python3 \
    make \
    g++ \
    libssl-dev \
    && rm -rf /var/lib/apt/lists/*

# Copy package management files
COPY package.json pnpm-lock.yaml ./

# Install pnpm and dependencies
RUN npm install -g pnpm@8 && \
    pnpm install --frozen-lockfile

# Copy application files
COPY . .

# Generate Prisma schema and client (crucial for multi-schema setup)
RUN pnpm prisma:schema && \
    sed -i '/\.prisma/d' prisma/schema.prisma && \
    pnpm prisma format && \
    pnpm prisma:generate

# Environment setup
ENV NODE_ENV=development
EXPOSE 3000

# Start application
CMD ["pnpm", "start:dev"]
```                 
------------------------------------------------------------------------------

# docker compose.yml 

```yml
version: "3.8"

services:
  app:
    container_name: spotify-wrap
    build: .
    ports:
      - "3000:3000"
    volumes:
      - .:/app
      - /app/node_modules
    env_file:
      - .env
    depends_on:
      db:
        condition: service_healthy
    networks:
      - app-network

  db:
    image: postgres:15
    container_name: spotify-wrap-db
    restart: always
    ports:
      - "5433:5432"
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: 1234
      POSTGRES_DB: spotify-wrap
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 5s
      timeout: 5s
      retries: 5
    networks:
      - app-network

networks:
  app-network:
    driver: bridge

volumes:
  postgres_data:

```
------------------------------------------------------------------------------

# package.json 
```json

{
  "name": "lawhaty-backend",
  "version": "0.0.1",
  "description": "",
  "author": "",
  "private": true,
  "license": "UNLICENSED",
  "scripts": {
    "prisma:schema": "prisma-multischema --main-schema prisma/schema.prisma --sub-schemas prisma/subschemas/*.prisma",
    "prisma:migrate": "prisma migrate dev",
    "prisma:deploy": "prisma migrate deploy",
    "prisma:seed": "prisma db seed",
    "prisma:generate": "prisma generate",
    "prisma:format": "prisma format",
    "build": "nest build",
    "format": "prettier --write \"src/**/*.ts\" \"test/**/*.ts\"",
    "start": "pnpm run prisma:generate && nest start",
    "start:dev": "pnpm run prisma:generate && nest start --watch",
    "start:debug": "pnpm run prisma:generate && nest start --debug --watch",
    "start:prod": "node dist/main",
    "lint": "eslint \"{src,apps,libs,test}/**/*.ts\" --fix",
    "test": "jest",
    "test:watch": "jest --watch",
    "test:cov": "jest --coverage",
    "test:debug": "node --inspect-brk -r tsconfig-paths/register -r ts-node/register node_modules/.bin/jest --runInBand",
    "test:e2e": "jest --config ./test/jest-e2e.json"
  },
  "dependencies": {
    "@nestjs/common": "^10.0.0",
    "@nestjs/config": "^3.2.0",
    "@nestjs/core": "^10.0.0",
    "@nestjs/event-emitter": "^2.0.4",
    "@nestjs/jwt": "^10.2.0",
    "@nestjs/mapped-types": "*",
    "@nestjs/platform-express": "^10.0.0",
    "@nestjs/schedule": "^4.0.1",
    "@nestjs/serve-static": "^4.0.1",
    "@prisma/client": "6.4.1",
    "aws-sdk": "^2.1569.0",
    "axios": "^1.6.7",
    "bcryptjs": "^2.4.3",
    "class-transformer": "^0.5.1",
    "class-validator": "^0.14.1",
    "firebase-admin": "^12.0.0",
    "form-data": "^4.0.0",
    "joi": "^17.12.1",
    "mailgun.js": "^10.2.1",
    "moyasar": "^0.5.1",
    "multer": "1.4.5-lts.1",
    "mustache": "^4.2.0",
    "nexmo": "^2.9.1",
    "node-fetch": "2",
    "node-jsencrypt": "^1.0.0",
    "reflect-metadata": "^0.2.0",
    "rxjs": "^7.8.1",
    "uuid": "^9.0.1"
  },
  "devDependencies": {
    "@nestjs/cli": "^10.0.0",
    "@nestjs/schematics": "^10.0.0",
    "@nestjs/testing": "^10.0.0",
    "@types/express": "^4.17.17",
    "@types/jest": "^29.5.2",
    "@types/multer": "^1.4.11",
    "@types/node": "^20.3.1",
    "@types/supertest": "^6.0.0",
    "@typescript-eslint/eslint-plugin": "^6.0.0",
    "@typescript-eslint/parser": "^6.0.0",
    "eslint": "^8.42.0",
    "eslint-config-prettier": "^9.0.0",
    "eslint-plugin-prettier": "^5.0.0",
    "jest": "^29.5.0",
    "prettier": "^3.0.0",
    "prisma": "^6.4.1",
    "prisma-multischema": "^1.1.4",
    "source-map-support": "^0.5.21",
    "supertest": "^6.3.3",
    "ts-jest": "^29.1.0",
    "ts-loader": "^9.4.3",
    "ts-node": "^10.9.1",
    "tsconfig-paths": "^4.2.0",
    "typescript": "^5.1.3"
  },
  "prisma": {
    "seed": "ts-node prisma/seeders/seed.ts"
  },
  "jest": {
    "moduleFileExtensions": [
      "js",
      "json",
      "ts"
    ],
    "rootDir": "src",
    "testRegex": ".*\\.spec\\.ts$",
    "transform": {
      "^.+\\.(t|j)s$": "ts-jest"
    },
    "collectCoverageFrom": [
      "**/*.(t|j)s"
    ],
    "coverageDirectory": "../coverage",
    "testEnvironment": "node"
  }
}

```