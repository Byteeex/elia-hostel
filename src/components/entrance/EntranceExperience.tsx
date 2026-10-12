"use client";

import dynamic from "next/dynamic";
import { Component, useCallback, useEffect, useState, type ReactNode } from "react";

const DoorCanvas = dynamic(() => import("./DoorCanvas"), { ssr: false });
const KEY = "elia-entrance-seen";

class DoorErrorBoundary extends Component<{ children: ReactNode; onError: () => void }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  componentDidCatch() { this.props.onError(); }
  render() { return this.state.failed ? null : this.props.children; }
}

export function EntranceExperience() {
  const [visible, setVisible] = useState(true);
  const [ready, setReady] = useState(false);
  const [modelReady, setModelReady] = useState(false);
  const [requested, setRequested] = useState(false);
  const [entering, setEntering] = useState(false);
  const [reduced, setReduced] = useState(false);
  const [webgl, setWebgl] = useState(true);

  const finish = useCallback(() => {
    try { sessionStorage.setItem(KEY, "1"); } catch { /* storage may be disabled */ }
    setVisible(false);
    document.dispatchEvent(new Event("elia:entered"));
    requestAnimationFrame(() => document.getElementById("main")?.focus({ preventScroll: true }));
  }, []);

  useEffect(() => {
    const preview = new URLSearchParams(location.search).has("intro");
    let seen = !preview && Boolean(location.hash);
    try { if (!preview) seen ||= sessionStorage.getItem(KEY) === "1"; } catch { /* storage may be disabled */ }
    if (seen) { const frame = requestAnimationFrame(() => setVisible(false)); return () => cancelAnimationFrame(frame); }
    const motion = matchMedia("(prefers-reduced-motion: reduce)");
    let available = false;
    try {
      const canvas = document.createElement("canvas");
      available = Boolean(canvas.getContext("webgl2") || canvas.getContext("webgl"));
    } catch { /* use the accessible static entrance */ }
    const frame = requestAnimationFrame(() => {
      setReduced(motion.matches);
      setWebgl(available);
      setReady(true);
      document.querySelector<HTMLButtonElement>(".entrance-button")?.focus({ preventScroll: true });
    });
    const before = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { cancelAnimationFrame(frame); document.body.style.overflow = before; };
  }, [visible]);

  useEffect(() => {
    if (!visible) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") finish();
      if (event.key !== "Tab") return;
      const controls = [...document.querySelectorAll<HTMLButtonElement>(".entrance button:not(:disabled)")];
      if (!controls.length) return;
      const first = controls[0], last = controls[controls.length - 1];
      if (!controls.includes(document.activeElement as HTMLButtonElement)) { event.preventDefault(); (event.shiftKey ? last : first).focus(); return; }
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [visible, finish]);

  if (!visible) return null;
  const enter = () => {
    if (requested || entering) return;
    if (!ready || reduced || !webgl) { finish(); return; }
    setRequested(true);
    if (modelReady) setEntering(true);
  };
  const onDoorReady = () => {
    setModelReady(true);
    if (requested) setEntering(true);
  };
  return <div className={`entrance${entering ? " entrance--entering" : ""}`} role="dialog" aria-modal="true" aria-label="Enter Elia Hostel">
    <div className="entrance-scene" aria-hidden="true">{ready && webgl && <DoorErrorBoundary onError={() => { setWebgl(false); if (requested) finish(); }}><DoorCanvas entering={entering} onReady={onDoorReady} onComplete={finish} /></DoorErrorBoundary>}</div>
    <div className="entrance-vignette" aria-hidden="true" />
    <div className="entrance-glow" aria-hidden="true" />
    <div className="entrance-top"><span className="entrance-brand">ELIA <small>HOSTEL</small></span><button className="entrance-skip" onClick={finish}>Skip intro <span aria-hidden="true">↗</span></button></div>
    <div className="entrance-content"><p className="entrance-kicker">TANGIER · OLD MEDINA</p><h1>Every journey<br />begins at a <em>door.</em></h1><p>Come in. Your little corner of Tangier is waiting.</p><button className="entrance-button" onClick={enter} disabled={requested}>{entering ? "Opening…" : requested ? "Preparing…" : "Enter Elia"}<span aria-hidden="true">→</span></button></div>
    <p className="entrance-foot">A LITTLE PLACE TO FEEL AT HOME</p>
  </div>;
}
