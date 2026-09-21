export function normalizeIndianMobile(value: string): string | null {
  const compact = value.replace(/[\s-]/g, '');
  const match = compact.match(/^(?:\+91|91)?([6-9]\d{9})$/);
  return match ? `+91${match[1]}` : null;
}
export function isContactEndpointConfigured(endpoint: string): boolean {
  try {
    const url = new URL(endpoint);
    return url.protocol === 'https:' && !url.username && !url.password && url.origin === 'https://api.web3forms.com' && url.pathname === '/submit';
  } catch { return false; }
}
export interface ContactPayload { name: string; phone: string; email: string; subject: string; message: string; }
export async function sendContact(endpoint: string, accessKey: string, payload: ContactPayload, timeoutMs: number): Promise<void> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(endpoint, {
      method: 'POST', headers: { Accept: 'application/json' }, body: new URLSearchParams({ ...payload, access_key: accessKey }),
      mode: 'cors', credentials: 'omit', signal: controller.signal,
    });
    if (!response.ok) throw new Error('Submission rejected');
    const data: unknown = await response.json();
    if (!data || typeof data !== 'object' || !('success' in data) || data.success !== true) throw new Error('Submission not confirmed');
  } catch (error) {
    if (controller.signal.aborted) { const timeoutError = new Error('Save could not be confirmed'); timeoutError.name = 'TimeoutError'; throw timeoutError; }
    throw error;
  } finally { clearTimeout(timeout); }
}
