"use client";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import FooterNav from "./components/footerNav";
import { usePathname } from "next/navigation";
import { OrderProvider } from "./context/order";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({ children }) {
  const pathname = usePathname();

  const shouldShowFooter =
    pathname !== "/login" &&
    pathname !== "/" &&
  !pathname.startsWith("/category/")&&
    !pathname.startsWith("/product/")&&
    pathname !== "/checkout" &&
    !pathname.startsWith("/banner/");

  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Cairo:wght@200..1000&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <OrderProvider>
          {children}
          {shouldShowFooter && <FooterNav />}
        </OrderProvider>
      </body>
    </html>
  );
}
