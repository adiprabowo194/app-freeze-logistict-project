import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import "remixicon/fonts/remixicon.css";

const fontPoppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "App Freeze Logistics",
  description: "App Freeze Logistics",
  icons: {
    icon: "/assets/logo_freeze_logistics_nav.ico",
  },
  openGraph: {
    title: "Freeze Logistics",
    description: "App Freeze Logistics",
    images: ["/assets/logo_freeze_logistics_nav.ico"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${fontPoppins.className} `} suppressHydrationWarning>
        <>{children}</>
      </body>
    </html>
  );
}
