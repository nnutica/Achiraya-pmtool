"use client";

import Link from "next/link";
import { useState } from "react";
import { useAuth } from "./AuthProvider";
import { FiSidebar, FiLogOut, FiHome, FiGrid } from "react-icons/fi";

export default function Sidebar() {
    const { currentUser, signOut } = useAuth();

    const [isHovering, setIsHovering] = useState(false);

    if (!currentUser) return null;

    const sidebarIsVisible = isHovering;

    return (
        <>
            {/* Sidebar */}
            <aside
                onMouseEnter={() => setIsHovering(true)}
                onMouseLeave={() => setIsHovering(false)}
                className={`fixed top-0 left-0 h-screen bg-blue-300 shadow-lg z-40 flex flex-col justify-between transition-all duration-300
          ${sidebarIsVisible ? "w-64" : "w-16"}
        `}
            >
                {/* ส่วนบน: โลโก้ + ปุ่มปิด (เอาออก) + เมนู */}
                <div>
                    <div className="p-6 flex items-center justify-start">
                        {sidebarIsVisible ? (
                            <Link href="/" className="text-2xl font-bold text-gray-800 whitespace-nowrap">
                                Achiraya Tool
                            </Link>
                        ) : (
                            // แสดงแค่ตัวอักษรย่อหรือไอคอนตอน sidebar ปิด (ถ้าต้องการ)
                            <div className="flex justify-center items-center w-6 h-6 text-gray-800 mx-auto">
                                <FiSidebar className="w-6 h-6" />
                            </div>

                        )}
                    </div>

                    {/* เมนูลิงก์ */}
                    <nav className="flex flex-col px-2 space-y-2">
                        <Link
                            href="/"
                            className={`flex items-center gap-3 px-3 py-2 rounded-md hover:bg-blue-400 transition
                ${!sidebarIsVisible ? "justify-center" : ""}
              `}
                        >
                            <FiHome className="w-6 h-6 text-gray-800" />
                            {sidebarIsVisible && <span>Home</span>}
                        </Link>

                        <Link
                            href="/Dashboard"
                            className={`flex items-center gap-3 px-3 py-2 rounded-md hover:bg-blue-400 transition
                ${!sidebarIsVisible ? "justify-center" : ""}
              `}
                        >
                            <FiGrid className="w-6 h-6 text-gray-800" />
                            {sidebarIsVisible && <span>Dashboard</span>}
                        </Link>

                        {sidebarIsVisible && (
                            <p className="mt-6 px-3 text-gray-700 font-semibold whitespace-nowrap">
                                Welcome, {currentUser.displayName || "User"}
                            </p>
                        )}
                    </nav>
                </div>

                {/* ปุ่ม Sign Out */}
                <div className="px-4 py-6 border-t border-blue-400">
                    <button
                        onClick={() => signOut()}
                        className={`flex items-center gap-3 w-full rounded-md px-3 py-2 transition
              ${sidebarIsVisible
                                ? "bg-red-600 text-white hover:bg-red-700"
                                : "justify-center text-red-600 hover:bg-red-100"}
            `}
                        aria-label="Sign Out"
                    >
                        <FiLogOut className={`w-6 h-6 ${sidebarIsVisible ? "text-white" : "text-red-600"}`} />
                        {sidebarIsVisible && <span>Sign Out</span>}
                    </button>
                </div>
            </aside>

            {/* Overlay ปิดเมื่อคลิกนอก sidebar และจอเล็ก (ถ้าต้องการ) */}
            {/* <div
          className={`fixed inset-0 bg-black/40 z-30 md:hidden ${sidebarIsVisible ? "" : "hidden"}`}
          onClick={() => setIsHovering(false)}
      ></div> */}
        </>
    );
}
