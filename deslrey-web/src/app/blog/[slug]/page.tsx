import { BytemdViewer } from '@/components/Markdown/viewer';
import styles from './index.module.scss';
import { api } from '@/api';

export default async function Page({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;

    let post

    try {
        const res = await fetch(`${api.articleDateil.detail}/${slug}`, {
            cache: 'no-store',
        });
        const result = await res.json();

        post = result.data;
    } catch (error) {
        post = null
    }

    let carouseUrl = ''

    try {

        const carouselRes = await fetch(`${api.detailHeadPage.scenery}`, {
            cache: 'no-store'
        })
        const carouse = await carouselRes.json()
        // carouseUrl = carouse.data
    } catch (error) {
        carouseUrl = ''
    }


    return (
        <div className={styles.bolgBox}>
            <BytemdViewer article={post} carouseUrl={carouseUrl} />
        </div>
    );
}
