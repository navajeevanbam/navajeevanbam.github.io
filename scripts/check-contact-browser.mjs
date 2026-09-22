import assert from 'node:assert/strict';
import { contact } from '../src/config/contact.ts';
import AxeBuilder from '@axe-core/playwright';
export async function checkContact(page, href, output) {
  await page.goto(href('contact/'));
  await page.emulateMedia({reducedMotion:'reduce'});
  const submit = page.getByRole('button',{name:'Send message',exact:true});
  const name = page.getByLabel('Your name');
  const phone = page.getByLabel('Mobile Number');
  const email = page.getByLabel('Email address');
  const message = page.getByLabel('Your message');
  const text = 'I would like to learn about future volunteering opportunities.';
  const requests = [];
  const listener = request => { if(request.method()==='POST') requests.push(request); };
  page.on('request',listener);
  await submit.click();
  assert.equal(await page.locator('#contact-result').isVisible(),false);
  await name.fill('Sample Visitor');
  await page.getByLabel('What brings you here?').selectOption('Volunteering');
  await message.fill(text);
  for(const invalid of ['','1234567890','987654321','+449876543210','09876543210','98765abc10']) {
    await phone.fill(invalid);await submit.click();
    assert.equal(await phone.evaluate(el=>el.validity.valid),false);
  }
  await phone.fill('+91 98765-43210');
  await email.fill('invalid');await submit.click();
  assert.equal(await email.evaluate(el=>el.validity.valid),false);
  for (const value of ['visitor@example.org', 'visitor@gmail.com.evil.org', 'visitor@sub.gmail.com']) {
    await email.fill(value); await submit.click();
    assert.equal(await email.evaluate(el=>el.validity.valid),false);
    assert.equal(requests.length,0);
  }
  await email.fill('');
  assert.equal(await page.locator('#contact-form').getAttribute('data-endpoint'),contact.endpointUrl);
  await page.locator('#contact-form').evaluate(el=>el.dataset.endpoint='');
  await submit.click();
  assert.match(await page.locator('#contact-result').innerText(),/not available yet/);
  assert.equal(requests.length,0);
  assert.equal(await name.inputValue(),'Sample Visitor');
  assert.equal(await page.locator('#contact-success').isVisible(),false);
  const endpoint=contact.endpointUrl;
  let mode='success';
  await page.route(endpoint,async route=>{
    const current=mode;
    if(current==='network')return route.abort('failed');
    if(current==='timeout'){await new Promise(resolve=>setTimeout(resolve,250));return route.fulfill({body:'{}'}).catch(()=>{});}
    if(current==='slow')await new Promise(resolve=>setTimeout(resolve,150));
    const body=current==='malformed'?'not-json':JSON.stringify(current==='reject'||current==='false'?{success:false}:current==='missing'?{}:current==='string'?{success:'true'}:{success:true});
    await route.fulfill({status:current==='http'?500:current==='reject'?422:current==='rate-limit'?429:200,contentType:'application/json',headers:{'access-control-allow-origin':'*'},body});
  });
  await page.locator('#contact-form').evaluate((el,url)=>el.dataset.endpoint=url,endpoint);
  const fieldId=await phone.getAttribute('name');
  await phone.evaluate(el=>el.name='');
  await submit.click();
  assert.equal(requests.length,0);
  assert.match(await page.locator('#contact-result').innerText(),/not available yet/);
  await phone.evaluate((el,id)=>el.name=id,fieldId);
  for(const failure of ['network','timeout']) {
    mode=failure;
    await page.locator('#contact-form').evaluate((el,timeout)=>el.dataset.timeout=String(timeout),failure==='timeout'?50:20000);
    await submit.click();
    await page.waitForFunction(()=>!document.querySelector('#contact-result').hidden && !document.querySelector('#contact-form').hasAttribute('aria-busy'));
    assert.match(await page.locator('#contact-error-text').innerText(),failure==='timeout'?/could not confirm.*Please try again/:/Please try again/);
    assert.equal(await name.inputValue(),'Sample Visitor');assert.equal(await message.inputValue(),text);
    assert.equal(await phone.inputValue(),'+91 98765-43210');
    assert.equal(await page.locator('#contact-success').isVisible(),false);
    assert.equal(await page.locator('#contact-result').evaluate(el=>document.activeElement===el),true);
  }
  assert.deepEqual((await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze()).violations.map(v=>v.id),[]);
  await page.locator('#contact-form').evaluate(el=>el.dataset.timeout='20000');
  mode='slow';
  const before=requests.length;
  await submit.click();
  assert.equal(await page.getByRole('button',{name:'Sending…',exact:true}).isDisabled(),true);
  await page.locator('#contact-form').evaluate(el=>el.dispatchEvent(new Event('submit',{bubbles:true,cancelable:true})));
  await page.locator('#contact-success').waitFor({state:'visible'});
  assert.equal(requests.length,before+1);
  const payload=new URLSearchParams(requests.at(-1).postData());
  assert.equal(payload.get(contact.fieldIds.phone),'+919876543210');assert.equal(payload.get(contact.fieldIds.email),'');
  assert.deepEqual([...payload.keys()].sort(),Object.values(contact.fieldIds).sort());
  assert.match(requests.at(-1).headers()['content-type'],/application\/x-www-form-urlencoded/);
  assert.equal(await page.locator('#contact-success h2').evaluate(el=>document.activeElement===el),true);
  assert.deepEqual((await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze()).violations.map(v=>v.id),[]);
  if(output) for(const width of [375,1440]) {
    await page.setViewportSize({width,height:1000});
    assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
    await page.locator('#contact-success').screenshot({path:`${output}/contact-success-${width}.png`});
  }
  await page.getByRole('button',{name:'Send another message'}).click();
  assert.equal(await name.inputValue(),'');assert.equal(await phone.inputValue(),'');
  assert.equal(await name.evaluate(el=>document.activeElement===el),true);
  assert.equal(await page.evaluate(()=>localStorage.length+sessionStorage.length),0);
  await name.fill('Another Visitor');
  await phone.fill('919876543210');
  await email.fill('visitor@gmail.com');
  await page.getByLabel('What brings you here?').selectOption('Planning a visit');
  await message.fill(text);mode='success';
  await submit.click();await page.locator('#contact-success').waitFor({state:'visible'});
  assert.equal(new URLSearchParams(requests.at(-1).postData()).get(contact.fieldIds.email),'visitor@gmail.com');
  await page.unroute(endpoint);page.off('request',listener);
  await page.emulateMedia({reducedMotion:'no-preference'});
}
