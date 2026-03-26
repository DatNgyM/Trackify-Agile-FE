# Projects Module — Frontend Integration Context

> **Base Route:** `/api/projects`
> **Auth Required:** Yes — all endpoints require `Authorization: Bearer <accessToken>`
> **RBAC:** Most endpoints require project membership, some require specific roles

---

## 1. Module Overview

Manages projects, project members, and project labels. Projects are the top-level container — issues, sprints, and labels belong to a project. Access is controlled via `ProjectRoleGuard` which checks membership and role.

---

## 2. Data Contracts

### Project
```typescript
interface Project {
  id: string;              // UUID
  name: string;
  key: string;             // e.g., 'TRK' — uppercase, 2-10 chars
  description: string | null;
  createdAt: string;       // ISO 8601
  updatedAt: string;
  _count?: {
    members: number;
    labels: number;
  };
}
```

### ProjectMember
```typescript
interface ProjectMember {
  userId: string;          // UUID
  projectId: string;       // UUID
  role: ProjectRole;
  joinedAt: string;        // ISO 8601
  user?: {
    id: string;
    fullName: string;
    email: string;
    avatarUrl: string | null;
  };
}
```

### Label
```typescript
interface Label {
  id: string;              // UUID
  name: string;
  color: string;           // hex #RRGGBB
  projectId: string;
  createdAt: string;
}
```

### Enums
```typescript
type ProjectRole = 'OWNER' | 'ADMIN' | 'MEMBER' | 'VIEWER';
// Hierarchy: OWNER > ADMIN > MEMBER > VIEWER
```

### Paginated Response
```typescript
interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
```

---

## 3. REST API Endpoints

### 3.1 Projects CRUD

#### POST /api/projects
Create a new project. Creator automatically becomes OWNER.

**Request:**
```typescript
{
  name: string;           // 1-100 chars, required
  key: string;            // 2-10 chars, uppercase letters + numbers, must start with letter, required
  description?: string;   // 0-500 chars
}
```

**Response (201):**
```typescript
{
  statusCode: 201,
  data: {
    id: string,
    name: string,
    key: string,
    description: string | null,
    members: [{ userId: string, projectId: string, role: 'OWNER' }]
  },
  timestamp: string
}
```

**Errors:**
| Status | Error Code | When |
|--------|-----------|------|
| 400 | `VALIDATION_FAILED` | Invalid key format, missing name |
| 409 | `PROJECT_KEY_EXISTS` | Project key already taken |

---

#### GET /api/projects
List projects the current user is a member of (paginated).

**Query Params:**
```
?page=1&limit=10
```

**Response (200):**
```typescript
{
  statusCode: 200,
  data: {
    data: [{
      id: string,
      name: string,
      key: string,
      description: string | null,
      createdAt: string,
      _count: { members: number }
    }],
    meta: { total, page, limit, totalPages }
  },
  timestamp: string
}
```

---

#### GET /api/projects/:projectId
Get project details. Requires project membership.

**Response (200):**
```typescript
{
  statusCode: 200,
  data: {
    id: string,
    name: string,
    key: string,
    description: string | null,
    createdAt: string,
    _count: { members: number, labels: number }
  },
  timestamp: string
}
```

**Errors:**
| Status | Error Code | When |
|--------|-----------|------|
| 403 | `PROJECT_ACCESS_DENIED` | Not a project member |
| 404 | `PROJECT_NOT_FOUND` | Project doesn't exist |

---

#### PATCH /api/projects/:projectId
Update project. **OWNER only.**

**Request:**
```typescript
{
  name?: string;          // 1-100 chars
  description?: string;   // 0-500 chars
}
```

**Errors:**
| Status | Error Code | When |
|--------|-----------|------|
| 403 | `PROJECT_ACCESS_DENIED` | Not OWNER |
| 404 | `PROJECT_NOT_FOUND` | Project doesn't exist |

---

#### DELETE /api/projects/:projectId
Delete project. **OWNER only.**

**Errors:**
| Status | Error Code | When |
|--------|-----------|------|
| 403 | `PROJECT_ACCESS_DENIED` | Not OWNER |
| 404 | `PROJECT_NOT_FOUND` | Project doesn't exist |

---

### 3.2 Members

#### POST /api/projects/:projectId/members
Add a member. **ADMIN+ only.** Only OWNER can assign ADMIN/OWNER roles.

**Request:**
```typescript
{
  userId: string;          // UUID of user to add, required
  role?: ProjectRole;      // default: 'MEMBER'
}
```

**Response (201):**
```typescript
{
  statusCode: 201,
  data: {
    userId: string,
    projectId: string,
    role: ProjectRole,
    joinedAt: string
  },
  timestamp: string
}
```

**Errors:**
| Status | Error Code | When |
|--------|-----------|------|
| 403 | `PROJECT_ACCESS_DENIED` | Insufficient role or non-OWNER assigning ADMIN/OWNER |
| 404 | `USER_NOT_FOUND` | Target user doesn't exist |
| 409 | `PROJECT_MEMBER_EXISTS` | User already a member |

---

#### GET /api/projects/:projectId/members
List project members (paginated).

**Query:** `?page=1&limit=10`

**Response (200):**
```typescript
{
  statusCode: 200,
  data: {
    data: [{
      userId: string,
      projectId: string,
      role: ProjectRole,
      joinedAt: string,
      user: {
        id: string,
        fullName: string,
        email: string,
        avatarUrl: string | null
      }
    }],
    meta: { total, page, limit, totalPages }
  },
  timestamp: string
}
```

---

#### PATCH /api/projects/:projectId/members/:userId
Update member role. **ADMIN+ only.** Only OWNER can assign ADMIN/OWNER.

**Request:**
```typescript
{
  role: ProjectRole;   // required
}
```

**Errors:**
| Status | Error Code | When |
|--------|-----------|------|
| 403 | `PROJECT_ACCESS_DENIED` | Insufficient role |
| 404 | `PROJECT_MEMBER_NOT_FOUND` | Member not found |
| 409 | `PROJECT_LAST_OWNER` | Cannot demote last OWNER |

---

#### DELETE /api/projects/:projectId/members/me
Leave the project.

**Errors:**
| Status | Error Code | When |
|--------|-----------|------|
| 409 | `PROJECT_LAST_OWNER` | Cannot leave as last OWNER |

---

#### DELETE /api/projects/:projectId/members/:userId
Remove a member. **ADMIN+ only.** Only OWNER can remove another OWNER.

**Errors:**
| Status | Error Code | When |
|--------|-----------|------|
| 403 | `PROJECT_ACCESS_DENIED` | Insufficient role |
| 404 | `PROJECT_MEMBER_NOT_FOUND` | Member not found |
| 409 | `PROJECT_LAST_OWNER` | Cannot remove last OWNER |

---

### 3.3 Labels

#### POST /api/projects/:projectId/labels
Create a label. **MEMBER+ only** (VIEWER cannot).

**Request:**
```typescript
{
  name: string;    // 1-50 chars, required
  color: string;   // hex format #RRGGBB, required (e.g., '#ff0000')
}
```

**Response (201):**
```typescript
{
  statusCode: 201,
  data: {
    id: string,
    name: string,
    color: string,
    projectId: string,
    createdAt: string
  },
  timestamp: string
}
```

**Errors:**
| Status | Error Code | When |
|--------|-----------|------|
| 409 | `PROJECT_LABEL_EXISTS` | Label name already exists in project |

---

#### GET /api/projects/:projectId/labels
List project labels (paginated).

**Query:** `?page=1&limit=10`

---

#### PATCH /api/projects/:projectId/labels/:labelId
Update a label. **MEMBER+ only.**

**Request:**
```typescript
{
  name?: string;   // 1-50 chars
  color?: string;  // hex #RRGGBB
}
```

**Errors:**
| Status | Error Code | When |
|--------|-----------|------|
| 404 | `PROJECT_LABEL_NOT_FOUND` | Label doesn't exist |
| 409 | `PROJECT_LABEL_EXISTS` | New name conflicts |

---

#### DELETE /api/projects/:projectId/labels/:labelId
Delete a label. **ADMIN+ only.**

**Errors:**
| Status | Error Code | When |
|--------|-----------|------|
| 404 | `PROJECT_LABEL_NOT_FOUND` | Label doesn't exist |

---

## 4. Frontend Integration Notes

- Project key is **immutable** after creation — cannot be changed via PATCH
- Project key format: uppercase letters + numbers, starts with letter (e.g., `TRK`, `PROJ1`)
- All `:projectId` params must be valid UUIDs
- Role hierarchy matters for UI: show/hide buttons based on user's project role
  - VIEWER: read-only access
  - MEMBER: can create/update labels, issues
  - ADMIN: can manage members, delete labels
  - OWNER: full control including project settings and deletion
- The `ProjectRoleGuard` returns 403 if user is not a member — handle this for deep-linked URLs
