import BlogPage from "./BlogPage";

export default async function Page({ params, }: { params: Promise<{ slug: string }>; }) {
    const { slug } = await params;

    return <BlogPage slug={slug} />
}
