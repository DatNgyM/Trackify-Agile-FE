import { io, type Socket } from "socket.io-client";

const socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL ?? "";

let socket: Socket | null = null;

/**
 * Kết nối tới Gateway BE5 (Socket.io).
 * Set NEXT_PUBLIC_SOCKET_URL trong .env (vd: http://localhost:4000).
 * Nếu không set thì không tạo kết nối.
 */
export function getSocket(): Socket | null {
  if (typeof window === "undefined") return null;
  if (!socketUrl) return null;
  if (socket?.connected) return socket;
  socket = io(socketUrl, {
    autoConnect: true,
    reconnection: true,
  });
  return socket;
}

/**
 * Hook-friendly: subscribe to Kanban updates (BE emit "kanban:update" với payload tasks/columns).
 */
export function subscribeKanban(callback: (data: unknown) => void): (() => void) | void {
  const s = getSocket();
  if (!s) return;
  s.on("kanban:update", callback);
  return () => {
    s.off("kanban:update", callback);
  };
}

/**
 * Subscribe to new comments (BE emit "comments:new" với payload comment).
 */
export function subscribeComments(taskId: string, callback: (data: unknown) => void): (() => void) | void {
  const s = getSocket();
  if (!s) return;
  const event = `comments:${taskId}`;
  s.on(event, callback);
  return () => {
    s.off(event, callback);
  };
}
