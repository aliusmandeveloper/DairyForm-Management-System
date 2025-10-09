"use client";
import React from "react";
import Link from "next/link";

const Sidebar = ({ isSidebarOpen, handleLogout }) => {
  const links = [
    { name: "Manage Dairy Form", href: "/admin/dashboard/dashboard" },
    // { name: "Manage Dairy Form", href: "/admin/dashboard/managedairyform" },
    { name: "Cows", href: "/admin/dashboard/cows" },
    { name: "Customers", href: "/admin/dashboard/customers" },
    { name: "Milk Detail", href: "/admin/dashboard/milkdetail" },
    // { name: "Milk Sale", href: "/admin/dashboard/milk-sales" },
  ];

  return (
    <aside
      id="default-sidebar"
      className={`fixed left-0 z-40 w-64 h-screen transition-transform ${
        isSidebarOpen ? "translate-x-0" : "-translate-x-full"
      } bg-gray-50 shadow-lg pt-4 mt-10 rounded-tr-md lg:translate-x-0 lg:relative lg:w-64`}
      aria-label="Sidebar"
    >
      <div className="px-3 py-4 overflow-y-auto h-full">
        <ul className="space-y-2 font-medium pl-4">
          {links.map((link) => (
            <li key={link.name}>
              <Link
                href={link.href}
                className="flex items-center p-2 text-gray-900 rounded-lg hover:bg-gray-100 group font-light"
              >
                <span className="ms-3">{link.name}</span>
              </Link>
            </li>
          ))}
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
