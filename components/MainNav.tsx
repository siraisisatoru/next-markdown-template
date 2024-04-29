import React from "react";
import ThemeSwitch from "./UI/ThemeSwitch";
import { FaBars, FaFlaskVial } from "react-icons/fa6";
import { FaGoogle, FaUserAlt, FaHome, FaRoute } from "react-icons/fa";
import Image from "next/image";
import Link from "next/link";
import SiteTree from "./SiteTree";
import CloseDrawerLink from "./UI/CloseDrawerLink";
import SearchBar from "./UI/SearchBar";
import { getFullSearchList } from "./utils/FileManager";

const MainNav = async () => {
    const searchList = await getFullSearchList();
    return (
        // MARK: hello
        <nav className="navbar bg-base-200 sticky top-0 z-50">
            <div className="flex-none">
                <div className="drawer z-50">
                    <input id="my-drawer" type="checkbox" className="drawer-toggle" />
                    <div className="drawer-content">
                        {/* Page content here */}
                        <label
                            htmlFor="my-drawer"
                            className="btn bg-transparent border-none shadow-none drawer-button">
                            <FaBars />
                        </label>
                    </div>
                    <div className="drawer-side">
                        <label
                            htmlFor="my-drawer"
                            aria-label="close sidebar"
                            className="drawer-overlay !cursor-default"></label>
                        <ul className="menu pt-8 p-4 w-[18rem] sm:w-80 gap-4  min-h-full bg-base-200 text-base-content">
                            {/* Sidebar content here */}
                            <CloseDrawerLink
                                className="btn btn-ghost gap-1 sm:gap-4 hover:bg-transparent text-lg sm:text-xl h-fit"
                                href="/">
                                <Image
                                    src="/img/logo.svg"
                                    alt="react markdown template logo"
                                    width="0" // Set the width of the image
                                    height="0" // Set the height of the image
                                    sizes="100vw"
                                    className="h-7 sm:h-10 w-auto"
                                />
                                <p>Next markdown template</p>
                            </CloseDrawerLink>

                            <li>
                                <CloseDrawerLink href="/">
                                    <FaHome />
                                    Home page
                                </CloseDrawerLink>
                            </li>
                            <li>
                                <CloseDrawerLink href="/testhook">
                                    <FaFlaskVial />
                                    Page function tests
                                </CloseDrawerLink>
                                {/* <Link >
                                    
                                </Link> */}
                            </li>
                            <li>
                                <div className="pointer-events-none">
                                    <FaRoute />
                                    Notes index
                                </div>
                                <SiteTree isIndex={false} />
                                {/* <SiteTreeRender groupedFiles={groupedFiles} /> */}
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
            <div className="flex flex-1">
                <Link
                    className="btn btn-ghost gap-4 hover:bg-transparent text-lg sm:text-xl max-w-full text-wrap flex-nowrap h-fit"
                    href="/">
                    <Image
                        src="/img/logo.svg"
                        alt="Next markdown template logo"
                        width="0" // Set the width of the image
                        height="0" // Set the height of the image
                        sizes="100vw"
                        className="h-8 sm:h-10 w-auto"
                        priority={true}
                    />
                    Next markdown template
                </Link>
            </div>

            <div className="flex-none">
                <SearchBar searchList={searchList}/>

                <div className="dropdown dropdown-hover dropdown-end">
                    <div
                        tabIndex={0}
                        role="button"
                        className="btn btn-sm sm:btn-md m-1 btn-square btn-ghost">
                        {/* <FaEllipsis /> */}
                        <FaUserAlt />
                    </div>

                    <ul
                        tabIndex={0}
                        className={`dropdown-content z-[1] shadow-xl border bg-base-100 rounded-box w-44 dark:border-neutral-600 border-neutral-300`}>
                        <li className="m-3">
                            <button className="btn btn-ghost w-full">
                                <FaGoogle /> Log-in
                            </button>
                        </li>

                        <li className="m-3">
                            <ThemeSwitch />
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
};

export default MainNav;
