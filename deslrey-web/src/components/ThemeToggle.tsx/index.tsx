import React from 'react';
import { Sun, Moon, Monitor } from 'lucide-react';
import styles from './index.module.scss';
import classNames from 'classnames';
import { useTheme } from '../ThemeProvider';

const ThemeToggle: React.FC = () => {
    const { mode, setMode } = useTheme();

    const options = [
        { key: 'light', icon: <Sun size={18} />, label: '白天' },
        { key: 'dark', icon: <Moon size={18} />, label: '黑夜' },
        { key: 'system', icon: <Monitor size={18} />, label: '系统' },
    ] as const;

    return (
        <div className={styles.themeToggleGroup}>
            {options.map(({ key, icon, label }) => (
                <button
                    key={key}
                    className={classNames(styles.themeToggleBtn, {
                        [styles.active]: mode === key,
                    })}
                    onClick={() => setMode(key)}
                    title={label}
                >
                    {icon}
                </button>
            ))}
        </div>
    );
};

export default ThemeToggle;
