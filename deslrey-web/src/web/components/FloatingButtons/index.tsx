import React, { useState, useEffect, useRef } from 'react';
import { ArrowUp, Share2, Twitter, Facebook, Link2, Check, TableOfContents } from 'lucide-react';
import styles from './index.module.scss';

interface FloatingButtonsProps {
    title: string;
    url?: string;
    onTocClick?: () => void;
    showTocButton?: boolean;
}

const FloatingButtons: React.FC<FloatingButtonsProps> = ({
    title,
    url,
    onTocClick,
}) => {
    const [isShareOpen, setIsShareOpen] = useState(false);
    const [copied, setCopied] = useState(false);
    const [showScrollTop, setShowScrollTop] = useState(false);
    const [showTocButton, setShowTocButton] = useState(false);
    const [showOtherButtons, setShowOtherButtons] = useState(true);
    const shareUrl = url || window.location.href;
    const shareContainerRef = useRef<HTMLDivElement>(null);
    const lastScrollY = useRef(0);

    // 监听窗口大小变化
    useEffect(() => {
        const handleResize = () => {
            setShowTocButton(window.innerWidth <= 1280);
        };

        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // 监听滚动显示/隐藏按钮
    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;

            // 回到顶部按钮：滚动超过300px时显示
            setShowScrollTop(currentScrollY > 300);

            // 分享和目录按钮：向下滚动隐藏，向上滚动显示
            if (currentScrollY > lastScrollY.current && currentScrollY > 100) {
                // 向下滚动且超过100px，隐藏
                setShowOtherButtons(false);
            } else if (currentScrollY < lastScrollY.current) {
                // 向上滚动，显示
                setShowOtherButtons(true);
            }

            lastScrollY.current = currentScrollY;
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // 点击外部关闭分享菜单
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (shareContainerRef.current && !shareContainerRef.current.contains(event.target as Node)) {
                setIsShareOpen(false);
            }
        };

        if (isShareOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isShareOpen]);

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleCopyLink = async () => {
        try {
            await navigator.clipboard.writeText(shareUrl);
            setCopied(true);
            setTimeout(() => {
                setCopied(false);
                setIsShareOpen(false);
            }, 1500);
        } catch (err) {
            console.error('复制失败:', err);
        }
    };

    const handleShare = (platform: 'twitter' | 'facebook') => {
        const encodedUrl = encodeURIComponent(shareUrl);
        const encodedTitle = encodeURIComponent(title);

        const urls = {
            twitter: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`,
            facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`
        };

        window.open(urls[platform], '_blank', 'width=600,height=400');
        setIsShareOpen(false);
    };

    return (
        <div className={styles.floatingButtons}>
            {/* 分享按钮 */}
            {showOtherButtons && (
                <div className={styles.shareContainer} ref={shareContainerRef}>
                    <button
                        className={styles.button}
                        onClick={() => setIsShareOpen(!isShareOpen)}
                        aria-label="分享"
                    >
                        <Share2 size={20} />
                    </button>

                    {isShareOpen && (
                        <div className={styles.shareMenu}>
                            <button
                                className={styles.shareItem}
                                onClick={() => handleShare('twitter')}
                                aria-label="分享到 Twitter"
                            >
                                <Twitter size={18} />
                            </button>
                            <button
                                className={styles.shareItem}
                                onClick={() => handleShare('facebook')}
                                aria-label="分享到 Facebook"
                            >
                                <Facebook size={18} />
                            </button>
                            <button
                                className={styles.shareItem}
                                onClick={handleCopyLink}
                                aria-label="复制链接"
                            >
                                {copied ? <Check size={18} /> : <Link2 size={18} />}
                            </button>
                        </div>
                    )}
                </div>
            )}

            {/* 回到顶部按钮 */}
            {showScrollTop && (
                <button
                    className={styles.button}
                    onClick={scrollToTop}
                    aria-label="回到顶部"
                >
                    <ArrowUp size={20} />
                </button>
            )}

            {/* 目录按钮 */}
            {showTocButton && showOtherButtons && (
                <button
                    className={styles.button}
                    onClick={onTocClick}
                    aria-label="目录"
                >
                    <TableOfContents size={20} />
                </button>
            )}
        </div>
    );
};

export default FloatingButtons;
