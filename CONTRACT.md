# Web Starter HTTP Contract

Version: 1.0.0

This contract allows `react-starter` and `vue-starter` to use either `go-fiber-starter` or `rust-axum-starter` without framework-specific changes.

## Transport rules

- All application endpoints live under `/api`.
- Requests and responses use UTF-8 JSON unless an endpoint explicitly documents another media type.
- JSON field names use camelCase.
- Datetimes use RFC 3339 UTC strings.
- Authenticated requests send `Authorization: Bearer <token>`.
- Frontends use relative `/api` URLs by default and may set `VITE_API_BASE_URL` to an absolute origin.
- Development servers proxy `/api` to the selected backend.
- Mock mode must preserve the same methods, status codes, fields, and error shape as a real backend.

## Data shapes

### Health

```json
{
  "status": "ok",
  "service": "go-fiber-starter",
  "version": "1.0.0"
}
```

- `status` is `ok` when the process can serve requests.
- `service` identifies the active backend and is not a frontend routing key.
- `version` is the backend API version.

### Credentials

```json
{
  "username": "admin",
  "password": "change-me"
}
```

- `username`: 1–64 Unicode characters.
- `password`: 6–72 characters.

### User

```json
{
  "id": "019fc04f-3bb0-7c26-a9b2-c91cfc102042",
  "username": "admin",
  "createdAt": "2026-07-29T08:00:00Z",
  "updatedAt": "2026-07-29T08:00:00Z"
}
```

### Token

```json
{
  "token": "<jwt>"
}
```

### Error

Errors use an RFC 9457-compatible problem object:

```json
{
  "status": 401,
  "title": "Unauthorized",
  "detail": "用户名或密码错误"
}
```

Validation errors may also contain:

```json
{
  "errors": [
    {
      "message": "expected length >= 6",
      "location": "body.password",
      "value": "short"
    }
  ]
}
```

Clients must branch on HTTP status and may display `detail`. They must not depend on localized `title` or `detail` text.

## Endpoints

### `GET /api/health`

Returns `200 OK` and a Health object. No authentication is required.

### `POST /api/auth/register`

Accepts Credentials.

- `201 Created`: User
- `409 Conflict`: username already exists
- `422 Unprocessable Entity`: invalid input
- `500 Internal Server Error`: storage or password-hashing failure

### `POST /api/auth/login`

Accepts Credentials.

- `200 OK`: Token
- `401 Unauthorized`: invalid username or password
- `422 Unprocessable Entity`: invalid input
- `500 Internal Server Error`: storage or token-generation failure

### `GET /api/auth/profile`

Requires a valid Bearer JWT.

- `200 OK`: User
- `401 Unauthorized`: missing, invalid, or expired token
- `404 Not Found`: token subject no longer exists
- `500 Internal Server Error`: storage failure

## API discovery

Both backends expose:

- `GET /docs`: interactive documentation
- `GET /openapi.json`: OpenAPI 3.1 JSON
- `GET /openapi.yaml`: OpenAPI 3.1 YAML when supported by the documentation adapter

The OpenAPI document must describe the four application endpoints, the Bearer security scheme, success payloads, and documented error status codes.

## Compatibility verification

Each backend must test:

- the four paths and their HTTP methods;
- register, login, and profile as one end-to-end flow;
- missing-token rejection;
- duplicate-user rejection;
- representative validation errors;
- the OpenAPI version and required paths.

Each frontend must test:

- Bearer token assignment;
- the shared response types;
- mock and real adapters exposing the same method paths;
- a failed request surfacing the problem `detail`.
