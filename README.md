# AI Marketing Content Generator Service

Production-style FastAPI microservice responsible only for AI-powered marketing content generation. It is designed to be consumed later by a Spring Boot backend.

## Features

- Generates 3 variations for Instagram captions, LinkedIn posts, email campaigns, Google Ads, and product descriptions.
- Uses the async Google GenAI SDK with Gemini 2.5 Flash and structured JSON output.
- Validates requests and responses with Pydantic.
- Computes a mock engagement score in service code.
- Includes CORS, logging, retry logic, health checks, and a rate-limiting placeholder.
- Keeps prompts reusable in `app/prompts`.
- Keeps the provider behind `app/services/ai_provider.py`, so Spring Boot and FastAPI callers do not depend on SDK details.
- Provides a streaming extension point in the service layer for future SSE routes.

## Project Structure

```text
app/
|-- main.py
|-- core/
|-- models/
|-- prompts/
|-- routes/
|-- services/
`-- utils/
```

## Setup

Use Python 3.12.

```bash
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
```

On Windows PowerShell:

```powershell
py -3.12 -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
Copy-Item .env.example .env
```

Create a Gemini API key in Google AI Studio, then update `.env`:

```text
GEMINI_API_KEY=your-gemini-api-key-here
GEMINI_MODEL=gemini-2.5-flash
```

The Gemini API has a free tier for developers and small projects. Google AI Studio can create keys for free-tier testing, and billing can be enabled later for higher production quotas.

## Run

```bash
uvicorn app.main:app --reload
```

Open Swagger UI at:

```text
http://localhost:8000/docs
```

## Endpoints

- `GET /health`
- `GET /health/provider`
- `POST /api/v1/generate`

## Sample Request

```bash
curl -X POST "http://localhost:8000/api/v1/generate" \
  -H "Content-Type: application/json" \
  -d '{
    "product_name": "Nimbus CRM",
    "product_description": "A lightweight CRM that helps founders manage leads, follow-ups, and customer notes from one clean dashboard.",
    "target_audience": "early-stage SaaS founders",
    "platform": "linkedin",
    "tone": "professional and confident",
    "goal": "drive demo bookings",
    "keywords": ["CRM", "sales pipeline", "founders"]
  }'
```

## Response Shape

```json
{
  "platform": "linkedin",
  "variations": [
    {
      "content": "...",
      "hashtags": ["#CRM", "#SaaS"],
      "cta": "Book a demo today.",
      "score": 82
    },
    {
      "content": "...",
      "hashtags": ["#SalesPipeline"],
      "cta": "Start your free trial.",
      "score": 78
    },
    {
      "content": "...",
      "hashtags": ["#Founders"],
      "cta": "See Nimbus CRM in action.",
      "score": 84
    }
  ]
}
```

The service enforces exactly 3 variations at runtime.

## Provider Diagnostics

```bash
curl "http://localhost:8000/health/provider"
```

Example:

```json
{
  "provider": "gemini",
  "model": "gemini-2.5-flash",
  "configured": true
}
```

## Local Testing

The sample integration tests use a fake provider, so they do not call Gemini or spend quota.

```bash
pytest
```

The tests cover successful content generation, schema validation failure handling, and provider quota error mapping.

## Gemini Notes

- SDK package: `google-genai`
- Default model: `gemini-2.5-flash`
- Environment variable: `GEMINI_API_KEY`
- Structured output is requested with JSON mode and a JSON schema, then the service validates the response again with Pydantic.
- If structured output is rejected by the provider, the Gemini adapter falls back to JSON text generation and still validates the result before returning it.

Useful references:

- Google GenAI SDK: https://googleapis.github.io/python-genai/
- Gemini API quickstart: https://ai.google.dev/gemini-api/docs/quickstart
- Gemini structured outputs: https://ai.google.dev/gemini-api/docs/structured-output
- Gemini pricing and free tier: https://ai.google.dev/gemini-api/docs/pricing
