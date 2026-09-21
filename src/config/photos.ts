import { referencePhotos } from './reference-photos';
export const photos: Record<string, { src: string; alt: string; width?: number; height?: number; source?: string }> = {
  ...referencePhotos,
  community: { src: 'images/community.webp', alt: 'An illustrative gathering of elders, families, and volunteers in a sunlit Indian courtyard' },
  education: { src: 'images/education.webp', alt: 'A volunteer reading with children in a community learning room' },
  food: { src: 'images/food.webp', alt: 'Volunteers sharing a freshly prepared meal with a community member' },
  elders: { src: 'images/elders.webp', alt: 'An elderly woman and a young volunteer enjoying a conversation in a garden' },
  health: { src: 'images/health.webp', alt: 'A health volunteer checking an older community member’s blood pressure' },
  volunteers: { src: 'images/volunteers.webp', alt: 'Community volunteers planting a garden together' },
};

