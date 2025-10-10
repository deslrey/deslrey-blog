'use client';

import { createContext, useContext, useEffect, useState } from 'react';

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

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
    const [mode, setMode] = useState<ThemeMode>('system');
    const [theme, setTheme] = useState<ActiveTheme>('light');

    useEffect(() => {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
        const savedMode = (localStorage.getItem('themeMode') as ThemeMode) || 'system';
        setMode(savedMode);

        const applyTheme = (mode: ThemeMode) => {
            let activeTheme: ActiveTheme;
            if (mode === 'system') {
                activeTheme = prefersDark.matches ? 'dark' : 'light';
            } else {
                activeTheme = mode;
            }

            setTheme(activeTheme);
            document.documentElement.setAttribute('data-theme', activeTheme);
        };

        applyTheme(savedMode);

        const handleSystemChange = (e: MediaQueryListEvent) => {
            if (mode === 'system') {
                const newTheme: ActiveTheme = e.matches ? 'dark' : 'light';
                setTheme(newTheme);
                document.documentElement.setAttribute('data-theme', newTheme);
            }
        };

        prefersDark.addEventListener('change', handleSystemChange);
        return () => prefersDark.removeEventListener('change', handleSystemChange);
    }, [mode]);

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
