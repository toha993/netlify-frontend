// src/app/layout.tsx

import Link from "next/link";
import "./globals.css";
import { Inter } from "next/font/google";
import Image from "next/image";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Opti Retreat",
  description: "A voting application for optimal retreats",
  icons: [{ rel: "icon", url: "/optimizely-logo.png", type: "image/png" }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <style>{`
          :root {
            --navbar-bg: #f0f0f0;
            --navbar-text: #333333;
            --navbar-hover: #555555;
          }
        `}</style>
      </head>
      <body className={`${inter.className} bg-white min-h-screen`}>
        <nav
          style={{ backgroundColor: "var(--navbar-bg)" }}
          className="shadow-md"
        >
          <div className="container mx-auto px-4">
            <div className="flex gap-2 items-center py-4">
              <Image
                src="/optimizely-logo.png"
                alt="Landscape picture"
                width={32}
                height={32}
              />
              <Link
                href="/"
                style={{ color: "var(--navbar-text)" }}
                className="text-2xl font-bold hover:text-opacity-80 transition-colors duration-200"
              >
                Opti Retreat
              </Link>
              {/* You can add more nav items here if needed */}
            </div>
          </div>
        </nav>
        <main className="container mx-auto px-4 py-8">{children}</main>
      </body>
    </html>
  );
}
