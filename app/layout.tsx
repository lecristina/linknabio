import type React from "react";
import type { Metadata } from "next";
import { Public_Sans } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { Suspense } from "react";
import { Providers } from "./providers";
import "./globals.css";

const publicSans = Public_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Axolutions - Analítica",
  description: "",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className={publicSans.className}>
        <Providers>
          <Suspense fallback={null}>{children}</Suspense>
          <Analytics />
        </Providers>
      </body>
    </html>
  );
}
