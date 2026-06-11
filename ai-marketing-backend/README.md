# AI Marketing Backend

Spring Boot 3 backend for an AI Marketing Content Generator SaaS.

## Architecture

```text
React Frontend
  -> Spring Boot Backend
    -> FastAPI AI Service
      -> Gemini/OpenAI provider
```

The Spring Boot backend owns authentication, users, content history, PostgreSQL persistence, and the integration boundary to the FastAPI AI service.

## Tech Stack

- Java 21
- Spring Boot 3.x
- Maven
- PostgreSQL
- Spring Security
- JWT authentication
- Spring Data JPA
- Lombok
- Bean Validation
- WebClient
- Flyway
- SpringDoc OpenAPI
- Docker

## IntelliJ IDEA Setup

1. Open IntelliJ IDEA.
2. Choose `File -> Open`.
3. Select the `ai-marketing-backend` folder.
4. Wait for Maven reload to complete.
5. Enable annotation processing for Lombok if IntelliJ prompts you.
6. Start PostgreSQL with Docker Compose or configure your own database.
7. Run `AiMarketingBackendApplication`.

Swagger UI:

```text
http://localhost:8080/swagger-ui.html
```

## Environment

Copy `.env.example` to `.env` if you use Docker Compose, or set the variables in your IntelliJ run configuration.

Important values:

```text
SPRING_DATASOURCE_URL=jdbc:postgresql://localhost:5432/ai_marketing
SPRING_DATASOURCE_USERNAME=postgres
SPRING_DATASOURCE_PASSWORD=postgres
JWT_SECRET=replace-with-a-strong-secret-at-least-32-characters
AI_SERVICE_BASE_URL=http://localhost:8000
```

The FastAPI service should be running separately on:

```text
http://localhost:8000
```

## Run Locally

Start PostgreSQL:

```bash
docker compose up -d postgres
```

Run the backend:

```bash
mvn spring-boot:run
```

Run tests:

```bash
mvn test
```

Run the full stack container for this backend and PostgreSQL:

```bash
docker compose up --build
```

## API Endpoints

Public:

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /swagger-ui.html`
- `GET /v3/api-docs`

Protected:

- `GET /api/auth/me`
- `POST /api/content/generate`
- `GET /api/content/history`
- `GET /api/content/{id}`
- `DELETE /api/content/{id}`

## Sample Registration

```bash
curl -X POST "http://localhost:8080/api/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Sudarshan",
    "email": "sudarshan@example.com",
    "password": "password123"
  }'
```

## Sample Login

```bash
curl -X POST "http://localhost:8080/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "sudarshan@example.com",
    "password": "password123"
  }'
```

Use the returned JWT:

```bash
curl -X POST "http://localhost:8080/api/content/generate" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "productName": "FitTrack",
    "productDescription": "AI fitness app",
    "targetAudience": "College students",
    "platform": "instagram",
    "tone": "motivational",
    "goal": "increase app downloads",
    "keywords": ["fitness", "health"]
  }'
```

## Response Shape

All application endpoints use:

```json
{
  "success": true,
  "message": "Success",
  "data": {}
}
```

Errors use:

```json
{
  "success": false,
  "message": "Validation failed.",
  "data": null
}
```

## Notes

- Flyway creates `users` and `generated_content`.
- Users can only read or delete their own generated content.
- The FastAPI contract remains isolated in `integration/AiContentClient`.
- Tests mock the FastAPI response, so they do not require Gemini/OpenAI credentials.
