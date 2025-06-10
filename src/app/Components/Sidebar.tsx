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
                className={`fixed top-0 left-0 h-screen bg-blue-300 shadow-lg z-40 flex flex-col justify-between transition-all duration-500 ease-in-out overflow-hidden
          ${sidebarIsVisible ? "w-64" : "w-16"}
        `}
            >
                {/* ส่วนบน: โลโก้ + ปุ่มปิด (เอาออก) + เมนู */}
                <div className="flex flex-col h-full">
                    <div className="p-6 flex items-center justify-start min-h-[88px]">
                        <div className={`transition-all duration-500 ease-in-out ${sidebarIsVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
                            {sidebarIsVisible ? (
                                <Link href="/" className="text-2xl font-bold text-gray-800 whitespace-nowrap">
                                    Achiraya Tool
                                </Link>
                            ) : null}
                        </div>

                        <div className={`transition-all duration-500 ease-in-out ${!sidebarIsVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95 absolute'}`}>
                            {!sidebarIsVisible && (
                                <div className="flex justify-center items-center w-6 h-6 text-gray-800 mx-auto">
                                    <FiSidebar className="w-6 h-6" />
                                </div>
                            )}
                        </div>
                    </div>

                    {/* เมนูลิงก์ */}
                    <nav className="flex flex-col px-2 space-y-2 flex-1">
                        <div className={`transition-all duration-500 ease-in-out ${sidebarIsVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'}`}>
                            {sidebarIsVisible && (
                                <p className="mt-6 px-3 text-gray-700 font-semibold whitespace-nowrap">
                                    Welcome, {currentUser.displayName || "User"}
                                </p>
                            )}
                        </div>

                        <Link
                            href="/"
                            className={`flex items-center gap-3 px-3 py-2 rounded-md hover:bg-blue-400 transition-all duration-300
                ${!sidebarIsVisible ? "justify-center" : ""}
              `}
                        >
                            <FiHome className="w-6 h-6 text-gray-800 flex-shrink-0" />
                            <span className={`transition-all duration-500 ease-in-out ${sidebarIsVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'} whitespace-nowrap`}>
                                {sidebarIsVisible && "Home"}
                            </span>
                        </Link>

                        <Link
                            href="/Dashboard"
                            className={`flex items-center gap-3 px-3 py-2 rounded-md hover:bg-blue-400 transition-all duration-300
                ${!sidebarIsVisible ? "justify-center" : ""}
              `}
                        >
                            <FiGrid className="w-6 h-6 text-gray-800 flex-shrink-0" />
                            <span className={`transition-all duration-500 ease-in-out ${sidebarIsVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'} whitespace-nowrap`}>
                                {sidebarIsVisible && "Dashboard"}
                            </span>
                        </Link>
                    </nav>
                </div>

                {/* ปุ่ม Sign Out */}
                <div className="px-4 py-6 border-t border-blue-400">
                    <button
                        onClick={() => signOut()}
                        className={`flex items-center w-full rounded-md transition-all duration-500 ease-in-out
            ${sidebarIsVisible
                                ? "gap-3 bg-red-600 text-white hover:bg-red-700 px-3 py-2"
                                : "justify-center text-red-600 hover:bg-red-100 px-1 py-1"}
        `}
                        aria-label="Sign Out"
                    >
                        <FiLogOut className={`flex-shrink-0 transition-all duration-500 ease-in-out ${sidebarIsVisible ? "w-6 h-6 text-white" : "w-10 h-10 text-red-600"}`} />
                        <span className={`transition-all duration-500 ease-in-out ${sidebarIsVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'} whitespace-nowrap`}>
                            {sidebarIsVisible && "Sign Out"}
                        </span>
                    </button>
                </div>
            </aside>
        </>
    );
}