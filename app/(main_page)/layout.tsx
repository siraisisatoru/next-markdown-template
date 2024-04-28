import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../globals.css";
import MainNav from "@/components/MainNav";
import Footer from "@/components/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "Next markdown template",
    description:
        "This is a meaningful wiki page for you.",

    icons: {
        icon: "/img/logo.svg", // /public path
    },
};

export default function MainLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className="flex flex-col min-h-screen">
            <div className="mb-6">
                <MainNav />
                {children}
            </div>
            <Footer></Footer>
        </div>
    );
}
