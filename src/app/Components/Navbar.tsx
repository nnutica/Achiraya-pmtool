"use client";

import Link from "next/link";
import { useAuth } from "./AuthProvider"; // Import useAuth

export default function Navbar() {
    const { currentUser } = useAuth(); // ดึงข้อมูล currentUser จาก AuthProvider

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
                    <div className="flex items-center space-x-4">
                        <Link href="/" className="text-gray-600 hover:text-gray-900">
                            Home
                        </Link>
                        <Link href="/Dashboard" className="text-gray-600 hover:text-gray-900">
                            Dashboard
                        </Link>
                        <span className="text-gray-600">Welcome, {currentUser.displayName || "User"}</span>
                    </div>
                </div>
            </div>
        </nav>
    );
}