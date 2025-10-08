// "use client";
// import React, { useState, useRef } from "react";
// import Link from "next/link";
// import { useRouter } from "next/navigation";


// const Header = ({ toggleSidebar, handleLogout }) => {
//   const [searchTerm, setSearchTerm] = useState("");
//   const router = useRouter();
//   const input = useRef();

 
//   return (
//     <header className="bg-gray-50 w-full flex flex-col md:flex-row items-center justify-between px-4 py-[18px]">
//       <div className="flex-shrink-0">
//         <img
//           src="/img/logo.png"
//           alt="Company Logo"
//           className="w-16 h-16 ml-4 bg-transparent"
//         />
//       </div>

     

//       {/* Menu Button */}
//       <button
//         onClick={toggleSidebar}
//         className="lg:hidden focus:ring-4 focus:outline-none font-lg rounded-lg text-sm px-4 py-2 text-black mt-4 md:mt-0"
//       >
//         <svg
//           className="w-5 h-5"
//           fill="none"
//           stroke="currentColor"
//           viewBox="0 0 24 24"
//         >
//           <path
//             strokeLinecap="round"
//             strokeLinejoin="round"
//             strokeWidth="2"
//             d="M4 6h16M4 12h16m-7 6h7"
//           />
//         </svg>
//       </button>
//       <Link
//         href="/auth/login"
//         onClick={handleLogout}
//         className="hidden lg:block bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 text-white mt-4 md:mt-0"
//       >
//         Log out
//       </Link>
//     </header>
//   );
// };

// export default Header;
