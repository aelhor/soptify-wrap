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