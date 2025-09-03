import '@/styles/markdown/md.scss'

export default async function Page({
    params,
}: {
    params: Promise<{ slug: string }>
}) {
    const { slug } = await params
    const { default: Post } = await import(`@/content/${slug}.mdx`)

    return (
        <div className="markdown">
            <Post />
        </div>
    )
}

export function generateStaticParams() {
    return [{ slug: '1' }, { slug: '2' }]
}

export const dynamicParams = false