"use client";

import { useEffect } from "react";
import { useAuth } from "./Components/AuthProvider";
import { logout } from "@/libs/authService";
import { useRouter } from "next/navigation";

export default function Home() {
  const { currentUser } = useAuth();
  const router = useRouter();

  // 🔐 Redirect to login if not logged in
  useEffect(() => {
    if (currentUser === null) {
      router.push("/login");
    }
  }, [currentUser, router]);

  const handleLogout = async () => {
    try {
      await logout();
      alert("You have logged out successfully.");
      router.push("/login");
    } catch (error) {
      console.error("Logout failed:", error);
      alert("Failed to log out. Please try again.");
    }
  };

  // 🕐 Optionally add loading state while checking user
  if (currentUser === undefined) {
    return <div className="text-white">Loading...</div>;
  }

  return (
    <div className="text-3xl font-bold text-green-300">
      {currentUser ? (
        <div>
          <p>Welcome, {currentUser.displayName || currentUser.email}!</p>
          <button
            onClick={handleLogout}
            className="mt-4 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg"
          >
            Logout
          </button>
        </div>
      ) : null}
    </div>
  );
}
