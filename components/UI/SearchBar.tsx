"use client";
import React from "react";

import Fuse from "fuse.js";
import { SearchItem } from "../utils/FileManager";
import SearchBarRender from "../renderer/site_render/SearchBarRender";

const SearchBar = ({ searchList }: { searchList: SearchItem[] }) => {

    const fuseOptions = {
        isCaseSensitive: false,
        // includeScore: true,
        includeMatches: true,
        useExtendedSearch: true,
        ignoreLocation: true,
        keys: ["content"], // Keys to search for exact matches
    };

    const fuse = new Fuse(searchList, fuseOptions);

    return (
        <>
            <SearchBarRender fuse={fuse} />
        </>
    );
};

export default SearchBar;
