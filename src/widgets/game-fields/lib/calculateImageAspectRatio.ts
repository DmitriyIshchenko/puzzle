import { IMAGES_BASE_URL } from "../../../shared";

export async function calculateImageAspectRatio(src: string) {
  const image = await new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image();
    img.src = `${IMAGES_BASE_URL}/${src}`;
    img.addEventListener("load", () => {
      resolve(img);
    });

    img.addEventListener("error", () => {
      reject(new Error(`Failed to load image: ${src}`));
    });
  });

  return image.naturalWidth / image.naturalHeight;
}
