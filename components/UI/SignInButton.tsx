import { signIn } from "@/auth";
import React from "react";
import { FaGithub } from "react-icons/fa6";

const SignInButton = () => {
    return (
        <form
            action={async () => {
                "use server";
                await signIn("github");
            }}>
            <button className="btn btn-ghost w-full font-normal" type="submit">
                <FaGithub className="inline" />
                Log in
            </button>
        </form>
    );
};

export default SignInButton;
