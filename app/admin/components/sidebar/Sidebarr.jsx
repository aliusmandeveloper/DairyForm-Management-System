"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  FaHome, 
  FaUsers, 
  FaCoffee,
  FaSignOutAlt,
  FaTachometerAlt
} from "react-icons/fa";

const Sidebar = ({ isSidebarOpen, handleLogout }) => {
  const pathname = usePathname();

  const links = [
    { 
      name: "Manage Dairy Form", 
      href: "/admin/dashboard/dashboard", 
      icon: <FaTachometerAlt className="w-5 h-5" /> 
    },
    { 
      name: "Cows", 
      href: "/admin/dashboard/cows", 
      icon: <FaHome className="w-5 h-5" /> 
    },
    { 
      name: "Customers", 
      href: "/admin/dashboard/customers", 
      icon: <FaUsers className="w-5 h-5" /> 
    },
    { 
      name: "Milk Detail", 
      href: "/admin/dashboard/milkdetail", 
      icon: <FaCoffee className="w-5 h-5" /> 
    },
  ];

  const isActiveLink = (href) => {
    return pathname === href;
  };

  return (
    <aside
      id="default-sidebar"
      className={`fixed left-0 z-40 w-64  h-full transition-transform ${
        isSidebarOpen ? "translate-x-0" : "-translate-x-full"
      } bg-gradient-to-b from-blue-900 to-blue-800 shadow-lg pt-4 mt-10 rounded-tr-md lg:translate-x-0 lg:relative lg:w-64`}
      aria-label="Sidebar"
    >
      <div className="px-3 py-4  overflow-y-auto h-full ">
        {/* Sidebar Header */}
        <div className="px-3 mt-3 py-4 mb-4 border-b border-blue-700">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white rounded-lg">
              <FaCoffee className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-white">Dairy Manager</h1>
              <p className="text-blue-200 text-xs">Admin Panel</p>
            </div>
          </div>
        </div>

        <ul className="space-y-2 font-medium pl-2">
          {links.map((link) => {
            const isActive = isActiveLink(link.href);
            return (
              <li key={link.name}>
                <Link
                  href={link.href}
                  className={`flex items-center p-3 rounded-lg transition-all duration-200 group ${
                    isActive 
                      ? "bg-white text-blue-700 shadow-md" 
                      : "text-blue-100 hover:bg-blue-700 hover:text-white"
                  }`}
                >
                  <div className={`transition-colors duration-200 ${
                    isActive ? "text-blue-600" : "text-blue-300 group-hover:text-white"
                  }`}>
                    {link.icon}
                  </div>
                  <span className="ms-3">{link.name}</span>
                </Link>
              </li>
            );
          })}
        </ul>

        {/* Logout Button inside Sidebar */}
        <div className="mt-auto p-4 lg:hidden absolute bottom-4 left-4 right-4">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg text-sm px-4 py-3 transition duration-200"
          >
            <FaSignOutAlt className="w-4 h-4" />
            Log out
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;