"use client";
import React, { useState } from "react";
import { FaRegCopy } from "react-icons/fa";

const CopyCodeBtn = ({ codeStr }: { codeStr: string }) => {
    const [copyTip, setCopyTip] = useState("Copy code");

    return (
        <button
            aria-label="Copy code button"
            className="right-0 tooltip tooltip-left absolute z-40 mr-2 mt-5"
            data-tip={copyTip}
            onClick={async () => {
                setCopyTip("Copied");
                try {
                    await navigator.clipboard.writeText(codeStr);
                    await new Promise((resolve) => setTimeout(resolve, 500));
                } catch (error) {
                    // console.error(error.message);
                }
                setCopyTip(`Copy code`);
            }}>
            <FaRegCopy className="h-5 w-5 cursor-pointer hover:text-blue-600" />
        </button>
    );
};

export default CopyCodeBtn;
