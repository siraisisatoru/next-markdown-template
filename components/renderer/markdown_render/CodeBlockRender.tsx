"use client";
import React, { useEffect, useState } from "react";
import * as Comlink from "comlink";
import Image from "next/image";

interface Props {
    codeStr: string;
    // worker?: Worker;
    metaInfo: string;
    language: string;
}

interface PyWorker {
    init(): Promise<void>;
    runPython(code: string, metaInfo: string): Promise<string>;
    runC(code: string, metaInfo: string): Promise<string>;
}
interface CppWorker {
    setShowTiming(data: any): Promise<void>;
    compileLinkRun(data: any): Promise<{ result: any; consoleOutput: string }>;
}
interface ParsedString {
    type: string;
    content: string;
}

function parseString(inputString: string) {
    // GPT
    const imgRegex = /<img src="data:image\/png;base64,([^"]+)">/g;

    let match;
    const parsedData = [];
    let lastIndex = 0;

    // Iterate through all matches
    while ((match = imgRegex.exec(inputString)) !== null) {
        // Push text before the match
        const textBeforeMatch = inputString.substring(lastIndex, match.index);
        if (textBeforeMatch) {
            parsedData.push({ type: "text", content: textBeforeMatch });
        }

        // Push the image data
        parsedData.push({ type: "image", content: match[1] });

        // Update lastIndex
        lastIndex = imgRegex.lastIndex;
    }

    // Push remaining text after the last match
    const textAfterLastMatch = inputString.substring(lastIndex);
    if (textAfterLastMatch) {
        parsedData.push({ type: "text", content: textAfterLastMatch });
    }
    // console.log(parsedData);
    return parsedData;
}

const CodeBlockRender = ({ codeStr, metaInfo, language }: Props) => {
    const [executeOutput, setExecuteOutput] = useState<string>("");

    const [parsedData, setParsedData] = useState<ParsedString[]>([]);

    useEffect(() => {
        const runPythonCode = async () => {
            // Create a new worker instance
            const worker = new Worker(new URL("../../utils/workers/pyWorker", import.meta.url), {
                type: "module",
            });

            // Wrap the worker in Comlink to enable communication
            const pyodideWorker: PyWorker = Comlink.wrap<PyWorker>(worker);

            try {
                // Initialize Pyodide worker
                await pyodideWorker.init();

                // Execute Python code
                // const output = await pyodideWorker.runPython(pythonCode);
                const output = await pyodideWorker.runPython(codeStr, metaInfo);
                // console.log(output);

                setExecuteOutput(output);
                if (metaInfo.toLowerCase().includes("monitor")) {
                    const newData: ParsedString[] = parseString(output);
                    setParsedData(newData);
                }
            } catch (error) {
                console.error("Error running Python code:", error);
            } finally {
                // Terminate the worker after execution
                worker.terminate();
            }
        };

        const runCppCode = async () => {
            // Create a new worker instance
            const worker = new Worker(
                new URL("../../utils/workers/cpp_worker/cpp_worker.js", import.meta.url),
                {
                    type: "module",
                }
            );

            // Wrap the worker in Comlink to enable communication
            const cppWorker: CppWorker = Comlink.wrap<CppWorker>(worker);

            try {
                const result = await cppWorker.compileLinkRun(codeStr);
                setExecuteOutput(result.consoleOutput);
            } catch (error) {
                console.error("Error running Python code:", error);
            } finally {
                // Terminate the worker after execution
                worker.terminate();
            }
        };

        if (language?.match(/(py\b.*)/i) || language?.match(/(python\b.*)/i)) {
            setExecuteOutput("Loading Pyodide...");
            setParsedData([{ type: "text", content: "Loading Pyodide..." }]);
            runPythonCode();
        } else if (language?.match(/(cpp\b.*)/i)) {
            setExecuteOutput("Loading CPP compiler...");
            runCppCode();
        } else {
            setExecuteOutput("Waiting for nothing...");
        }
    }, [language, codeStr, metaInfo]);

    // console.log("code block");

    return (
        <>
            <div>
                <pre className="prismjs not-prose mx-4 mt-2 mb-6 text-xs sm:text-sm mockup-code shadow-xl ">
                    <pre className="px-8 text-nowrap before:hidden">
                        {metaInfo.toLowerCase().includes("monitor") &&
                        (language?.match(/(py\b.*)/i) || language?.match(/(python\b.*)/i)) ? (
                            <>
                                {parsedData.map((item, index) => {
                                    if (item.type === "text") {
                                        return <span key={index}>{item.content}</span>;
                                    } else if (item.type === "image") {
                                        return (
                                            <React.Fragment key={index}>
                                                <Image
                                                    width={0}
                                                    height={0}
                                                    sizes="100vw"
                                                    className="not-prose h-52 w-auto mx-auto"
                                                    src={`data:image/png;base64, ${item.content}`}
                                                    alt=""
                                                />
                                            </React.Fragment>
                                        );
                                    }
                                    return null;
                                })}
                            </>
                        ) : (
                            <>
                                {/* <pre className="prismjs not-prose mx-4 my-2 text-xs sm:text-sm mockup-code shadow-xl ">
                            <pre className="px-8 text-nowrap before:hidden"> */}
                                {executeOutput}
                                {/* </pre>
                        </pre> */}
                            </>
                        )}
                    </pre>
                </pre>
            </div>
        </>
    );
};

export default CodeBlockRender;
