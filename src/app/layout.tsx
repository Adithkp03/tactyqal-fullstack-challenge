import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Tactyqal Labs — Redesigned",
  description:
    "Homepage redesign and blog backend for Tactyqal Labs. Built for the Fullstack Developer Intern hire-a-thon.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
