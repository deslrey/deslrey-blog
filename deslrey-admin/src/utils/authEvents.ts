const AUTH_EXPIRED_EVENT = "admin:auth-expired";

export function emitAuthExpired(message = "登录超时，请重新登录") {
    window.dispatchEvent(
        new CustomEvent(AUTH_EXPIRED_EVENT, {
            detail: { message },
        })
    );
}

export function onAuthExpired(handler: (message: string) => void) {
    const listener = (event: Event) => {
        const customEvent = event as CustomEvent<{ message?: string }>;
        handler(customEvent.detail?.message ?? "登录超时，请重新登录");
    };
    window.addEventListener(AUTH_EXPIRED_EVENT, listener);
    return () => window.removeEventListener(AUTH_EXPIRED_EVENT, listener);
}
