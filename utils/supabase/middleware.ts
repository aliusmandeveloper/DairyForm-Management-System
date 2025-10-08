import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // ✅ Get the logged-in user
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const pathname = request.nextUrl.pathname;

  // 🛑 Redirect non-logged users to login
  if (
    !user &&
    !pathname.includes("/login") &&
    !pathname.includes("/register") &&
    !pathname.includes("/forgot-password") &&
    !pathname.includes("/reset-password") &&
    !pathname.startsWith("/auth") &&
    !pathname.includes("/error")
  ) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  // 🧠 Role-based protection
  const role = user?.user_metadata?.role;

  // If normal admin tries to access superadmin routes → redirect
  if (pathname.startsWith("/admin/manage-admins") && role !== "superadmin") {
    const url = request.nextUrl.clone();
    url.pathname = "/admin/dashboard/list";
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}
