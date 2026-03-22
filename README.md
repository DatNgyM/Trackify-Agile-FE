# CC PT PM - Trang đăng nhập / đăng ký

Giao diện làm theo mẫu: form bên trái, hình laptop bên phải.

## Công nghệ

- **Next.js 14** (App Router)
- **React 18** + **TypeScript**
- **Tailwind CSS**
- **Framer Motion**

## Cấu trúc thư mục

Xem [docs/STRUCTURE.md](docs/STRUCTURE.md) để biết cách tổ chức `app/`, `components/`, `lib/`, `actions/`, `validations/`, `prisma/`, `docker/` và Git submodule (`modules/`).

## Chạy dự án

```bash
npm install
cp .env.example .env.local   # rồi sửa DATABASE_URL nếu dùng DB
npm run docker:up             # PostgreSQL tùy chọn (:5432) — không chạy cùng lúc postgres-app infra nếu cùng cổng
npm run db:generate           # sinh Prisma client
npm run dev              # Next mặc định (port 3000)
# hoặc
npm run start:dev        # port 3001 — Next :3000; Nest backend mặc định :4000
```

Mở [http://localhost:3000](http://localhost:3000) (hoặc [http://localhost:3001](http://localhost:3001) nếu dùng `npm run start:dev`).

## Hình ảnh bên phải

Để hiển thị hình laptop bên phải, đặt ảnh của bạn vào:

- **`public/hero-image.png`**

Hoặc nếu bạn dùng đúng tên file ảnh đã lưu trong workspace, đổi tên/copy file đó thành `public/hero-image.png`. Nếu chưa có file, khu vực bên phải vẫn hiển thị nền tối.
