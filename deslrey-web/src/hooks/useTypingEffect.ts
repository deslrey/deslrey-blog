import { useState, useEffect } from 'react';

interface TypingOptions {
    typingSpeed?: number;
    deletingSpeed?: number;
    holdTime?: number;
}

interface TypingItem {
    text: string;
    highlight?: string;
}

/**
 * 自定义钩子，用于创建打字机动画效果
 * @param items - 需要逐字输入的文本数组
 * @param options - 速度和停顿时间的配置
 */
export const useTypingEffect = (
    items: TypingItem[],
    {
        typingSpeed = 120,
        deletingSpeed = 80,
        holdTime = 1500,
    }: TypingOptions = {}
) => {
    const [index, setIndex] = useState(0);
    const [charIndex, setCharIndex] = useState(0);
    const [isDeleting, setIsDeleting] = useState(false);

    const currentItem = items[index];
    const currentText = currentItem.text.slice(0, charIndex);

    useEffect(() => {
        let timer: number;

        const handleTyping = () => {
            if (!isDeleting && charIndex < currentItem.text.length) {
                setCharIndex((prev) => prev + 1);
                timer = window.setTimeout(handleTyping, typingSpeed);
            } else if (!isDeleting && charIndex === currentItem.text.length) {
                timer = window.setTimeout(() => {
                    setIsDeleting(true);
                    handleTyping();
                }, holdTime);
            } else if (isDeleting && charIndex > 0) {
                setCharIndex((prev) => prev - 1);
                timer = window.setTimeout(handleTyping, deletingSpeed);
            } else if (isDeleting && charIndex === 0) {
                setIsDeleting(false);
                setIndex((prev) => (prev + 1) % items.length);
                timer = window.setTimeout(handleTyping, typingSpeed);
            }
        };

        timer = window.setTimeout(handleTyping, typingSpeed);

        return () => clearTimeout(timer);
    }, [index, isDeleting, items.length, typingSpeed, deletingSpeed, holdTime, currentItem.text.length]);

    return {
        currentText,
        currentItem,
        isFinished: !isDeleting && charIndex === currentItem.text.length,
    };
};
