import assert from 'node:assert/strict';
import { normalizeIndianMobile, isContactEndpointConfigured } from '../src/lib/contact.ts';
for(const value of ['9876543210','+919876543210','919876543210','+91 98765-43210','98765 43210'])assert.equal(normalizeIndianMobile(value),'+919876543210');
for(const value of ['6123456789','7123456789','8123456789','9123456789'])assert.equal(normalizeIndianMobile(value),`+91${value}`);
for(const value of ['','1234567890','987654321','+449876543210','09876543210','98765abc10','++919876543210'])assert.equal(normalizeIndianMobile(value),null);
assert.equal(isContactEndpointConfigured('https://example.com/submit'),false);
for(const url of ['','http://example.com','javascript:alert(1)','https://name:password@example.com'])assert.equal(isContactEndpointConfigured(url),false);
assert.equal(isContactEndpointConfigured('https://api.web3forms.com/submit'),true);
console.log('Contact phone normalization and endpoint configuration checks passed.');
