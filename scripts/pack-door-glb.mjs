import { readFile, mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

const source = path.resolve('assets/3d-source/large-castle-door');
const target = path.resolve('public/models/large-castle-door-1k.glb');
const document = JSON.parse(await readFile(path.join(source, 'large_castle_door_1k.gltf'), 'utf8'));
const chunks = [];
let length = 0;
for (const image of document.images) {
  const bytes = await readFile(path.join(source, image.uri));
  image.bufferView = document.bufferViews.length;
  document.bufferViews.push({ buffer: 0, byteOffset: length, byteLength: bytes.length });
  delete image.uri;
  chunks.push(bytes);
  length += bytes.length;
  const padding = (4 - length % 4) % 4;
  if (padding) { chunks.push(Buffer.alloc(padding)); length += padding; }
}
const geometry = await readFile(path.join(source, document.buffers[0].uri));
chunks.unshift(geometry);
for (const image of document.images) document.bufferViews[image.bufferView].byteOffset += geometry.length;
length += geometry.length;
const geometryPadding = (4 - geometry.length % 4) % 4;
if (geometryPadding) {
  chunks.splice(1, 0, Buffer.alloc(geometryPadding));
  for (const image of document.images) document.bufferViews[image.bufferView].byteOffset += geometryPadding;
  length += geometryPadding;
}
document.buffers = [{ byteLength: length }];
const json = Buffer.from(JSON.stringify(document));
const jsonPadding = (4 - json.length % 4) % 4;
const jsonChunk = Buffer.concat([json, Buffer.alloc(jsonPadding, 0x20)]);
const binChunk = Buffer.concat(chunks);
const header = Buffer.alloc(12);
header.write('glTF', 0);
header.writeUInt32LE(2, 4);
header.writeUInt32LE(12 + 8 + jsonChunk.length + 8 + binChunk.length, 8);
const jsonHeader = Buffer.alloc(8);
jsonHeader.writeUInt32LE(jsonChunk.length, 0);
jsonHeader.write('JSON', 4);
const binHeader = Buffer.alloc(8);
binHeader.writeUInt32LE(binChunk.length, 0);
binHeader.write('BIN\0', 4);
await mkdir(path.dirname(target), { recursive: true });
await writeFile(target, Buffer.concat([header, jsonHeader, jsonChunk, binHeader, binChunk]));
console.log(`${target}: ${((12 + 8 + jsonChunk.length + 8 + binChunk.length) / 1048576).toFixed(2)} MiB`);
