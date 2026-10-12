import * as THREE from "three";
import { qualityPresets, type SceneMetrics, type SceneQuality } from "./quality";

export type LeafInstance = {
  point: THREE.Vector3;
  documentY: number;
  at: number;
  angle: number;
  scale: number;
  side: number;
  phase: number;
  color: THREE.Color;
  variant: 0 | 1;
};

export type BranchStage = { at: number; documentY: number; start: number; count: number; duration: number };

export type PlantGeometry = {
  stem: THREE.BufferGeometry;
  branches: THREE.BufferGeometry;
  leaf: THREE.BufferGeometry;
  leaves: LeafInstance[];
  stages: BranchStage[];
  stemSegments: number;
  radial: number;
  startY: number;
  endY: number;
};

function random(seed: number) {
  let state = seed;
  return () => { state = (state * 1664525 + 1013904223) >>> 0; return state / 4294967296; };
}

function taperedTube(curve: THREE.CatmullRomCurve3, segments: number, radial: number, radius: number) {
  const frames = curve.computeFrenetFrames(segments, false);
  const positions: number[] = [];
  const indices: number[] = [];
  for (let i = 0; i <= segments; i++) {
    const t = i / segments;
    const p = curve.getPointAt(t);
    const organic = 1 + Math.sin(t * 31) * .055 + Math.sin(t * 79) * .025;
    const width = Math.max(.18, radius * (1 - .57 * t) * organic);
    for (let j = 0; j < radial; j++) {
      const a = j / radial * Math.PI * 2;
      const normal = frames.normals[i].clone().multiplyScalar(Math.cos(a) * width).addScaledVector(frames.binormals[i], Math.sin(a) * width);
      positions.push(p.x + normal.x, p.y + normal.y, p.z + normal.z);
      if (i < segments) {
        const a0 = i * radial + j;
        const b0 = i * radial + (j + 1) % radial;
        const a1 = (i + 1) * radial + j;
        const b1 = (i + 1) * radial + (j + 1) % radial;
        indices.push(a0, a1, b0, b0, a1, b1);
      }
    }
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  return geometry;
}

function ivyLeafGeometry() {
  const geometry = new THREE.PlaneGeometry(1, 1, 5, 5);
  geometry.translate(0, .5, 0);
  const positions = geometry.getAttribute("position");
  for (let i = 0; i < positions.count; i++) {
    const x = positions.getX(i), y = positions.getY(i);
    const cup = .11 * Math.sin(Math.PI * y) * (1 - Math.abs(x) * .6);
    positions.setZ(i, cup - .07 * Math.abs(x));
  }
  positions.needsUpdate = true;
  geometry.computeVertexNormals();
  return geometry;
}

export function buildPlant(metrics: SceneMetrics, quality: SceneQuality): PlantGeometry {
  const preset = qualityPresets[quality];
  const { width, height } = metrics;
  const center = width >= 1000;
  const startY = 105;
  const endY = Math.max(height - 240, 1400);
  const pathPoints: THREE.Vector3[] = [];
  const pointCount = Math.max(16, Math.ceil((endY - startY) / 250));
  const baseX = center ? 0 : width / 2 - (width < 650 ? 17 : 28);
  for (let i = 0; i <= pointCount; i++) {
    const t = i / pointCount;
    const sway = Math.sin(t * Math.PI * 7) * (center ? 22 : 7) + Math.sin(t * Math.PI * 15) * (center ? 7 : 3);
    pathPoints.push(new THREE.Vector3(baseX + sway, -startY - t * (endY - startY), Math.sin(t * 12) * 6));
  }
  const curve = new THREE.CatmullRomCurve3(pathPoints, false, "centripetal", .38);
  const stemSegments = Math.max(100, Math.ceil((endY - startY) / preset.stemStep));
  const radial = preset.radial;
  const stem = taperedTube(curve, stemSegments, radial, center ? 3.3 : 2.1);
  const rng = random(89241);
  const leafCount = Math.min(preset.maxLeaves, Math.max(48, Math.round((endY - startY) / preset.leafSpacing)));
  const leaves: LeafInstance[] = [];
  const stages: BranchStage[] = [];
  const branchPositions: number[] = [];
  const branchIndices: number[] = [];

  const appendBranch = (branchCurve: THREE.CatmullRomCurve3, segments: number, radius: number) => {
    const branch = taperedTube(branchCurve, segments, Math.max(4, radial - 2), radius);
    const baseVertex = branchPositions.length / 3;
    const vertexArray = branch.getAttribute("position").array;
    const indexArray = branch.getIndex()!.array;
    for (let v = 0; v < vertexArray.length; v++) branchPositions.push(Number(vertexArray[v]));
    for (let v = 0; v < indexArray.length; v++) branchIndices.push(Number(indexArray[v]) + baseVertex);
    branch.dispose();
  };
  const addLeaf = (point: THREE.Vector3, at: number, side: number, scale: number, angle: number, variant: 0 | 1) => {
    const tone = .72 + rng() * .3;
    leaves.push({ point, documentY: -point.y, at, angle, scale, side, phase: rng() * 6.28, variant,
      color: new THREE.Color(tone, tone * (.96 + rng() * .08), tone * (.9 + rng() * .05)) });
  };

  for (let i = 0; i < leafCount; i++) {
    const at = .015 + (i + .12 + rng() * .76) / leafCount * .965;
    const point = curve.getPointAt(at);
    const side = rng() > .5 ? -1 : 1;
    const reach = (center ? 20 : 10) + rng() * (center ? 26 : 13);
    const branchCurve = new THREE.CatmullRomCurve3([
      point,
      point.clone().add(new THREE.Vector3(side * reach * .39, -reach * .17, 5)),
      point.clone().add(new THREE.Vector3(side * reach, -reach * (.4 + rng() * .28), 12 + rng() * 8)),
    ]);
    const start = branchIndices.length;
    appendBranch(branchCurve, preset.branchSegments, quality === "low" ? .55 : .75);
    const tip = branchCurve.getPointAt(1);
    addLeaf(tip, at + .003, side, (center ? 30 : 20) + rng() * (center ? 14 : 8), side * (.48 + rng() * .5), i % 3 === 0 ? 1 : 0);

    const node = branchCurve.getPointAt(.55);
    const twigTip = node.clone().add(new THREE.Vector3(side * (7 + rng() * 8), -4 - rng() * 8, 6 + rng() * 5));
    appendBranch(new THREE.CatmullRomCurve3([node, node.clone().lerp(twigTip, .5).add(new THREE.Vector3(0, 0, 3)), twigTip]), Math.max(4, preset.branchSegments - 2), .43);
    addLeaf(twigTip, at + .0045, side, (center ? 22 : 15) + rng() * 10, -side * (.22 + rng() * .42), 1);

    if (quality === "high" || (quality === "medium" && i % 2 === 0)) {
      const base = branchCurve.getPointAt(.28);
      const backTip = base.clone().add(new THREE.Vector3(-side * (6 + rng() * 7), -8 - rng() * 5, 8 + rng() * 4));
      appendBranch(new THREE.CatmullRomCurve3([base, base.clone().lerp(backTip, .5), backTip]), Math.max(4, preset.branchSegments - 3), .38);
      addLeaf(backTip, at + .0055, -side, (center ? 19 : 13) + rng() * 9, -side * (.5 + rng() * .35), 0);
    }
    stages.push({ at, documentY: -point.y, start, count: branchIndices.length - start, duration: .72 / leafCount });
  }
  const branches = new THREE.BufferGeometry();
  branches.setAttribute("position", new THREE.Float32BufferAttribute(branchPositions, 3));
  branches.setIndex(branchIndices);
  branches.computeVertexNormals();
  return { stem, branches, leaf: ivyLeafGeometry(), leaves, stages, stemSegments, radial, startY, endY };
}
