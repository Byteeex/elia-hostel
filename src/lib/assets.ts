export function assetPath(path: string) {
  const basePath = typeof window !== "undefined" && window.location.hostname.endsWith("github.io")
    ? "/elia-hostel"
    : "";
  return `${basePath}${path}`;
}
