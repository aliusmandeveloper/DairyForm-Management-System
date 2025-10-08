import { createClient } from "../../utils/supabase/server";
import Link from "next/link";
import React from "react";
import Logout from "./Logout";

const Navbar = async () => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <nav className="absolute top-0 left-0 w-full z-50 bg-white border-b" >
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-3">
        {/* Logo / Title */}
        <Link href="/" className="text-lg font-semibold text-gray-800 hover:text-blue-600">
          Dairy Farm
        </Link>

        {/* Right side */}
        <div className="flex items-center gap-4">
          {!user ? (
            <Link href="/login">
              <button className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-2 rounded-md transition">
                Login
              </button>
            </Link>
          ) : (
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-700">{user.email}</span>
              <Logout />
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
