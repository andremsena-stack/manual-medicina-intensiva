import { useEffect, useState } from "react";

export async function removeNearWhiteHalo(src: string, whiteThreshold = 180): Promise<string> {
  const res = await fetch(src);
  if (!res.ok) throw new Error(`Failed to fetch ${src}: ${res.status}`);
  const blob = await res.blob();
  const bitmap = await createImageBitmap(blob);
  const canvas = document.createElement("canvas");
  canvas.width = bitmap.width;
  canvas.height = bitmap.height;
  const ctx = canvas.getContext("2d");
  if (!ctx) return src;
  ctx.drawImage(bitmap, 0, 0);
  const imageData = ctx.getImageData(0, 0, bitmap.width, bitmap.height);
  const d = imageData.data;
  for (let i = 0; i < d.length; i += 4) {
    const r = d[i];
    const g = d[i + 1];
    const b = d[i + 2];
    const a = d[i + 3];
    if (a > 0 && a < 255 && r > whiteThreshold && g > whiteThreshold && b > whiteThreshold) {
      d[i + 3] = 0;
    }
  }
  ctx.putImageData(imageData, 0, 0);
  const outBlob: Blob | null = await new Promise((resolve) => canvas.toBlob(resolve, "image/png"));
  if (!outBlob) return src;
  return URL.createObjectURL(outBlob);
}

export function useImageWithoutHalo(src: string, whiteThreshold = 180) {
  const [url, setUrl] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    let createdUrl: string | undefined;
    removeNearWhiteHalo(src, whiteThreshold)
      .then((cleanedUrl) => {
        if (cancelled) {
          if (cleanedUrl.startsWith("blob:")) URL.revokeObjectURL(cleanedUrl);
          return;
        }
        if (cleanedUrl.startsWith("blob:")) createdUrl = cleanedUrl;
        setUrl(cleanedUrl);
      })
      .catch(() => {
        if (!cancelled) setUrl(src);
      });
    return () => {
      cancelled = true;
      if (createdUrl) URL.revokeObjectURL(createdUrl);
    };
  }, [src, whiteThreshold]);

  return url;
}
