import assert from 'node:assert/strict';
import { contact } from '../src/config/contact.ts';
import { isAllowedContactEmail, normalizeIndianMobile, isContactEndpointConfigured, isContactFieldIdsConfigured, sendContact } from '../src/lib/contact.ts';
for(const value of ['9876543210','+919876543210','919876543210','+91 98765-43210','98765 43210'])assert.equal(normalizeIndianMobile(value),'+919876543210');
for(const value of ['6123456789','7123456789','8123456789','9123456789'])assert.equal(normalizeIndianMobile(value),`+91${value}`);
for(const value of ['','1234567890','987654321','+449876543210','09876543210','98765abc10','++919876543210'])assert.equal(normalizeIndianMobile(value),null);
assert.equal(isContactEndpointConfigured('https://example.com/submit'),false);
for(const url of ['','http://example.com','javascript:alert(1)','https://name:password@example.com'])assert.equal(isContactEndpointConfigured(url),false);
assert.equal(isContactEndpointConfigured('https://api.web3forms.com/submit'),false);
assert.equal(isContactEndpointConfigured(contact.endpointUrl),true);
assert.equal(isContactFieldIdsConfigured(contact.fieldIds),true);
assert.equal(isContactFieldIdsConfigured({...contact.fieldIds, phone: ''}),false);
const originalFetch = globalThis.fetch;
try {
  globalThis.fetch = async (url, options) => {
    assert.equal(url, contact.endpointUrl);
    assert.equal(options.mode, 'no-cors');
    assert.deepEqual(Object.fromEntries(options.body), {
      'entry.145352443': 'Visitor', 'entry.535490106': '+919876543210',
      'entry.494635287': '', 'entry.1517815594': 'Volunteering', 'entry.1889640487': 'Hello',
    });
    return { type: 'opaque', ok: false, status: 0 };
  };
  await sendContact(contact.endpointUrl, contact.fieldIds, {name:'Visitor',phone:'+919876543210',email:'',subject:'Volunteering',message:'Hello'},1000);
} finally { globalThis.fetch = originalFetch; }
console.log('Contact phone normalization and endpoint configuration checks passed.');

for (const domain of contact.allowedEmailDomains) {
  assert.equal(isAllowedContactEmail(`visitor+test@${domain.toUpperCase()}`, contact.allowedEmailDomains), true);
}
assert.equal(isAllowedContactEmail('', contact.allowedEmailDomains), true);
for (const value of ['visitor@example.org', 'visitor@gmail.com.evil.org', 'visitor@sub.gmail.com', 'visitor@@gmail.com', '@gmail.com', 'hello world@gmail.com']) {
  assert.equal(isAllowedContactEmail(value, contact.allowedEmailDomains), false);
}
