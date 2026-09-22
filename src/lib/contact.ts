export function normalizeIndianMobile(value: string): string | null {
  const compact = value.replace(/[\s-]/g, '');
  const match = compact.match(/^(?:\+91|91)?([6-9]\d{9})$/);
  return match ? `+91${match[1]}` : null;
}
export function isContactEndpointConfigured(endpoint: string): boolean {
  try {
    const url = new URL(endpoint);
    return url.protocol === 'https:' && !url.username && !url.password && url.origin === 'https://docs.google.com' && /^\/forms\/d\/e\/[A-Za-z0-9_-]+\/formResponse$/.test(url.pathname) && !url.search && !url.hash;
  } catch { return false; }
}
export interface ContactPayload { name: string; phone: string; email: string; subject: string; message: string; }
export type ContactFieldIds = Record<keyof ContactPayload, string>;
export function isContactFieldIdsConfigured(fieldIds: ContactFieldIds): boolean {
  const ids = [fieldIds.name, fieldIds.phone, fieldIds.email, fieldIds.subject, fieldIds.message];
  return ids.every(id => /^entry\.\d+$/.test(id)) && new Set(ids).size === ids.length;
}
export async function sendContact(endpoint: string, fieldIds: ContactFieldIds, payload: ContactPayload, timeoutMs: number): Promise<void> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(endpoint, {
      method: 'POST', body: new URLSearchParams(
        Object.entries(payload).map(([field, value]) => [fieldIds[field as keyof ContactPayload], value]),
      ),
      mode: 'no-cors', credentials: 'omit', signal: controller.signal,
    });
    // Google Forms returns an opaque cross-origin response: receipt cannot be verified.
    if (response.type !== 'opaque' && !response.ok) throw new Error('Submission rejected');
  } catch (error) {
    if (controller.signal.aborted) { const timeoutError = new Error('Save could not be confirmed'); timeoutError.name = 'TimeoutError'; throw timeoutError; }
    throw error;
  } finally { clearTimeout(timeout); }
}
