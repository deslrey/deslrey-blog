export function delayImport<T>(importFn: () => Promise<T>, ms: number) {
    return new Promise<T>((resolve) => {
        setTimeout(() => {
            importFn().then(resolve);
        }, ms);
    });
}
