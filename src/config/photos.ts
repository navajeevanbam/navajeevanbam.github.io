import type { PhotoData } from '../lib/image-types';
import { referencePhotos } from './reference-photos';
export const photos: Record<string, PhotoData> = {
  ...referencePhotos,
  'donation-meals': { ...referencePhotos['reference-meals'], src: 'images/donation/meals.webp' },
};

