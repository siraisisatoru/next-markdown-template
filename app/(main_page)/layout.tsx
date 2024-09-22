import type { Metadata } from "next";
import "../globals.css";
import MainNav from "@/components/MainNav";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
    title: "Next markdown template",
    description: "This is a meaningful wiki page for you.",
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
            <MainNav />
            {children}
            <Footer />
        </div>
    );
}
