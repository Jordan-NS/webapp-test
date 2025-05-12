import "./globals.css";
import { Inter } from "next/font/google";
import { Metadata } from "next";
import { Navbar } from "@/components/Navbar";
import { Providers } from "@/app/providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "NASA Images Explorer",
  description: "Explore as mais impressionantes imagens da NASA APOD API",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html suppressHydrationWarning lang="pt-BR">
      <head>
        <link rel="icon" href="/rocket.svg" />
      </head>
      <body suppressHydrationWarning className={inter.className}>
        <Providers>
          <Navbar />
          {children}
        </Providers>
      </body>
    </html>
  );
}