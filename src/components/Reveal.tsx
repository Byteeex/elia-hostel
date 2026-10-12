"use client";
import { useEffect, useRef } from "react";
import type { PropsWithChildren } from "react";

export function Reveal({ children, className = "" }: PropsWithChildren<{ className?: string }>) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let context: { revert: () => void } | undefined;
    let active = true;
    Promise.all([import("gsap"), import("gsap/ScrollTrigger")]).then(([{ gsap }, { ScrollTrigger }]) => {
      if (!active || !ref.current) return;
      gsap.registerPlugin(ScrollTrigger);
      context = gsap.context(() => {
        gsap.fromTo(ref.current, { opacity: 0, y: 38 }, { opacity: 1, y: 0, duration: 1, ease: "power2.out", scrollTrigger: { trigger: ref.current, start: "top 92%", once: true } });
      }, ref);
    });
    return () => { active = false; context?.revert(); };
  }, []);
  return <div ref={ref} className={className}>{children}</div>;
}
