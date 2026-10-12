"use client";

import { Canvas, useThree } from "@react-three/fiber";
import { useGLTF, useTexture } from "@react-three/drei";
import gsap from "gsap";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { InteriorPlants } from "./InteriorPlants";

const URL = "/models/large-castle-door-1k.glb";

function Door({ entering, onComplete }: { entering: boolean; onComplete: () => void }) {
  const { scene } = useGLTF(URL);
  const model = useMemo(() => {
    const copy = scene.clone(true);
    copy.traverse(object => {
      if (object instanceof THREE.Mesh) { object.castShadow = true; object.receiveShadow = true; }
    });
    const frame = copy.getObjectByName("large_castle_door_frame");
    const right = copy.getObjectByName("large_castle_door_right");
    const left = copy.getObjectByName("large_castle_door_left");
    if (!frame || !right || !left) throw new Error("The supplied door export is missing its frame or leaves");
    const rightPosition = right.position.clone();
    const leftPosition = left.position.clone();
    right.position.set(0, 0, 0);
    left.position.set(0, 0, 0);
    return { frame, right, left, rightPosition, leftPosition };
  }, [scene]);
  const rightHinge = useRef<THREE.Group>(null);
  const leftHinge = useRef<THREE.Group>(null);
  const light = useRef<THREE.PointLight>(null);
  const { camera, invalidate } = useThree();

  useEffect(() => {
    if (!entering || !rightHinge.current || !leftHinge.current) return;
    const timeline = gsap.timeline({ onUpdate: invalidate, onComplete });
    timeline.to(rightHinge.current.rotation, { y: -1.53, duration: 1.55, ease: "power2.inOut" }, 0.12)
      .to(leftHinge.current.rotation, { y: 1.53, duration: 1.55, ease: "power2.inOut" }, 0.18)
      .to(light.current, { intensity: 6.3, duration: 1.3, ease: "power2.out" }, 0.32)
      .to(camera.position, { z: 1.65, duration: 1.45, ease: "power2.inOut" }, 0.55)
      .to(camera.position, { z: -1.05, x: .09, duration: 1.2, ease: "power2.inOut" }, 1.98);
    return () => { timeline.kill(); };
  }, [entering, camera, invalidate, onComplete]);

  // The source nodes' origins are their hinge positions; their mesh coordinates
  // already extend inward from those origins. Only each leaf joins a pivot.
  return <>
    <primitive object={model.frame} />
    <group ref={rightHinge} position={model.rightPosition}><primitive object={model.right} /></group>
    <group ref={leftHinge} position={model.leftPosition}><primitive object={model.left} /></group>
    <pointLight ref={light} position={[0, 1.5, -1.2]} intensity={2.4} color="#ffc882" distance={6} decay={2} />
  </>;
}

function HangingIvy() {
  const leaf = useTexture("/textures/ivy-leaf.webp");
  const leafMap = useMemo(() => {
    const map = leaf.clone();
    map.colorSpace = THREE.SRGBColorSpace;
    map.needsUpdate = true;
    return map;
  }, [leaf]);
  useEffect(() => () => leafMap.dispose(), [leafMap]);
  const stem = useMemo(() => new THREE.TubeGeometry(new THREE.CatmullRomCurve3([
    new THREE.Vector3(-1.44, 3.56, .14),
    new THREE.Vector3(-1.34, 2.86, .18),
    new THREE.Vector3(-1.49, 2.15, .2),
    new THREE.Vector3(-1.36, 1.52, .22),
    new THREE.Vector3(-1.49, .95, .22),
  ]), 56, .015, 5, false), []);
  const leaves = useMemo(() => Array.from({ length: 27 }, (_, index) => {
    const t = index / 26;
    return {
      x: -1.43 + Math.sin(t * Math.PI * 5) * .09 + (index % 2 ? .12 : -.12),
      y: 3.5 - t * 2.55,
      z: .27 + (index % 3) * .012,
      angle: (index % 2 ? -1 : 1) * (.28 + t * .2),
      size: .18 + (index % 5) * .022,
    };
  }), []);
  return <group>
    <mesh geometry={stem}><meshStandardMaterial color="#425a32" roughness={1} /></mesh>
    {leaves.map((item, index) => <mesh key={index} position={[item.x, item.y, item.z]} rotation={[0, 0, item.angle]} scale={item.size}>
      <planeGeometry args={[1, 1, 2, 2]} />
      <meshStandardMaterial map={leafMap} transparent alphaTest={.22} side={THREE.DoubleSide} roughness={.91} depthWrite={false} />
    </mesh>)}
  </group>;
}

function usePlaster() {
  const material = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = canvas.height = 128;
    const context = canvas.getContext("2d")!;
    const pixels = context.createImageData(128, 128);
    let seed = 73265;
    for (let i = 0; i < pixels.data.length; i += 4) {
      seed = (seed * 1664525 + 1013904223) >>> 0;
      const variation = (seed / 4294967296 - .5) * 20;
      pixels.data[i] = 215 + variation;
      pixels.data[i + 1] = 198 + variation;
      pixels.data[i + 2] = 169 + variation;
      pixels.data[i + 3] = 255;
    }
    context.putImageData(pixels, 0, 0);
    const map = new THREE.CanvasTexture(canvas);
    map.colorSpace = THREE.SRGBColorSpace;
    map.wrapS = map.wrapT = THREE.RepeatWrapping;
    map.repeat.set(3, 3);
    return new THREE.MeshStandardMaterial({ map, roughness: 1 });
  }, []);
  useEffect(() => () => { material.map?.dispose(); material.dispose(); }, [material]);
  return material;
}

function useTileMaterial() {
  const material = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = canvas.height = 512;
    const context = canvas.getContext("2d")!;
    let seed = 98276;
    const random = () => { seed = (seed * 1664525 + 1013904223) >>> 0; return seed / 4294967296; };
    context.fillStyle = "#afa996";
    context.fillRect(0, 0, 512, 512);
    for (let row = 0; row < 8; row++) for (let column = 0; column < 8; column++) {
      const x = column * 64 + 2, y = row * 64 + 2;
      context.fillStyle = (row + column) % 2 ? "#eee7d6" : "#294b52";
      context.fillRect(x, y, 60, 60);
      context.strokeStyle = (row + column) % 2 ? "rgba(44,77,82,.5)" : "rgba(238,231,214,.62)";
      context.lineWidth = 2;
      context.strokeRect(x + 11, y + 11, 38, 38);
      context.beginPath();
      context.moveTo(x + 30, y + 15);
      context.lineTo(x + 45, y + 30);
      context.lineTo(x + 30, y + 45);
      context.lineTo(x + 15, y + 30);
      context.closePath();
      context.stroke();
      for (let i = 0; i < 32; i++) {
        context.fillStyle = `rgba(91,72,49,${random() * .085})`;
        context.fillRect(x + random() * 60, y + random() * 60, 1 + random() * 2, 1 + random() * 2);
      }
    }
    const map = new THREE.CanvasTexture(canvas);
    map.colorSpace = THREE.SRGBColorSpace;
    map.wrapS = map.wrapT = THREE.RepeatWrapping;
    map.repeat.set(1.5, 4);
    map.anisotropy = 4;
    return new THREE.MeshStandardMaterial({ map, roughness: .94, metalness: 0 });
  }, []);
  useEffect(() => () => { material.map?.dispose(); material.dispose(); }, [material]);
  return material;
}

function Passage({ plaster, mobile }: { plaster: THREE.Material; mobile: boolean }) {
  const tile = useTileMaterial();
  return <group>
    <mesh position={[0, -.052, -3.28]} rotation={[-Math.PI / 2, 0, 0]} material={tile} receiveShadow><planeGeometry args={[2.28, 6.6]} /></mesh>
    <mesh position={[-1.22, 1.47, -3.3]} material={plaster} receiveShadow><boxGeometry args={[.2, 3.04, 6.7]} /></mesh>
    <mesh position={[1.22, 1.47, -3.3]} material={plaster} receiveShadow><boxGeometry args={[.2, 3.04, 6.7]} /></mesh>
    <mesh position={[0, 3.055, -3.3]} material={plaster} receiveShadow><boxGeometry args={[2.62, .18, 6.7]} /></mesh>
    <mesh position={[0, 1.48, -6.62]} material={plaster} receiveShadow><boxGeometry args={[2.62, 3.05, .18]} /></mesh>
    <mesh position={[-1.095, .16, -3.3]}><boxGeometry args={[.045, .33, 6.65]} /><meshStandardMaterial color="#526c68" roughness={.85} /></mesh>
    <mesh position={[1.095, .16, -3.3]}><boxGeometry args={[.045, .33, 6.65]} /><meshStandardMaterial color="#526c68" roughness={.85} /></mesh>
    <mesh position={[0, 1.46, -6.51]}><planeGeometry args={[1.18, 2.04]} /><meshStandardMaterial color="#a4673b" roughness={1} /></mesh>
    <mesh position={[0, 1.46, -6.48]}><planeGeometry args={[.94, 1.8]} /><meshBasicMaterial color="#f9d39c" toneMapped /></mesh>
    <mesh position={[0, 2.95, -3.12]}><cylinderGeometry args={[.01, .01, .48, 6]} /><meshStandardMaterial color="#4b3827" metalness={.35} roughness={.5} /></mesh>
    <mesh position={[0, 2.62, -3.12]}><cylinderGeometry args={[.19, .27, .34, 12, 1, true]} /><meshStandardMaterial color="#9a6332" metalness={.28} roughness={.52} side={THREE.DoubleSide} /></mesh>
    <mesh position={[0, 2.58, -3.12]}><sphereGeometry args={[.13, 12, 8]} /><meshBasicMaterial color="#ffdb9b" toneMapped={false} /></mesh>
    <pointLight position={[0, 2.58, -3.12]} color="#ffc47f" intensity={3.8} distance={4.2} decay={2} />
    <InteriorPlants mobile={mobile} />
  </group>;
}

function Scene({ entering, mobile, onReady, onComplete }: { entering: boolean; mobile: boolean; onReady: () => void; onComplete: () => void }) {
  const { camera } = useThree();
  const plaster = usePlaster();
  useEffect(() => {
    camera.position.set(0, 1.48, mobile ? 7.7 : 5.25);
    camera.lookAt(0, 1.48, 0);
    camera.updateProjectionMatrix();
  }, [camera, mobile]);
  useEffect(() => { onReady(); }, [onReady]);
  return <>
    <color attach="background" args={["#b99e7c"]} />
    <ambientLight intensity={2.2} color="#fff2d9" />
    <directionalLight position={[-3, 5, 4]} intensity={3.2} color="#ffdda8" castShadow={!mobile} shadow-mapSize={[1024, 1024]} shadow-bias={-.0002} shadow-radius={3} />
    <directionalLight position={[3, 2, -2]} intensity={1.8} color="#ffbb75" />
    <Passage plaster={plaster} mobile={mobile} />
    <mesh position={[-2.18, 1.5, -0.16]} material={plaster} receiveShadow><boxGeometry args={[2.2, 3.7, 0.3]} /></mesh>
    <mesh position={[2.15, 1.5, -0.16]} material={plaster} receiveShadow><boxGeometry args={[2.2, 3.7, 0.3]} /></mesh>
    <mesh position={[0, 3.38, -0.16]} material={plaster} receiveShadow><boxGeometry args={[6, 0.8, 0.3]} /></mesh>
    <HangingIvy />
    <Door entering={entering} onComplete={onComplete} />
  </>;
}

export default function DoorCanvas({ entering, onReady, onComplete }: { entering: boolean; onReady: () => void; onComplete: () => void }) {
  const mobile = window.innerWidth < 700;
  return <Canvas frameloop="demand" shadows={!mobile} dpr={[1, mobile ? 1.25 : 1.65]} camera={{ position: [0, 1.48, mobile ? 7.7 : 5.25], fov: 34, near: 0.05, far: 40 }} gl={{ antialias: true, powerPreference: "high-performance", toneMapping: THREE.ACESFilmicToneMapping, outputColorSpace: THREE.SRGBColorSpace }}>
    <Scene entering={entering} mobile={mobile} onReady={onReady} onComplete={onComplete} />
  </Canvas>;
}

useGLTF.preload(URL);
