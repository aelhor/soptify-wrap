# Installation Steps

1.  Clone the repository:

```bash
git clone https://github.com/kortobaaorg/lawhaty-backend
```

2.  Change into the project directory:

```bash
cd lawhaty-backend
```

3.  Install dependencies:

```bash
pnpm install
```

    _NOTE_ : You may need to use

```bash
pnpm install --legacy-peer-deps
```

4.  Migrate the database

```bash
pnpm prisma:schema
pnpm prisma:migrate
pnpm prisma:seed
```


5. Start the application:

```bash
# development
pnpm run start

# watch mode
pnpm run start:dev

# production mode
pnpm run start:prod
```
