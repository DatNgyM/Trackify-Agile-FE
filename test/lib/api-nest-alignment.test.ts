import { describe, it, expect } from "vitest";
import { AxiosError } from "axios";
import {
  unwrapApiData,
  getApiErrorMessage,
  parseLoginPayload,
} from "@/lib/api";
import type { AuthUser } from "@/lib/types/api";

describe("unwrapApiData (Nest TransformInterceptor)", () => {
  it("lấy data từ envelope { statusCode, data, timestamp }", () => {
    const body = {
      statusCode: 200,
      data: { accessToken: "a", refreshToken: "b" },
      timestamp: "2026-01-01T00:00:00.000Z",
    };
    expect(unwrapApiData(body)).toEqual({
      accessToken: "a",
      refreshToken: "b",
    });
  });

  it("register trả user trong data", () => {
    const user: AuthUser = {
      id: "uuid",
      email: "u@x.com",
      fullName: "A",
      role: "USER",
      createdAt: "t1",
      updatedAt: "t2",
    };
    const body = { statusCode: 201, data: user, timestamp: "t" };
    expect(unwrapApiData<AuthUser>(body)).toEqual(user);
  });

  it("body không phải envelope thì trả nguyên (mock Next)", () => {
    const raw = { token: "mock" };
    expect(unwrapApiData(raw)).toEqual(raw);
  });
});

describe("parseLoginPayload", () => {
  it("Nest login: envelope + accessToken + refreshToken", () => {
    const body = {
      statusCode: 200,
      data: { accessToken: "acc", refreshToken: "ref" },
      timestamp: "t",
    };
    expect(parseLoginPayload(body)).toEqual({
      accessToken: "acc",
      refreshToken: "ref",
    });
  });

  it("mock Next: { token } phẳng", () => {
    expect(parseLoginPayload({ token: "legacy" })).toEqual({
      accessToken: "legacy",
      refreshToken: "",
    });
  });

  it("không hợp lệ thì throw", () => {
    expect(() => parseLoginPayload({ statusCode: 200, data: {}, timestamp: "" })).toThrow(
      "Invalid login response"
    );
  });
});

function axiosErrWithData(data: unknown): AxiosError {
  const err = new AxiosError("fail");
  err.response = {
    status: 401,
    statusText: "Unauthorized",
    data,
    headers: {},
    config: {} as AxiosError["config"],
  };
  return err;
}

describe("getApiErrorMessage (Nest HttpExceptionFilter shape)", () => {
  it("message string", () => {
    const err = axiosErrWithData({
      statusCode: 401,
      message: "AUTH_INVALID_CREDENTIALS",
      timestamp: "t",
      path: "/api/auth/login",
    });
    expect(getApiErrorMessage(err)).toBe("AUTH_INVALID_CREDENTIALS");
  });

  it("message array (validation)", () => {
    const err = axiosErrWithData({ message: ["a", "b"] });
    expect(getApiErrorMessage(err)).toBe("a, b");
  });

  it("không phải AxiosError → fallback", () => {
    expect(getApiErrorMessage(new Error("x"), "mặc định")).toBe("mặc định");
  });
});
