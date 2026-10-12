# Concept imagery

The hostel provided the original files for `public/images/elia-dorm.jpg` and `public/images/elia-reception-salon.jpg`. They show a shared dormitory and reception salon at Elia. The dorm category pictured has not been verified, so the site uses it only as a general shared-room photo.

The official logo was supplied as `elia logo.pdf`. The header emblem and wordmark, plus the complete footer logo, are direct raster exports of that PDF with the empty page margins cropped. They are saved as `public/images/elia-emblem.png`, `public/images/elia-wordmark.png`, and `public/images/elia-logo-full.png`.

The three images below were generated with the built-in image generation tool for website art direction. They are illustrative concepts, **not photographs of Elia Hostel or its exact location**. The rooftop and Medina concepts remain in use until real images of those areas are available. The shared-room concept is retained as an unused reference asset.

## `public/images/tangier-rooftop-concept.png`

> Use case: photorealistic-natural. Asset type: conceptual hero image for a boutique hostel website, clearly an artistic mood image rather than a documentary property photograph. Scene: an intimate sunlit rooftop courtyard above Tangier's Old Medina, pale timeworn plaster, weathered wood, tactile woven textiles, terracotta pots and climbing ivy, glimpses of old white buildings and sea haze. No people. Style: high-end editorial travel photography, analog film warmth, natural imperfections, restrained composition. Wide horizontal framing with the architecture and greenery concentrated on the right and central area, soft open wall and sky toward the left for text overlay. Lighting: late afternoon Mediterranean sunlight, gentle shadows. Palette: warm ivory, cream, deep botanical green, muted terracotta, antique gold. Avoid: text, signs, logos, watermarks, exaggerated luxury, glossy CGI, generic resort pools.

## `public/images/shared-room-concept.png`

> Use case: photorealistic-natural. Asset type: clearly illustrative conceptual website image for Elia Hostel room storytelling; not a photograph of the actual property. A humble but beautiful shared hostel room in Tangier with two visible wooden bunk beds dressed in muted olive and cream linen, limewashed plaster walls, one antique brass reading lamp, a small leafy plant, filtered morning sun through an arched window. Authentic and intimate, not luxurious. High-end editorial travel photography, tactile analog grain, vertical composition, natural light. Avoid people, words, logos, signs, watermarks, glossy CGI.

## `public/images/medina-lane-concept.png`

> Use case: photorealistic-natural. Asset type: clearly illustrative conceptual website image for Elia Hostel Tangier storytelling; not a documentary photograph of its exact location. A quiet winding pedestrian lane in Tangier's Old Medina, white and sand colored timeworn plaster facades, aged wooden doors, potted climbing ivy and small terracotta planters, a glimpse of pale blue sky, warm late afternoon sunlight with delicate long shadows. Calm, human scale, authentic texture, high-end analog travel photography, vertical composition. Avoid people, readable signs, words, logos, watermarks, excessive blue saturation or fantasy architecture.

## 3D entrance door

`public/models/large-castle-door-1k.glb` is a 3.12 MiB browser-ready pack of the [Poly Haven Large Castle Door](https://polyhaven.com/a/large_castle_door) 1K glTF export. This is a real modeled mesh, under Poly Haven's CC0 license. Its frame and two leaves are separate original meshes. The original color, tangent-space normal, and packed metallic/roughness JPEG textures are embedded unchanged. `scripts/pack-door-glb.mjs` only packs the official glTF, BIN, and images into a single GLB; it does not generate or simplify geometry. The source download is retained under `assets/3d-source/large-castle-door/`.

The four supplied `public/large_castle_door_*` files were accidentally given the wrong filenames. Checksums against Poly Haven's API confirm that `large_castle_door_4k.blend` is the normal EXR, `large_castle_door_metal_4k.exr` is the diffuse JPEG, `large_castle_door_nor_gl_4k.exr` is the roughness EXR, and `large_castle_door_rough_4k.exr` is the metallic EXR. The actual Blender model was not among those four files. An official copy of the 4K `.blend` was downloaded to the source folder for provenance; the deployed model uses the matching official glTF export. The original misnamed user files were left untouched.

The glTF has one frame mesh and two leaf meshes. Each leaf's local origin is at its outer hinge edge; the entrance code moves the two leaves into separate hinge groups and rotates those groups inward while the frame stays still. The ring handles and ironwork are fused into their respective leaf meshes, so a separate handle-turn animation is not available from this asset.

## 3D ivy textures

The entrance passage also uses these existing leaf textures on instanced 3D stems and foliage for its ivy pots and low wall vines. Other floor pots have distinct modeled sword leaves, broad leaves, and fern fronds. The entrance plants are illustrative scenery inspired by the hostel's botanical styling, not a precise inventory of real plants in the reception room.

- `public/textures/ivy-leaf.webp` and `ivy-leaf-young.webp` were generated with the built-in imagegen tool as transparent botanical texture cutouts and optimized to 768px WebP. Prompts: “One mature, five-lobed English ivy leaf, realistic botanical scan, dark olive mottling, detailed branching veins, slight curled edges, transparent background”; and “One younger, three-lobed English ivy leaf, photoreal botanical scan, natural green variation, fine veins, transparent background.” Both are project artwork, not a photographed plant at Elia.
