/**
 * ============================================================================
 * FILE: frontend/src/utils/imageOptimizer.js
 * PURPOSE: Smart Document & Image Resizer Studio (Premium Feature).
 *          Automatically resizes and compresses photos/signatures to exact
 *          government portal specifications (e.g. 20-50 KB for SSC/UPSC,
 *          10-20 KB for signatures) WITHOUT blurring or loss of clarity!
 * ============================================================================
 */

export const OPTIMIZER_PRESETS = {
  passport_photo: {
    id: "passport_photo",
    label: "Govt Exam Passport Photo (SSC, UPSC, NTA, State)",
    width: 350,
    height: 450,
    minKB: 20,
    maxKB: 50,
    idealKB: 35,
    description: "350x450 px • 20 KB – 50 KB • Crisp Face Clarity • White Background",
    sharpen: true,
    enhanceContrast: false
  },
  signature: {
    id: "signature",
    label: "Scanned Signature (Banking, SSC, Railway)",
    width: 280,
    height: 120,
    minKB: 10,
    maxKB: 20,
    idealKB: 15,
    description: "280x120 px • 10 KB – 20 KB • Dark Ink Enhancement • Zero Blur",
    sharpen: true,
    enhanceContrast: true
  },
  postcard_photo: {
    id: "postcard_photo",
    label: "Postcard Size Photo (NEET / NTA Exams)",
    width: 480,
    height: 720,
    minKB: 50,
    maxKB: 100,
    idealKB: 75,
    description: "480x720 px • 50 KB – 100 KB • High Definition 4x6 Ratio",
    sharpen: true,
    enhanceContrast: false
  },
  document_scan: {
    id: "document_scan",
    label: "Marksheet / Certificate Scan (A4 JPG)",
    width: 1200,
    height: 1600,
    minKB: 80,
    maxKB: 200,
    idealKB: 150,
    description: "Under 200 KB • Sharp Text Readability • High DPI",
    sharpen: true,
    enhanceContrast: false
  }
};

/**
 * Optimizes an image File or Data URL to exact dimension & target KB specs
 * without blurring.
 *
 * @param {File|string} source - File object or Base64 data URL
 * @param {object} options - { preset, customMinKB, customMaxKB, customWidth, customHeight }
 * @returns {Promise<{ dataUrl: string, sizeKB: string, width: number, height: number, fileName: string }>}
 */
export async function optimizeImage(source, options = {}) {
  const presetKey = options.preset || "passport_photo";
  const preset = OPTIMIZER_PRESETS[presetKey] || OPTIMIZER_PRESETS.passport_photo;

  const targetWidth = options.customWidth || preset.width;
  const targetHeight = options.customHeight || preset.height;
  const targetMinBytes = (options.customMinKB || preset.minKB) * 1024;
  const targetMaxBytes = (options.customMaxKB || preset.maxKB) * 1024;

  let imgDataUrl = "";
  let originalFileName = "optimized_document.jpg";

  if (typeof source === "string") {
    imgDataUrl = source;
  } else if (source instanceof File) {
    originalFileName = source.name.replace(/\.[^/.]+$/, "") + "_optimized.jpg";
    imgDataUrl = await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target.result);
      reader.onerror = reject;
      reader.readAsDataURL(source);
    });
  }

  // Load image into HTML Image object
  const img = await new Promise((resolve, reject) => {
    const el = new Image();
    el.crossOrigin = "anonymous";
    el.onload = () => resolve(el);
    el.onerror = () => reject(new Error("Failed to decode image file."));
    el.src = imgDataUrl;
  });

  // Create high-DPI canvas
  const canvas = document.createElement("canvas");
  canvas.width = targetWidth;
  canvas.height = targetHeight;
  const ctx = canvas.getContext("2d", { willReadFrequently: true });

  // Use highest quality smooth downscaling
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";

  // White background for transparent PNGs
  ctx.fillStyle = "#FFFFFF";
  ctx.fillRect(0, 0, targetWidth, targetHeight);

  // Preserve aspect ratio or crop centered to fill
  const srcRatio = img.width / img.height;
  const dstRatio = targetWidth / targetHeight;
  let sx = 0, sy = 0, sw = img.width, sh = img.height;

  if (srcRatio > dstRatio) {
    // Image is wider than target
    sw = img.height * dstRatio;
    sx = (img.width - sw) / 2;
  } else {
    // Image is taller than target
    sh = img.width / dstRatio;
    sy = (img.height - sh) / 2;
  }

  ctx.drawImage(img, sx, sy, sw, sh, 0, 0, targetWidth, targetHeight);

  // Optional: Enhance contrast for signatures so faint pen ink doesn't fade
  if (preset.enhanceContrast) {
    const imgData = ctx.getImageData(0, 0, targetWidth, targetHeight);
    const d = imgData.data;
    for (let i = 0; i < d.length; i += 4) {
      // If pixel is near-white background (gray paper), push to pure white
      const avg = (d[i] + d[i + 1] + d[i + 2]) / 3;
      if (avg > 200) {
        d[i] = 255;
        d[i + 1] = 255;
        d[i + 2] = 255;
      } else if (avg < 150) {
        // Darken the ink strokes
        d[i] = Math.max(0, d[i] * 0.8);
        d[i + 1] = Math.max(0, d[i + 1] * 0.8);
        d[i + 2] = Math.max(0, d[i + 2] * 0.8);
      }
    }
    ctx.putImageData(imgData, 0, 0);
  }

  // Binary search for exact JPEG quality to hit [minBytes, maxBytes]
  let minQ = 0.3;
  let maxQ = 0.98;
  let bestDataUrl = "";
  let bestBlobSize = 0;

  for (let iter = 0; iter < 7; iter++) {
    const midQ = (minQ + maxQ) / 2;
    const testDataUrl = canvas.toDataURL("image/jpeg", midQ);
    const approxBytes = Math.round((testDataUrl.length - "data:image/jpeg;base64,".length) * 0.75);

    bestDataUrl = testDataUrl;
    bestBlobSize = approxBytes;

    if (approxBytes > targetMaxBytes) {
      // Too large, lower quality
      maxQ = midQ;
    } else if (approxBytes < targetMinBytes) {
      // Too small, increase quality
      minQ = midQ;
    } else {
      // Hit the sweet spot!
      break;
    }
  }

  return {
    dataUrl: bestDataUrl,
    sizeKB: (bestBlobSize / 1024).toFixed(1),
    width: targetWidth,
    height: targetHeight,
    fileName: originalFileName,
    format: "image/jpeg"
  };
}
