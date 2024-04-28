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
    // const directories = parts;
    const filename = parts[parts.length - 1].split(".")[0];
    const slug = getSlug(filePath);
    const url = parts.map((segment) => decodeURIComponent(segment.replace(".md", ""))).join("/"); // path to the page

    // console.log(url);

    const yamlConfig = getMdYaml(getPost({ params: { slug } }));

    return { directories, filename, url, yamlConfig };
    // return { directories, filename, url };
};

export const getFinishGroupedFiles = (): Record<string, Directory> => {
    const fileNames = getFileList();

    const safeJSONParse = (param: string | undefined): string[] | [] => {
        return param ? JSON.parse(param) : [];
    };

    // const excludedFiles = safeJSONParse(process.env.EXCLUDEDFILES);
    // const excludedDirectories = safeJSONParse(process.env.EXCLUDEDDIRECTORIES);

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
    const fileNames = getFileList();

    const safeJSONParse = (param: string | undefined): string[] | [] => {
        return param ? JSON.parse(param) : [];
    };

    // const excludedFiles = safeJSONParse(process.env.EXCLUDEDFILES);
    // const excludedDirectories = safeJSONParse(process.env.EXCLUDEDDIRECTORIES);

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
    const fileNames = getFileList();

    const safeJSONParse = (param: string | undefined): string[] | [] => {
        return param ? JSON.parse(param) : [];
    };

    // const excludedFiles = safeJSONParse(process.env.EXCLUDEDFILES_SEARCH);
    // const excludedDirectories = safeJSONParse(process.env.EXCLUDEDDIRECTORIES_SEARCH);

    let groupedFiles: Record<string, Directory> = {};

    fileNames.forEach((filePath) => {
        const { directories, filename, url, yamlConfig } = extractInfo(filePath.toString());
        groupedFiles = addElement(groupedFiles, directories, filename, url, yamlConfig);
    });

    return groupedFiles;
};

export const getFullSearchList = async (): Promise<SearchItem[]> => {
    const fileNames = getFileList();

    const doneList = await fileNames
        // .filter()
        .map(async (filePath: string) => {
            const { directories, filename, url } = extractInfo(filePath);
            // console.log(directories[directories.length-1]);
            const slug = getSlug(filePath);
            const mdText = getPost({ params: { slug } });
            return {
                key: filePath,
                url: url,
                filename: filename,
                courseName: directories[directories.length - 1],
                content: await getPlainContent(mdText),
            } as SearchItem;
        });

    // const finalList: { filteredList: SearchItem }[] =  doneList.map(item => ({ filteredList: item }));
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
    const fileNames = getFileList();
    const paths = fileNames.map((fileName) => {
        const slug = getSlug(fileName.toString());
        return { slug };
    });
    return paths;
};

export const getPost = ({ params }: { params: { slug: string[] } }) => {
    const filepath = params.slug.map((segment) => decodeURIComponent(segment)).join("/");
    // console.log(filepath);
    const postFilePath = path.join(process.cwd(), "Notes", filepath + ".md").replaceAll(" ", " ");
    //   console.log(postFilePath.replaceAll(" ","\\ "));
    // console.log(decodeURI(postFilePath));
    const mdText = fs.readFileSync(decodeURI(postFilePath), "utf8");
    // const mdText = "";
    return mdText;
};
