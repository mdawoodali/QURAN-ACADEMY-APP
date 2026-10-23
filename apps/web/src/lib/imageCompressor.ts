/**
 * Client-Side Image Compressor for Mobile Receipt Slips
 * Converts high-resolution mobile camera snaps (iPhone 10MB HEIC/PNG)
 * into lightweight, high-clarity JPEGs (<350KB) before network transmission.
 */

export interface CompressionResult {
  file: File;
  dataUrl: string;
  originalSizeKb: number;
  compressedSizeKb: number;
  width: number;
  height: number;
}

export async function compressReceiptImage(
  file: File,
  maxWidth = 1200,
  maxHeight = 1600,
  quality = 0.82
): Promise<CompressionResult> {
  const originalSizeKb = Math.round(file.size / 1024);

  // If already under 150KB and JPEG/PNG, no heavy resize needed
  if (file.size <= 150 * 1024 && (file.type === "image/jpeg" || file.type === "image/png")) {
    const dataUrl = await fileToDataUrl(file);
    return {
      file,
      dataUrl,
      originalSizeKb,
      compressedSizeKb: originalSizeKb,
      width: 0,
      height: 0,
    };
  }

  return new Promise((resolve, reject) => {
    const img = new Image();
    const objectUrl = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(objectUrl);

      let width = img.naturalWidth || img.width;
      let height = img.naturalHeight || img.height;

      // Maintain aspect ratio while clamping to max bounds
      if (width > maxWidth || height > maxHeight) {
        const ratio = Math.min(maxWidth / width, maxHeight / height);
        width = Math.round(width * ratio);
        height = Math.round(height * ratio);
      }

      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext("2d");
      if (!ctx) {
        // Fallback to original if canvas 2D is unavailable
        fileToDataUrl(file).then((dataUrl) => {
          resolve({
            file,
            dataUrl,
            originalSizeKb,
            compressedSizeKb: originalSizeKb,
            width,
            height,
          });
        });
        return;
      }

      // Smooth bicubic resampling
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";
      ctx.drawImage(img, 0, 0, width, height);

      const compressedDataUrl = canvas.toDataURL("image/jpeg", quality);

      canvas.toBlob(
        (blob) => {
          if (!blob) {
            resolve({
              file,
              dataUrl: compressedDataUrl,
              originalSizeKb,
              compressedSizeKb: originalSizeKb,
              width,
              height,
            });
            return;
          }

          const compressedFile = new File(
            [blob],
            `receipt_${Date.now()}.jpg`,
            { type: "image/jpeg", lastModified: Date.now() }
          );

          resolve({
            file: compressedFile,
            dataUrl: compressedDataUrl,
            originalSizeKb,
            compressedSizeKb: Math.round(compressedFile.size / 1024),
            width,
            height,
          });
        },
        "image/jpeg",
        quality
      );
    };

    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      // Graceful fallback for non-renderable formats
      fileToDataUrl(file)
        .then((dataUrl) => {
          resolve({
            file,
            dataUrl,
            originalSizeKb,
            compressedSizeKb: originalSizeKb,
            width: 0,
            height: 0,
          });
        })
        .catch(reject);
    };

    img.src = objectUrl;
  });
}

function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
