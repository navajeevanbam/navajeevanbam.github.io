import { contact } from '../config/contact';
import { isAllowedContactEmail, normalizeIndianMobile, isContactEndpointConfigured, isContactFieldIdsConfigured, sendContact } from '../lib/contact';
const form = document.querySelector<HTMLFormElement>('#contact-form')!;
const panel = document.querySelector<HTMLElement>('#contact-entry')!;
const success = document.querySelector<HTMLElement>('#contact-success')!;
const result = document.querySelector<HTMLElement>('#contact-result')!;
const errorText = document.querySelector<HTMLElement>('#contact-error-text')!;
const alternatives = document.querySelector<HTMLElement>('#contact-alternatives')!;
const name = document.querySelector<HTMLInputElement>('#contact-name')!;
const phone = document.querySelector<HTMLInputElement>('#contact-phone')!;
const email = document.querySelector<HTMLInputElement>('#contact-email')!;
const subject = document.querySelector<HTMLSelectElement>('#contact-subject')!;
const message = document.querySelector<HTMLTextAreaElement>('#contact-message')!;
const button = form.querySelector<HTMLButtonElement>('button[type="submit"]')!;
const fields = form.querySelector<HTMLFieldSetElement>('fieldset')!;
let sending = false;
button.disabled = false;
form.addEventListener('input', () => {
  email.setCustomValidity(''); name.setCustomValidity(''); phone.setCustomValidity(''); message.setCustomValidity('');
  result.hidden = true;
});
function showError(text: string, unavailable = false) {
  errorText.textContent = text;
  alternatives.hidden = !unavailable;
  result.hidden = false;
  result.focus();
}
form.addEventListener('submit', async event => {
  event.preventDefault();
  if (sending) return;
  const normalizedPhone = normalizeIndianMobile(phone.value);
  name.setCustomValidity(name.value.trim() ? '' : 'Please enter your name.');
  phone.setCustomValidity(normalizedPhone ? '' : 'Enter a 10-digit Indian mobile number starting with 6, 7, 8, or 9.');
  message.setCustomValidity(message.value.trim() ? '' : 'Please enter your message.');
  email.setCustomValidity(isAllowedContactEmail(email.value, contact.allowedEmailDomains) ? '' : contact.emailProviderHint);
  if (!form.reportValidity()) return;
  const endpoint = form.dataset.endpoint ?? '';
  const fieldIds = {
    name: name.name, phone: phone.name, email: email.name,
    subject: subject.name, message: message.name,
  };
  if (!isContactEndpointConfigured(endpoint) || !isContactFieldIdsConfigured(fieldIds)) {
    showError('The contact form is not available yet. Please call or email us using the links below.', true);
    return;
  }
  sending = true;
  fields.disabled = true;
  button.disabled = true;
  button.textContent = 'Sending…';
  form.setAttribute('aria-busy', 'true');
  result.hidden = true;
  try {
    await sendContact(endpoint, fieldIds, {
      name: name.value.trim(), phone: normalizedPhone!, email: email.value.trim(),
      subject: subject.value, message: message.value.trim(),
    }, Number(form.dataset.timeout));
    form.reset();
    panel.hidden = true;
    success.hidden = false;
    success.querySelector<HTMLElement>('h2')!.focus();
  } catch (error) {
    showError(error instanceof Error && error.name === 'TimeoutError'
      ? 'We could not confirm whether your message was saved. Please try again.'
      : 'We could not send your message. Please try again.');
  } finally {
    sending = false;
    fields.disabled = false;
    button.disabled = false;
    button.textContent = 'Send message';
    form.removeAttribute('aria-busy');
  }
});
document.querySelector('#contact-again')!.addEventListener('click', () => {
  success.hidden = true; panel.hidden = false; result.hidden = true;
  form.reset(); name.focus();
});
