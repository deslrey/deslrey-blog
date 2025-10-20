import { BytemdViewer } from '@/components/Markdown/viewer';
import styles from './index.module.scss';
import { api } from '@/api';

export default async function Page({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;

    const res = await fetch(`${api.articleDateil.detail}/${slug}`, {
        cache: 'no-store',
    });
    const result = await res.json();

    const post = result.data;

    console.log(post)

    return (
        <div className={styles.bolgBox}>
            <BytemdViewer article={post} />
        </div>
    );
}
