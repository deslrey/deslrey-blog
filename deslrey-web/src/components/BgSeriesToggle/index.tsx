'use client';

import React from 'react';
import { Image, Paintbrush, Mountain } from 'lucide-react';
import styles from './index.module.scss';
import classNames from 'classnames';
import { useBgSeries } from '../BgSeriesProvider';

const BgSeriesToggle: React.FC = () => {
    const { series, setSeries } = useBgSeries();

    const options = [
        { key: 'sex', icon: <Image size={18} />, label: '性感' },
        { key: 'pure', icon: <Paintbrush size={18} />, label: '纯色' },
        { key: 'scenery', icon: <Mountain size={18} />, label: '风景' },
    ] as const;

    return (
        <div className={styles.bgToggleGroup}>
            {options.map(({ key, icon, label }) => (
                <button
                    key={key}
                    className={classNames(styles.bgToggleBtn, {
                        [styles.active]: series === key,
                    })}
                    onClick={() => setSeries(key)}
                    title={label}
                >
                    {icon}
                </button>
            ))}
        </div>
    );
};

export default BgSeriesToggle;
