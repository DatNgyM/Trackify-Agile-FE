import { NextRequest, NextResponse } from "next/server";

/** Mock register: trả JWT khi BE chưa có. Thay bằng gọi BE thật khi đã có. */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, password } = body ?? {};
    if (!name || !email || !password) {
      return NextResponse.json(
        { message: "Thiếu tên, email hoặc mật khẩu" },
        { status: 400 }
      );
    }
    if (password.length < 6) {
      return NextResponse.json(
        { message: "Mật khẩu tối thiểu 6 ký tự" },
        { status: 400 }
      );
    }
    const token = "mock-jwt-" + Date.now();
    return NextResponse.json({
      token,
      user: { id: "1", email, name },
    });
  } catch {
    return NextResponse.json({ message: "Lỗi server" }, { status: 500 });
  }
}
