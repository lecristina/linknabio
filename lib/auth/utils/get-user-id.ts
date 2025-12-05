import { getToken } from "next-auth/jwt";
import { NextRequest } from "next/server";

export async function getUserIdFromRequest(request: NextRequest): Promise<string | null> {
  const isMockedAuth = process.env.NODE_ENV === "development" && process.env.NEXT_PUBLIC_MOCKED_AUTH === "true";

  if (isMockedAuth) {
    const mockSession = await import("@/lib/auth/mocks/session.dev.json");
    return mockSession.user.sub;
  }

  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  return token?.sub as string | null;
}

