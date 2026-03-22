import { describe, it, expect } from "vitest";
import { loginSchema, registerSchema } from "@/validations/auth";

describe("loginSchema", () => {
  it("hợp lệ", () => {
    const r = loginSchema.safeParse({ email: "a@b.co", password: "x" });
    expect(r.success).toBe(true);
  });

  it("email sai", () => {
    const r = loginSchema.safeParse({ email: "bad", password: "x" });
    expect(r.success).toBe(false);
  });
});

describe("registerSchema (khớp BE: fullName + password phức tạp)", () => {
  it("hợp lệ", () => {
    const r = registerSchema.safeParse({
      fullName: "Nguyen Van A",
      email: "a@b.co",
      password: "Abcd1234!",
    });
    expect(r.success).toBe(true);
  });

  it("từ chối mật khẩu yếu (ngắn / thiếu ký tự đặc biệt)", () => {
    expect(registerSchema.safeParse({ fullName: "A", email: "a@b.co", password: "short" }).success).toBe(
      false
    );
    expect(
      registerSchema.safeParse({ fullName: "A", email: "a@b.co", password: "abcdefgh" }).success
    ).toBe(false);
  });

  it("fullName rỗng", () => {
    const r = registerSchema.safeParse({
      fullName: "",
      email: "a@b.co",
      password: "Abcd1234!",
    });
    expect(r.success).toBe(false);
  });
});
