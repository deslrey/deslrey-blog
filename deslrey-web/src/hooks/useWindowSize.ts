import { useState, useEffect } from 'react';

/**
 * 自定义钩子，用于跟踪窗口大小并判断是否为移动视图
 * @param breakpoint - 移动设备适用的像素宽度（默认值：768）
 */
export const useWindowSize = (breakpoint: number = 768) => {
    const [size, setSize] = useState({
        width: typeof window !== 'undefined' ? window.innerWidth : 0,
        height: typeof window !== 'undefined' ? window.innerHeight : 0,
    });

    const [isMobile, setIsMobile] = useState(
        typeof window !== 'undefined' ? window.innerWidth <= breakpoint : false
    );

    useEffect(() => {
        if (typeof window === 'undefined') return;

        const handleResize = () => {
            const width = window.innerWidth;
            const height = window.innerHeight;
            setSize({ width, height });
            setIsMobile(width <= breakpoint);
        };

        window.addEventListener('resize', handleResize);
        
        // Initial call to set state correctly
        handleResize();

        return () => window.removeEventListener('resize', handleResize);
    }, [breakpoint]);

    return { ...size, isMobile };
};
