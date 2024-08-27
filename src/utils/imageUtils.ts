export const createImage = (url: string): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener('load', () => resolve(image));
    image.addEventListener('error', (error) => reject(error));
    image.setAttribute('crossOrigin', 'anonymous');
    image.src = url;
  });

export const getCroppedImg = async (
  imageSrc: string,
  pixelCrop: { width: number; height: number; x: number; y: number } | null
): Promise<string> => {
  const image = await createImage(imageSrc);
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    return '';
  }

  canvas.width = pixelCrop?.width ?? 0;
  canvas.height = pixelCrop?.height ?? 0;

  ctx.drawImage(
    image,
    pixelCrop?.x ?? 0,
    pixelCrop?.y ?? 0,
    pixelCrop?.width ?? 0,
    pixelCrop?.height ?? 0,
    0,
    0,
    pixelCrop?.width ?? 0,
    pixelCrop?.height ?? 0
  );

  return new Promise((resolve) => {
    canvas.toBlob((file) => {
      if (file) {
        resolve(URL.createObjectURL(file));
      }
    }, 'image/jpeg');
  });
};