import React, { useState, useEffect, useRef } from 'react';
import { Share2, Twitter, Facebook, Link2, Check } from 'lucide-react';
import styles from './index.module.scss';

interface ShareButtonsProps {
    title: string;
    url?: string;
}

const ShareButtons: React.FC<ShareButtonsProps> = ({ title, url }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [copied, setCopied] = useState(false);
    const shareUrl = url || window.location.href;
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen]);

    const handleCopyLink = async () => {
        try {
            await navigator.clipboard.writeText(shareUrl);
            setCopied(true);
            setTimeout(() => {
                setCopied(false);
                setIsOpen(false);
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
        setIsOpen(false);
    };

    return (
        <div className={styles.shareButtons} ref={containerRef}>
            <button
                className={styles.shareToggle}
                onClick={() => setIsOpen(!isOpen)}
                aria-label="分享"
            >
                <Share2 size={20} />
            </button>

            {isOpen && (
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
    );
};

export default ShareButtons;
