import { createContext, useContext, useEffect, useState, useRef } from 'react';

type ThemeMode = 'light' | 'dark' | 'system';
type ActiveTheme = 'light' | 'dark';

interface ThemeContextValue {
    mode: ThemeMode;
    theme: ActiveTheme;
    setMode: (mode: ThemeMode) => void;
    toggleMode: () => void;
}

const ThemeContext = createContext<ThemeContextValue>({
    mode: 'system',
    theme: 'light',
    setMode: () => { },
    toggleMode: () => { },
});

export function useTheme() {
    return useContext(ThemeContext);
}

// 创建水波纹动画函数
const createRippleEffect = (x: number, y: number) => {
    // 创建涟漪元素
    const ripple = document.createElement('div');
    ripple.className = 'theme-ripple';
    
    // 设置涟漪样式
    ripple.style.left = `${x - 10}px`; // 减去一半宽度以居中
    ripple.style.top = `${y - 10}px`;  // 减去一半高度以居中
    
    // 添加涟漪到页面
    document.body.appendChild(ripple);
    
    // 动画结束后移除元素
    setTimeout(() => {
        document.body.removeChild(ripple);
    }, 800);
};



export default function ThemeProvider({ children }: { children: React.ReactNode }) {
    const [mode, setMode] = useState<ThemeMode>('system');
    const [theme, setTheme] = useState<ActiveTheme>('light');
    const lastClickPosition = useRef<{ x: number; y: number } | null>(null);

    // 监听点击事件以记录点击位置
    useEffect(() => {
        const handleClick = (e: MouseEvent) => {
            lastClickPosition.current = { x: e.clientX, y: e.clientY };
        };
        
        document.addEventListener('click', handleClick);
        return () => document.removeEventListener('click', handleClick);
    }, []);

    useEffect(() => {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
        const savedMode = (localStorage.getItem('themeMode') as ThemeMode) || 'system';
        setMode(savedMode);

        const applyTheme = (mode: ThemeMode) => {
            const activeTheme: ActiveTheme =
                mode === 'system' ? (prefersDark.matches ? 'dark' : 'light') : mode;

            // 如果有记录的点击位置，则创建涟漪效果
            if (lastClickPosition.current) {
                createRippleEffect(lastClickPosition.current.x, lastClickPosition.current.y);
                lastClickPosition.current = null; // 清除点击位置
            }

            setTheme(activeTheme);
            document.documentElement.setAttribute('data-theme', activeTheme);
            updateHighlightStyle(activeTheme);
        };

        applyTheme(savedMode);

        const handleSystemChange = (e: MediaQueryListEvent) => {
            if (mode === 'system') {
                const newTheme: ActiveTheme = e.matches ? 'dark' : 'light';
                setTheme(newTheme);
                document.documentElement.setAttribute('data-theme', newTheme);
                updateHighlightStyle(newTheme);
            }
        };

        prefersDark.addEventListener('change', handleSystemChange);
        return () => prefersDark.removeEventListener('change', handleSystemChange);
    }, [mode]);

    const updateHighlightStyle = (activeTheme: ActiveTheme) => {
        const existingLight = document.querySelector('link[data-hljs="light"]');
        const existingDark = document.querySelector('link[data-hljs="dark"]');

        if (activeTheme === 'dark') {
            if (!existingDark) {
                const link = document.createElement('link');
                link.rel = 'stylesheet';
                link.href = '/highlight/github-dark.min.css';
                link.setAttribute('data-hljs', 'dark');
                document.head.appendChild(link);
            }
            if (existingLight) existingLight.remove();
        } else {
            if (!existingLight) {
                const link = document.createElement('link');
                link.rel = 'stylesheet';
                link.href = '/highlight/vs.css';
                link.setAttribute('data-hljs', 'light');
                document.head.appendChild(link);
            }
            if (existingDark) existingDark.remove();
        }
    };

    const toggleMode = () => {
        const nextMode: ThemeMode =
            mode === 'system' ? 'light' : mode === 'light' ? 'dark' : 'system';
        setMode(nextMode);
        localStorage.setItem('themeMode', nextMode);
    };

    const handleSetMode = (mode: ThemeMode) => {
        setMode(mode);
        localStorage.setItem('themeMode', mode);
    };

    return (
        <ThemeContext.Provider value={{ mode, theme, setMode: handleSetMode, toggleMode }}>
            {children}
        </ThemeContext.Provider>
    );
}
