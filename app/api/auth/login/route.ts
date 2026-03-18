import { NextRequest, NextResponse } from "next/server";

/** Mock login: trả JWT khi BE chưa có. Thay bằng gọi BE thật khi đã có. */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body ?? {};
    if (!email || !password) {
      return NextResponse.json(
        { message: "Thiếu email hoặc mật khẩu" },
        { status: 400 }
      );
    }
    // Mock: luôn trả token. Khi có BE thì gọi BE và trả token thật.
    const token = "mock-jwt-" + Date.now();
    return NextResponse.json({
      token,
      user: { id: "1", email, name: email.split("@")[0] },
    });
  } catch {
    return NextResponse.json({ message: "Lỗi server" }, { status: 500 });
  }
}
