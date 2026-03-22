# Notifications Module — Frontend Integration Context

> **REST Base Route:** `/api/notifications`
> **WebSocket:** Socket.io on the same server
> **Auth Required:** Yes — REST requires Bearer JWT, WebSocket requires JWT in handshake

---

## 1. Module Overview

Handles real-time notifications and WebSocket events. The module has two parts:
1. **REST API** — list, mark-read, unread count (for notification center UI)
2. **WebSocket Gateway** — real-time push for notifications, board updates, and comments

The backend uses event-driven architecture — when other modules emit events (e.g., issue assigned), the notifications listener creates a DB record AND pushes a real-time WebSocket event.

---

## 2. Data Contracts

### Notification
```typescript
interface Notification {
  id: string;                  // UUID
  type: NotificationType;
  title: string;
  message: string;
  isRead: boolean;
  userId: string;              // recipient
  data: any | null;            // event-specific payload
  createdAt: string;           // ISO 8601
  updatedAt: string;
}
```

### Enums
```typescript
type NotificationType =
  | 'ISSUE_ASSIGNED'
  | 'ISSUE_STATUS_CHANGED'
  | 'COMMENT_ADDED'
  | 'MENTIONED'
  | 'SPRINT_STARTED'
  | 'SPRINT_COMPLETED'
  | 'MEMBER_INVITED';
```

---

## 3. REST API Endpoints

### GET /api/notifications
List notifications for the current user (paginated, newest first).

**Query Params:**
```
?page=1&limit=20
```

**Response (200):**
```typescript
{
  statusCode: 200,
  data: {
    data: [{
      id: string,
      type: NotificationType,
      title: string,
      message: string,
      isRead: boolean,
      userId: string,
      data: any | null,
      createdAt: string
    }],
    meta: {
      total: number,
      page: number,
      limit: number,
      totalPages: number
    }
  },
  timestamp: string
}
```

**Errors:**
| Status | Error Code | When |
|--------|-----------|------|
| 401 | `AUTH_UNAUTHORIZED` | Missing or invalid token |

---

### GET /api/notifications/unread-count
Get the number of unread notifications for the current user.

**Response (200):**
```typescript
{
  statusCode: 200,
  data: 3,           // number
  timestamp: string
}
```

---

### PATCH /api/notifications/:id/read
Mark a single notification as read.

**Response (200):**
```typescript
{
  statusCode: 200,
  data: {
    id: string,
    type: NotificationType,
    title: string,
    message: string,
    isRead: true,      // now true
    userId: string,
    createdAt: string
  },
  timestamp: string
}
```

**Errors:**
| Status | Error Code | When |
|--------|-----------|------|
| 404 | `NOTIFICATION_NOT_FOUND` | Notification doesn't exist or belongs to another user |

---

### PATCH /api/notifications/read-all
Mark all notifications as read for the current user.

**Response (200):**
```typescript
{
  statusCode: 200,
  data: {
    count: 5          // number of notifications marked as read
  },
  timestamp: string
}
```

---

## 4. WebSocket Events

### 4.1 Connection Setup

**Library:** Socket.io (use `socket.io-client` on frontend)

**Authentication:** Pass JWT token in the handshake:
```typescript
import { io } from 'socket.io-client';

const socket = io('http://localhost:3000', {
  auth: {
    token: accessToken,   // JWT access token (no 'Bearer' prefix)
  },
});
```

On successful connection, the server automatically joins the client to room `user:<userId>`.
On invalid/expired JWT, the server disconnects the client immediately.

---

### 4.2 Rooms (Client → Server)

The client must explicitly join project/issue rooms to receive scoped events.

#### Join a project room (for Kanban board updates)
```typescript
socket.emit('joinProject', { projectId: '<uuid>' });
// Joins room: project:<projectId>
```

#### Leave a project room
```typescript
socket.emit('leaveProject', { projectId: '<uuid>' });
```

#### Join an issue room (for live comments)
```typescript
socket.emit('joinIssue', { issueKey: 'TRK-42' });
// Joins room: issue:TRK-42
```

---

### 4.3 Events (Server → Client)

#### `notification:new` — Personal notification
**Room:** `user:<userId>` (auto-joined on connect)
**When:** Issue assigned to you, mentioned, invited to project, sprint started/completed

```typescript
socket.on('notification:new', (payload) => {
  // payload: Notification object
  // {
  //   id: string,
  //   type: 'ISSUE_ASSIGNED' | 'MENTIONED' | 'MEMBER_INVITED' | ...,
  //   title: string,
  //   message: string,
  //   userId: string,
  //   data: { projectId, issueKey, ... },
  //   createdAt: string
  // }
});
```

#### `board:update` — Kanban board change
**Room:** `project:<projectId>` (must join via `joinProject`)
**When:** Issue status changed (moved between columns)

```typescript
socket.on('board:update', (payload) => {
  // payload:
  // {
  //   issueKey: string,     // e.g., 'TRK-42'
  //   oldStatus: IssueStatus,
  //   newStatus: IssueStatus
  // }
});
```

#### `comment:new` — New comment on an issue
**Room:** `issue:<issueKey>` (must join via `joinIssue`)
**When:** Someone adds a comment to the issue

```typescript
socket.on('comment:new', (payload) => {
  // payload:
  // {
  //   id: string,          // comment ID
  //   content: string,
  //   authorId: string
  // }
});
```

---

## 5. Frontend Integration Notes

### Notification Center
- Poll `GET /api/notifications/unread-count` on page load, or use the WebSocket `notification:new` event to increment a counter in real-time
- Show a notification bell with unread count badge
- Notification dropdown: call `GET /api/notifications?page=1&limit=10`
- "Mark all as read" button: call `PATCH /api/notifications/read-all`
- Individual click: call `PATCH /api/notifications/:id/read`

### Kanban Board (Real-time)
- On mounting the board page:
  1. Fetch board data: `GET /api/projects/:projectId/issues/board`
  2. Join the project room: `socket.emit('joinProject', { projectId })`
- Listen for `board:update` events to update the board without refetching
- On leaving the board page: `socket.emit('leaveProject', { projectId })`

### Issue Detail Page (Live Comments)
- On mounting the issue detail page:
  1. Join the issue room: `socket.emit('joinIssue', { issueKey })`
- Listen for `comment:new` events to append new comments in real-time

### Socket.io Reconnection
- `socket.io-client` handles reconnection automatically
- On reconnect, re-emit `joinProject` / `joinIssue` to rejoin rooms
- Handle `disconnect` event to show "connection lost" UI

### Notification Type → UI Mapping
| Type | Icon/Color | Action on Click |
|------|-----------|-----------------|
| `ISSUE_ASSIGNED` | Assignment icon | Navigate to issue detail |
| `ISSUE_STATUS_CHANGED` | Status icon | Navigate to board |
| `COMMENT_ADDED` | Comment icon | Navigate to issue detail |
| `MENTIONED` | @ mention icon | Navigate to issue detail |
| `SPRINT_STARTED` | Sprint icon | Navigate to sprint board |
| `SPRINT_COMPLETED` | Checkmark icon | Navigate to sprint board |
| `MEMBER_INVITED` | Team icon | Navigate to project |

### Socket.io Client Setup Example
```typescript
import { io, Socket } from 'socket.io-client';

let socket: Socket;

export function connectSocket(accessToken: string) {
  socket = io(process.env.NEXT_PUBLIC_API_URL, {
    auth: { token: accessToken },
    transports: ['websocket'],
  });

  socket.on('connect', () => {
    console.log('Connected to WebSocket');
  });

  socket.on('disconnect', () => {
    console.log('Disconnected from WebSocket');
  });

  socket.on('notification:new', (notification) => {
    // Update notification store/state
  });

  return socket;
}

export function joinProject(projectId: string) {
  socket?.emit('joinProject', { projectId });
}

export function leaveProject(projectId: string) {
  socket?.emit('leaveProject', { projectId });
}

export function joinIssue(issueKey: string) {
  socket?.emit('joinIssue', { issueKey });
}
```
