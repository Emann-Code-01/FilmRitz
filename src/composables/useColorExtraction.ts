// composables/useColorExtraction.ts
import ColorThief from 'colorthief';
import { ColorPalette } from '../types/media';

export const useColorExtraction = () => {
  const colorThief = new ColorThief();

  const extractColors = async (imageUrl: string): Promise<ColorPalette> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'Anonymous';

      img.onload = () => {
        try {
          const dominantColor = colorThief.getColor(img);
          const palette = colorThief.getPalette(img, 5);

          resolve({
            dominant: `rgb(${dominantColor.join(',')})`,
            accent: `rgb(${palette[1].join(',')})`,
            vibrant: `rgb(${palette[2].join(',')})`,
            muted: `rgb(${palette[3].join(',')})`
          });
        } catch (error) {
          reject(error);
        }
      };

      img.onerror = reject;
      img.src = imageUrl;
    });
  };

  return { extractColors };
};