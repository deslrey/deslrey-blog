import React, { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';
import styles from './index.module.scss';

const ScrollToTop: React.FC = () => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const toggleVisibility = () => {
            if (window.scrollY > 300) {
                setIsVisible(true);
            } else {
                setIsVisible(false);
            }
        };

        window.addEventListener('scroll', toggleVisibility);
        return () => window.removeEventListener('scroll', toggleVisibility);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    return (
        <>
            {isVisible && (
                <button
                    className={styles.scrollToTop}
                    onClick={scrollToTop}
                    aria-label="返回顶部"
                >
                    <ArrowUp size={20} />
                </button>
            )}
        </>
    );
};

export default ScrollToTop;
