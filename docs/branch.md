# Chiến lược nhánh

## Khi làm gọn lại (Nếu đươc yêu cầu làm ít nhánh lại)

- **Cách 1:** Không tách 21 nhánh, gộp công việc vào ít nhánh hơn từ đầu (ví dụ 7 nhánh như bảng dưới).
- **Cách 2:** Đang có 21 nhánh rồi thì merge các nhánh nhỏ vào một nhánh “gộp” (ví dụ merge `feature/projects-list-create`, `feature/projects-edit-delete-settings`, `feature/projects-board-view` vào `feature/projects`), rồi chỉ merge nhánh gộp đó vào `develop`.

Chi tiết 21 nhánh xem [21.md](./21.md).

---

## Bảng 7 nhánh gộp (khi GV yêu cầu gom bớt)

| Nhánh gộp | Gồm các nhánh nhỏ |
|-----------|-------------------|
| `feature/fe-ui-and-layout` | fe-ui-buttons-inputs, fe-ui-cards-modals, fe-layout-header-sidebar, fe-design-tokens-tailwind, fe-framer-motion-animations |
| `feature/auth` | auth-nextauth-config, auth-login-register-pages, auth-session-protected-routes |
| `feature/projects` | projects-list-create, projects-edit-delete-settings, projects-board-view |
| `feature/tasks` | tasks-list-create, tasks-edit-detail, tasks-board-kanban, tasks-filter-by-project |
| `feature/dashboard-profile` | dashboard-layout-nav, dashboard-profile-page |
| `feature/cicd-docs` | cicd-page, docker-compose-scripts, docs-readme-setup |
| `feature/db-and-shared` | db-prisma-schema-migrations, db-seed-types, shared-submodule-validations |
