import type { Metadata, Viewport } from "next";
import { Zen_Old_Mincho, Zen_Kaku_Gothic_New } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/components/itinerary/language-provider";

const zenOldMincho = Zen_Old_Mincho({
  variable: "--font-zen-old-mincho",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "900"],
});

const zenKaku = Zen_Kaku_Gothic_New({
  variable: "--font-zen-kaku",
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
});

export const metadata: Metadata = {
  title: "Kyūshū · Six-Day Itinerary",
  description:
    "Chen family six-day self-drive itinerary across Kyūshū — Fukuoka, Kumamoto, Takachiho, Aso, Yufuin and Beppu.",
};

export const viewport: Viewport = {
  themeColor: "#19202f",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${zenOldMincho.variable} ${zenKaku.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-washi text-ink">
        <div className="noise-overlay" aria-hidden />
        <LanguageProvider>{children}</LanguageProvider>
      </body>
    </html>
  );
}
