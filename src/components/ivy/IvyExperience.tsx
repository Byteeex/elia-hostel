"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useState } from "react";
import { initialQuality, nextLowerQuality, type SceneMetrics, type SceneQuality } from "@/components/three/quality";

const IvyCanvas = dynamic(() => import("./IvyCanvas"), { ssr: false });

function readWebGL() {
  try {
    const canvas = document.createElement("canvas");
    return canvas.getContext("webgl2", { failIfMajorPerformanceCaveat: true }) || canvas.getContext("webgl", { failIfMajorPerformanceCaveat: true });
  } catch { return null; }
}

function readMetrics(): SceneMetrics {
  return {
    width: window.innerWidth,
    height: document.documentElement.scrollHeight,
  };
}

export function IvyExperience() {
  const [metrics, setMetrics] = useState<SceneMetrics | null>(null);
  const [quality, setQuality] = useState<SceneQuality>("medium");
  const [fallback, setFallback] = useState(false);
  const [ready, setReady] = useState(false);
  const [entranceDone, setEntranceDone] = useState(false);
  const degrade = useCallback(() => setQuality(previous => nextLowerQuality(previous)), []);

  useEffect(() => {
    const preview = new URLSearchParams(location.search).has("intro");
    let entered = !preview && Boolean(location.hash);
    try { if (!preview) entered ||= sessionStorage.getItem("elia-entrance-seen") === "1"; } catch { /* storage may be disabled */ }
    const frame = requestAnimationFrame(() => setEntranceDone(entered));
    const onEnter = () => setEntranceDone(true);
    document.addEventListener("elia:entered", onEnter);
    return () => { cancelAnimationFrame(frame); document.removeEventListener("elia:entered", onEnter); };
  }, []);

  useEffect(() => {
    const motion = matchMedia("(prefers-reduced-motion: reduce)");
    const gl = readWebGL();
    const detectedQuality = gl ? initialQuality(gl) : "low";
    gl?.getExtension("WEBGL_lose_context")?.loseContext();
    const setupFrame = requestAnimationFrame(() => {
      setFallback(motion.matches || !gl);
      setQuality(detectedQuality);
    });

    let frame = 0;
    const measure = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => setMetrics(previous => {
        const next = readMetrics();
        return previous?.width === next.width && previous.height === next.height ? previous : next;
      }));
    };
    measure();
    const observer = new ResizeObserver(measure);
    const main = document.querySelector("main");
    if (main) observer.observe(main);
    window.addEventListener("resize", measure);
    const motionChange = () => setFallback(motion.matches || !gl);
    motion.addEventListener("change", motionChange);
    document.fonts.ready.then(measure);
    const idle = window.requestIdleCallback?.(() => setReady(true), { timeout: 1600 });
    const timer = idle === undefined ? window.setTimeout(() => setReady(true), 500) : undefined;
    return () => {
      cancelAnimationFrame(setupFrame);
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener("resize", measure);
      motion.removeEventListener("change", motionChange);
      if (idle !== undefined) window.cancelIdleCallback(idle);
      if (timer !== undefined) window.clearTimeout(timer);
    };
  }, []);

  if (!metrics || !entranceDone) return null;
  if (fallback) return <div className="ivy-fallback" aria-hidden="true"><svg viewBox="0 0 110 650" role="presentation"><defs><path id="ivy-leaf" d="M0 0 C6 -10 17 -9 21 -19 C27 -13 25 -5 21 -1 C34 -3 39 10 29 17 C20 22 12 15 8 12 C6 24 -3 30 -13 22 C-20 16 -14 6 -8 4 C-19 3 -25 -9 -15 -16 C-6 -19 -3 -7 0 0Z" /></defs><path d="M92 -20 C19 70 99 132 53 220 C15 291 109 339 50 431 C7 498 86 557 31 672" fill="none" stroke="#4b5c3c" strokeWidth="4" strokeLinecap="round"/><g fill="#53694b" stroke="#314a36" strokeWidth="1.5"><use href="#ivy-leaf" transform="translate(65 54) rotate(-25) scale(.75)"/><use href="#ivy-leaf" transform="translate(72 125) rotate(32) scale(.9)"/><use href="#ivy-leaf" transform="translate(47 211) rotate(-35) scale(1.1)"/><use href="#ivy-leaf" transform="translate(72 304) rotate(26) scale(.8)"/><use href="#ivy-leaf" transform="translate(41 422) rotate(-40) scale(1)"/><use href="#ivy-leaf" transform="translate(68 519) rotate(32) scale(.85)"/><use href="#ivy-leaf" transform="translate(26 608) rotate(-31) scale(.7)"/></g></svg></div>;
  return ready ? <div className="ivy-layer" aria-hidden="true"><IvyCanvas metrics={metrics} quality={quality} onDegrade={degrade} onError={() => setFallback(true)} /></div> : null;
}
