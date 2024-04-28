"use client";
import { useRouter } from "next/navigation";
import React from "react";
import { FaArrowLeft } from "react-icons/fa6";

const BackBtn = () => {
    const router = useRouter();

    return (
        <button
            onClick={router.back}
            className="flex items-center justify-center w-1/2 px-5 py-2 text-sm transition-colors duration-200 border rounded-lg gap-x-2 sm:w-auto dark:hover:bg-gray-800 dark:bg-gray-900 dark:text-gray-200 dark:border-gray-700hover:bg-gray-100 bg-white text-gray-700">
            <FaArrowLeft />

            <span>Go back</span>
        </button>
    );
};

export default BackBtn;
