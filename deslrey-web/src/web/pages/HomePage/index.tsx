import React, { Suspense } from 'react'

import styles from './index.module.scss'
import LatestReleases from '../../components/HomeComponent/LatestReleases'
import LoaderComponent from '../../../loader/LoaderComponent'
import Classify from '../../components/HomeComponent/Classify'
import PopularTags from '../../components/HomeComponent/PopularTags'

const HomePage: React.FC = () => {
    return (
        <div className={styles.homePage}>
            <div className={styles.latestReleases}>
                {/* <Suspense fallback={<LoaderComponent />}> */}
                <LatestReleases />
                {/* </Suspense> */}
            </div>
            <div className={styles.classTags}>
                {/* <Suspense fallback={<LoaderComponent />}> */}
                <Classify />
                {/* </Suspense> */}
                {/* <Suspense fallback={<LoaderComponent />}> */}
                <PopularTags />
                {/* </Suspense> */}
            </div>
        </div>
    )
}

export default HomePage