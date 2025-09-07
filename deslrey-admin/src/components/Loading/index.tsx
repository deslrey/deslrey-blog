import React from 'react';

import styles from './index.module.scss';

const Loading: React.FC = () => {
    return (
        <div className={styles.loadingBox}>
            正在加载中......
        </div>
    );
};

export default Loading;
