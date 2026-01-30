import React from 'react';
import styles from './index.module.css';

interface CheckboxProps {
    checked: boolean;
    onChange: () => void;
}

const Checkbox: React.FC<CheckboxProps> = ({ checked, onChange }) => {
    return (
        <div className={styles.toggleWrapper} onClick={onChange}>
            <div className={`${styles.bars} ${styles.bar1} ${checked ? styles.open : ''}`}></div>
            <div className={`${styles.bars} ${styles.bar2} ${checked ? styles.open : ''}`}></div>
            <div className={`${styles.bars} ${styles.bar3} ${checked ? styles.open : ''}`}></div>
        </div>
    );
};

export default Checkbox;
