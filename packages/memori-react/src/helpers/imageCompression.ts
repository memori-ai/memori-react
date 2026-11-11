/**
 * Image compression utility using HTML5 Canvas API
 * Compresses images before upload to reduce file size and LLM context usage
 */

export interface CompressionOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
  maxSizeMB?: number;
}

const DEFAULT_OPTIONS: Required<CompressionOptions> = {
  maxWidth: 1920,
  maxHeight: 1920,
  quality: 0.75,
  maxSizeMB: 2,
};


/**
 * Apply EXIF orientation to canvas context
 */
const applyOrientation = (
  ctx: CanvasRenderingContext2D,
  orientation: number,
  width: number,
  height: number
) => {
  switch (orientation) {
    case 2:
      // Horizontal flip
      ctx.transform(-1, 0, 0, 1, width, 0);
      break;
    case 3:
      // 180° rotation
      ctx.transform(-1, 0, 0, -1, width, height);
      break;
    case 4:
      // Vertical flip
      ctx.transform(1, 0, 0, -1, 0, height);
      break;
    case 5:
      // Vertical flip + 90° rotation
      ctx.transform(0, 1, 1, 0, 0, 0);
      break;
    case 6:
      // 90° rotation
      ctx.transform(0, 1, -1, 0, height, 0);
      break;
    case 7:
      // Horizontal flip + 90° rotation
      ctx.transform(0, -1, -1, 0, height, width);
      break;
    case 8:
      // 270° rotation
      ctx.transform(0, -1, 1, 0, 0, width);
      break;
    default:
      // No transformation needed
      break;
  }
};

/**
 * Load image from File and return HTMLImageElement
 */
const loadImage = (file: File): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Failed to load image'));
    };

    img.src = url;
  });
};

/**
 * Calculate new dimensions maintaining aspect ratio
 */
const calculateDimensions = (
  width: number,
  height: number,
  maxWidth: number,
  maxHeight: number
): { width: number; height: number } => {
  // If image is already smaller than max dimensions, return original
  if (width <= maxWidth && height <= maxHeight) {
    return { width, height };
  }

  // Calculate scale factor
  const scaleWidth = maxWidth / width;
  const scaleHeight = maxHeight / height;
  const scale = Math.min(scaleWidth, scaleHeight, 1);

  return {
    width: Math.round(width * scale),
    height: Math.round(height * scale),
  };
};

/**
 * Compress image using Canvas API
 * @param file - Original image file
 * @param options - Compression options
 * @returns Compressed File object
 */
export const compressImage = async (
  file: File,
  options: CompressionOptions = {}
): Promise<File> => {
  const opts = { ...DEFAULT_OPTIONS, ...options };

  // Check if compression is needed
  const fileSizeMB = file.size / (1024 * 1024);
  const shouldCompress = fileSizeMB > 1; // Compress if > 1 MB

  if (!shouldCompress) {
    // Load image to check dimensions
    try {
      const img = await loadImage(file);
      const needsResize =
        img.width > opts.maxWidth || img.height > opts.maxHeight;

      if (!needsResize) {
        // File is already small enough, return original
        return file;
      }
    } catch (error) {
      // If we can't load the image, return original
      return file;
    }
  }

  try {
    // Load image
    const img = await loadImage(file);

    // Get orientation (simplified - full EXIF parsing would require a library)
    const orientation = 1;

    // Calculate new dimensions
    const { width, height } = calculateDimensions(
      img.width,
      img.height,
      opts.maxWidth,
      opts.maxHeight
    );

    // Create canvas
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      throw new Error('Failed to get canvas context');
    }

    // Apply orientation transformation
    applyOrientation(ctx, orientation, width, height);

    // Draw image to canvas
    ctx.drawImage(img, 0, 0, width, height);

    // Convert canvas to blob
    return new Promise((resolve, reject) => {
      canvas.toBlob(
        (blob) => {
          if (!blob) {
            reject(new Error('Failed to compress image'));
            return;
          }

          // Check if compressed size is acceptable
          const compressedSizeMB = blob.size / (1024 * 1024);

          if (compressedSizeMB > opts.maxSizeMB) {
            // If still too large, try lower quality
            canvas.toBlob(
              (lowerQualityBlob) => {
                if (!lowerQualityBlob) {
                  // Fallback to original blob
                  const compressedFile = new File(
                    [blob],
                    file.name.replace(/\.[^/.]+$/, '.jpg'),
                    { type: 'image/jpeg' }
                  );
                  resolve(compressedFile);
                  return;
                }
                const compressedFile = new File(
                  [lowerQualityBlob],
                  file.name.replace(/\.[^/.]+$/, '.jpg'),
                  { type: 'image/jpeg' }
                );
                resolve(compressedFile);
              },
              'image/jpeg',
              Math.max(0.5, opts.quality - 0.2) // Reduce quality by 0.2, min 0.5
            );
          } else {
            // Create new File with JPEG extension
            const compressedFile = new File(
              [blob],
              file.name.replace(/\.[^/.]+$/, '.jpg'),
              { type: 'image/jpeg' }
            );
            resolve(compressedFile);
          }
        },
        'image/jpeg', // Always convert to JPEG for better compression
        opts.quality
      );
    });
  } catch (error) {
    // If compression fails, return original file
    return file;
  }
};
