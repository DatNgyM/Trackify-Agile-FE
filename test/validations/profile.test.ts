import { describe, it, expect } from "vitest";
import { updateProfileSchema } from "@/validations/profile";

describe("updateProfileSchema", () => {
  it("accepts valid profile", () => {
    const r = updateProfileSchema.safeParse({ fullName: "Nguyễn Văn A", email: "a@b.co" });
    expect(r.success).toBe(true);
  });

  it("rejects empty fullName", () => {
    const r = updateProfileSchema.safeParse({ fullName: "", email: "a@b.co" });
    expect(r.success).toBe(false);
  });

  it("rejects invalid email", () => {
    const r = updateProfileSchema.safeParse({ fullName: "A", email: "not-email" });
    expect(r.success).toBe(false);
  });
});
