"use client";
import React, { useState } from "react";
import Sidebar from "../../components/sidebar/Sidebarr";
// import Header from "../../components/header/Header";



export default function Dashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex flex-col h-screen ">
      {/* <Header toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} /> */}
      <div className="flex flex-1">
        <Sidebar isSidebarOpen={isSidebarOpen} />
        <main className="flex-1 p-6 overflow-y-auto mt-16">
          <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
        </main>
      </div>
    </div>
  );
}
