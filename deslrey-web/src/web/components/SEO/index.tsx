import React, { useEffect } from 'react';

interface SEOProps {
    title?: string;
    description?: string;
    keywords?: string;
}

/**
 * 用于处理文档元数据和标题的组件
 */
const SEO: React.FC<SEOProps> = ({ title, description, keywords }) => {
    useEffect(() => {
        if (title) {
            document.title = title;
        }

        const updateMeta = (name: string, content: string) => {
            let meta = document.querySelector(`meta[name="${name}"]`);
            if (meta) {
                meta.setAttribute('content', content);
            } else {
                meta = document.createElement('meta');
                meta.setAttribute('name', name);
                meta.setAttribute('content', content);
                document.head.appendChild(meta);
            }
        };

        if (description) {
            updateMeta('description', description);
        }

        if (keywords) {
            updateMeta('keywords', keywords);
        }
    }, [title, description, keywords]);

    return null;
};

export default SEO;
