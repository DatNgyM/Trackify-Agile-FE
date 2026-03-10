# Cấu trúc thư mục (Trackify-Agile)

| Thư mục / File | Mục đích |
|----------------|----------|
| `app/` | Next.js App Router: routes, layout, page (FE) |
| `components/ui/` | Component UI cơ bản (button, input, modal...) |
| `components/forms/` | Form components dùng với Zod |
| `components/layout/` | Header, Sidebar, Footer... |
| `lib/` | DB client (Prisma), Auth config (NextAuth), utils |
| `actions/` | Server Actions (BE logic) |
| `validations/` | Zod schemas (auth, project, task...) |
| `types/` | TypeScript types dùng chung |
| `modules/` | **Git submodule** – shared logic (thêm sau: `git submodule add <url> modules/shared`) |
| `prisma/` | Schema, migrations, seed |
| `docker/` | Docker Compose (PostgreSQL) |
| `.env.example` | Mẫu biến môi trường (copy thành `.env.local`) |

## Chuẩn bị push lên Git

1. Copy `.env.example` → `.env.local` (và điền giá trị thật; file `.env.local` đã được gitignore).
2. Chạy `npm install` rồi `npm run db:generate` (sinh Prisma client).
3. Khởi tạo repo và push:
   ```bash
   git init
   git add .
   git commit -m "chore: setup folder structure, Prisma, Docker, validations"
   git remote add origin <url-repo>
   git push -u origin main
   ```
4. Khi có repo shared, thêm submodule: `git submodule add <url-shared> modules/shared`.
