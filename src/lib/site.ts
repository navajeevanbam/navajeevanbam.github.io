export const site = {
  name: 'Navjeen Seva Ashram',
  tagline: 'A little care. A new beginning.',
  email: 'hello@example.org',
  address: 'Community address coming soon, India',
  visiting: 'Visits by prior arrangement',
};

export function url(path = '') {
  return `${import.meta.env.BASE_URL.replace(/\/$/, '')}/${path.replace(/^\//, '')}`;
}

export const photos: Record<string, { src: string; alt: string }> = {
  community: { src: 'images/community.webp', alt: 'An illustrative gathering of elders, families, and volunteers in a sunlit Indian courtyard' },
  education: { src: 'images/education.webp', alt: 'A volunteer reading with children in a community learning room' },
  food: { src: 'images/food.webp', alt: 'Volunteers sharing a freshly prepared meal with a community member' },
  elders: { src: 'images/elders.webp', alt: 'An elderly woman and a young volunteer enjoying a conversation in a garden' },
  health: { src: 'images/health.webp', alt: 'A health volunteer checking an older community member’s blood pressure' },
  volunteers: { src: 'images/volunteers.webp', alt: 'Community volunteers planting a garden together' },
};

export const programs = [
  { title: 'A chance to learn', category: 'Education', image: 'education', icon: 'book', description: 'Opening doors through books, patient guidance, and a welcoming place to learn.' },
  { title: 'A meal, shared with love', category: 'Food & nourishment', image: 'food', icon: 'bowl', description: 'Bringing people together around nourishing meals and the simple joy of sharing.' },
  { title: 'Care that feels like home', category: 'Elder care', image: 'elders', icon: 'heart', description: 'Making space for companionship, everyday support, and a life of dignity.' },
  { title: 'Wellness within reach', category: 'Health & wellbeing', image: 'health', icon: 'plus', description: 'Helping our neighbours connect with preventive care and health awareness.' },
];

export const dateLabel = (date: Date) => new Intl.DateTimeFormat('en-IN', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' }).format(date);
