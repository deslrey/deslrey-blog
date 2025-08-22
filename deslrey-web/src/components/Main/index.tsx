import React from "react";

import styles from "./index.module.scss";
import LatestReleases from "./LatestReleases";
import Classify from "./Classify";
import PopularTags from "./PopularTags";

const Main: React.FC = () => {
    return (
        <div className={styles.main}>
            <div className={styles.latestReleases}>
                <LatestReleases />
            </div>
            <div className={styles.classTags}>
                <Classify />
                <PopularTags />
            </div>
        </div>
    );
};

export default Main;
