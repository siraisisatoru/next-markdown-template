import React from "react";
import { getGroupedFiles, getFinishGroupedFiles, getTodoGroupedFiles } from "./utils/FileManager";
import { Directory } from "./utils/FileManager";
import SiteTreeRender from "./renderer/site_render/SiteTreeRender";

interface Props {
    isIndex: boolean;
    finished?: boolean;
}

const SiteTree = ({ isIndex, finished }: Props) => {
    let nameList: Record<string, Directory>;
    if (!isIndex) {
        nameList = getGroupedFiles();
    } else {
        if (finished) {
            nameList = getFinishGroupedFiles();
            return (
                <>
                    {Object.entries(nameList).map(([key, value]) => (
                        <div
                            key={key}
                            className="border border-border-wiki rounded-lg p-4 mb-4 max-h-96 overflow-auto">
                            <h2 className="text-lg font-bold mb-2">{key}</h2>
                            <SiteTreeRender
                                nameList={{ [key]: value }}
                                isIndex={isIndex}
                                finished={finished}
                                key={key}
                            />
                        </div>
                    ))}
                </>
            );
        } else {
            nameList = getTodoGroupedFiles();
        }
    }
    return (
        <>
            <SiteTreeRender nameList={nameList} isIndex={isIndex} finished={finished} />
            {/* <Directory directory={nameList} /> */}
        </>
    );
};

export default SiteTree;
