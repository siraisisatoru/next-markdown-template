import React from "react";
import { FaUserAlt } from "react-icons/fa";
import ThemeSwitch from "../ThemeSwitch";

import { auth } from "@/auth";
import SignInButton from "../SignInButton";
import SignOutButton from "../SignOutButton";

import Image from "next/image";

const DropdownSelect = async () => {
    const session = await auth();

    return (
        <div className="dropdown dropdown-hover dropdown-end ">
            <div
                tabIndex={0}
                role="button"
                className="btn btn-sm sm:btn-md m-1 btn-square btn-ghost relative overflow-hidden">
                {session?.user?.image ? (
                    <Image
                        src={session.user.image}
                        width={0} // Set your image width
                        height={0} // Set your image height
                        alt={"User profile image"}
                        className="w-full h-full object-cover rounded-sm"
                        sizes="100vw"
                    />
                ) : (
                    <FaUserAlt />
                )}
            </div>

            <ul
                tabIndex={0}
                className={`dropdown-content z-[1] shadow-xl border bg-base-100 rounded-box w-44 dark:border-neutral-600 border-neutral-300`}>
                <li className="m-3">
                    {session && session.user ? <SignOutButton /> : <SignInButton />}
                </li>

                <li className="m-3">
                    <ThemeSwitch />
                </li>
            </ul>
        </div>
    );
};

export default DropdownSelect;
