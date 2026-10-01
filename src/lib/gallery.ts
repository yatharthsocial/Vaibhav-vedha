// Real event photography, optimized from src/gallery/ (originals were
// up to 20MB camera JPGs) down to web-sized files in public/gallery/.
// See the optimization step in project history — resized to a 1600px
// long edge, JPEG quality 82, EXIF rotation baked in.

const GALLERY_COUNT = 62;

export const allGalleryImages: string[] = Array.from(
  { length: GALLERY_COUNT },
  (_, i) => `/gallery/gallery-${String(i + 1).padStart(2, "0")}.jpg`,
);

// A spread across the full set (not just the first few, which are all
// from one event) so the sweep itself shows some variety — the "View
// More" modal is where the complete set lives.
const FEATURED_INDEXES = [1, 8, 15, 22, 30, 38, 48];

export const featuredGalleryImages: string[] = FEATURED_INDEXES.map(
  (i) => `/gallery/gallery-${String(i).padStart(2, "0")}.jpg`,
);

// A different 4-image spread for the "View More" tile's own
// collage preview, so it isn't just repeating images already visible
// a moment earlier in the same sweep.
const PREVIEW_INDEXES = [4, 18, 34, 55];

export const previewGalleryImages: string[] = PREVIEW_INDEXES.map(
  (i) => `/gallery/gallery-${String(i).padStart(2, "0")}.jpg`,
);

// A larger, still-spread-out set for the dense grid wall — enough
// tiles to fill several rows without repeating an image twice.
const WALL_INDEXES = [
  2, 5, 9, 12, 16, 19, 23, 26, 29, 32, 35, 39, 42, 45, 49, 52, 56, 59, 62, 3, 11, 20, 28, 37,
];

export const wallGalleryImages: string[] = WALL_INDEXES.map(
  (i) => `/gallery/gallery-${String(i).padStart(2, "0")}.jpg`,
);
