"use client";
import Fuse, { FuseResult } from "fuse.js";
import React, { useState } from "react";
import { FaMagnifyingGlass, FaXmark } from "react-icons/fa6";
import { HiOutlineInformationCircle } from "react-icons/hi";
import { SearchItem } from "../utils/FileManager";
import Link from "next/link";

interface ExtendedFuseResult<T> extends FuseResult<T> {
    highlight?: string;
}

var highlighter = (resultItem: FuseResult<SearchItem>): ExtendedFuseResult<SearchItem> => {
    const resultClone: ExtendedFuseResult<SearchItem> = structuredClone(resultItem);

    if (resultClone.matches)
        resultClone.matches.forEach((matchItem) => {
            const text = resultItem.item.content;
            var resultArr: string[] = [];
            var matches = [...matchItem.indices];
            var pair = matches.shift();
            var skip = false;
            for (let i = 0; i < text.length; i++) {
                // console.log(pair);
                if (
                    (pair && (i < (pair[0] >= 30 ? pair[0] - 30 : pair[0]) || i > pair[1] + 30)) ||
                    !pair
                ) {
                    skip = true;
                    continue;
                }
                if (skip) {
                    resultArr.push(" ... ");
                    skip = false;
                }
                if (pair && i == pair[0]) {
                    resultArr.push("<span class='text-red-600'>");
                }
                resultArr.push(text.charAt(i));
                if (pair && i == pair[1]) {
                    resultArr.push("</span>");
                    // pair = matches.shift();
                }
                // console.log(matches[0]);
                if (pair && (i == pair[1] + 30 || (matches.length > 0 && i == matches[0][0] - 1))) {
                    pair = matches.shift();
                }
            }
            const result = resultArr.join("");

            resultClone["highlight"] = result;
        });

    return resultClone;
};

const SearchBarRender = ({ fuse }: { fuse: Fuse<SearchItem> }) => {
    const [results, setResults] = useState<ExtendedFuseResult<SearchItem>[]>();

    const handleSearch = (text: string) => {
        let result = fuse.search(`${text ? `'"` + text + `"` : ""}`).reverse();
        var resultArr: ExtendedFuseResult<SearchItem>[] = [];
        result.forEach((resultItem) => {
            resultArr.push(highlighter(resultItem));
        });

        setResults(resultArr);
    };

    return (
        <div className="relative">
            <button
                className="btn btn-sm sm:btn-md m-1 btn-square btn-ghost "
                onClick={() => {
                    (document.getElementById("search") as HTMLInputElement).value = "";
                    handleSearch("");
                    (document.getElementById("searchModal") as HTMLDialogElement).showModal();
                }}>
                <FaMagnifyingGlass />
            </button>
            <dialog id="searchModal" className="modal shadow-lg rounded-lg p-4">
                <div className="modal-box overflow-visible">
                    <form method="dialog">
                        <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2 text-gray-500">
                            <FaXmark />
                        </button>
                    </form>
                    <div className="flex flex-row items-center gap-2">
                        <h3 className="my-2 font-bold text-lg text-blue-500">Searching ... </h3>

                        <div className="dropdown dropdown-hover dropdown-opven dropdown-bottom sm:dropdown-right flex sm:flex-none justify-center items-center">
                            <div
                                tabIndex={0}
                                role="button"
                                className="btn btn-sm sm:btn-md m-1 btn-square btn-ghost hover:bg-transparent">
                                <HiOutlineInformationCircle />
                            </div>
                            <div
                                tabIndex={0}
                                className=" dropdown-content z-50 p-4 shadow-[0_0px_20px] shadow-slate-500 bg-base-100 rounded-lg w-80 max-h-64 overflow-auto">
                                {/* className="dropdown-content z-[1]  p-2 shadow bg-base-100 rounded-box w-52"> */}
                                <p className="text-xs">
                                    This search perform &apos;exact&apos; search and capable
                                    separating words with white spaces. AND and OR function does not
                                    supported.
                                </p>
                            </div>
                        </div>
                    </div>
                    <input
                        type="text"
                        id="search"
                        placeholder="Find something"
                        onChange={(e) => handleSearch(e.target.value)}
                        className="my-2  w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 hover:outline-none hover:ring-2 hover:ring-blue-500"
                    />

                    <div className="my-2 overflow-y-auto">
                        <div className="max-h-80 w-full">
                            <table className="table table-pin-rows w-full table-fixed border-separate scroll-smooth">
                                {results &&
                                    results.map((result, i) => (
                                        <React.Fragment key={`result-${i}`}>
                                            <thead>
                                                <tr>
                                                    <th className="bg-gradient-to-tr from-base-300 to-bafrom-base-300/5 rounded-md shadow-inner shadow-slate-300 gap-4 flex items-center">
                                                        <Link
                                                            prefetch={false}
                                                            href={`/${encodeURI(result.item.url)}`}
                                                            className="link text-lg capitalize break-words whitespace-normal"
                                                            onClick={() => {
                                                                (
                                                                    document.getElementById(
                                                                        "searchModal"
                                                                    ) as HTMLDialogElement
                                                                ).close();
                                                            }}>
                                                            {result.item.filename}
                                                        </Link>
                                                        <span>
                                                            &#8212;&#8212; {result.item.courseName}
                                                        </span>
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr>
                                                    <td className="whitespace-normal bg-base-200/50 rounded-md ">
                                                        <p
                                                            className="break-words text-base-content"
                                                            dangerouslySetInnerHTML={{
                                                                __html: result.highlight!,
                                                            }}
                                                        />
                                                    </td>
                                                </tr>
                                            </tbody>
                                            <tbody>
                                                <tr>
                                                    <td>
                                                        <p className="h-[1rem]"></p>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </React.Fragment>
                                    ))}
                            </table>
                        </div>
                    </div>
                </div>
                <form method="dialog" className="modal-backdrop">
                    <button className="text-blue-500">close</button>
                </form>
            </dialog>
        </div>
    );
};

export default SearchBarRender;
