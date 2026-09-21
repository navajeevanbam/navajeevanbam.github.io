interface Sponsorship {
  title: string;
  description: string;
  icon: string;
  options: { label: string; amount: number; period: string }[];
}
interface BankAccount { holder: string; number: string; ifsc: string; bank: string; branch: string; }

// Transcribed from the main website's donation section; account numbers remain strings.
export const donation = {
  source: 'https://www.navajeevanbam.com/home#donate',
  checkedOn: '2026-09-21',
  qr: {
    src: 'images/donation/donation-qr.jpeg', width: 768, height: 996,
    source: 'https://www.navajeevanbam.com/assets/images/QR-Code-for-donation-768x996.jpeg',
  },
  sponsorships: [
    { title: 'Sponsor a breakfast', description: 'Start the day with a nourishing meal for the Ashram community.', icon: 'sun', options: [{ label: 'Breakfast', amount: 2000, period: 'per meal' }, { label: 'Special breakfast', amount: 2500, period: 'per meal' }] },
    { title: 'Sponsor lunch or dinner', description: 'Bring people together over a meal, on an ordinary day or a special occasion.', icon: 'bowl', options: [{ label: 'Regular lunch or dinner', amount: 4000, period: 'per meal' }, { label: 'Special lunch or dinner', amount: 6000, period: 'per meal' }] },
    { title: 'A full day of meals', description: 'Sponsor breakfast, lunch, and dinner for a day at the Ashram.', icon: 'heart', options: [{ label: 'Breakfast, lunch & dinner', amount: 12000, period: 'per day' }] },
    { title: 'Support a teacher', description: 'Contribute towards teaching staff for the children at the Ashram.', icon: 'book', options: [{ label: 'Teaching staff sponsorship', amount: 10000, period: 'per month' }] },
    { title: 'Annalaxmi for one woman', description: 'Support the Annalaxmi programme for an older woman in need.', icon: 'heart', options: [{ label: 'One woman’s sponsorship', amount: 12000, period: 'per year' }] },
    { title: 'Care for the Goshala', description: 'Help meet the everyday expenses of Navajeevan Goshala.', icon: 'sun', options: [{ label: 'Goshala expenses', amount: 2000, period: 'per day' }] },
    { title: 'Support one Gomata', description: 'Contribute towards the care of one cow at the Goshala.', icon: 'heart', options: [{ label: 'One cow’s care', amount: 500, period: 'per month' }] },
  ] satisfies Sponsorship[],
  accounts: [
    { holder: 'Navajeevan Seva Ashram', number: '4794000100023666', ifsc: 'PUNB0479400', bank: 'Punjab National Bank', branch: 'Jenanahospital Road, Berhampur, Ganjam' },
    { holder: 'Navajeevan Seva Trust', number: '293110100044278', ifsc: 'UBIN0829315', bank: 'Union Bank of India', branch: 'Bishnu Nagar, Aska Road, Berhampur, Ganjam' },
    { holder: 'Navajeevan Seva Trust', number: '84048316367', ifsc: 'SBIN0RRUKGB', bank: 'Utkal Grameen Bank', branch: 'Courtpeta, Brahmapur, Ganjam' },
  ] satisfies BankAccount[],
};
