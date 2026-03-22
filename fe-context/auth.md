# Auth Module — Frontend Integration Context

> **Base Route:** `/api/auth`
> **Auth Required:** No (public endpoints, except logout)
> **Rate Limited:** Yes — login/register have strict throttling

---

## 1. Module Overview

Handles user registration, JWT-based login, token refresh, and logout. Uses access + refresh token pattern. Access tokens expire in 15m, refresh tokens in 7d.

---

## 2. Data Contracts

### User (returned on register)
```typescript
interface User {
  id: string;           // UUID
  email: string;
  fullName: string;
  role: GlobalRole;     // 'ADMIN' | 'USER'
  createdAt: string;    // ISO 8601
  updatedAt: string;    // ISO 8601
}
```

### Auth Tokens (returned on login)
```typescript
interface AuthTokens {
  accessToken: string;   // JWT, expires in 15m
  refreshToken: string;  // JWT, expires in 7d
}
```

### Enums
```typescript
type GlobalRole = 'ADMIN' | 'USER';
```

---

## 3. REST API Endpoints

### All responses are wrapped:
```typescript
// Success
{ statusCode: number, data: T, timestamp: string }

// Error
{ statusCode: number, message: string, errorCode?: string, timestamp: string, path: string }
```

---

### POST /api/auth/register

Create a new user account.

**Request:**
```typescript
{
  email: string;        // valid email format
  password: string;     // min 8 chars, 1 uppercase, 1 lowercase, 1 number, 1 special (@#$%^&*!)
  fullName: string;     // 1-100 chars
}
```

**Response (201):**
```typescript
{
  statusCode: 201,
  data: {
    id: string,
    email: string,
    fullName: string,
    role: 'USER',
    createdAt: string,
    updatedAt: string
  },
  timestamp: string
}
```

**Errors:**
| Status | Error Code | When |
|--------|-----------|------|
| 400 | `VALIDATION_FAILED` | Invalid email, weak password, missing fields |
| 409 | `AUTH_EMAIL_EXISTS` | Email already registered |
| 429 | — | Rate limited (1 req/sec, 5 req/min) |

---

### POST /api/auth/login

Authenticate and receive JWT tokens.

**Request:**
```typescript
{
  email: string;     // valid email
  password: string;  // min 1 char
}
```

**Response (200):**
```typescript
{
  statusCode: 200,
  data: {
    accessToken: string,
    refreshToken: string
  },
  timestamp: string
}
```

**Errors:**
| Status | Error Code | When |
|--------|-----------|------|
| 401 | `AUTH_INVALID_CREDENTIALS` | Wrong email or password |
| 429 | — | Rate limited (1 req/sec, 5 req/min) |

---

### POST /api/auth/refresh

Get a new access token using a refresh token.

**Request:**
```typescript
{
  refreshToken: string;  // the refresh token from login
}
```

**Response (200):**
```typescript
{
  statusCode: 200,
  data: {
    accessToken: string
  },
  timestamp: string
}
```

**Errors:**
| Status | Error Code | When |
|--------|-----------|------|
| 401 | `AUTH_REFRESH_TOKEN_INVALID` | Expired, invalid, or revoked refresh token |

---

### POST /api/auth/logout

Invalidate the current user's refresh token. **Requires Bearer token.**

**Headers:**
```
Authorization: Bearer <accessToken>
```

**Request Body:** None

**Response (200):**
```typescript
{
  statusCode: 200,
  data: {
    message: "Logged out successfully"
  },
  timestamp: string
}
```

**Errors:**
| Status | Error Code | When |
|--------|-----------|------|
| 401 | `AUTH_UNAUTHORIZED` | Missing or invalid access token |

---

## 4. Frontend Integration Notes

- Store `accessToken` in memory (NOT localStorage for security)
- Store `refreshToken` in httpOnly cookie or secure storage
- Set up an Axios/fetch interceptor to:
  1. Attach `Authorization: Bearer <accessToken>` to all authenticated requests
  2. On 401 response, call `/api/auth/refresh` with the refresh token
  3. Retry the failed request with the new access token
  4. If refresh also fails, redirect to login page
- Password validation regex: `/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@#$%^&*!]).{8,}$/`
