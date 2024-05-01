import React from "react";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { FaHouse } from "react-icons/fa6";
import BackBtn from "@/components/UI/BackBtn";
import Link from "next/link";

const NotFound = () => {
    return (
        <>
            <section className="dark:bg-gray-900 bg-white">
                <div className="container flex items-center min-h-screen px-6 py-12 mx-auto">
                    <div className="flex flex-col items-center max-w-sm mx-auto text-center">
                        <p className="p-3 text-sm font-medium text-blue-500 rounded-full dark:bg-gray-800 bg-blue-50">
                            <HiOutlineExclamationCircle className="w-6 h-6" />
                        </p>
                        <h1 className="mt-3 text-2xl font-semibold md:text-3xl dark:text-white text-gray-800">
                            Page not found
                        </h1>
                        <p className={"mt-4 dark:text-gray-400 text-gray-5 "}>
                            The page you are looking for doesn&apos;t exist. Here are some helpful
                            links:
                        </p>

                        <div className="flex items-center w-full mt-6 gap-x-3 shrink-0 sm:w-auto">
                            <BackBtn />
                            <Link
                                prefetch={false}
                                href="/"
                                className="flex items-center justify-center w-1/2 px-5 py-2 text-sm tracking-wide text-white transition-colors duration-200  rounded-lg  gap-x-2   sm:w-auto dark:hover:bg-blue-500 dark:bg-blue-600 hover:bg-blue-600 bg-blue-500 ">
                                <FaHouse />
                                <span>Take me home</span>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
};

export default NotFound;
