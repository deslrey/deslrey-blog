'use client';

import React from 'react';
import { Sun, Moon, Monitor } from 'lucide-react';
import { useTheme } from '@/components/ThemeProvider/ThemeProvider';
import styles from './index.module.scss';
import classNames from 'classnames';

const ThemeToggle: React.FC = () => {
    const { mode, setMode } = useTheme();

    const options = [
        { key: 'light', icon: <Sun size={18} /> },
        { key: 'dark', icon: <Moon size={18} /> },
        { key: 'system', icon: <Monitor size={18} /> },
    ] as const;

    return (
        <div className={styles.themeToggleGroup}>
            {options.map(({ key, icon }) => (
                <button
                    key={key}
                    className={classNames(styles.themeToggleBtn, {
                        [styles.active]: mode === key,
                    })}
                    onClick={() => setMode(key)}
                >
                    {icon}
                </button>
            ))}
        </div>
    );
};

export default ThemeToggle;
