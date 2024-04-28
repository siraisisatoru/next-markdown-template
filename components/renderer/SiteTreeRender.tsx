"use client";
import React from "react";
import { Directory, Element } from "../utils/FileManager";
import { FaFolderClosed } from "react-icons/fa6";
import { IoIosConstruct } from "react-icons/io";
import { usePathname } from "next/navigation";
import Link from "next/link";

interface Props {
    nameList: Record<string, Directory>;
    isIndex: boolean;
    finished?: boolean;
}

interface LookupObj {
    "working-on": number[];
    new: number[];
    maxIndex: number;
}

interface AnnotationList {
    [key: string]: LookupObj;
}

const SiteTreeRender = ({ nameList, isIndex, finished }: Props) => {
    // const headersList = headers();
    // const activeHost = headersList.get("x-invoke-path");
    // console.log(headersList);
    const pathname = usePathname();

    function FileItem({ files, lookupObj }: { files: Element[]; lookupObj: LookupObj }) {
        // lookupObj provide an object with properties of 'working-on','new'
        lookupObj = lookupObj || { "working-on": [], new: [], maxIndex: -1 };
        files.sort((a, b) => {
            const extractNumber = (name: string) => {
                const match = name.match(/\d+/);
                return match ? parseInt(match[0]) : null;
            };

            const numA = extractNumber(a.name);
            const numB = extractNumber(b.name);

            // Handle cases where name doesn't follow 'ch' + number structure
            if (numA !== null && numB !== null) {
                return numA - numB;
            } else {
                // Fallback sorting by name if numeric extraction fails
                return a.name.localeCompare(b.name);
            }
        });
        return (
            <ul className="menu gap-1 ">
                {files.map((file, index) =>
                    parseInt((file.name.match(/ch(\d+)/i) || [])[1]) <= lookupObj["maxIndex"] ||
                    lookupObj["maxIndex"] == -1 ? (
                        <li key={file.name} className="whitespace-normal">
                            <Link
                                onClick={() => {
                                    isIndex ? null : document.getElementById("my-drawer")?.click();
                                }}
                                href={`/${encodeURI(file.url)}`}
                                className={`static ${
                                    "/" + encodeURI(file.url) === pathname
                                        ? "active pointer-events-none "
                                        : ""
                                }`}>
                                <div className="capitalize">
                                    {!isIndex &&
                                    lookupObj["new"].includes(
                                        parseInt((file.name.match(/ch(\d+)/i) || [])[1])
                                    ) ? (
                                        // <span className="indicator-item indicator-start badge badge-accent badge-xs -left-1 -top-0"></span>
                                        <>
                                            <span className="absolute flex h-3 w-3 top-1 left-1">
                                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
                                                <span className="relative inline-flex rounded-full h-3 w-3 bg-sky-500"></span>
                                            </span>
                                        </>
                                    ) : null}

                                    {file.name.includes(" - ") ? (
                                        file.name.split(" - ").map((part, index) => (
                                            <div
                                                key={index}
                                                className={`${index == 1 ? "font-bold" : null}`}>
                                                {part}

                                                {index === 1 &&
                                                !isIndex &&
                                                lookupObj["working-on"].includes(
                                                    parseInt((file.name.match(/ch(\d+)/i) || [])[1])
                                                ) ? (
                                                    <IoIosConstruct className="ml-2 inline-block" />
                                                ) : null}
                                            </div>
                                        ))
                                    ) : (
                                        <>
                                            {file.name}
                                            {!isIndex &&
                                            lookupObj["working-on"].includes(
                                                parseInt((file.name.match(/ch(\d+)/i) || [])[1])
                                            ) ? (
                                                <IoIosConstruct className="ml-2 inline-block" />
                                            ) : null}
                                        </>
                                    )}
                                </div>
                            </Link>
                        </li>
                    ) : null
                )}
            </ul>
        );
    }

    /**
     * The way to add new and working on icon is not careful that it is possible have some edge cases such as empty files under directory or other indexing issues.
     * For now, leave it as it is, if there are any bugs found in nav plate, it is possible casued here.
     */

    function Directory({ directory }: { directory: Record<string, Directory> }) {
        const annoList: AnnotationList = {
            python_tutorial: {
                "working-on": [7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24],
                new: [5, 6],
                maxIndex: -1,
            },
        };

        // console.log(directory.sort((a, b) => a.name.localeCompare(b.name)));

        return (
            <ul className={`menu gap-1 ${isIndex && finished ? "menu-xs" : ""}`}>
                {Object.entries(directory)
                .map(([key, value]) => (
                    <li key={key} className="whitespace-normal">
                        <details
                            open={
                                decodeURI(pathname).includes(key) || (isIndex && finished)
                                // isIndex
                            }>
                            <summary>
                                <strong className="pointer-events-none flex gap-4">
                                    <FaFolderClosed className="shrink-0" />
                                    <span>{key}</span>
                                </strong>
                            </summary>
                            {value.files.length > 0 ? (
                                <FileItem files={value.files} lookupObj={annoList[key]} />
                            ) : null}
                            {Object.keys(value.subdirectory).length > 0 ? (
                                <Directory directory={value.subdirectory} />
                            ) : null}
                        </details>
                    </li>
                ))}
            </ul>
        );
    }

    return (
        <>
            <Directory directory={nameList} />
        </>
    );
};

export default SiteTreeRender;
