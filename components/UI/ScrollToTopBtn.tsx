"use client";

import ScrollToTop from "react-scroll-to-top";
import { FaArrowUp } from "react-icons/fa";

const ScrollToTopBtn = () => {
    return (
        <ScrollToTop
            smooth
            className="!bg-base-300 !bottom-24 !z-50"
            component={<FaArrowUp className="m-auto" />}
        />
    );
};

export default ScrollToTopBtn;
