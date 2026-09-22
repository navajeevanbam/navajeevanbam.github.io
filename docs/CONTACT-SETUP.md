# Contact form: Google Forms

The website posts contact messages to the public Google Form. Edit `src/config/contact.ts` to change its public URL, submission endpoint, field IDs, or timeout, then rebuild and publish.

| Website field | Google Form question | Submission field ID |
| --- | --- | --- |
| Name | Name | `entry.2089867619` |
| Mobile number | Phone | `entry.576901234` |
| Email (optional) | Email | `entry.854492072` |
| Topic | Type | `entry.87025741` |
| Message | Comment | `entry.1398384653` |

These are public submission entry IDs, not the internal question IDs. If questions are deleted and recreated, update their entry IDs. Keep the form published and accepting responses without requiring sign-in; keep Email optional.

Requests are URL-encoded HTTPS POSTs using `no-cors` and no credentials. Google Forms returns an opaque response, so the browser cannot inspect HTTP errors, validation failures, or confirm that a response was saved. The completion panel therefore says submitted and explains that receipt cannot be confirmed. Network errors and timeouts preserve entered values and offer retry. A timed-out request may still have arrived; there is no automatic retry. Duplicate clicks are blocked while sending. Invalid configuration shows phone/email alternatives without submitting.

Mobile numbers are normalized to +91 followed by ten digits. Values are not stored in browser storage. Without JavaScript, visitors can open the configured Google Form directly or call/email.

Automated checks mock requests and verify field mappings, validation, network failure, timeout, and completion behavior without creating live responses. To verify storage, submit a clearly marked enquiry with your own details and check the Google Form Responses tab (or linked spreadsheet), both with and without email. Repeat after publishing or changing the Google Form.
