# Flora Full-Stack Project

Flora is a static frontend plus an Express REST API for bouquet data.

## Local Backend Setup

1. Install dependencies:

```bash
npm install
```

2. Create `.env` from `.env.example` and set your PostgreSQL connection:

```bash
cp .env.example .env
```

3. Start the backend:

```bash
npm run dev
```

The API runs at `http://localhost:3000`.
Swagger UI is available at `http://localhost:3000/api-docs`.

## API

- `GET /api/bouquets`
- `GET /api/bouquets/:id`
- `POST /api/bouquets`
- `PUT /api/bouquets/:id`
- `DELETE /api/bouquets/:id`
- `PATCH /api/bouquets/:id/favorite`
- `PATCH /api/bouquets/:id/photo`
- `GET /api/bouquets/bestsellers`

The backend uses Sequelize with PostgreSQL, Joi validation, Multer uploads to
`public/photos`, and Swagger documentation.

## Render Deploy

This repository includes `render.yaml` for deploying the backend as
`flora-backend-soroka`.

The Blueprint references an existing Render Postgres instance named `Flora`:

```yaml
DATABASE_URL:
  fromDatabase:
    name: Flora
    property: connectionString
```

No database password is committed to the repository.

## Frontend

For local frontend testing, run any static server from the project root:

```bash
python3 -m http.server 8080
```

Then open `http://localhost:8080`.
