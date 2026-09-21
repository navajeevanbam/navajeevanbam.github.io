# Contact form: Web3Forms

The website sends contact messages directly to Web3Forms. No separate backend is needed.

## Configuration

Open `src/config/contact.ts` to change the destination:

```ts
export const contact = {
  endpointUrl: 'https://api.web3forms.com/submit',
  accessKey: 'YOUR_WEB3FORMS_ACCESS_KEY',
  timeoutMs: 20_000,
} satisfies { endpointUrl: string; accessKey: string; timeoutMs: number };
```

Keep the endpoint shown above and set `accessKey` to your Web3Forms form access key. This key is intended for browser forms and is included in the public page. After changing it, rebuild and publish the website as usual.

## Fields sent

| Field | What it contains |
| --- | --- |
| `access_key` | The form access key from configuration. |
| `name` | Required name, up to 100 characters. |
| `phone` | Required Indian mobile, normalized to `+91` followed by 10 digits starting with 6–9. |
| `email` | Optional email; an empty string when omitted. |
| `subject` | The selected contact topic. |
| `message` | Required non-blank message, up to 3000 characters. |

Requests use HTTPS POST, URL-encoded fields, and `Accept: application/json`. A successful HTTP response containing JSON `success: true` confirms acceptance. Missing, false, or malformed confirmation is treated as failure. Acceptance does not guarantee email delivery to an inbox.

## What visitors see

- The button says **Sending…** during submission, and duplicate submissions are prevented.
- An accepted submission replaces the form with a thank-you panel. **Send another message** opens a fresh form.
- HTTP errors (including validation and rate limits), network failures, and timeouts keep all entered values and display **Please try again**.
- The timeout is 20 seconds. A timed-out request may still have arrived; the website does not automatically retry.
- An invalid endpoint or missing access key makes no request and displays phone/email alternatives.
- Without JavaScript, visitors can use the phone and email links.
- Form values are kept only in page memory, not browser storage.

## Check delivery

1. Confirm your Web3Forms access key belongs to the intended recipient email.
2. Check that your Web3Forms settings allow an empty email field and your published website domain.
3. Submit a clearly marked test enquiry on the website using your own phone number, first without email and then with email.
4. Check the recipient inbox and spam folder for the enquiry, including name, phone, email (when provided), subject, and message.
5. Repeat after publishing the site.

Automated browser checks use mocked Web3Forms responses; they do not send messages to the live account. Live acceptance and notification delivery must be verified separately.

Reference: [Web3Forms's AJAX submission example](https://docs.web3forms.com/how-to-guides/html-and-javascript).
