"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

enum ErrorType {
    Configuration = "Configuration",
    AccessDenied = "AccessDenied",
    Verification = "Verification",
}

function ErrorContent() {
    const search = useSearchParams();
    const error = search.get("error") as ErrorType;

    if (error === ErrorType.Configuration) {
        return (
            <div className="max-w-md p-6 bg-red-100 rounded shadow-md">
                <h1 className="text-2xl font-bold text-red-600 mb-4">Configuration Error</h1>
                <p>
                    There was a problem when trying to authenticate. Please contact us if this error
                    persists. Unique error code:{" "}
                    <code className="rounded-sm bg-slate-100 p-1 text-xs">Configuration</code>
                </p>
            </div>
        );
    } else if (error === ErrorType.AccessDenied) {
        return (
            <div className="max-w-md p-6 bg-red-100 rounded shadow-md">
                <h1 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h1>
                <p>This website is only accessible by SiraisiSatoru.</p>
            </div>
        );
    } else if (error === ErrorType.Verification) {
        return (
            <div className="max-w-md p-6 bg-yellow-100 rounded shadow-md">
                <h1 className="text-2xl font-bold text-yellow-600 mb-4">Verification Failed</h1>
                <p>You are not supposed to be here.</p>
            </div>
        );
    } else {
        return <p>Please contact us if this error persists.</p>;
    }
}

export default function ErrorPage() {
    return (
        <div className="flex h-screen w-full flex-col items-center justify-center">
            <h5 className="mb-2 flex items-center justify-center gap-2 text-xl font-bold text-gray-900 dark:text-white">
                Something went wrong
            </h5>
            <Suspense fallback={<p>Loading...</p>}>
                <div className="font-normal text-gray-700 dark:text-gray-400 mb-6">
                    <ErrorContent />
                </div>
            </Suspense>
            <Link
                href="/"
                className="flex items-center justify-center w-1/2 px-5 py-2 text-sm text-white bg-blue-500 rounded-lg gap-x-2 hover:bg-blue-600 transition-colors duration-200 sm:w-auto dark:bg-blue-600 dark:hover:bg-blue-500">
                <span>Take me home</span>
            </Link>
        </div>
    );
}
