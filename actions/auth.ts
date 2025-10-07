"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "../utils/supabase/server";
// import { redirect } from "next/dist/server/api-utils";
import { redirect } from "next/navigation";
import { headers } from "next/headers";


export async function SignUp(formData: FormData) {
  const supabase = await createClient();

  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const username = formData.get("username") as string;
  const role = formData.get("role") as string || "admin"; // default: admin

  // 🧠 Ensure only one super admin exists
  if (role === "super_admin") {
    const { data: existingSuperAdmin } = await supabase
      .from("auth.users")
      .select("*")
      .eq("raw_user_meta_data->>role", "super_admin");

    if (existingSuperAdmin && existingSuperAdmin.length > 0) {
      return { status: "Super admin already exists", user: null };
    }
  }

  // 🔐 Signup user in Supabase Auth
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { username, role },
    },
  });

  if (error) return { status: error.message, user: null };

  revalidatePath("/", "layout");
  return { status: "success", user: data.user };
}


export async function SignIn(formData: FormData) {
  const supabase = await createClient();

  const userData = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  const { data, error } = await supabase.auth.signInWithPassword({
    email: userData.email,
    password: userData.password,
  });

  if (error) {
    return { status: error.message, user: null };
  }

  // ✅ No need for extra user_profiles table now
  revalidatePath("/", "layout");
  return { status: "success", user: data.user };
}

export async function SignOut() {
  const supabase = await createClient();
  const { error } = await supabase.auth.signOut();
  if (error) redirect("/error");

  revalidatePath("/", "layout");
  redirect("/login");
}


export async function forgotPassword(formData: FormData) {
  const supabase = await createClient();
  const origin = (await headers()).get("origin");

  const { error } = await supabase.auth.resetPasswordForEmail(
    formData.get("email") as string,
    {
      redirectTo: `${origin}/reset-password`,
    }
  );
  if (error) {
    return { status: error?.message };
  }
  return { status: "success" };
}

export async function resetPassword(formData: FormData, code: string) {

  const supabase = await createClient();
  const { error: codeError } = await supabase.auth.exchangeCodeForSession(code);
  if (codeError) {
    return { status: codeError?.message };
  }
  const { error } = await supabase.auth.updateUser({
    password: formData.get("password") as string,
  });
  if (error) {
    return { status: error?.message };
  }
  return { status: "success" };
}
