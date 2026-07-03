# Database Setup

This project uses MySQL with Drizzle ORM.

## Local Database

Start the local MySQL container:

```bash
npm run db:local
```

The local database runs on `127.0.0.1:3307`.

Default development connection string:

```bash
DATABASE_URL=mysql://fitociencia:fitociencia_dev_password@127.0.0.1:3307/fitociencia_care
```

## Environment

The project includes:

- `.env.example`: template for local or production configuration.
- `.env`: local development values for the Docker database.

Before production, replace:

- `APP_SECRET`
- `DATABASE_URL`
- `OWNER_UNION_ID`
- `KIMI_AUTH_URL`
- `KIMI_OPEN_URL`
- `VITE_KIMI_AUTH_URL`
- `VITE_APP_ID`

## Create Tables And Seed Data

After the database container is healthy:

```bash
npm run db:setup
```

This runs:

```bash
npm run db:push
npm run db:seed
```

## Reset Local Database

To drop all local tables and recreate seed data:

```bash
npm run db:reset
npm run db:push
npm run db:seed
```

## Admin User

The first admin can be assigned in either of these ways:

1. Set `OWNER_UNION_ID` before the owner logs in for the first time.
2. Update the user role manually:

```sql
UPDATE users SET role = 'admin' WHERE id = <user_id>;
```

## Client Medical Checkups

The personalized checkup flow is backed by the `medical_checkups` table.

- Admins create checkups from `/admin`.
- Clients see only their own published checkups in `/mi-cuenta`.
- Draft and archived checkups stay hidden from clients.
