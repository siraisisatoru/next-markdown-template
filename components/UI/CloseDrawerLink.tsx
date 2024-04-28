"use client";
import Link from "next/link";
import React from "react";

const CloseDrawerLink = ({ ...props }: any) => {
    return (
        <Link
            {...props}
            onClick={() => {
                document.getElementById("my-drawer")?.click();
            }}></Link>
    );
};

export default CloseDrawerLink;
