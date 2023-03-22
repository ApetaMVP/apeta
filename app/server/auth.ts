import { json, redirect } from "@remix-run/node";
import bcrypt from "bcryptjs";
import {
  createUserSession,
  destroySession,
  getUserId,
  getUserSession,
} from "./cookie";
import { prisma } from "./prisma";

async function validateUser(request: Request) {
  const userId = await getUserId(request);
  if (typeof userId !== "string") {
    return null;
  }
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true },
    });
    return user ? true : false;
  } catch {
    throw logout(request);
  }
}

export async function requireAuth(request: Request) {
  const session = await getUserSession(request);
  const userId = session.get("userId");
  if (!userId || typeof userId !== "string") {
    throw redirect("/auth/login");
  }
  return { userId };
}

export async function login(email: string, password: string) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return json({ error: `Invalid username or password` }, { status: 401 });
  }
  return await createUserSession(user.id, "/home");
}

export async function register(
  email: string,
  password: string,
  name: string,
  username: string
) {
  try {
    const existingUser = await prisma.user.findFirst({
      where: { OR: [{ email }, { username }] },
    });
    if (existingUser) {
      return json(
        { error: `Email or username already in use` },
        { status: 406 }
      );
    }
    const user = await prisma.user.create({
      data: {
        email,
        password: await bcrypt.hash(password, 10),
        name,
        username,
      },
    });
    return await createUserSession(user.id, "/home");
  } catch (err) {
    return json(
      { error: `Error occurred creating user: ${err}` },
      { status: 500 }
    );
  }
}

export async function logout(request: Request) {
  const session = await getUserSession(request);
  return redirect("/auth/login", {
    headers: {
      "Set-Cookie": await destroySession(session),
    },
  });
}

export async function redirectAuthUser(request: Request) {
  return (await validateUser(request)) ? redirect("/home") : null;
}
