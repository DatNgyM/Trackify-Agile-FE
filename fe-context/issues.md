# Issues Module — Frontend Integration Context

> **Base Route:** `/api/projects/:projectId/issues`
> **Auth Required:** Yes — all endpoints require `Authorization: Bearer <accessToken>`
> **RBAC:** All endpoints require project membership via `ProjectRoleGuard`

---

## 1. Module Overview

Manages issues (tasks/bugs/stories) within projects. Provides CRUD, Kanban board view, drag-and-drop reorder, label assignment, and file attachments. Issues are identified by a human-readable key (e.g., `TRK-42`).

---

## 2. Data Contracts

### Issue
```typescript
interface Issue {
  id: string;               // UUID
  title: string;
  description: string | null;
  issueKey: string;          // e.g., 'TRK-42'
  issueNumber: number;
  status: IssueStatus;
  priority: Priority;
  type: IssueType;
  position: number;          // sort order within status column
  projectId: string;
  reporterId: string;        // user who created the issue
  assigneeId: string | null;
  sprintId: string | null;
  createdAt: string;
  updatedAt: string;
  assignee?: { id: string; fullName: string; email: string };
  reporter?: { id: string; fullName: string; email: string };
  labels?: IssueLabel[];
  attachments?: Attachment[];
  _count?: { comments: number; attachments: number };
}
```

### Attachment
```typescript
interface Attachment {
  id: string;           // UUID
  filename: string;
  url: string;          // relative path, e.g., '/uploads/issues/<uuid>.<ext>'
  mimeType: string;
  size: number;         // bytes
  issueId: string;
  uploaderId: string;
  createdAt: string;
  updatedAt: string;
  uploader?: { id: string; fullName: string };
}
```

### Kanban Board
```typescript
interface KanbanBoard {
  BACKLOG: Issue[];
  TODO: Issue[];
  IN_PROGRESS: Issue[];
  IN_REVIEW: Issue[];
  DONE: Issue[];
  CANCELLED: Issue[];
}
```

### Enums
```typescript
type IssueStatus = 'BACKLOG' | 'TODO' | 'IN_PROGRESS' | 'IN_REVIEW' | 'DONE' | 'CANCELLED';

type Priority = 'LOWEST' | 'LOW' | 'MEDIUM' | 'HIGH' | 'HIGHEST';

type IssueType = 'EPIC' | 'STORY' | 'TASK' | 'BUG' | 'SUBTASK';
```

---

## 3. REST API Endpoints

### 3.1 Issue CRUD

#### POST /api/projects/:projectId/issues
Create a new issue. Issue key is auto-generated (e.g., `TRK-1`, `TRK-2`).

**Request:**
```typescript
{
  title: string;              // 1-200 chars, required
  description?: string;       // max 5000 chars
  priority?: Priority;        // default determined by backend
  type?: IssueType;           // default determined by backend
  assigneeId?: string;        // UUID — must be a project member
  labelIds?: string[];        // array of label UUIDs
}
```

**Response (201):**
```typescript
{
  statusCode: 201,
  data: {
    id: string,
    title: string,
    issueKey: string,         // auto-generated, e.g., 'TRK-1'
    issueNumber: number,
    status: 'BACKLOG',        // default status
    priority: Priority,
    type: IssueType,
    position: number,
    projectId: string,
    reporterId: string,
    assigneeId: string | null,
    assignee?: { id, fullName, email },
    reporter: { id, fullName, email },
    labels: [],
    createdAt: string,
    updatedAt: string
  },
  timestamp: string
}
```

**Errors:**
| Status | Error Code | When |
|--------|-----------|------|
| 400 | `ISSUE_ASSIGNEE_NOT_PROJECT_MEMBER` | Assignee is not a member of the project |

---

#### GET /api/projects/:projectId/issues
List issues with filters (paginated).

**Query Params:**
```
?page=1&limit=20&status=TODO&priority=HIGH&type=BUG&assigneeId=<uuid>&search=login
```

All filter params are optional.

**Response (200):**
```typescript
{
  statusCode: 200,
  data: {
    data: Issue[],    // includes assignee, reporter, labels, _count
    meta: { total, page, limit, totalPages }
  },
  timestamp: string
}
```

---

#### GET /api/projects/:projectId/issues/board
Get Kanban board view — issues grouped by status, ordered by position.

**Query Params:**
```
?sprintId=<uuid>    // optional — filter by sprint
```

**Response (200):**
```typescript
{
  statusCode: 200,
  data: {
    BACKLOG: Issue[],
    TODO: Issue[],
    IN_PROGRESS: Issue[],
    IN_REVIEW: Issue[],
    DONE: Issue[],
    CANCELLED: Issue[]
  },
  timestamp: string
}
```

---

#### GET /api/projects/:projectId/issues/:issueKey
Get issue details by key (e.g., `TRK-42`).

**Response (200):**
```typescript
{
  statusCode: 200,
  data: {
    id: string,
    title: string,
    description: string | null,
    issueKey: string,
    status: IssueStatus,
    priority: Priority,
    type: IssueType,
    position: number,
    projectId: string,
    reporterId: string,
    assigneeId: string | null,
    assignee?: { id, fullName, email },
    reporter: { id, fullName, email },
    labels: [{ label: { id, name, color } }],
    attachments: [{ id, filename, url, mimeType, size, uploader: { id, fullName } }],
    _count: { comments: number },
    createdAt: string,
    updatedAt: string
  },
  timestamp: string
}
```

**Errors:**
| Status | Error Code | When |
|--------|-----------|------|
| 404 | `ISSUE_KEY_NOT_FOUND` | Issue with this key doesn't exist |

---

#### PATCH /api/projects/:projectId/issues/:issueKey
Update issue fields.

**Request:**
```typescript
{
  title?: string;             // 1-200 chars
  description?: string;       // max 5000 chars
  priority?: Priority;
  type?: IssueType;
  assigneeId?: string | null; // UUID or null to unassign
}
```

**Errors:**
| Status | Error Code | When |
|--------|-----------|------|
| 400 | `ISSUE_ASSIGNEE_NOT_PROJECT_MEMBER` | Invalid assignee |
| 404 | `ISSUE_KEY_NOT_FOUND` | Issue not found |

---

#### PATCH /api/projects/:projectId/issues/:issueKey/status
Update issue status (Kanban column move).

**Request:**
```typescript
{
  status: IssueStatus;   // required
}
```

**Errors:**
| Status | Error Code | When |
|--------|-----------|------|
| 404 | `ISSUE_KEY_NOT_FOUND` | Issue not found |

---

#### PATCH /api/projects/:projectId/issues/:issueKey/reorder
Reorder issue (drag-and-drop within or across columns).

**Request:**
```typescript
{
  status: IssueStatus;   // target column, required
  position: number;      // target position (0-based index), required
}
```

**Errors:**
| Status | Error Code | When |
|--------|-----------|------|
| 404 | `ISSUE_KEY_NOT_FOUND` | Issue not found |

---

#### DELETE /api/projects/:projectId/issues/:issueKey
Delete an issue. **ADMIN/OWNER only.**

**Response:** 204 No Content

**Errors:**
| Status | Error Code | When |
|--------|-----------|------|
| 403 | `PROJECT_ACCESS_DENIED` | Not ADMIN/OWNER |
| 404 | `ISSUE_KEY_NOT_FOUND` | Issue not found |

---

### 3.2 Issue Labels

#### POST /api/projects/:projectId/issues/:issueKey/labels/:labelId
Add a label to an issue.

**Response:** 204 No Content

**Errors:**
| Status | Error Code | When |
|--------|-----------|------|
| 404 | `ISSUE_LABEL_NOT_FOUND` | Issue or label not found |

---

#### DELETE /api/projects/:projectId/issues/:issueKey/labels/:labelId
Remove a label from an issue.

**Response:** 204 No Content

**Errors:**
| Status | Error Code | When |
|--------|-----------|------|
| 404 | `ISSUE_LABEL_NOT_FOUND` | Label not found on issue |

---

### 3.3 Attachments

#### POST /api/projects/:projectId/issues/:issueKey/attachments
Upload a file attachment. Uses `multipart/form-data`.

**Request:**
```
Content-Type: multipart/form-data

Field: file (binary)
Allowed MIME types: image/jpeg, image/png, image/webp, application/pdf, text/plain
Max size: 5MB
```

**Response (201):**
```typescript
{
  statusCode: 201,
  data: {
    id: string,
    filename: string,
    url: string,
    mimeType: string,
    size: number,
    issueId: string,
    uploaderId: string,
    createdAt: string
  },
  timestamp: string
}
```

**Errors:**
| Status | Error Code | When |
|--------|-----------|------|
| 400 | `FILE_TYPE_NOT_ALLOWED` | Invalid MIME type |
| 400 | `FILE_TOO_LARGE` | Exceeds 5MB |
| 404 | `ISSUE_KEY_NOT_FOUND` | Issue not found |

---

#### GET /api/projects/:projectId/issues/:issueKey/attachments
List attachments for an issue.

**Response (200):**
```typescript
{
  statusCode: 200,
  data: [{
    id: string,
    filename: string,
    url: string,
    mimeType: string,
    size: number,
    uploaderId: string,
    uploader: { id: string, fullName: string },
    createdAt: string
  }],
  timestamp: string
}
```

---

#### DELETE /api/projects/:projectId/issues/:issueKey/attachments/:attachmentId
Delete an attachment. Only the uploader or ADMIN/OWNER can delete.

**Response:** 204 No Content

**Errors:**
| Status | Error Code | When |
|--------|-----------|------|
| 403 | `ATTACHMENT_DELETE_FORBIDDEN` | Not uploader and not ADMIN/OWNER |
| 404 | `ATTACHMENT_NOT_FOUND` | Attachment doesn't exist |

---

## 4. Frontend Integration Notes

- Issue keys (e.g., `TRK-42`) are used in URLs, not UUIDs — use `:issueKey` in routes
- Kanban board: call `GET .../issues/board` to get pre-grouped data, or `GET .../issues` for flat list
- Drag-and-drop: call `PATCH .../issues/:issueKey/reorder` with target `status` + `position`
- Status change (quick move): call `PATCH .../issues/:issueKey/status` with just the new status
- Label assignment is separate from issue create/update — use the label endpoints
- `assigneeId: null` in update DTO means "unassign" — important for the assignee dropdown
- Attachment URLs are relative — prepend API base URL
- Use `FormData` with field name `file` for attachment uploads
