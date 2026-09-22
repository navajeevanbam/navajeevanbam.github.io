/** Public Google Forms configuration. See docs/CONTACT-SETUP.md. */
export const contact = {
  formUrl: 'https://docs.google.com/forms/d/e/1FAIpQLSecMIccxk5z5JMgoaejXzi3VTw7v4CseWY6bLor0kgENkPBzg/viewform',
  endpointUrl: 'https://docs.google.com/forms/d/e/1FAIpQLSecMIccxk5z5JMgoaejXzi3VTw7v4CseWY6bLor0kgENkPBzg/formResponse',
  fieldIds: {
    name: 'entry.145352443',
    phone: 'entry.535490106',
    email: 'entry.494635287',
    subject: 'entry.1517815594',
    message: 'entry.1889640487',
  },
  // Five allowed providers; Microsoft includes its Outlook and Hotmail domains.
  allowedEmailDomains: ['gmail.com', 'outlook.com', 'hotmail.com', 'yahoo.com', 'icloud.com', 'aol.com'],
  emailProviderHint: 'Use Gmail, Outlook/Hotmail, Yahoo, iCloud, or AOL.',
  timeoutMs: 20_000,
};
