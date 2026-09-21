/** Public Web3Forms configuration. See docs/CONTACT-SETUP.md. */
export const contact = {
  endpointUrl: 'https://api.web3forms.com/submit',
  accessKey: 'c764beea-b423-44f5-86bf-65fef4262d78',
  timeoutMs: 20_000,
} satisfies { endpointUrl: string; accessKey: string; timeoutMs: number };
