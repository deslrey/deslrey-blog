import { BytemdViewer } from '@/components/Markdown/viewer'
import styles from './index.module.scss'
import { api } from '@/api'

export default async function Page({
    params,
}: {
    params: Promise<{ slug: string }>
}) {
    const { slug } = await params

    const data = await fetch(`${api.articleDateil.detail}/${slug}`)
    const posts = await data.json()

    return (
        <div className={styles.bolgBox}>
            <BytemdViewer body={posts.data.content} />
        </div>
    )
}