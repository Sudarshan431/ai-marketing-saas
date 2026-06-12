# AI Marketing Frontend

React + TypeScript frontend for the AI Marketing Content Generator SaaS.

## Stack

- React with Vite
- TypeScript
- React Router
- Axios
- Tailwind CSS
- Zustand
- TanStack React Query
- React Hook Form
- Zod
- Lucide icons

## Backend

The app expects the Spring Boot backend to run at:

```text
http://localhost:8080
```

Configure the API base URL in `.env`:

```text
VITE_API_BASE_URL=http://localhost:8080
```

## Run

```bash
npm install
npm run dev
```

Open:

```text
http://localhost:5173
```

## Routes

Public:

- `/login`
- `/register`

Protected:

- `/dashboard`
- `/generate`
- `/results`
- `/history`
- `/content/:id`
- `/profile`

## API Integration

The Axios client is configured in:

```text
src/api/http.ts
```

It reads `VITE_API_BASE_URL`, attaches the JWT from Zustand, unwraps the backend `ApiResponse<T>` format, and clears auth on `401`.

## Backend Contract

Auth:

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`

Content:

- `POST /api/content/generate`
- `GET /api/content/history`
- `GET /api/content/{id}`
- `DELETE /api/content/{id}`
