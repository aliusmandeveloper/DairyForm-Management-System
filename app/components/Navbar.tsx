import { createClient } from "../../utils/supabase/server";
import Link from "next/link";
import React from "react";
import Logout from "./Logout";
import { FaCrow, FaUserCircle } from "react-icons/fa";

const Navbar = async () => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-gradient-to-r from-blue-600 to-blue-700 shadow-lg border-b border-blue-500">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
        {/* Logo / Title */}
        <Link 
          href="/" 
          className="flex items-center gap-3 text-white hover:scale-105 transition-transform duration-200"
        >
          <div className="p-2 bg-white rounded-xl shadow-lg">
            <FaCrow className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight">Dairy Farm Pro</h1>
            <p className="text-blue-100 text-xs font-light">Management System</p>
          </div>
        </Link>

        {/* Right side */}
        <div className="flex items-center gap-4">
          {!user ? (
            <Link href="/login">
              <button className="bg-white text-blue-600 hover:bg-blue-50 font-semibold text-sm px-6 py-2.5 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg hover:scale-105 flex items-center gap-2">
                <FaUserCircle className="w-4 h-4" />
                Login
              </button>
            </Link>
          ) : (
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3 bg-blue-500 px-4 py-2 rounded-lg border border-blue-400">
                <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                  <span className="text-blue-600 font-bold text-sm">
                    {user.email?.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="hidden sm:block">
                  <p className="text-white text-sm font-medium">
                    {user.email?.split('@')[0]}
                  </p>
                  <p className="text-blue-100 text-xs">
                    {user.email}
                  </p>
                </div>
              </div>
              <Logout />
            </div>
          )}
        </div>
      </div>

      {/* Decorative element */}
      <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-white to-transparent opacity-20"></div>
    </nav>
  );
};

export default Navbar;