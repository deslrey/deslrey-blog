import { BytemdViewer } from '@/components/Markdown/viewer'
import styles from './index.module.scss'

export default async function Page({
    params,
}: {
    params: Promise<{ slug: string }>
}) {
    const { slug } = await params

    const data = await fetch('http://localhost:8080/deslrey/article/detail/1')
    const posts = await data.json()

    return (
        <div className={styles.bolgBox}>
            <BytemdViewer body={posts.data.content} />
        </div>
    )
}