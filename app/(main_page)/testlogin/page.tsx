import { auth } from "@/auth";
import React from "react";

const LoginTestPage = async () => {
    const session = await auth();

    return (
        <>
            {/* This is a secret page to test the log-in mechanism */}

            {session?.user ? (
                <>
                    <div className="flex items-center justify-center flex-1 bg-green-100">
                        <div className="max-w-md p-6 bg-white rounded shadow-md">
                            <h1 className="text-2xl font-bold text-green-600 mb-4">
                                Welcome, {session.user.name}!
                            </h1>
                            <p className="text-gray-700">You have access to this protected page.</p>
                            <p className="text-gray-700">Session information:</p>
                            <p className="indent-4 text-gray-700">Email: {session.user.email}</p>
                            <p className="indent-4 text-gray-700">Id: {session.user.id}</p>
                            <p className="indent-4 text-gray-700">Image: {session.user.image}</p>
                            <p className="indent-4 text-gray-700">Session expire: {session.expires}</p>
                        </div>
                    </div>
                </>
            ) : (
                <>
                    <div className="flex items-center justify-center flex-1 bg-red-100">
                        <div className="max-w-md p-6 bg-white rounded shadow-md">
                            <h1 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h1>
                            <p className="text-gray-700">
                                You must be signed in to view this page.
                            </p>
                        </div>
                    </div>
                </>
            )}

            {/* <div className="flex items-center justify-center flex-1 bg-yellow-100">
                <div className="max-w-md p-6 bg-white rounded shadow-md">
                    <h1 className="text-2xl font-bold text-yellow-600 mb-4">Unauthorized Access</h1>
                    <p className="text-gray-700">You are not supposed to be here.</p>
                </div>
            </div> */}
        </>
    );
};

export default LoginTestPage;
