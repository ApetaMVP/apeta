import { json, redirect } from "@remix-run/node";
import bcrypt from "bcryptjs";
import {
  createUserSession,
  destroySession,
  getUserId,
  getUserSession,
} from "./cookie.server";
import { prisma } from "./prisma.server";
import { createUser } from "./user.server";

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
  const userId = await getUserId(request);
  return { userId };
}

export async function login(email: string, password: string) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return json({ error: `Invalid username or password` }, { status: 401 });
  }
  return await createUserSession(user.id, "/site");
}

export async function register(
  email: string,
  password: string,
  name: string,
  username: string,
) {
  try {
    const existingUser = await prisma.user.findFirst({
      where: { OR: [{ email }, { username }] },
    });
    if (existingUser) {
      return json(
        { error: `Email or username already in use` },
        { status: 406 },
      );
    }
    const user = await createUser(email, password, name, username);
    return await createUserSession(user.id, "/site");
  } catch (err) {
    return json(
      { error: `Error occurred creating user: ${err}` },
      { status: 500 },
    );
  }
}

export async function logout(request: Request) {
  try {

    const session = await getUserSession(request);
    return redirect("/auth/login", {
      headers: {
        "Set-Cookie": await destroySession(session),
      },
    });
  } catch(err: any) {
    return json(
      {error: `Error occurred signing out: ${err}` },
      { status: err["status"]}
    )
  }
}

export async function redirectAuthUser(request: Request) {
  return (await validateUser(request)) ? redirect("/site") : null;
}
