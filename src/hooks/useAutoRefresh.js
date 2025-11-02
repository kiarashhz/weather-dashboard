import { useEffect, useRef } from "react";

export function useAutoRefresh(callback, intervalMs, enabled=true) {
  const saved = useRef(callback);
  useEffect(()=>{ saved.current = callback; }, [callback]);
  useEffect(() => {
    if (!enabled || !intervalMs) return;
    const id = setInterval(()=> saved.current?.(), intervalMs);
    return () => clearInterval(id);
  }, [enabled, intervalMs]);
  // pause when tab hidden
  useEffect(() => {
    function onVisibility(){
      if (document.visibilityState === "visible") saved.current?.();
    }
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, []);
}
