# ĐẶC TẢ DỰ ÁN TRACKIFY-AGILE

## 1. Tổng quan

**Trackify-Agile** là ứng dụng web quản lý dự án theo mô hình Agile, hỗ trợ quản lý task, Kanban board, CI/CD và hồ sơ người dùng. Ứng dụng sử dụng **Next.js**, **TypeScript**, **Tailwind CSS**, **Framer Motion**, **Zod**, **Prisma**.

---

## 2. Các giao diện (màn hình)

### 2.1. Xác thực (Authentication)


| Trang         | Route    | Mô tả                                                                                                                     |
| ------------- | -------- | ------------------------------------------------------------------------------------------------------------------------- |
| **Đăng ký**   | `/`      | Form đăng ký: Họ và tên, Email, Mật khẩu, Xác nhận mật khẩu; đăng nhập bằng Email, Google, Facebook; link sang Đăng nhập. |
| **Đăng nhập** | `/login` | Form đăng nhập: Email, Mật khẩu; đăng nhập bằng Email, Google, Facebook; link sang Đăng ký.                               |


**Thiết kế:** Layout 50/50 (form bên trái, ảnh hero bên phải trên desktop), animation Framer Motion, design tokens (background, foreground, primary, muted).

**Validation (Zod):**

- Đăng nhập: `email` (email hợp lệ), `password` (bắt buộc).
- Đăng ký: `name` (bắt buộc), `email` (email hợp lệ), `password` (tối thiểu 6 ký tự).

---

### 2.2. Dashboard (sau khi đăng nhập)

**Layout chung:** Sidebar trái cố định (w-56), main content bên phải; sidebar có menu và link Logout.

**Menu điều hướng:**

- **Home** → `/dashboard`
- **Project** (có submenu):
  - Project list → `/dashboard/projects`
  - Project Board → `/dashboard/projects/board`
  - Project Settings → `/dashboard/projects/settings`
- **Task** (có submenu):
  - My Tasks List → `/dashboard/tasks`
  - Create New Tasks → `/dashboard/tasks/new`
  - Task Detail → `/dashboard/tasks/detail`
- **CI/CD** → `/dashboard/cicd`
- **User Profile** → `/dashboard/profile`
- **Logout** → `/login`

---

### 2.3. Home (`/dashboard`)

- **3 thẻ trên:** Biểu đồ cột (Bar chart placeholder), biểu đồ vùng (Area chart placeholder), chỉ số 55% (placeholder).
- **2 thẻ dưới:**
  - **Follow meeting:** Hiển thị ghi chú meeting đã lưu; nút "Thêm ghi chú" mở modal nhập ghi chú, có nút Hủy / Lưu.
  - **Ongoing project:** Placeholder cho danh sách dự án đang thực hiện.

**Thành phần UI:** Card, Modal, Button, Input, Label.

---

### 2.4. Project


| Trang                | Route                          | Mô tả                                                                                                                                                                                              |
| -------------------- | ------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Project list**     | `/dashboard/projects`          | Tiêu đề "Project list", mô tả ngắn, nút "Mở Project Board" dẫn tới board.                                                                                                                          |
| **Project Board**    | `/dashboard/projects/board`    | Kanban 3 cột: **To do**, **In process**, **Done**. Mỗi task card có: loại (Bug/Feature), tiêu đề, ngày, progress (✔ 0/1), avatar placeholder. Bug: badge đỏ; Feature: badge primary. Dữ liệu mock. |
| **Project Settings** | `/dashboard/projects/settings` | Tiêu đề "Project Settings", mô tả "Cấu hình dự án — nội dung sẽ bổ sung."                                                                                                                          |


**Validation (Project):**

- Tạo dự án: `name` (bắt buộc), `description` (tùy chọn).
- Cập nhật: các trường trên, tất cả optional (partial).

---

### 2.5. Task


| Trang                | Route                     | Mô tả                                                                                                                                                                                        |
| -------------------- | ------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **My Tasks List**    | `/dashboard/tasks`        | Badge "My task list"; ô tìm kiếm + nút search; bộ lọc All / To do / Done; nút "Thêm task mới"; bảng: Task Name (#id), Project, Priority, Deadline, Status. Dữ liệu mock (TSK-01, TSK-02, …). |
| **Create New Tasks** | `/dashboard/tasks/new`    | Tiêu đề "Create New Tasks", mô tả "Form tạo task mới — nội dung sẽ bổ sung."                                                                                                                 |
| **Task Detail**      | `/dashboard/tasks/detail` | Tiêu đề "Task Detail", mô tả "Chi tiết task — nội dung sẽ bổ sung."                                                                                                                          |


**Validation (Task):**

- Tạo task: `title` (bắt buộc), `description`, `projectId`, `status` (todo | in_progress | done) — optional.
- Cập nhật: partial của schema tạo.

---

### 2.6. CI/CD (`/dashboard/cicd`)

- **3 metric:** Total Builds (156), Success Rate (92%), Avg. Duration (2m 15s).
- **Bảng Recent Build Activities:** Cột Build/Commit, Branch, Duration, Time, Status.
- **Status:** Success (primary), Failed (destructive), In Progress (amber).
- Dữ liệu mock: Build #205 (Success), #204 (Failed), #206 (In Progress).

---

### 2.7. User Profile (`/dashboard/profile`)

- **Header:** Avatar (chữ "J"), tên "Jecica".
- **Contact information:** Email, SĐT, link GitHub (card riêng).
- **Overview Stats:** 3 ô: Tasks Done (45), Bugs Fixed (12), Hours Logged (120h).
- **Activity Chart:** Biểu đồ vùng kép (placeholder).
- **Settings:** 2 toggle: Email Notifications, Dark Mode (chỉ UI, chưa logic).

---

## 3. Thành phần UI dùng chung

- **Button:** variant (primary, secondary, outline), size (default, icon, sm).
- **Input, Label:** form controls.
- **Card:** CardHeader, CardTitle, CardContent, CardFooter; variant `muted`.
- **Modal:** `open`, `onOpenChange`, `title`, `footer` (actions).
- **Dropdown:** Dropdown, DropdownItem (export trong `components/ui`).

---

## 4. Công nghệ & cấu trúc

- **Framework:** Next.js (App Router).
- **Ngôn ngữ:** TypeScript.
- **Styling:** Tailwind CSS, design tokens (background, foreground, primary, muted, destructive, border, ring).
- **Animation:** Framer Motion (fade, stagger).
- **Validation:** Zod (auth, task, project).
- **Database:** Prisma (cấu hình trong `lib/db.ts`).
- **Auth:** Cấu trúc sẵn trong `lib/auth.ts` (NextAuth), chưa triển khai provider.

---

## 5. Các chức năng chưa triển khai / placeholder

- Đăng nhập/đăng ký thật (Email, Google, Facebook) và bảo vệ route.
- Lưu/đọc ghi chú meeting từ backend.
- Danh sách dự án thật và CRUD dự án.
- Kéo thả task trên Kanban và lưu trạng thái.
- Form tạo task và trang chi tiết task (nội dung đầy đủ).
- Project Settings (cấu hình dự án).
- Tích hợp CI/CD thật (build, webhook).
- Cập nhật profile và áp dụng Dark Mode / Email Notifications.

