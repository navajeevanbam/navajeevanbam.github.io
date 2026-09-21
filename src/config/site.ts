interface SiteConfig {
  name: string;
  shortName: string;
  tagline: string;
  city: string;
  logo: { src: string; width: number; height: number };
  community: { label: string; href: string };
  emails: string[];
  phones: { label: string; href: `tel:${string}` }[];
  addressLines: string[];
  visiting: string;
}

export const site = {
  shortName: 'Navajeevan',
  logo: { src: 'images/branding/logo.png', width: 2170, height: 725 },
  community: { label: 'Join our community', href: 'https://www.facebook.com/Navajeevansevaashram' },
  name: 'Navajeevan Seva Ashram',
  tagline: 'A little care. A new beginning.',
  city: 'BRAHMPUR',
  emails: ['navajeevansevaashram.bam@gmail.com', 'navajeevansevatrust@gmail.com'],
  phones: [{ label: '+91 94373-22820', href: 'tel:+919437322820' }, { label: '+91 70085-30044', href: 'tel:+917008530044' }],
  addressLines: ['Madanmohanpur, Kanishi', 'Brahmapur, Ganjam, Odisha'],
  visiting: 'Visits by prior arrangement',
} satisfies SiteConfig;
