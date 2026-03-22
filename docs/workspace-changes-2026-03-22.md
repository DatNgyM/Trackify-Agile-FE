# Ghi chú thay đổi workspace — 2026-03-22

Tài liệu này mô tả các thay đổi đáng chú ý **trong repo frontend** `Trackify-Agile` (Next.js), đồng bộ tên file với backend và infrastructure để dễ tra cứu.

## Ngữ cảnh

- **Mục tiêu:** hợp nhất UI ở root, gỡ bỏ bản copy lồng `trackify-agile-frontend-dev/`, chỉnh dashboard và tích hợp với backend NestJS.

## Git workflow — nhánh theo chức năng (repo này)

| Repo | Nhánh đề xuất | Ý nghĩa ngắn |
|------|----------------|---------------|
| **Trackify-Agile** | `feature/fe-nest-backend-integration` | Tích hợp giao diện Next.js với API Nest, dashboard / auth / projects. |

Tạo nhánh (nếu chưa có): `git checkout -b feature/fe-nest-backend-integration` (từ nhánh base team quy định, ví dụ `develop` hoặc `main`).

## Thay đổi đã theo dõi (modified)

| Khu vực | Nội dung |
|--------|-----------|
| `app/` | `layout.tsx`, `globals.css`, `login/`, `register/`, toàn bộ `dashboard/` (layout, notifications, profile, projects, board, issues, settings, tasks). |
| `components/layout/` | `Header.tsx`, `Nav.tsx`, `Sidebar.tsx` — điều hướng và khung dashboard. |
| `components/forms/` | `CreateSubTaskModal.tsx` — chỉnh nhẹ. |
| `components/ui/` | `Card`, `Input`, `Label`, `Modal`, `index.ts` — đồng bộ style/component. |
| `tailwind.config.ts` | Cập nhật theme / token. |
| `validations/auth.ts` | Bổ sung / chỉnh validation. |

## Xóa khỏi repo (deleted)

- Toàn bộ thư mục **`trackify-agile-frontend-dev/`** (project Next cũ lồng bên trong): app, features, shared, config, v.v.

## File mới (untracked — cần `git add` nếu muốn commit)

- `components/auth/auth-page-icons.tsx`
- `components/theme/ThemeHydration.tsx`
- `components/ui/`: `avatar`, `badge`, `dialog`, `dropdown-menu`, `popover`, `scroll-area`, `select`, `separator`, `sheet`, `sidebar`, `skeleton`, `switch`, `table`, `tabs`, `textarea`, `tooltip`
- `hooks/use-mobile.ts`
- `lib/theme-preferences.ts`

## Gợi ý commit

1. Add các file untracked cần dùng lâu dài.
2. Không commit secrets; kiểm tra `.env*` đã được ignore.

## Liên kết repo khác

- Backend: `trackify-agile-backend/docs/workspace-changes-2026-03-22.md`
- Infrastructure: `trackify-agile-infrastructure/docs/workspace-changes-2026-03-22.md`
