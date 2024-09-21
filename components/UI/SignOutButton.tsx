import { signOut } from "@/auth";
import React from "react";
import { FaGithub } from "react-icons/fa6";

const SignOutButton = () => {
    return (
        <form
            action={async () => {
                "use server";
                await signOut({ redirectTo: "/", redirect: true });
            }}>
            <button className="btn btn-ghost w-full font-normal" type="submit">
                <FaGithub className="inline" />
                Log Out
            </button>
        </form>
    );
};

export default SignOutButton;
