"use client";
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserGear } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";

const Sidebar = ({ isSidebarOpen, handleLogout }) => {
  return (
    <aside
      id="default-sidebar"
      className={`fixed left-0 z-40 w-64 h-screen transition-transform  ${
        isSidebarOpen ? "translate-x-0" : "-translate-x-full"
      } bg-gray-50 shadow-lg pt-4 mt-10 rounded-tr-md lg:translate-x-0 lg:relative lg:w-64`}
      aria-label="Sidebar"
    >
      <div className="px-3 py-4 overflow-y-auto h-full">
        <ul className="space-y-2 font-medium pl-4">
          <li>
            <Link
              href="/admin/dashboard/list"
              className="flex items-center p-2 text-gray-900 rounded-lg hover:bg-gray-100 group font-light"
            >
              <svg
                className="w-5 h-5 text-gray-400 transition duration-75 group-hover:text-gray-900"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 22 21"
              >
                <path d="M16.975 11H10V4.025a1 1 0 0 0-1.066-.998 8.5 8.5 0 1 0 9.039 9.039.999.999 0 0 0-1-1.066h.002Z" />
                <path d="M12.5 0c-.157 0-.311.01-.565.027A1 1 0 0 0 11 1.02V10h8.975a1 1 0 0 0 1-.935c.013-.188.028-.374.028-.565A8.51 8.51 0 0 0 12.5 0Z" />
              </svg>
              <span className="ms-3">Dashboard</span>
            </Link>
          </li>

       
        </ul>

        {/* Logout Button inside Sidebar */}
        <div className="mt-auto p-4 lg:hidden">
          <Link
            href="/auth/login"
            onClick={handleLogout}
            className="block w-full bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 text-white text-center"
          >
            Log out
          </Link>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
