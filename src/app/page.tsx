"use client";

import { useEffect } from "react";
import { useAuth } from "./Components/AuthProvider";
import { useRouter } from "next/navigation";
import { logout } from "@/libs/authService";

export default function Home() {
  const { currentUser } = useAuth();
  const router = useRouter();

  // 🔐 Redirect to login if not logged in
  useEffect(() => {
    if (currentUser === null) {
      logout
      router.push("/login");
    }
  }, [currentUser, router]);


  // 🕐 Optionally add loading state while checking user
  if (currentUser === undefined) {
    return <div className="text-white">Loading...</div>;
  }

  return (
    <div className="text-3xl font-bold text-green-300">
      {currentUser ? (
        <div className="ml-6">
          <p className="m-10">Welcome, {currentUser.displayName || currentUser.email}!</p>

        </div>
      ) : null}
    </div>
  );
}
