interface Slide { image: string; eyebrow: string; title: string; description: string; cta: string; }
interface Value { title: string; icon: string; description: string; }
interface Service { id: string; title: string; description: string; }
interface TeamMember { name: string; role: string; image: string; }
interface HomeConfig {
  slides: Slide[]; about: { title: string; paragraphs: string[]; images: { image: string; caption: string }[] };
  projects: string[]; values: Value[]; services: Service[]; team: TeamMember[];
  donation: { title: string; description: string; cta: string };
  contact: { title: string; description: string; cta: string };
}
export const home: HomeConfig = {
  slides: [
    { image: 'reference-children', eyebrow: 'A home. A family. A new beginning.', title: 'Every child deserves a place to belong.', description: 'Help make room for care, learning, and the simple joy of childhood.', cta: 'Support a brighter tomorrow' },
    { image: 'reference-meals', eyebrow: 'Nourishment, shared with love', title: 'A shared meal. A world of care.', description: 'Support food sponsorship and bring comfort to the Ashram community.', cta: 'Give with love' },
    { image: 'reference-community', eyebrow: 'Together, we care', title: 'Kindness brings us together.', description: 'Be part of a community caring for children, older women, and animals.', cta: 'Support our community' },
  ],
  about: {
    title: 'Rooted in care.\nGrowing together.',
    images: [
      { image: 'reference-learning', caption: 'Vidyadaan — learning with our volunteers.' },
      { image: 'reference-mkcg', caption: 'MKCG students visiting the Ashram community.' },
    ],
    paragraphs: [
      'Navajeevan Seva Trust provides free services to orphaned children, children in need, and older women, including widows. A home, nourishing food, education, and everyday support help create a place where people are cared for with dignity, beyond geographical boundaries.',
      'Established on 25 March 2012, the Ashram serves people as well as domestic animals. Based in Madanmohanpur, Kanishi, Brahmapur, Odisha, it grew under the active leadership of Sri Susant Kumar Maharana and a team of social workers.',
      'The institution is sponsored and supported by Dr. K. Sridhar Acharya, founder and president of Navajeevan Blind Relief Centre at Tiruchanur, Tirupati, Andhra Pradesh — a charitable trust with branches across different states of India.',
      'Our five service activities bring this commitment to life: Children’s Welfare, Ved Vidyalaya, Go-Sambardhan, Annalaxmi for Widows, and Ahalya Nivas. Together, they connect learning, nourishment, shelter, companionship, and care for animals.',
    ],
  },
  projects: ['tree-plantation-2022', 'eye-testing-camp-2022', 'health-checkup-camp-2022'],
  values: [
    { title: 'Purpose', icon: 'sun', description: 'Care for children, older women, and animals who need a place of support.' },
    { title: 'Values', icon: 'heart', description: 'Meet each person with decency, respect, and the courage to help.' },
    { title: 'Beliefs', icon: 'book', description: 'Compassion reaches beyond boundaries. Everyone deserves to belong.' },
    { title: 'Support', icon: 'bowl', description: 'Give what you can. Small acts of generosity help sustain everyday care.' },
  ],
  services: [
    { id: 'childrens-welfare', title: 'Children’s Welfare', description: 'A caring home, nourishing meals, and opportunities to learn for children in need.' },
    { id: 'ved-vidyalaya', title: 'Ved Vidyalaya', description: 'Preserving Atharva Veda learning through the Gurukul Ashram tradition.' },
    { id: 'go-sambardhan', title: 'Go-Sambardhan', description: 'Food, shelter, and healthcare for cows and calves at Navajeevan Goshala.' },
    { id: 'annalaxmi-for-widows', title: 'Annalaxmi for Widows', description: 'Ration support for older women without dependable family or financial support.' },
    { id: 'ahalya-nivas', title: 'Ahalya Nivas', description: 'Shelter and everyday care for older women who need a home and companionship.' },
  ],
  team: [
    { name: 'Dr. K. Sridhar Acharya', role: 'Founder & President, Navajeevan Blind Relief Centre, Tirupati (AP)', image: 'reference-acharya' },
    { name: 'Dr. Sangita Babu', role: 'President, Navajeevan Seva Trust, Brahmapur', image: 'reference-babu' },
    { name: 'Sri Susant Kumar Maharana', role: 'Secretary cum Incharge, Navajeevan Seva Trust', image: 'reference-maharana' },
  ],
  donation: { title: 'A little generosity.\nA lasting difference.', description: 'Help sustain the meals, learning, shelter, and everyday care that make this community a home.', cta: 'Make a donation' },
  contact: { title: 'There’s a place for you here.', description: 'Visit by prior arrangement, explore volunteering, or simply start a conversation.', cta: 'Get in touch' },
};
