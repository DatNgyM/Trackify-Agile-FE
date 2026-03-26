# Áp dụng design tokens lên nhánh `feature/fe-design-tokens-tailwind`

Code design tokens hiện đang nằm trên nhánh `feature/fe-ui-buttons-inputs`. Để nhánh `feature/fe-design-tokens-tailwind` cũng có tokens (đúng theo kế hoạch), làm như sau:

## Cách 1: Copy thủ công (nhanh)

1. Checkout nhánh design tokens:
   ```bash
   git checkout feature/fe-design-tokens-tailwind
   ```

2. Thay nội dung hai file bằng nội dung trong thư mục `docs/design-tokens-files/`:
   - `app/globals.css` ← copy từ `docs/design-tokens-files/globals.css`
   - `tailwind.config.ts` ← copy từ `docs/design-tokens-files/tailwind.config.ts`

3. Commit:
   ```bash
   git add app/globals.css tailwind.config.ts
   git commit -m "feat: add design tokens (CSS variables + Tailwind theme)"
   ```

4. Quay lại nhánh buttons-inputs (nếu đang làm tiếp):
   ```bash
   git checkout feature/fe-ui-buttons-inputs
   ```

---

## Cách 2: Cherry-pick hoặc merge (nếu đã commit tokens trên nhánh kia)

Nếu bạn đã commit riêng phần tokens trên `feature/fe-ui-buttons-inputs`:

- **Cherry-pick:** checkout `feature/fe-design-tokens-tailwind`, rồi `git cherry-pick <commit-hash>` (hash của commit chỉ có tokens).
- **Merge:** merge `feature/fe-design-tokens-tailwind` vào `feature/fe-ui-buttons-inputs` trước, sau đó trên nhánh design-tokens bạn có thể tạo commit có nội dung giống (copy từ nhánh kia) rồi push.

---

## Sau khi xong

- **feature/fe-design-tokens-tailwind**: chỉ có design tokens (globals.css + tailwind.config).
- **feature/fe-ui-buttons-inputs**: có tokens + Button/Input/Label (giữ nguyên như hiện tại, hoặc rebase/merge lên design-tokens để tránh trùng code).

Merge vào `develop` nên làm theo thứ tự: merge `feature/fe-design-tokens-tailwind` trước, rồi mới merge `feature/fe-ui-buttons-inputs`.
