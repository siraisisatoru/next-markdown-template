import React from "react";

import { Prism as SyntaxHighlighter, createElement } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/cjs/styles/prism";

interface Props {
    renderStr: string;
    language: string;
}

const TerminalRender = ({ renderStr, language }: Props) => {
    
    return (
        <SyntaxHighlighter
            style={vscDarkPlus}
            language={language ? language : "plaintext"}
            className="text-sm my-2 mockup-code not-prose"
            codeTagProps={{style: {} , className:""}}
            showLineNumbers={true}
            useInlineStyles={false}
            lineNumberStyle={{ minWidth: "4em" }}
            wrapLongLines={true}
            renderer={({ rows, stylesheet, useInlineStyles }) => {
                return rows.map((row, index) => {
                    const children = row.children;
                    const lineNumberElement = children?.shift();

                    /**
                     * We will take current structure of the rows and rebuild it
                     * according to the suggestion here https://github.com/react-syntax-highlighter/react-syntax-highlighter/issues/376#issuecomment-1246115899
                     */
                    if (lineNumberElement) {
                        row.children = [
                            lineNumberElement,
                            {
                                children,
                                properties: {
                                    className: [],
                                },
                                tagName: "span",
                                type: "element",
                            },
                        ];
                    }

                    return createElement({
                        node: row,
                        stylesheet,
                        useInlineStyles,
                        key: index,
                    });
                });
            }}>
            {String(renderStr).replace(/\n$/, "")}
        </SyntaxHighlighter>
    );
};

export default TerminalRender;
