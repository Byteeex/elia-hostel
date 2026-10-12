"use client";

import { useTexture } from "@react-three/drei";
import { useLayoutEffect, useMemo, useEffect, useRef } from "react";
import * as THREE from "three";
import { assetPath } from "@/lib/assets";

type Leaf = { position: THREE.Vector3; rotation: THREE.Euler; size: number; young: boolean };
type Stem = { start: THREE.Vector3; end: THREE.Vector3 };
type Species = "ivy" | "sword" | "broad" | "fern";
type Pot = { x: number; z: number; height: number; species: Species };
type Blade = { position: THREE.Vector3; rotation: THREE.Euler; width: number; height: number; tint: number };

const floorPlants: Pot[] = [
  { x: -.84, z: -1.55, height: .82, species: "ivy" }, { x: .84, z: -2.05, height: 1.06, species: "sword" },
  { x: -.85, z: -2.75, height: 1.08, species: "broad" }, { x: .84, z: -3.45, height: .82, species: "fern" },
  { x: -.85, z: -4.15, height: .94, species: "sword" }, { x: .84, z: -4.8, height: 1.12, species: "broad" },
  { x: -.84, z: -5.48, height: .9, species: "fern" }, { x: .84, z: -5.9, height: 1.04, species: "ivy" },
];

function buildFoliage(mobile: boolean) {
  const leaves: Leaf[] = [];
  const stems: Stem[] = [];
  const swordBlades: Blade[] = [];
  const broadBlades: Blade[] = [];
  const addStem = (points: THREE.Vector3[]) => {
    for (let i = 1; i < points.length; i++) stems.push({ start: points[i - 1], end: points[i] });
  };
  const pots = mobile ? floorPlants.slice(0, 6) : floorPlants;

  pots.forEach((plant, plantIndex) => {
    if (plant.species === "sword") {
      const count = mobile ? 7 : 11;
      for (let i = 0; i < count; i++) {
        const angle = i * 2.399 + plantIndex;
        swordBlades.push({
          position: new THREE.Vector3(plant.x + Math.cos(angle) * .06, .36, plant.z + Math.sin(angle) * .06),
          rotation: new THREE.Euler(-.08, angle, Math.cos(angle) * (.14 + i % 3 * .035)),
          width: .16 + (i % 3) * .025,
          height: plant.height * (.68 + (i % 5) * .09),
          tint: .82 + (i % 4) * .045,
        });
      }
      return;
    }

    if (plant.species === "broad") {
      const count = mobile ? 5 : 7;
      for (let i = 0; i < count; i++) {
        const angle = i / count * Math.PI * 2 + plantIndex * .24;
        const base = new THREE.Vector3(plant.x + Math.cos(angle) * .14, .61 + (i % 3) * .08, plant.z + Math.sin(angle) * .14);
        addStem([new THREE.Vector3(plant.x, .36, plant.z), new THREE.Vector3(plant.x + Math.cos(angle) * .07, .48, plant.z + Math.sin(angle) * .07), base]);
        broadBlades.push({
          position: base,
          rotation: new THREE.Euler(-.16, angle, Math.cos(angle) * .46),
          width: .34 + (i % 3) * .045,
          height: plant.height * (.52 + (i % 3) * .07),
          tint: .84 + (i % 4) * .04,
        });
      }
      return;
    }

    if (plant.species === "fern") {
      const count = mobile ? 5 : 7;
      for (let i = 0; i < count; i++) {
        const angle = i / count * Math.PI * 2 + plantIndex * .16;
        const point = (t: number) => new THREE.Vector3(
          plant.x + Math.cos(angle) * .43 * t,
          .37 + plant.height * (.9 * t - .32 * t * t),
          plant.z + Math.sin(angle) * .43 * t,
        );
        addStem(Array.from({ length: 7 }, (_, segment) => point(segment / 6)));
        for (let leaflet = 1; leaflet <= 5; leaflet++) {
          const t = leaflet / 6;
          for (const side of [-1, 1]) {
            const position = point(t);
            position.x += Math.cos(angle + side * Math.PI / 2) * .035;
            position.z += Math.sin(angle + side * Math.PI / 2) * .035;
            broadBlades.push({
              position,
              rotation: new THREE.Euler(-.1, angle + side * .66, side * .52),
              width: .075 + (leaflet % 3) * .01,
              height: .18 + (5 - leaflet) * .014,
              tint: .83 + (leaflet % 4) * .035,
            });
          }
        }
      }
      return;
    }

    const stemCount = mobile ? 5 : 8;
    for (let stemIndex = 0; stemIndex < stemCount; stemIndex++) {
      const angle = stemIndex / stemCount * Math.PI * 2 + plantIndex * .41;
      const height = plant.height * (.78 + (stemIndex % 3) * .11);
      const point = (t: number) => new THREE.Vector3(
        plant.x + Math.cos(angle) * (.035 + .28 * t * t),
        .38 + height * t,
        plant.z + Math.sin(angle) * (.035 + .25 * t * t),
      );
      addStem(Array.from({ length: 6 }, (_, i) => point(i / 5)));
      for (let leafIndex = 0; leafIndex < 4; leafIndex++) {
        const t = .29 + leafIndex * .22;
        const side = (leafIndex + stemIndex) % 2 ? 1 : -1;
        const position = point(t);
        position.x += side * .055;
        position.z += side * .035;
        leaves.push({
          position,
          rotation: new THREE.Euler(-.22 - leafIndex * .1, Math.PI / 2 - angle + side * .23, side * (.24 + leafIndex * .06)),
          size: (.14 + t * .095) * (plant.height > 1 ? 1.08 : 1),
          young: (plantIndex + stemIndex + leafIndex) % 4 === 0,
        });
      }
    }
  });

  const wallCount = mobile ? 2 : 4;
  for (let wall = 0; wall < wallCount; wall++) {
    const side = wall % 2 ? 1 : -1;
    const z = -2.6 - Math.floor(wall / 2) * 2.5;
    const point = (t: number) => new THREE.Vector3(side * (1.105 - .035 * Math.sin(t * 9)), .45 + t * 1.57, z + Math.sin(t * 6 + wall) * .16);
    addStem(Array.from({ length: 15 }, (_, i) => point(i / 14)));
    for (let i = 0; i < 13; i++) {
      const t = .08 + i * .07;
      const position = point(t);
      position.x -= side * .045;
      leaves.push({
        position,
        rotation: new THREE.Euler(0, side * Math.PI / 2, (i % 2 ? -.5 : .5)),
        size: .16 + (i % 4) * .018,
        young: (wall + i) % 5 === 0,
      });
    }
  }
  return { leaves, stems, swordBlades, broadBlades, pots };
}

function LeafInstances({ leaves, texture }: { leaves: Leaf[]; texture: THREE.Texture }) {
  const mesh = useRef<THREE.InstancedMesh>(null);
  useLayoutEffect(() => {
    if (!mesh.current) return;
    const dummy = new THREE.Object3D();
    leaves.forEach((leaf, index) => {
      dummy.position.copy(leaf.position);
      dummy.rotation.copy(leaf.rotation);
      dummy.scale.setScalar(leaf.size);
      dummy.updateMatrix();
      mesh.current!.setMatrixAt(index, dummy.matrix);
    });
    mesh.current.instanceMatrix.needsUpdate = true;
    mesh.current.computeBoundingSphere();
  }, [leaves]);
  if (!leaves.length) return null;
  return <instancedMesh ref={mesh} args={[undefined, undefined, leaves.length]} frustumCulled={false}>
    <planeGeometry args={[1, 1, 2, 2]} />
    <meshStandardMaterial map={texture} transparent alphaTest={.28} depthWrite={false} side={THREE.DoubleSide} roughness={.94} />
  </instancedMesh>;
}

function bladeGeometry(kind: "sword" | "broad") {
  const geometry = new THREE.PlaneGeometry(1, 1, 4, 10);
  geometry.translate(0, .5, 0);
  const positions = geometry.getAttribute("position") as THREE.BufferAttribute;
  const colors: number[] = [];
  const center = new THREE.Color(kind === "sword" ? "#31583b" : "#245b37");
  const edge = new THREE.Color(kind === "sword" ? "#a5ae6c" : "#568a53");
  for (let i = 0; i < positions.count; i++) {
    const x = positions.getX(i), t = positions.getY(i);
    const outline = kind === "sword"
      ? (.72 + .28 * Math.sin(Math.PI * t)) * (1 - t * t)
      : Math.pow(Math.sin(Math.PI * t), .72);
    positions.setX(i, x * outline);
    positions.setZ(i, .075 * Math.sin(Math.PI * t) * (1 - Math.abs(x)) + .04 * t * t);
    const color = center.clone().lerp(edge, kind === "sword" ? Math.abs(x) * 1.32 : Math.abs(x) * .58);
    colors.push(color.r, color.g, color.b);
  }
  geometry.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));
  geometry.computeVertexNormals();
  return geometry;
}

function BladeInstances({ blades, kind }: { blades: Blade[]; kind: "sword" | "broad" }) {
  const mesh = useRef<THREE.InstancedMesh>(null);
  const geometry = useMemo(() => bladeGeometry(kind), [kind]);
  useEffect(() => () => geometry.dispose(), [geometry]);
  useLayoutEffect(() => {
    if (!mesh.current) return;
    const dummy = new THREE.Object3D();
    blades.forEach((blade, index) => {
      dummy.position.copy(blade.position);
      dummy.rotation.copy(blade.rotation);
      dummy.scale.set(blade.width, blade.height, 1);
      dummy.updateMatrix();
      mesh.current!.setMatrixAt(index, dummy.matrix);
      mesh.current!.setColorAt(index, new THREE.Color().setRGB(blade.tint, .94 + (index % 3) * .018, blade.tint));
    });
    mesh.current.instanceMatrix.needsUpdate = true;
    if (mesh.current.instanceColor) mesh.current.instanceColor.needsUpdate = true;
    mesh.current.computeBoundingSphere();
  }, [blades]);
  if (!blades.length) return null;
  return <instancedMesh ref={mesh} args={[geometry, undefined, blades.length]} frustumCulled={false}>
    <meshStandardMaterial vertexColors side={THREE.DoubleSide} roughness={.84} />
  </instancedMesh>;
}

function StemInstances({ stems }: { stems: Stem[] }) {
  const mesh = useRef<THREE.InstancedMesh>(null);
  useLayoutEffect(() => {
    if (!mesh.current) return;
    const dummy = new THREE.Object3D();
    const up = new THREE.Vector3(0, 1, 0);
    stems.forEach(({ start, end }, index) => {
      const direction = end.clone().sub(start);
      dummy.position.copy(start).add(end).multiplyScalar(.5);
      dummy.quaternion.setFromUnitVectors(up, direction.clone().normalize());
      dummy.scale.set(1, direction.length(), 1);
      dummy.updateMatrix();
      mesh.current!.setMatrixAt(index, dummy.matrix);
    });
    mesh.current.instanceMatrix.needsUpdate = true;
    mesh.current.computeBoundingSphere();
  }, [stems]);
  return <instancedMesh ref={mesh} args={[undefined, undefined, stems.length]} frustumCulled={false}>
    <cylinderGeometry args={[.007, .011, 1, 5]} />
    <meshStandardMaterial color="#4d6541" roughness={1} />
  </instancedMesh>;
}

export function InteriorPlants({ mobile }: { mobile: boolean }) {
  const mature = useTexture(assetPath("/textures/ivy-leaf.webp"));
  const young = useTexture(assetPath("/textures/ivy-leaf-young.webp"));
  const maps = useMemo(() => [mature, young].map(source => {
    const map = source.clone();
    map.colorSpace = THREE.SRGBColorSpace;
    map.needsUpdate = true;
    return map;
  }), [mature, young]);
  useEffect(() => () => maps.forEach(map => map.dispose()), [maps]);
  const plants = useMemo(() => buildFoliage(mobile), [mobile]);
  const matureLeaves = useMemo(() => plants.leaves.filter(leaf => !leaf.young), [plants]);
  const youngLeaves = useMemo(() => plants.leaves.filter(leaf => leaf.young), [plants]);

  return <group>
    <StemInstances stems={plants.stems} />
    <LeafInstances leaves={matureLeaves} texture={maps[0]} />
    <LeafInstances leaves={youngLeaves} texture={maps[1]} />
    <BladeInstances blades={plants.swordBlades} kind="sword" />
    <BladeInstances blades={plants.broadBlades} kind="broad" />
    {plants.pots.map((pot, index) => <group key={`floor-${index}`} position={[pot.x, 0, pot.z]}>
      <mesh position={[0, .18, 0]} castShadow receiveShadow><cylinderGeometry args={[pot.species === "fern" ? .26 : pot.species === "sword" ? .2 : .23, .17, .36, 16]} /><meshStandardMaterial color={{ ivy: "#b8714c", sword: "#b99d76", broad: "#77604c", fern: "#c19565" }[pot.species]} roughness={1} /></mesh>
      <mesh position={[0, .36, 0]} rotation={[-Math.PI / 2, 0, 0]}><torusGeometry args={[pot.species === "fern" ? .235 : pot.species === "sword" ? .18 : .205, .028, 6, 16]} /><meshStandardMaterial color={{ ivy: "#c17a4e", sword: "#c4ad89", broad: "#87715b", fern: "#cba477" }[pot.species]} roughness={1} /></mesh>
      <mesh position={[0, .355, 0]}><cylinderGeometry args={[pot.species === "fern" ? .226 : pot.species === "sword" ? .173 : .195, pot.species === "fern" ? .226 : pot.species === "sword" ? .173 : .195, .012, 16]} /><meshStandardMaterial color="#463a2d" roughness={1} /></mesh>
    </group>)}
  </group>;
}
