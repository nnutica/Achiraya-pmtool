"use client";

import { useEffect, useState } from "react";
import { useAuth } from "./Components/AuthProvider";
import { useRouter } from "next/navigation";

export default function Home() {
  const { currentUser } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  // 🔐 ตรวจสอบสถานะผู้ใช้
  useEffect(() => {
    // ถ้า currentUser ยัง undefined แสดงว่ากำลังโหลดข้อมูล authentication
    if (currentUser === undefined) {
      setLoading(true);
      return;
    }

    // ถ้า currentUser เป็น null แสดงว่าไม่ได้ล็อกอิน (หลังจากโหลดเสร็จแล้ว)
    if (currentUser === null) {
      router.push("/login");
      return;
    }

    // ถ้า currentUser มีค่า แสดงว่าล็อกอินแล้ว
    if (currentUser) {
      setLoading(false);
    }
  }, [currentUser, router]);

  // 🕐 แสดงข้อความ Loading ระหว่างตรวจสอบสถานะผู้ใช้
  if (loading || currentUser === undefined) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  // ถ้า currentUser เป็น null จะ redirect ไปแล้ว ไม่ต้อง render อะไร
  if (currentUser === null) {
    return null;
  }

  return (
    <div className="text-3xl font-bold text-green-300">
      <div className="ml-6">
        <p className="m-10">Welcome, {currentUser.displayName || currentUser.email}!</p>
      </div>
    </div>
  );
}