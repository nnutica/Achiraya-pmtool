"use client";

import Link from "next/link";
import { useState } from "react";
import { useAuth } from "./AuthProvider"; // Import useAuth

export default function Navbar() {
    const { currentUser, signOut } = useAuth(); // เพิ่ม signOut จาก AuthProvider
    const [dropdownOpen, setDropdownOpen] = useState(false); // state สำหรับ dropdown

    if (!currentUser) return null; // ซ่อน Navbar หากไม่มีผู้ใช้ล็อกอิน

    return (
        <nav className="bg-blue-300 shadow-md">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex items-center">
                        <Link href="/" className="text-xl font-bold text-gray-800">
                            Achiraya Tool
                        </Link>
                    </div>
                    <div className="flex items-center space-x-4 relative">
                        <Link href="/" className="text-gray-600 hover:text-gray-900">
                            Home
                        </Link>
                        <Link href="/Dashboard" className="text-gray-600 hover:text-gray-900">
                            Dashboard
                        </Link>

                        {/* Dropdown Trigger */}
                        <div className="relative">
                            <button
                                onClick={() => setDropdownOpen(!dropdownOpen)}
                                className="text-gray-600 hover:text-gray-900 focus:outline-none"
                            >
                                Welcome, {currentUser.displayName || "User"}
                            </button>

                            {/* Dropdown Menu */}
                            {dropdownOpen && (
                                <div className="absolute right-0 mt-2 w-40 bg-white rounded-md shadow-lg z-50">
                                    <button
                                        onClick={() => {
                                            signOut();
                                            setDropdownOpen(false);
                                        }}
                                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                                    >
                                        Sign Out
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
}
