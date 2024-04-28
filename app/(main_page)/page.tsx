import SiteTree from "@/components/SiteTree";
import React from "react";
import Image from "next/image";
import profileIcon from "../../public/img/profileIcon.jpg";

const HomePage = () => {
    return (
        <>
            <div className=" flex flex-col max-w-[120ch] px-8 md:px-20 mx-auto mt-6 gap-4">
                <div className="flex flex-col">
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="flex-shrink-0 m-4 sm:my-auto ">
                            <Image
                                className="w-40 h-40 mx-auto rounded-2xl shadow-xl dark:shadow-slate-800 shadow-slate-400"
                                src={profileIcon} // Path to your image in the public folder
                                alt="Profile Icon"
                                sizes="100vw"
                                width={0}
                                height={0}
                                priority={true}
                            />
                        </div>
                        <div className="w-full p-4">
                            <h1
                                className={
                                    "mb-2 border-b leading-snug text-center text-2xl dark:border-none border-gray-800"
                                }>
                                Hi 👋, I&apos;m SiraisiSatoru
                            </h1>
                            <h3 className="indent-4">
                                A passionate full stack developer, IoT architect from Hong Kong
                                living in Sydney
                            </h3>
                            <ul className="list-disc ml-4">
                                <li>
                                    <span>🔭 I&apos;m currently working on </span>
                                    <a
                                        className="link"
                                        href="https://github.com/siraisisatoru/react-markdown-template">
                                        react wiki template
                                    </a>
                                </li>
                                <li>
                                    <span>🌱 I&apos;m currently learning </span>
                                    <strong>Python and C</strong>
                                </li>
                                <li>
                                    <span>💬 Ask me about </span>
                                    <strong>IoT and Python</strong>
                                </li>
                                <li>
                                    <span>⚡ Fun fact, </span>
                                    <strong>
                                        I am an electronic graduate but develop websites and train
                                        machine learning models.
                                    </strong>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div className="">
                    <h3 className="text-lg mb-4 font-bold">Quick indexing:</h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-2">
                        <SiteTree isIndex={true} finished={true} />
                    </div>

                    <div className="">
                        <h3 className="text-lg mb-4 font-bold">Todo list:</h3>
                        <SiteTree isIndex={true} finished={false} />
                    </div>
                </div>
                {/* <div className="">
                        <h3 className="text-lg mb-4 font-bold">Recent posts in this wiki :</h3>
                        <div className="h-72 bg-white"></div>
                        <h3 className="text-lg mb-4 font-bold">Updates of this wiki:</h3>
                        <div className="h-32 bg-yellow-300"> </div>
                    </div> */}
            </div>
        </>
    );
};

export default HomePage;
