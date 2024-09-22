import "./mdCss.css";
import { getMdRender, getMdYaml } from "@/components/renderer/markdown_render/MarkdownRender";
import path from "path";
import fs from "fs";

interface MdPageProps {
    slug: string[];
}

const MarkdownPage = ({ params }: { params: MdPageProps }) => {
    const filepath = params.slug.map((segment) => decodeURIComponent(segment)).join("/");
    const postFilePath = path.join(process.cwd(), process.env.MDFOLDER!, filepath + ".md");

    // try {
    const mdText = fs.readFileSync(decodeURI(postFilePath), "utf8");
    const status = fs.statSync(decodeURI(postFilePath));
    // } catch (error) {
    //     console.log(error);
    // }

    const jsonData = getMdYaml({
        mdText: mdText,
        dates: { createTime: status.birthtime, modifyTime: status.mtime },
    });
    return (
        <>
            <div className="flex flex-col max-w-[120ch] w-full px-8 md:px-20 mx-auto my-6">
                <div className="flex flex-col gap-2">
                    <h1 className="text-4xl md:text-5xl first-letter:uppercase ">
                        {jsonData.title}
                    </h1>

                    <p>Created on {jsonData.createDate.toLocaleString()}</p>
                    <p>Last modified on {jsonData.lastModify.toLocaleString()}</p>

                    {jsonData.abstract != "" ? (
                        <>
                            <p className="indent-4 md:text-lg my-2">{jsonData.abstract}</p>
                        </>
                    ) : null}
                </div>

                <article className="prose prose-sm sm:prose-base mx-auto !w-full !max-w-full">
                    {getMdRender(mdText)}
                </article>
            </div>
        </>
    );
};

export default MarkdownPage;

export async function generateStaticParams() {
    const mdFolder = process.env.MDFOLDER;
    if (!mdFolder) return [];

    const postsDirectory = path.join(process.cwd(), mdFolder);

    // Read all file names recursively from the posts directory
    const fileNames = fs.readdirSync(postsDirectory, { recursive: true });

    // Parse excluded files and directories from environment variables
    const excludedFiles: string[] = process.env.EXCLUDEDFILES
        ? JSON.parse(process.env.EXCLUDEDFILES)
        : [];
    const excludedDirs: string[] = process.env.EXCLUDEDDIRECTORIES
        ? JSON.parse(process.env.EXCLUDEDDIRECTORIES)
        : [];

    return fileNames
        .filter((file) => String(file).endsWith(".md")) // Keep only Markdown files
        .filter(
            (file) =>
                // Exclude files that are in the excludedFiles list
                !excludedFiles.some((excluded) => String(file).endsWith(excluded)) &&
                // Exclude files that are within any of the excluded directories
                excludedDirs.every((dir) => !String(file).includes(`/${dir}/`))
        )
        .sort() // Optional: Sort the files alphabetically
        .map((file) => {
            // Generate the slug by removing the .md extension and splitting the path
            const slug = String(file)
                .replace(/\.md$/, "") // Remove file extension
                .split(path.sep) // Split path by separator
                .filter(Boolean) // Remove empty segments
                .map((segment) =>
                    process.env.NODE_ENV === "production" ? segment : encodeURIComponent(segment)
                );

            return {
                slug,
            };
        });
}

// Use this like to make sure url must be one of the markdown file
export const dynamicParams = false;
// export const dynamic = "error";
