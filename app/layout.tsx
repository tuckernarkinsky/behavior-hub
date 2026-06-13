import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Behavior Hub",
  description:
    "ABA data collection with AI-native documentation — probe data, ABC logging, and insurance-ready session notes.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <div
          style={{
            background: "#1B2A28",
            color: "#F4F1EA",
            textAlign: "center",
            fontSize: 12,
            fontWeight: 600,
            padding: "6px 12px",
            letterSpacing: "0.02em",
          }}
        >
          Demo — fake data only. No real client information.
        </div>
        {children}
      </body>
    </html>
  );
}
