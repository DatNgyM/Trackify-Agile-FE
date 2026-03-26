## **1.** `feature/fe-ui-buttons-inputs` đã xong **← Nên làm tiếp**

**Làm gì:** Tạo các component dùng lại trong `components/ui`:

- **Button** – nút (primary, secondary, outline, ghost…), dùng design tokens (primary, foreground, border).
- **Input** – ô nhập (text, email, password), có placeholder, error, disabled, dùng `border`, `ring`, `focus:ring-primary`.
- **Label** – nhãn cho form (gắn với input), typography từ theme.

**Mục đích:** Cả app dùng chung Button/Input/Label, giao diện và hành vi thống nhất.

---

## **2.** `feature/fe-ui-cards-modals` đã xong 

**Làm gì:** Component trong `components/ui`:

- **Card** – khối nội dung (title, body, footer), shadow/radius từ tokens, có thể có variant (default, muted).
- **Modal** – popup (overlay + content), đóng/mở, có thể dùng cho confirm, form.
- **Dropdown** – menu xổ xuống (trigger + list items), đóng khi click ngoài.

**Mục đích:** Thống nhất cách hiển thị card, popup và dropdown trên toàn app.

---

## **3.** `feature/fe-layout-header-sidebar` đã xong

**Làm gì:** Layout trong `components/layout`:

- **Header** – thanh trên (logo, nav, user menu…).
- **Sidebar** – cột trái (menu dashboard, project, task…).
- **Nav** – thành phần điều hướng (link, active state).

**Mục đích:** Tách layout dashboard thành component tái sử dụng, dễ chỉnh responsive và scroll.

---

## **4.** `feature/fe-design-tokens-tailwind` **✅ (đã xong)**

**Làm gì:** Màu, spacing, theme trong Tailwind (globals, config) – bạn đã làm xong.

---

## **5.** `feature/fe-framer-motion-animations` đang làm 

**Làm gì:** Animation dùng chung với Framer Motion:

- Chuyển trang (page transition).
- List (stagger, fade in).
- Modal (mở/đóng mượt).

**Mục đích:** Cả app dùng chung một bộ animation, không mỗi trang tự viết khác nhau.

---

## **Thứ tự gợi ý sau khi xong design tokens**

1. ✅ **feature/fe-design-tokens-tailwind** – đã xong
2. **feature/fe-ui-buttons-inputs** – làm tiếp (có Button/Input/Label rồi mới làm form, card, layout cho chuẩn).
3. **feature/fe-ui-cards-modals** – Card, Modal, Dropdown.
4. **feature/fe-layout-header-sidebar** – Header, Sidebar, Nav.
5. **feature/fe-framer-motion-animations** – animation.

**Tóm lại:** Nhánh tiếp theo nên làm là `feature/fe-ui-buttons-inputs` (Button, Input, Label trong `components/ui`).