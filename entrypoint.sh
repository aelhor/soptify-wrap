#!/bin/sh

# Wait for the database to be ready
until nc -z -v -w30 $POSTGRE_HOST $POSTGRE_PORT; do
  echo "Waiting for database connection..."
  sleep 1
done



pnpm run prisma:schema
pnpm run prisma:generate
pnpm run prisma:deploy
pnpm run prisma:seed
pnpm run start
