import React, { Suspense } from "react";

import styles from "./index.module.scss";
import LatestReleases from "./LatestReleases";
import Classify from "./Classify";
import PopularTags from "./PopularTags";
import LoaderComponent from "../LoaderComponent";

const Main: React.FC = () => {
    return (
        <div className={styles.main}>
            <div className={styles.latestReleases}>
                <Suspense fallback={<LoaderComponent />}>
                    <LatestReleases />
                </Suspense>
            </div>
            <div className={styles.classTags}>
                <Suspense fallback={<LoaderComponent />}>
                    <Classify />
                </Suspense>
                <Suspense fallback={<LoaderComponent />}>
                    <PopularTags />
                </Suspense>
            </div>
        </div>
    );
};

export default Main;
