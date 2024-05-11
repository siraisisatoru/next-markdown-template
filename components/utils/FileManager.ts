import fs from "fs";
import path from "path";
import { MDYaml, getMdYaml, getPlainContent } from "../renderer/MarkdownRender";
export interface Element {
    name: string;
    url: string;
    yamlConfig: MDYaml; // Assuming yamlConfig type
}

export interface Directory {
    files: Element[];
    subdirectory: Record<string, Directory>;
}

export interface ListItem {
    directories: string[]; // Assuming directories is an array of strings
    name: string;
    url: string;
    yamlConfig: MDYaml; // Replace 'any' with the specific type of yamlConfig if known
}

export interface SearchItem {
    key: string;
    url: string;
    filename: string;
    courseName: string;
    content: string;
}

const safeJSONParse = (param: string | undefined): string[] | [] => {
    return param ? JSON.parse(param) : [];
};

export const getFileList = (): string[] => {
    if (!process.env.MDFOLDER) {
        return [];
    }

    const postsDirectory = path.join(process.cwd(), process.env.MDFOLDER);
    const fileNames = fs.readdirSync(postsDirectory, { recursive: true });
    // Filter only markdown files and convert them to strings
    const markdownFiles: string[] = fileNames
        .map((fileName) => fileName.toString())
        .filter((fileName) => fileName.endsWith(".md"))
        .sort(); // Filter only markdown files
    return markdownFiles;
};

const getNoRouteList = (): string[] => {
    const fileNames = getFileList();

    const excludedFiles = safeJSONParse(process.env.EXCLUDEDFILES);
    const excludedDirectories = safeJSONParse(process.env.EXCLUDEDDIRECTORIES);

    return fileNames.filter(
        (filePath) =>
            !excludedFiles.some((excluded) => filePath.endsWith(excluded)) &&
            excludedDirectories.every((dir) => !filePath.includes(`/${dir}/`))
    );
};

const getNoSearchList = (): string[] => {
    const fileNames = getNoRouteList();
    const excludedFiles = safeJSONParse(process.env.EXCLUDEDFILES_SEARCH);
    const excludedDirectories = safeJSONParse(process.env.EXCLUDEDDIRECTORIES_SEARCH);
    return fileNames.filter(
        (filePath) =>
            !excludedFiles.some((excluded) => filePath.endsWith(excluded)) &&
            excludedDirectories.every((dir) => !filePath.includes(`/${dir}/`))
    );
};

const addElement = (
    obj: Record<string, Directory>,
    elements: string[],
    filename: string,
    url: string,
    yamlConfig: MDYaml
): Record<string, any> => {
    if (elements.length === 0) {
        return obj;
    } else {
        const currentElement = elements.shift();
        if (!obj[currentElement!]) {
            obj[currentElement!] = { files: [], subdirectory: {} };
        }
        if (elements.length === 0) {
            obj[currentElement!].files.push({
                name: filename,
                url: url,
                yamlConfig: yamlConfig,
            });
        }
        obj[currentElement!].subdirectory = addElement(
            obj[currentElement!].subdirectory,
            elements,
            filename,
            url,
            yamlConfig
        );
        return obj;
    }
};

const extractInfo = (filePath: string) => {
    const parts = filePath.split("/");
    const directories = parts.slice(0, parts.length - 1);
    const filename = parts[parts.length - 1].split(".")[0];
    const slug = getSlug(filePath);
    const url = parts.map((segment) => decodeURIComponent(segment.replace(".md", ""))).join("/"); // path to the page

    const yamlConfig = getMdYaml(getPost({ params: { slug } }));

    return { directories, filename, url, yamlConfig };
};

export const getFinishGroupedFiles = (): Record<string, Directory> => {
    const fileNames = getNoRouteList();
    let finishGroupedFiles: Record<string, Directory> = {};
    fileNames.forEach((filePath) => {
        const { directories, filename, url, yamlConfig } = extractInfo(filePath.toString());
        if (yamlConfig.done) {
            finishGroupedFiles = addElement(
                finishGroupedFiles,
                directories,
                filename,
                url,
                yamlConfig
            );
        }
    });

    return finishGroupedFiles;
};

export const getTodoGroupedFiles = (): Record<string, Directory> => {
    const fileNames = getNoRouteList();

    let todoGroupedFiles: Record<string, Directory> = {};

    fileNames.forEach((filePath) => {
        const { directories, filename, url, yamlConfig } = extractInfo(filePath.toString());
        if (!yamlConfig.done) {
            todoGroupedFiles = addElement(todoGroupedFiles, directories, filename, url, yamlConfig);
        }
    });

    return todoGroupedFiles;
};

export const getGroupedFiles = (): Record<string, Directory> => {
    const fileNames = getNoRouteList();

    let groupedFiles: Record<string, Directory> = {};

    fileNames.forEach((filePath) => {
        const { directories, filename, url, yamlConfig } = extractInfo(filePath.toString());
        groupedFiles = addElement(groupedFiles, directories, filename, url, yamlConfig);
    });

    return groupedFiles;
};

export const getFullSearchList = async (): Promise<SearchItem[]> => {
    const fileNames = getNoSearchList();

    const doneList = await fileNames.map(async (filePath: string) => {
        const { directories, filename, url } = extractInfo(filePath);
        // console.log(directories[directories.length-1]);
        const slug = getSlug(filePath);
        const mdText = getPost({ params: { slug } }).mdText;
        return {
            key: filePath,
            url: url,
            filename: filename,
            courseName: directories[directories.length - 1],
            content: await getPlainContent(mdText),
        } as SearchItem;
    });

    const finalList: SearchItem[] = await Promise.all(doneList.map(async (item) => await item));

    return finalList;
};

export const getSlug = (pathstr: string) => {
    return pathstr
        .replace(/\.md$/, "") // Remove file extension
        .split(path.sep) // Split path by separator
        .filter(Boolean)
        .map((segment) => {
            if (process.env.NODE_ENV === "production") {
                return segment;
            } else {
                return encodeURIComponent(segment);
            }
        });
};

export const getSlugs = () => {
    const fileNames = getNoRouteList();
    const paths = fileNames.map((fileName) => {
        const slug = getSlug(fileName.toString());
        return { slug };
    });
    return paths;
};

export const getPost = ({ params }: { params: { slug: string[] } }) => {
    const filepath = params.slug.map((segment) => decodeURIComponent(segment)).join("/");
    const postFilePath = path
        .join(process.cwd(), process.env.MDFOLDER!, filepath + ".md")
        .replaceAll(" ", " ");
    const mdText = fs.readFileSync(decodeURI(postFilePath), "utf8");
    const status = fs.statSync(decodeURI(postFilePath));
    return { mdText: mdText, dates: { createTime: status.birthtime, modifyTime: status.mtime } };
};
