import React, { useState, useEffect, useRef, type ReactNode } from "react";

interface LazyLoadProps {
    children: ReactNode;
    placeholder?: ReactNode;
    threshold?: number;
    rootMargin?: string;
    className?: string;
}

/**
 * A reusable LazyLoad component using IntersectionObserver.
 * Defer the rendering of children until they are near the viewport.
 */
const LazyLoad: React.FC<LazyLoadProps> = ({
    children,
    placeholder = null,
    threshold = 0.1,
    rootMargin = "0px 0px 200px 0px", // Load 200px before it enters the viewport
    className = "",
}) => {
    const [isVisible, setIsVisible] = useState(false);
    const containerRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (isVisible) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.disconnect();
                }
            },
            { threshold, rootMargin }
        );

        if (containerRef.current) {
            observer.observe(containerRef.current);
        }

        return () => observer.disconnect();
    }, [isVisible, threshold, rootMargin]);

    return (
        <div ref={containerRef} className={className}>
            {isVisible ? children : placeholder}
        </div>
    );
};

export default LazyLoad;
