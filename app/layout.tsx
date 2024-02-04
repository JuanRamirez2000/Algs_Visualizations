import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import "mapbox-gl/dist/mapbox-gl.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Algs Visualizations",
  description:
    "A quickly scaffolded project meant to showcase pathfinding algorithms for now",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="bg-base-800 text-zinc-100">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
