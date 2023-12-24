import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import "mapbox-gl/dist/mapbox-gl.css";
import MapContainer from "./MapContainer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <main className="flex flex-row h-screen w-screen">
          <section className="w-1/3 h-full">{children}</section>
          <section className="w-2/3 h-full">
            <MapContainer />
          </section>
        </main>
      </body>
    </html>
  );
}
