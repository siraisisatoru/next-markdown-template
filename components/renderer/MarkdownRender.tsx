// Register `hName`, `hProperties` types, used when turning markdown to HTML:
/// <reference types="mdast-util-to-hast" />
// Register directive nodes in mdast:
/// <reference types="mdast-util-directive" />

import ReactMarkdown from "react-markdown";

import { remark } from "remark";
import strip, { Handler } from "strip-markdown";

import remarkGfm from "remark-gfm";
import remarkToc from "remark-toc";
import remarkEmoji from "remark-emoji";
import remarkIns from "remark-ins";
import remarkMarkers from "remark-flexible-markers";
import remarkCollapse from "remark-collapse";
import { remarkDefinitionList, defListHastHandlers } from "remark-definition-list";
import remarkSupersub from "remark-supersub";
import remarkDirective from "remark-directive";
import remarkBreak from "remark-breaks";
import remarkImg from "remark-images";
import remarkUnwrapImages from "remark-unwrap-images";
import remarkFrontmatter from "remark-frontmatter";
import remarkMath from "remark-math";
import rehypeAutolink from "rehype-autolink-headings";
import rehypeSlug from "rehype-slug";
import rehypeRaw from "rehype-raw";
import rehypeKatex from "rehype-katex";

import { visit } from "unist-util-visit";
import { h } from "hastscript";

import yaml from "js-yaml";

import {
    HiOutlineInformationCircle,
    HiOutlineCheckCircle,
    HiOutlineExclamationCircle,
    HiOutlineXCircle,
} from "react-icons/hi";
import React from "react";
import Link from "next/link";
import Image from "next/image";

import P5Render from "./p5Render";
import CharacterRender from "./CharacterRender";
import GalleryRender from "./GalleryRender";
import TerminalRender from "./TerminalRender";
import CopyCodeBtn from "../UI/CopyCodeBtn";

import dynamic from "next/dynamic";
import CodeBlockRender from "./CodeBlockRender";

const MermaidRender = dynamic(() => import("./MermaidRender"), { ssr: false });

export interface MDYaml {
    title: string;
    createDate: Date;
    lastModify: Date;
    exeCPP: boolean;
    exePYTHON: boolean;
    abstract: string;
    tags: string[];
    done: boolean;
}

export const getMdYaml = ({
    mdText,
    dates,
}: {
    mdText: string;
    dates: { createTime: Date; modifyTime: Date };
}) => {
    // Split the markdown string by the YAML delimiter ("+=+=+=+")
    const mdConfig = mdText.split("+=+=+=+")[1];

    let jsonData: MDYaml = {
        title: "YOU NEED A TITLE",
        createDate: dates.createTime,
        lastModify: dates.modifyTime,
        exeCPP: false,
        exePYTHON: false,
        abstract: "",
        tags: [],
        done: false,
    };
    // Convert YAML to JSON
    if (mdConfig?.length > 1) {
        const mdConfigJson = yaml.load(mdConfig) as MDYaml;
        jsonData.title = mdConfigJson?.title || jsonData.title;
        jsonData.exeCPP = mdConfigJson?.exeCPP || jsonData.exeCPP;
        jsonData.exePYTHON = mdConfigJson?.exePYTHON || jsonData.exePYTHON;
        jsonData.abstract = mdConfigJson?.abstract || jsonData.abstract;
        jsonData.tags = mdConfigJson?.tags || jsonData.tags;
        jsonData.done = mdConfigJson?.done || jsonData.done;
    }
    return jsonData;
};

// Define the handler function
const handleMarkNode: Handler = (node) => {
    if (node.type === "mark") {
        // Remove the mark tags and return the children nodes
        return node.children || [];
    }
    // Return the node unchanged if it's not an mark node
    return node;
};

export const getPlainContent = async (mdText: string) => {
    return String(
        await remark()
            .use(remarkMath)
            .use(remarkGfm)
            .use(remarkFrontmatter, [{ type: "yaml", fence: "+=+=+=+" }])
            .use(remarkDirective)
            .use(remarkMarkers)
            .use(strip, {
                remove: [
                    "containerDirective",
                    "leafDirective",
                    "textDirective",
                    "html",
                    "math",
                    ["mark", handleMarkNode],
                ], // extend the list to add types being removed.
            })
            .process(mdText)
    );
};

export const getMdRender = async (mdText: string) => {
    // >> Customise remark plugin =========================
    function remarkCustomPlugin() {
        /**
         * @param {import('mdast').Root} tree
         *   Tree.
         * @returns {undefined}
         *   Nothing.
         */
        return function (tree: import("mdast").Root) {
            visit(tree, function (node) {
                // console.log(node);
                if (
                    node.type === "containerDirective" ||
                    node.type === "leafDirective" ||
                    node.type === "textDirective"
                ) {
                    if (node.name === "note") {
                        // console.log(node)

                        // calling data in the following means assigning attributes to the node.data
                        const data = node.data || (node.data = {});
                        const tagName = node.type === "textDirective" ? "span" : "div";
                        // const tagName = node.type === "span" ;
                        data.hName = tagName;
                        if (node.attributes?.class == "alert") {
                            data.hProperties = h(
                                tagName,
                                { class: "my-4 alert", role: "alert" } || {}
                            ).properties;
                        } else if (node.attributes?.class == "info") {
                            data.hProperties = h(
                                tagName,
                                { class: "my-4 alert alert-info", role: "alert" } || {}
                            ).properties;
                        } else if (node.attributes?.class == "success") {
                            data.hProperties = h(
                                tagName,
                                { class: "my-4 alert alert-success", role: "alert" } || {}
                            ).properties;
                        } else if (node.attributes?.class == "warning") {
                            data.hProperties = h(
                                tagName,
                                { class: "my-4 alert alert-warning", role: "alert" } || {}
                            ).properties;
                        } else if (node.attributes?.class == "error") {
                            data.hProperties = h(
                                tagName,
                                { class: "my-4 alert alert-error", role: "alert" } || {}
                            ).properties;
                        } else if (node.attributes?.class == "openChat") {
                            data.hProperties = h(
                                tagName,
                                { class: "my-4 ml-4 chat chat-start" } || {}
                            ).properties;
                        } else if (node.attributes?.class == "closeChat") {
                            data.hProperties = h(
                                tagName,
                                { class: "my-4 mr-4 chat chat-end" } || {}
                            ).properties;
                        } else {
                            data.hProperties = h(tagName, node.attributes || {}).properties;
                        }
                    } else {
                        const data = node.data || (node.data = {});
                        const hast = h(node.name, node.attributes || {});
                        data.hName = hast.tagName;
                        data.hProperties = hast.properties;
                    }
                } else if (node.type === "image") {
                    const src = node.url;
                    const classRegex = /#([:a-zA-Z0-9\-_\[\]]+)/g;
                    const classMatch = src.match(classRegex);
                    // console.log(classMatch);
                    if (classMatch) {
                        const classNames = classMatch
                            .map((match: string) => match.slice(1))
                            .join(" ");
                        if (!node.data) node.data = {};
                        if (!node.data.hProperties) node.data.hProperties = {};
                        node.data.hProperties.className = classNames;
                    }
                }
            });
        };
    }
    // >> Customise remark plugin =========================

    return (
        <ReactMarkdown
            remarkPlugins={[
                remarkSupersub,
                remarkIns,
                remarkDefinitionList,
                remarkBreak,
                remarkDirective,
                remarkMath,
                [
                    remarkImg,
                    {
                        imageExtensions: [
                            "JPG",
                            "avif",
                            "gif",
                            "jpeg",
                            "jpg",
                            "png",
                            "svg",
                            "webp",
                        ],
                    },
                ],
                remarkUnwrapImages,
                [remarkGfm, { singleTilde: false }],
                [remarkCollapse, { test: "Colltest" }],
                [remarkEmoji, { emoticon: false }],
                [remarkToc, { maxDepth: 3 }],

                // remarkMarkers,
                [
                    remarkMarkers,
                    {
                        dictionary: {
                            b: "DeepSkyBlue",
                            r: "lightpink",
                        },
                        markerProperties: (color: any) => {
                            return color
                                ? {
                                      style: `background-color:${color};`,
                                  }
                                : "";
                        },
                    },
                ],
                [remarkFrontmatter, [{ type: "yaml", fence: "+=+=+=+" }]],
                remarkCustomPlugin,
            ]}
            rehypePlugins={[
                rehypeKatex,
                () => {
                    return function (tree) {
                        visit(tree, function (node) {
                            if (node.tagName == "code" && node.data?.meta) {
                                node.properties.dataMeta = node.data.meta;
                            }
                        });
                    };
                },
                rehypeRaw,
                rehypeSlug,
                [
                    rehypeAutolink,
                    {
                        behavior: "wrap",
                        properties: {
                            class: "text-wrap items-center gap-2 group w-fit no-underline",
                        },
                        content: [
                            {
                                type: "element", // Type of node
                                tagName: "span", // HTML tag name
                                properties: {
                                    class: "ml-2 align-middle text-base hidden group-hover:inline-block ",
                                }, // HTML attributes
                                children: [
                                    // Child nodes
                                    {
                                        type: "text", // Type of child node (text node)
                                        value: "#", // Text content
                                    },
                                ],
                            },
                        ],
                    },
                ],
            ]}
            remarkRehypeOptions={{
                handlers: {
                    // any other handlers
                    ...defListHastHandlers,
                },
            }}
            components={{
                table: ({ node, ...props }) => {
                    return (
                        <div className="w-full overflow-auto">
                            {/* <div className=""> */}
                            <table {...props}></table>
                        </div>
                    );
                },

                kbd: (props) => {
                    return (
                        <>
                            <span className="not-prose mx-1">
                                <kbd
                                    className="kbd kbd-sm first-letter:capitalize"
                                    {...props}></kbd>
                            </span>
                        </>
                    );
                },

                pre: ({ node, children, className, ...props }) => {
                    const codeChunk = children && (children as React.ReactElement).props.children;
                    const language =
                        children &&
                        (children as React.ReactElement).props.className?.replace(/language-/g, "");
                    const dataMeta =
                        children && ((children as React.ReactElement).props["data-meta"] || "");
                    const isRun = dataMeta?.match(/^(run\b.*)$/i);
                    const isP5 = dataMeta?.match(/(p5\b.*)/i);
                    const isCharacter = dataMeta?.match(/(character\b.*)/i);
                    const isGallery = dataMeta?.match(/(gallery\b.*)/i);
                    const isFullWidth = dataMeta?.match(/(fullWidth\b.*)/i);
                    const isMermaid = language?.match(/(mermaid\b.*)/i);
                    const isTerminal = dataMeta?.match(/(terminal\b.*)/i);
                    const isPython =
                        language?.match(/(py\b.*)/i) || language?.match(/(python\b.*)/i);
                    const isCpp = language?.match(/(cpp\b.*)/i);
                    const defineAlign =
                        (/align/i.test(dataMeta) && /"(.*?)"/.exec(dataMeta)?.[1]) || "";
                    const notShow = dataMeta?.match(/(notshow\b.*)/i);
                    if (notShow) {
                        return <></>;
                    }

                    if (isP5 && isRun && language?.match(/(js\b.*)/i)) {
                        // a p5 code snipt
                        const isHidden = dataMeta?.match(/(hidden\b.*)$/i);
                        if (isFullWidth) {
                            return (
                                <>
                                    <div
                                        className={`max-w-full max-h-full static flex justify-center items-center my-4 ${
                                            isHidden ? "overflow-hidden" : ""
                                        }`}>
                                        <P5Render sketch={codeChunk} />
                                    </div>
                                </>
                            );
                        } else if (defineAlign == "right") {
                            return (
                                <div className="max-w-min float-right mx-4 my-auto">
                                    <P5Render sketch={codeChunk} />
                                </div>
                            );
                        } else if (defineAlign == "left") {
                            return (
                                <div className="max-w-min float-left mx-4 my-auto">
                                    <P5Render sketch={codeChunk} />
                                </div>
                            );
                        } else {
                            return (
                                <div className="my-4 max-w-min mx-auto">
                                    <P5Render sketch={codeChunk} />
                                </div>
                            );
                        }
                    } else if (isCharacter && isRun && language?.match(/(yaml\b.*)/i)) {
                        // a character code snipt
                        if (defineAlign == "right") {
                            return (
                                <div className="max-w-min float-right mx-4 my-auto">
                                    <CharacterRender config={codeChunk} />
                                </div>
                            );
                        } else if (defineAlign == "left") {
                            return (
                                <div className="max-w-min float-left mx-4 my-auto">
                                    <CharacterRender config={codeChunk} />
                                </div>
                            );
                        } else {
                            return (
                                <div className="my-4 max-w-min mx-auto">
                                    <CharacterRender config={codeChunk} />
                                </div>
                            );
                        }
                    } else if (isGallery && isRun && language?.match(/(yaml\b.*)/i)) {
                        return <GalleryRender config={codeChunk} />;
                    } else if (isRun && isMermaid) {
                        const isWide = dataMeta?.match(/(wide\b.*)$/i);
                        const guidGenerator = () => {
                            var S4 = function () {
                                return (((1 + Math.random()) * 0x10000) | 0)
                                    .toString(16)
                                    .substring(1);
                            };
                            // return S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4();
                            return S4();
                        };
                        return (
                            <>
                                <MermaidRender
                                    codeStr={codeChunk}
                                    isWide={isWide}
                                    id={guidGenerator()}
                                />
                            </>
                        );
                    } else if (isTerminal) {
                        return (
                            <>
                                <div className="mx-4 my-2">
                                    <TerminalRender renderStr={codeChunk} language={language} />
                                </div>
                            </>
                        );
                    } else {
                        return (
                            <>
                                <div className="relative">
                                    <CopyCodeBtn codeStr={codeChunk} />

                                    {language ? (
                                        <span className="right-0 bottom-0 z-40 absolute mb-4 mr-2 rounded-lg p-1 text-xs uppercase text-base-300 bg-base-content/40 backdrop-blur-sm">
                                            {language}
                                        </span>
                                    ) : null}
                                    <TerminalRender renderStr={codeChunk} language={language} />
                                </div>

                                {isRun && isPython ? (
                                    <>
                                        <CodeBlockRender
                                            codeStr={codeChunk}
                                            metaInfo={dataMeta}
                                            language={language}
                                        />
                                    </>
                                ) : isRun && isCpp ? (
                                    <>
                                        {/* the code in this code block is Cpp, try to render the output for it */}
                                        <CodeBlockRender
                                            codeStr={codeChunk}
                                            metaInfo={dataMeta}
                                            language={language}
                                        />

                                        <pre className="not-prose">
                                            {/* {loading ? (
                                                <p>Loading Clang...</p>
                                            ) : cppRef.current ? (
                                                <div>
                                                    <Codeblock
                                                        langWorker={cppRef.current}
                                                        code={codeChunk}
                                                        metaInfo={dataMeta}
                                                        lang={"cpp"}
                                                    />
                                                </div>
                                            ) : (
                                                <></>
                                            )} */}
                                        </pre>
                                    </>
                                ) : (
                                    <>
                                        {/* <span>{node.children[0].properties?.dataMeta}</span> */}
                                    </>
                                )}
                            </>
                        );
                    }
                },

                div: ({ node, children, ...props }) => {
                    if (node && node.properties.className?.toString()?.includes("alert")) {
                        return (
                            <div {...props}>
                                {node.properties.className?.toString()?.includes("alert-info") ? (
                                    <HiOutlineInformationCircle className="stroke-current shrink-0 h-6 w-6" />
                                ) : node.properties.className
                                      .toString()
                                      ?.includes("alert-success") ? (
                                    <HiOutlineCheckCircle className="stroke-current shrink-0 h-6 w-6" />
                                ) : node.properties.className
                                      .toString()
                                      ?.includes("alert-warning") ? (
                                    <HiOutlineExclamationCircle className="stroke-current shrink-0 h-6 w-6" />
                                ) : node.properties.className
                                      .toString()
                                      ?.includes("alert-error") ? (
                                    <HiOutlineXCircle className="stroke-current shrink-0 h-6 w-6" />
                                ) : (
                                    <HiOutlineInformationCircle className="stroke-info shrink-0 h-6 w-6" />
                                )}

                                <span>
                                    {typeof children === "object" &&
                                        children &&
                                        (children as React.ReactElement).props.children}
                                </span>
                            </div>
                        );
                    } else if (node && node.properties.className?.toString()?.includes("chat")) {
                        return (
                            <div {...props}>
                                <div className="chat-bubble dark:bg-neutral-content bg-base-300 text-neutral">
                                    <span>
                                        {typeof children === "object" &&
                                            children &&
                                            (children as React.ReactElement).props.children}
                                    </span>
                                </div>
                            </div>
                        );
                    } else {
                        return <div {...props}> {children}</div>;
                    }
                },

                a: ({ node, ...props }) => {
                    if (
                        (props.children as React.ReactElement).props?.node?.tagName === "img" &&
                        props.href === (props.children as React.ReactElement).props.src &&
                        (props.children as React.ReactElement).props.alt === ""
                    ) {
                        const imgProps = (props.children as React.ReactElement).props.node
                            .properties;
                        return (
                            <Image
                                src={imgProps.src}
                                width={imgProps.width || 0} // Set your image width
                                height={imgProps.height || 0} // Set your image height
                                alt={imgProps.alt || ""}
                                className="w-auto"
                                sizes="100vw"
                            />
                        );
                    }
                    if (props.href)
                        return <Link prefetch={false} href={props.href} {...props}></Link>;
                },

                img: ({ node, ...props }) => {
                    const imgProp = (node && node.properties.src?.toString().split("#")) || [];
                    const alt = node && (node.properties?.alt as string);

                    if (imgProp.length == 1) {
                        return (
                            <Image
                                src={imgProp[0]}
                                width={0}
                                height={0}
                                sizes="100vw"
                                className="h-auto w-auto"
                                alt={alt || ""}
                            />
                        );
                    } else {
                        // console.log(props);
                        return (
                            <>
                                <Image
                                    src={props.src as string}
                                    width={0}
                                    height={0}
                                    sizes="100vw"
                                    className={
                                        props.className
                                            ? props.className + " h-auto w-auto"
                                            : "h-auto w-auto"
                                    }
                                    alt={props.alt || ""}
                                />
                            </>
                        );
                    }
                },

                h1: ({ node, ...props }) => {
                    return (
                        <h1
                            {...props}
                            className={`${
                                node?.properties.id === "contents" ? "mt-2" : "mt-12"
                            } mb-0 border-b leading-snug scroll-my-20 dark:border-gray-200 border-gray-800 `}></h1>
                    );
                },

                h2: ({ node, ...props }) => {
                    return <h2 {...props} className={`mt-4 mb-3 leading-snug scroll-my-20`}></h2>;
                },

                h3: ({ node, ...props }) => {
                    return <h3 {...props} className={`scroll-my-20`}></h3>;
                },

                h4: ({ node, ...props }) => {
                    return <h4 {...props} className={`scroll-my-20`}></h4>;
                },

                h5: ({ node, ...props }) => {
                    return <h5 {...props} className={`scroll-my-20`}></h5>;
                },

                h6: ({ node, ...props }) => {
                    return <h6 {...props} className={`scroll-my-20`}></h6>;
                },

                iframe: ({ node, ...pros }) => {
                    return pros.title!.includes("YouTube") ? (
                        <div className="mockup-window border bg-base-300 max-w-full mx-4 my-4">
                            <div className="flex justify-center bg-base-200 p-2">
                                <iframe
                                    src={pros.src}
                                    className="aspect-video w-full"
                                    title="YouTube video player"
                                    allowFullScreen></iframe>
                            </div>
                        </div>
                    ) : pros.className!.includes("zoom") ? (
                        <>
                            <div className="mockup-window border bg-base-300 max-w-full mx-4 my-4 ">
                                <div className="bg-base-200 p-2 ">
                                    <div className="overflow-hidden w-[100%] h-[400px]">
                                        <iframe
                                            {...pros}
                                            className=" bg-white scale-50 w-[200%] h-[800px] origin-top-left"></iframe>
                                    </div>
                                </div>
                            </div>
                        </>
                    ) : (
                        <iframe {...pros}></iframe>
                    );
                },
            }}>
            {mdText}
        </ReactMarkdown>
    );
};
