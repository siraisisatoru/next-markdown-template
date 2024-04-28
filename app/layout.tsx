import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "next-themes";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "Siraisinotes-Wiki",
    description:
        "This is the web page for personal reference. This page will include the majority of learning experience in the past years and organise in the way of course tiles and some arbitory notes. It is intended to be updated regularly.",
    icons: {
        icon: "/img/logo.svg", // /public path
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body className={inter.className}>
                <ThemeProvider>{children}</ThemeProvider>
            </body>
        </html>
    );
}
