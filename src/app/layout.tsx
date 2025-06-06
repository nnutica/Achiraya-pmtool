// app/layout.tsx
import "./globals.css";
import { ReactNode } from "react";
import { AuthProvider } from "./Components/AuthProvider";
import Navbar from "./Components/Navbar";

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-blue-950">
        <AuthProvider>
          <Navbar />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
