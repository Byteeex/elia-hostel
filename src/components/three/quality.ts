export type SceneQuality = "high" | "medium" | "low";

export type SceneMetrics = {
  width: number;
  height: number;
};

export const qualityPresets = {
  high: { maxDpr: 1.8, leafSpacing: 42, maxLeaves: 245, stemStep: 12, radial: 8, branchSegments: 9 },
  medium: { maxDpr: 1.35, leafSpacing: 75, maxLeaves: 160, stemStep: 18, radial: 6, branchSegments: 7 },
  low: { maxDpr: 1, leafSpacing: 110, maxLeaves: 95, stemStep: 25, radial: 5, branchSegments: 5 },
} as const;

export function nextLowerQuality(quality: SceneQuality): SceneQuality {
  return quality === "high" ? "medium" : "low";
}

export function initialQuality(gl: WebGLRenderingContext | WebGL2RenderingContext): SceneQuality {
  const memory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory;
  const cores = navigator.hardwareConcurrency || 4;
  const textureSize = Number(gl.getParameter(gl.MAX_TEXTURE_SIZE)) || 4096;
  const coarsePointer = matchMedia("(pointer: coarse)").matches;
  const saveData = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData;

  if (saveData || textureSize < 4096 || (memory !== undefined && memory <= 2) || cores <= 2) return "low";
  if (coarsePointer || window.innerWidth < 1024 || (memory !== undefined && memory <= 4) || cores <= 4 || textureSize < 8192) return "medium";
  return "high";
}
