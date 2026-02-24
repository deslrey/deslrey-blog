import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { useLocation } from "react-router";
import styles from "./index.module.scss";

type ProgressState = "idle" | "running" | "complete";

interface TopProgressContextValue {
  start: () => void;
  done: () => void;
}

const TopProgressContext = createContext<TopProgressContextValue | null>(null);

export function useTopProgress() {
  const ctx = useContext(TopProgressContext);
  return ctx;
}

export function TopProgressBar({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<ProgressState>("idle");
  const [width, setWidth] = useState(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const popstateDoneRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const location = useLocation();
  const prevKeyRef = useRef(location.key);

  const start = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    setState("running");
    setWidth(0);
    requestAnimationFrame(() => {
      setWidth(70);
    });
  }, []);

  const done = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setWidth(100);
    setState("complete");
    timerRef.current = setTimeout(() => {
      setState("idle");
      setWidth(0);
      timerRef.current = null;
    }, 200);
  }, []);

  // 路由变化时完成进度条
  useEffect(() => {
    if (prevKeyRef.current !== location.key) {
      prevKeyRef.current = location.key;
      done();
    }
  }, [location.key, done]);

  // 点击站内链接时开始进度条
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = (e.target as Element).closest("a");
      if (!target || target.target === "_blank" || target.hasAttribute("download")) return;
      const href = target.getAttribute("href");
      if (!href || href.startsWith("#") || href.startsWith("mailto:") || href.startsWith("tel:")) return;
      if (href.startsWith("/") || (typeof window !== "undefined" && new URL(href, window.location.origin).origin === window.location.origin)) {
        start();
      }
    };
    // 前进/返回时：主动在短延迟后完成，避免依赖 location 更新时机导致卡住
    const onPopState = () => {
      start();
      if (popstateDoneRef.current) clearTimeout(popstateDoneRef.current);
      popstateDoneRef.current = setTimeout(() => done(), 80);
    };
    document.addEventListener("click", handleClick, true);
    window.addEventListener("popstate", onPopState);
    return () => {
      document.removeEventListener("click", handleClick, true);
      window.removeEventListener("popstate", onPopState);
      if (popstateDoneRef.current) clearTimeout(popstateDoneRef.current);
    };
  }, [start, done]);

  const visible = state !== "idle";
  const isComplete = state === "complete";

  return (
    <TopProgressContext.Provider value={{ start, done }}>
      {visible && (
        <div
          className={`${styles.bar} ${isComplete ? styles.barComplete : ""}`}
          style={{ transform: `scaleX(${width / 100})` }}
          aria-hidden
        />
      )}
      {children}
    </TopProgressContext.Provider>
  );
}
