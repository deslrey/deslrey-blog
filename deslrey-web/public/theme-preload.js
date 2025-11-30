(() => {
    const savedMode = localStorage.getItem('themeMode') || 'system';
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    const activeTheme =
        savedMode === 'system'
            ? (prefersDark ? 'dark' : 'light')
            : savedMode;

    document.documentElement.setAttribute('data-theme', activeTheme);
})();
