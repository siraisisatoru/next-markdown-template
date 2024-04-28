import React from "react";

import { FaRegCopyright, FaGithub } from "react-icons/fa6";
import { SiTailwindcss, SiDaisyui, SiNextdotjs } from "react-icons/si";
import ScrollToTopBtn from "./UI/ScrollToTopBtn";
import Link from "next/link";

const Footer = () => {
    return (
        <>
            <ScrollToTopBtn />

            <footer className="footer footer-center p-4 bg-base-300 text-base-content mt-auto ">
                <aside>
                    <p>
                        <FaRegCopyright className="inline" />{" "}
                        <span>
                            2024 SiraisiSatoru{" "}
                            <Link href="https://github.com/siraisisatoru/">
                                <FaGithub className="inline" />
                            </Link>
                            . All right reserved.
                        </span>
                    </p>
                    <p>
                        <span>Powered by </span>
                        <Link href="https://nextjs.org/">
                            Next.js <SiNextdotjs className="inline" />
                        </Link>
                        <span> , </span>
                        <Link href="https://tailwindcss.com/">
                            Tailwind <SiTailwindcss className="inline" />
                        </Link>
                        <span> and </span>
                        <Link href="https://daisyui.com/">
                            Daisyui <SiDaisyui className="inline text-3xl" />
                        </Link>
                        <span>.</span>
                    </p>
                </aside>
            </footer>
        </>
    );
};

export default Footer;
