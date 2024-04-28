import { getPost, getSlugs } from "@/components/utils/FileManager";
import "./mdCss.css";
import { getMdRender, getMdYaml } from "@/components/renderer/MarkdownRender";

const MarkdownPage = async ({ params }: { params: { slug: string[] } }) => {
    const mdStr = getPost({ params });
    const jsonData = getMdYaml(mdStr);
    return (
        <>
            <div className=" flex flex-col max-w-[120ch] px-8 md:px-20 mx-auto mt-6">
                <div className="flex flex-col gap-2 mt-3">
                    <h1 className="text-4xl md:text-5xl first-letter:uppercase ">
                        {jsonData.title}
                    </h1>

                    <p>Created on {jsonData.date}</p>
                    {jsonData.abstract != "" ? (
                        <>
                            <p className="indent-4 md:text-lg my-2">{jsonData.abstract}</p>
                        </>
                    ) : null}
                </div>

                <article className="prose prose-sm sm:prose-base mx-auto !w-full !max-w-full">
                    {getMdRender(mdStr)}
                </article>
            </div>
        </>
    );
};

export default MarkdownPage;

type Params = {
    slug: string[];
};

// for garentee 404
export async function generateStaticParams(): Promise<Params[]> {    
    return getSlugs();
}

// Use this like to make sure url must be one of the markdown file
export const dynamicParams = false;
// export const dynamic = "error";
