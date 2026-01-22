import type { Metadata } from "next";
import "./globals.css";
import { TravelProvider } from "./contexts/TravelContext";

export const metadata: Metadata = {
  title: "智旅 2.0 - AI驱动的智能旅行规划助手",
  description: "基于地图探索的智能旅行规划应用,提供个性化行程推荐和实时景点信息",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body className="antialiased">
        <TravelProvider>
          {children}
        </TravelProvider>
      </body>
    </html>
  );
}
