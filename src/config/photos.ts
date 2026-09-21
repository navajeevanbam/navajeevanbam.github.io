import type { PhotoData } from '../lib/image-types';
import { referencePhotos } from './reference-photos';
export const photos: Record<string, PhotoData> = {
  ...referencePhotos,
  'donation-meals': { ...referencePhotos['reference-meals'], src: 'images/donation/meals.webp' },
  community: { src: 'images/shared/illustrations/community.webp', alt: 'An illustrative gathering of elders, families, and volunteers in a sunlit Indian courtyard', width: 1536, height: 1024 },
  education: { src: 'images/shared/illustrations/education.webp', alt: 'A volunteer reading with children in a community learning room', width: 1536, height: 1024 },
  food: { src: 'images/shared/illustrations/food.webp', alt: 'Volunteers sharing a freshly prepared meal with a community member', width: 1536, height: 1024 },
  elders: { src: 'images/shared/illustrations/elders.webp', alt: 'An elderly woman and a young volunteer enjoying a conversation in a garden', width: 1536, height: 1024 },
  health: { src: 'images/shared/illustrations/health.webp', alt: 'A health volunteer checking an older community member’s blood pressure', width: 1536, height: 1024 },
  volunteers: { src: 'images/shared/illustrations/volunteers.webp', alt: 'Community volunteers planting a garden together', width: 1536, height: 1024 },
};

