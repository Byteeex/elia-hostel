"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Component, Suspense, useEffect, useMemo, useRef, type ReactNode } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useTexture } from "@react-three/drei";
import * as THREE from "three";
import { buildPlant } from "@/components/three/botany";
import { qualityPresets, type SceneMetrics, type SceneQuality } from "@/components/three/quality";
import { assetPath } from "@/lib/assets";

type Props = { metrics: SceneMetrics; quality: SceneQuality; onDegrade: () => void; onError: () => void };

function DocumentScene({ metrics, quality, onDegrade }: Omit<Props, "onError">) {
  const { invalidate, size } = useThree();
  const plant = useMemo(() => buildPlant(metrics, quality), [metrics, quality]);
  const group = useRef<THREE.Group>(null);
  const leaves = useRef<[THREE.InstancedMesh | null, THREE.InstancedMesh | null]>([null, null]);
  const progress = useRef(0);
  const activeUntil = useRef(0);
  const frameSamples = useRef({ count: 0, sum: 0, lastDowngrade: 0 });
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const stemMaterial = useMemo(() => new THREE.MeshStandardMaterial({ color: "#526443", roughness: .9 }), []);
  const leafTextures = useTexture([assetPath("/textures/ivy-leaf.webp"), assetPath("/textures/ivy-leaf-young.webp")]);
  const leafMaterials = useMemo(() => leafTextures.map(source => {
    const texture = source.clone();
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.anisotropy = quality === "high" ? 4 : 2;
    texture.needsUpdate = true;
    return new THREE.MeshStandardMaterial({ map: texture, color: "#ffffff", side: THREE.DoubleSide, roughness: .72, metalness: 0, alphaTest: .28, emissive: "#182c17", emissiveIntensity: .1 });
  }), [leafTextures, quality]);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const update = () => {
      const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      progress.current = THREE.MathUtils.clamp(window.scrollY / max, 0, 1);
      activeUntil.current = performance.now() + 220;
      invalidate();
    };
    const trigger = ScrollTrigger.create({
      trigger: document.body,
      start: 0,
      end: () => Math.max(1, document.documentElement.scrollHeight - window.innerHeight),
      onUpdate: update,
      onRefresh: update,
    });
    const onVisibility = () => { if (!document.hidden) update(); };
    window.addEventListener("scroll", update, { passive: true });
    document.addEventListener("visibilitychange", onVisibility);
    update();
    ScrollTrigger.refresh();
    return () => {
      trigger.kill();
      window.removeEventListener("scroll", update);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [metrics.height, invalidate]);

  useEffect(() => () => {
    plant.stem.dispose();
    plant.branches.dispose();
    plant.leaf.dispose();
  }, [plant]);
  useEffect(() => () => { stemMaterial.dispose(); leafMaterials.forEach(material => { material.map?.dispose(); material.dispose(); }); }, [stemMaterial, leafMaterials]);

  useFrame((state, delta) => {
    if (!group.current || !leaves.current[0] || !leaves.current[1]) return;
    const scroll = window.scrollY;
    group.current.position.y = size.height / 2 + scroll;
    const growthAt = .018 + .982 * progress.current;
    const growthY = plant.startY + growthAt * (plant.endY - plant.startY);
    const visibleTop = Math.max(plant.startY, scroll - 120);
    const visibleBottom = Math.min(plant.endY, scroll + size.height + 120);
    const firstSegment = THREE.MathUtils.clamp(Math.floor((visibleTop - plant.startY) / (plant.endY - plant.startY) * plant.stemSegments), 0, plant.stemSegments);
    const lastSegment = THREE.MathUtils.clamp(Math.ceil((Math.min(growthY, visibleBottom) - plant.startY) / (plant.endY - plant.startY) * plant.stemSegments), 0, plant.stemSegments);
    const segmentIndices = plant.radial * 6;
    plant.stem.setDrawRange(firstSegment * segmentIndices, Math.max(0, lastSegment - firstSegment) * segmentIndices);

    let firstBranch = -1, branchEnd = 0;
    for (const stage of plant.stages) {
      if (stage.documentY < visibleTop - 80 || stage.documentY > visibleBottom + 80 || stage.at > growthAt) continue;
      if (firstBranch < 0) firstBranch = stage.start;
      const reveal = THREE.MathUtils.clamp((growthAt - stage.at) / stage.duration, 0, 1);
      const completeTriangles = Math.floor(stage.count * reveal / 3) * 3;
      branchEnd = stage.start + completeTriangles;
    }
    plant.branches.setDrawRange(Math.max(0, firstBranch), firstBranch < 0 ? 0 : Math.max(0, branchEnd - firstBranch));

    const visibleLeaves = [0, 0];
    for (const leaf of plant.leaves) {
      if (leaf.documentY < visibleTop - 80 || leaf.documentY > visibleBottom + 80 || leaf.at > growthAt) continue;
      const age = THREE.MathUtils.clamp((growthAt - leaf.at) / .018, 0, 1);
      const unfold = age * age * (3 - 2 * age);
      dummy.position.copy(leaf.point);
      dummy.rotation.set(.15 + Math.sin(state.clock.elapsedTime * .8 + leaf.phase) * .025, leaf.side * (.22 + Math.sin(leaf.phase) * .22), leaf.angle + Math.sin(state.clock.elapsedTime * .9 + leaf.phase) * .022);
      dummy.scale.setScalar(Math.max(.001, leaf.scale * unfold));
      dummy.updateMatrix();
      const mesh = leaves.current[leaf.variant]!;
      mesh.setMatrixAt(visibleLeaves[leaf.variant], dummy.matrix);
      mesh.setColorAt(visibleLeaves[leaf.variant], leaf.color);
      visibleLeaves[leaf.variant]++;
    }
    leaves.current.forEach((mesh, variant) => {
      if (!mesh) return;
      mesh.count = visibleLeaves[variant];
      mesh.instanceMatrix.needsUpdate = true;
      if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
    });

    const now = performance.now();
    if (!document.hidden && now < activeUntil.current && delta > 0 && delta < .12) {
      frameSamples.current.count++;
      frameSamples.current.sum += delta;
      if (frameSamples.current.count >= 90) {
        const average = frameSamples.current.sum / frameSamples.current.count;
        frameSamples.current.count = 0;
        frameSamples.current.sum = 0;
        if (quality !== "low" && average > .032 && now - frameSamples.current.lastDowngrade > 10000) {
          frameSamples.current.lastDowngrade = now;
          onDegrade();
        }
      }
    }
  });

  return <group ref={group}>
    <mesh geometry={plant.stem} material={stemMaterial} frustumCulled={false} dispose={null} />
    <mesh geometry={plant.branches} material={stemMaterial} frustumCulled={false} dispose={null} />
    {leafMaterials.map((material, variant) => <instancedMesh key={variant} ref={element => { leaves.current[variant as 0 | 1] = element; }} args={[plant.leaf, material, plant.leaves.length]} frustumCulled={false} dispose={null} />)}
  </group>;
}

class CanvasErrorBoundary extends Component<{ children: ReactNode; onError: () => void }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  componentDidCatch() { this.props.onError(); }
  render() { return this.state.failed ? null : this.props.children; }
}

export default function IvyCanvas({ metrics, quality, onDegrade, onError }: Props) {
  const preset = qualityPresets[quality];
  return <CanvasErrorBoundary onError={onError}><Canvas
    orthographic
    camera={{ position: [0, 0, 500], zoom: 1, near: .1, far: 1100 }}
    frameloop="demand"
    dpr={[1, preset.maxDpr]}
    gl={{ alpha: true, antialias: quality !== "low", powerPreference: quality === "high" ? "high-performance" : "low-power" }}
    onCreated={({ gl }) => {
      gl.outputColorSpace = THREE.SRGBColorSpace;
      gl.toneMapping = THREE.ACESFilmicToneMapping;
      gl.toneMappingExposure = 1.06;
      gl.domElement.addEventListener("webglcontextlost", onError, { once: true });
    }}
    style={{ pointerEvents: "none" }}
  >
    <ambientLight intensity={.64} />
    <hemisphereLight args={["#fff0d6", "#52664f", quality === "low" ? .64 : .82]} />
    <directionalLight position={[-180, 260, 270]} intensity={2.65} color="#ffe6bb" />
    {quality !== "low" && <directionalLight position={[170, -110, 150]} intensity={.38} color="#dcebd1" />}
    <Suspense fallback={null}><DocumentScene metrics={metrics} quality={quality} onDegrade={onDegrade} /></Suspense>
  </Canvas></CanvasErrorBoundary>;
}
