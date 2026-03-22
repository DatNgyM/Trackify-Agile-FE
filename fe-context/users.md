# Users Module — Frontend Integration Context

> **Base Route:** `/api/users`
> **Auth Required:** Yes — all endpoints require `Authorization: Bearer <accessToken>`

---

## 1. Module Overview

Manages the current user's profile and avatar. Users can view/update their own profile and upload an avatar image. No admin user management endpoints exist yet.

---

## 2. Data Contracts

### User Profile
```typescript
interface UserProfile {
  id: string;            // UUID
  email: string;
  fullName: string;
  role: GlobalRole;      // 'ADMIN' | 'USER'
  avatarUrl: string | null;  // e.g., '/uploads/avatars/uuid.jpg'
  createdAt: string;     // ISO 8601
  updatedAt: string;     // ISO 8601
}
```

---

## 3. REST API Endpoints

### GET /api/users/me

Get the current authenticated user's profile.

**Headers:**
```
Authorization: Bearer <accessToken>
```

**Response (200):**
```typescript
{
  statusCode: 200,
  data: {
    id: string,
    email: string,
    fullName: string,
    role: 'USER' | 'ADMIN',
    avatarUrl: string | null,
    createdAt: string,
    updatedAt: string
  },
  timestamp: string
}
```

**Errors:**
| Status | Error Code | When |
|--------|-----------|------|
| 401 | `AUTH_UNAUTHORIZED` | Missing or invalid token |

---

### PATCH /api/users/me

Update the current user's profile. At least one field must be provided.

**Request:**
```typescript
{
  fullName?: string;   // 1-100 chars
  email?: string;      // valid email format
}
```

**Response (200):**
```typescript
{
  statusCode: 200,
  data: {
    id: string,
    email: string,
    fullName: string,
    role: string,
    avatarUrl: string | null,
    createdAt: string,
    updatedAt: string
  },
  timestamp: string
}
```

**Errors:**
| Status | Error Code | When |
|--------|-----------|------|
| 400 | `VALIDATION_FAILED` | No fields provided or invalid values |
| 401 | `AUTH_UNAUTHORIZED` | Missing or invalid token |
| 409 | `USER_EMAIL_EXISTS` | Email already taken by another user |

---

### POST /api/users/me/avatar

Upload a new avatar image. Uses `multipart/form-data`.

**Request:**
```
Content-Type: multipart/form-data

Field: avatar (file)
Allowed types: image/jpeg, image/png, image/webp
Max size: 5MB
```

**Response (201):**
```typescript
{
  statusCode: 201,
  data: {
    id: string,
    email: string,
    fullName: string,
    avatarUrl: '/uploads/avatars/<uuid>.<ext>',
    // ... other user fields
  },
  timestamp: string
}
```

**Errors:**
| Status | Error Code | When |
|--------|-----------|------|
| 400 | `VALIDATION_FAILED` | No file uploaded |
| 400 | `FILE_TYPE_NOT_ALLOWED` | Invalid MIME type |
| 400 | `FILE_TOO_LARGE` | File exceeds 5MB |
| 401 | `AUTH_UNAUTHORIZED` | Missing or invalid token |

---

## 4. Frontend Integration Notes

- Avatar URL is relative (e.g., `/uploads/avatars/uuid.jpg`) — prepend the API base URL
- Use `FormData` for avatar upload:
  ```typescript
  const formData = new FormData();
  formData.append('avatar', file);
  await fetch('/api/users/me/avatar', {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  });
  ```
- Do NOT set `Content-Type` header manually for multipart — let the browser set it with the boundary
