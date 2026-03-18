# Full FE – Tổng hợp nhánh + màn hình

Tài liệu tổng hợp toàn bộ công việc Full FE (6 nhánh) và các màn hình cần phục vụ. Đánh dấu phần đã hoàn thiện theo thực tế codebase.

---

## A. 6 nhánh FE (theo thứ tự làm)

| # | Nhánh | Nội dung | Hoàn thành |
|---|--------|----------|------------|
| 1 | `feature/fe-design-tokens-tailwind` | Màu, spacing, theme trong Tailwind (globals, config) | ✅ |
| 2 | `feature/fe-ui-buttons-inputs` | Button, Input, Label trong `components/ui` | ✅ |
| 3 | `feature/fe-ui-cards-modals` | Card, Modal, Dropdown trong `components/ui` | ✅ |
| 4 | `feature/fe-layout-header-sidebar` | Header, Sidebar, Nav trong `components/layout` | ✅ |
| 5 | `feature/fe-framer-motion-animations` | Animation chung (page, list, modal) với Framer Motion | ✅ |
| 6 | `feature/fe-ui-project-task-sub-views` | Form/modal project con + form/modal + list task con trong task detail (UI only) | ✅ |

**Chi tiết nhánh 6:**

| Hạng mục | Trạng thái | Ghi chú |
|----------|------------|--------|
| Modal tạo project con | ✅ | `CreateChildProjectModal` – dùng trên `app/dashboard/projects/page.tsx` |
| Component modal + form tạo subtask | ✅ | `CreateSubTaskModal` có sẵn trong `components/forms/` |
| Task detail: tích hợp modal + list task con | ✅ | Trang `app/dashboard/tasks/detail/page.tsx` đã gắn modal & list subtask |

---

## B. Các màn hình / view

### 1. Auth

| Màn hình | Route | Hoàn thành | Ghi chú |
|----------|--------|------------|--------|
| Login | `app/login/page.tsx` | ✅ | Có form, Framer Motion |
| Register | `app/register/page.tsx` | ❌ | Chưa có route/trang |

### 2. Dashboard chung

| Màn hình | Route | Hoàn thành | Ghi chú |
|----------|--------|------------|--------|
| Layout + Sidebar + Nav | `app/dashboard/layout.tsx` | ✅ | Header, Sidebar, Nav, Framer Motion |
| Trang dashboard chính | `app/dashboard/page.tsx` | ✅ | Overview |

### 3. Projects

| Màn hình | Route | Hoàn thành | Ghi chú |
|----------|--------|------------|--------|
| Danh sách projects | `app/dashboard/projects/page.tsx` | ✅ | List, Card, modal tạo project con |
| Tạo project | `app/dashboard/projects/new/page.tsx` | ✅ | Form |
| Board projects | `app/dashboard/projects/board/page.tsx` | ✅ | View board/card |
| Settings project | `app/dashboard/projects/settings/page.tsx` | ✅ | Trang settings |
| Sửa project | (modal hoặc `.../projects/[id]/edit`) | ❌ | Chưa có UI sửa (modal/page) |

### 4. Tasks

| Màn hình | Route | Hoàn thành | Ghi chú |
|----------|--------|------------|--------|
| Danh sách tasks | `app/dashboard/tasks/page.tsx` | ✅ | List, search, filter (All / To do / Done) |
| Tạo task | `app/dashboard/tasks/new/page.tsx` | ✅ | Form |
| Chi tiết task | `app/dashboard/tasks/detail/page.tsx` | ✅ | Có trang, đã gắn modal + list task con |
| Sửa task | (trong detail hoặc modal) | ❌ | Chưa có form sửa |
| Filter theo project | Trên list tasks | ❌ | Hiện chỉ filter All/To do/Done, chưa lọc theo project |
| Kanban tasks | (vd. `tasks/board`) | ❌ | Chưa có view Kanban kéo thả |

### 5. Profile & CI/CD

| Màn hình | Route | Hoàn thành | Ghi chú |
|----------|--------|------------|--------|
| Profile | `app/dashboard/profile/page.tsx` | ✅ | Xem/sửa thông tin user |
| CI/CD | `app/dashboard/cicd/page.tsx` | ✅ | Trang nội dung/link/trạng thái |

### 6. Ngoài dashboard

| Màn hình | Route | Hoàn thành | Ghi chú |
|----------|--------|------------|--------|
| Landing / Home | `app/page.tsx` | ✅ | Trang trước khi đăng nhập |

---

## C. Tóm tắt tiến độ

| Nhóm | Đã xong | Chưa / Một phần |
|------|---------|------------------|
| **6 nhánh FE** | 6 nhánh đủ (tokens, buttons-inputs, cards-modals, layout, framer-motion, project-task-sub-views) | Đã hoàn thành toàn bộ 6 nhánh |
| **Màn hình** | Login, Dashboard (layout + home), Projects (list, new, board, settings), Tasks (list, new, detail), Profile, CI/CD, Landing | Register; Sửa project; Sửa task; Filter task theo project; Kanban tasks |

---

## D. Việc còn lại (FE)

1. **Register:** Tạo trang `app/register/page.tsx` (form đăng ký, dùng UI có sẵn).
2. **Sửa project:** Thêm UI sửa (modal hoặc trang `projects/[id]/edit`).
3. **Sửa task:** Thêm form sửa trong detail hoặc modal.
4. **Filter task theo project:** Thêm bộ lọc theo project trên trang list tasks.
5. **Kanban tasks:** Thêm view/trang Kanban (kéo thả theo status).

Cập nhật lần cuối: theo codebase hiện tại (components, app routes, Framer Motion, design tokens).
