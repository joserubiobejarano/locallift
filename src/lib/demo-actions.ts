"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function createDemoSession() {
  const cookieStore = await cookies();
  
  // Set demo cookie that expires in 24 hours
  cookieStore.set("ll_demo", "true", {
    httpOnly: false,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24, // 24 hours
    path: "/",
  });

  redirect("/dashboard?demo=1");
}
