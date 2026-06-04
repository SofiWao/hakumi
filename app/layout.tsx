import type { Metadata } from "next";
import { Playfair_Display, Fira_Code } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

const firaCode = Fira_Code({
  variable: "--font-fira-code",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Hakumi - Abyssal Light",
  description: "A psychological horror and therapeutic visual novel.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${playfair.variable} ${firaCode.variable} antialiased dark`}
      suppressHydrationWarning
    >
      <body className="min-h-screen bg-zinc-950 text-zinc-300 font-serif selection:bg-red-900/30 selection:text-white">
        {children}
      </body>
    </html>
  );
}
