export function url(path = '') {
  return `${import.meta.env.BASE_URL.replace(/\/$/, '')}/${path.replace(/^\//, '')}`;
}

export const dateLabel = (date: Date) => new Intl.DateTimeFormat('en-IN', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' }).format(date);

export function sortStories(a: { data: { date?: Date; title: string } }, b: { data: { date?: Date; title: string } }) {
  if (a.data.date && !b.data.date) return -1;
  if (!a.data.date && b.data.date) return 1;
  return (a.data.date && b.data.date ? +b.data.date - +a.data.date : 0) || a.data.title.localeCompare(b.data.title, 'en');
}
