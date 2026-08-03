import imageCompression from "browser-image-compression";

export interface CompressionResult {
  file: File;
  originalSize: number;
  compressedSize: number;
  savedPercentage: number;
}

export async function compressImage(
  file: File,
  options?: {
    maxSizeMB?: number;
    maxWidthOrHeight?: number;
  }
): Promise<CompressionResult> {
  // Skip non-image or SVG files
  if (!file.type.startsWith("image/") || file.type === "image/svg+xml") {
    return {
      file,
      originalSize: file.size,
      compressedSize: file.size,
      savedPercentage: 0,
    };
  }

  const defaultOptions = {
    maxSizeMB: options?.maxSizeMB ?? 0.8, // 800KB target
    maxWidthOrHeight: options?.maxWidthOrHeight ?? 1920,
    useWebWorker: true,
  };

  try {
    const compressedFile = await imageCompression(file, defaultOptions);
    const originalSize = file.size;
    const compressedSize = compressedFile.size;
    const savedPercentage = Math.round(((originalSize - compressedSize) / originalSize) * 100);

    return {
      file: compressedFile,
      originalSize,
      compressedSize: Math.min(originalSize, compressedSize),
      savedPercentage: Math.max(0, savedPercentage),
    };
  } catch (error) {
    console.warn("[compressImage] Compression failed, using original file:", error);
    return {
      file,
      originalSize: file.size,
      compressedSize: file.size,
      savedPercentage: 0,
    };
  }
}
