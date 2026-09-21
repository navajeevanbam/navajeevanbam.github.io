import { chromium } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { createServer } from 'node:http';
import { readFile, stat, readdir, mkdir, writeFile } from 'node:fs/promises';
import { resolve, join, extname } from 'node:path';
import assert from 'node:assert/strict';

const root = resolve('dist');
const base = (process.env.BASE_PATH || '/').replace(/\/$/, '');
const types = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.webp': 'image/webp', '.svg': 'image/svg+xml', '.woff2': 'font/woff2', '.woff': 'font/woff' };
const server = createServer(async (request, response) => {
  try {
    let pathname = decodeURIComponent(new URL(request.url, 'http://localhost').pathname);
    if (base && !pathname.startsWith(base + '/')) throw new Error('outside base');
    pathname = pathname.slice(base.length);
    let file = resolve(root, '.' + pathname);
    if (file !== root && !file.startsWith(root + '/')) throw new Error('outside root');
    if ((await stat(file)).isDirectory()) file = join(file, 'index.html');
    response.writeHead(200, { 'Content-Type': types[extname(file)] || 'application/octet-stream' });
    response.end(await readFile(file));
  } catch {
    response.writeHead(404, { 'Content-Type': 'text/html' });
    response.end(await readFile(join(root, '404.html')));
  }
});
await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
const origin = `http://127.0.0.1:${server.address().port}`;
const href = route => `${origin}${base}/${route}`;
const output = `test-results/${base ? 'subpath' : 'root'}`;
await mkdir(output, { recursive: true });
let browser;
const result = { base: base || '/', layouts: [], accessibility: [], interactions: [] };
try {
  browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  const events = (await readdir('src/content/events')).map(name => `events/${name.replace('.md', '')}/`);
  const stories = (await readdir('src/content/stories')).map(name => `stories/${name.replace('.md', '')}/`);
  const routes = ['', 'about/', 'donation/', 'contact/', 'events/', 'stories/', ...events, ...stories, '404.html'];
  for (const width of [375, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: 1000 });
    for (const route of routes) {
      const response = await page.goto(href(route));
      assert.equal(response.status(), 200, `${route} did not load`);
      await page.evaluate(() => document.fonts.ready);
      // Load below-fold images for a complete screenshot without changing source markup.
      await page.evaluate(() => { for (const img of document.images) img.loading = 'eager'; });
      await page.waitForFunction(() => [...document.images].every(img => img.complete && img.naturalWidth > 0));
      await page.evaluate(async () => { await Promise.all([...document.images].map(img => img.decode())); await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))); });
      assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `Horizontal overflow: ${route} at ${width}px`);
      if (route === '' || (width === 375 || width === 1440) && ['donation/','contact/',events[0],stories[0]].includes(route)) {
        await page.screenshot({ path: `${output}/${route.replaceAll('/', '-') || 'home'}-${width}.png`, fullPage: true });
      }
      result.layouts.push({ route, width, passed: true });
      if (width === 1440) {
        const audit = await new AxeBuilder({ page }).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze();
        const violations = audit.violations.map(v => ({ id: v.id, impact: v.impact, nodes: v.nodes.map(n => ({ target: n.target, summary: n.failureSummary })) }));
        result.accessibility.push({ route, violations });
      }
    }
  }
  for (const route of [...events, ...stories]) {
    await page.goto(href(route));
    assert.equal((await page.reload()).status(), 200, `Direct refresh failed: ${route}`);
  }
  await page.goto(href('events/'));
  await page.getByRole('button', {name:'Upcoming',exact:true}).click();
  assert.equal(await page.locator('.event-card:visible').count(),3);
  await page.getByRole('button', {name:'Past gatherings',exact:true}).click();
  assert.equal(await page.locator('.event-card:visible').count(),3);
  await page.getByRole('button', {name:'All gatherings',exact:true}).click();
  assert.equal(await page.locator('.event-card:visible').count(),6);
  result.interactions.push('Event filters: all, upcoming, and past');

  await page.goto(href('donation/'));
  await page.getByRole('button',{name:'Preview my contribution'}).click();
  assert.match(await page.locator('#donation-result').innerText(),/₹1,000/);
  await page.locator('label').filter({has:page.locator('input[value="500"]')}).click();
  assert.equal(await page.locator('#amount-preview').innerText(),'₹500');
  await page.getByLabel('Choose a custom amount').check();
  await page.locator('#custom-amount').fill('-1');
  await page.getByRole('button',{name:'Preview my contribution'}).click();
  assert.equal(await page.locator('#custom-amount').evaluate(el => el.validity.valid),false);
  assert.equal(await page.locator('#donation-result').isVisible(),false);
  await page.locator('#custom-amount').fill('1750');
  await page.getByLabel('Where would you like to help?').selectOption('Education');
  await page.getByRole('button',{name:'Preview my contribution'}).click();
  assert.match(await page.locator('#donation-result').innerText(),/₹1,750 · Education/);
  assert.match(await page.locator('#donation-result').innerText(),/no payment processed/);
  result.interactions.push('Donation presets, custom amount validation, cause, and demo feedback');

  await page.goto(href('contact/'));
  const sent = [];
  page.on('request', request => { if (request.method() !== 'GET') sent.push(request.url()); });
  await page.getByRole('button',{name:'Preview my enquiry'}).click();
  assert.equal(await page.locator('#contact-result').isVisible(),false);
  await page.getByLabel('Your name').fill('Sample Visitor');
  await page.getByLabel('Email address').fill('invalid');
  assert.equal(await page.locator('#contact-email').evaluate(el => el.validity.valid),false);
  await page.getByLabel('Email address').fill('visitor@example.org');
  await page.getByLabel('What brings you here?').selectOption('Volunteering');
  await page.getByLabel('Your message').fill('I would like to learn about future volunteering opportunities.');
  await page.getByRole('button',{name:'Preview my enquiry'}).click();
  assert.match(await page.locator('#contact-result').innerText(),/no message was sent or stored/);
  assert.equal(await page.locator('#contact-name').inputValue(),'');
  assert.equal(sent.length,0);
  assert.equal(await page.evaluate(() => localStorage.length + sessionStorage.length),0);
  result.interactions.push('Contact required fields, email validation, demo feedback, and no storage or submission');

  await page.setViewportSize({width:375,height:812});
  await page.goto(href(''));
  await page.keyboard.press('Tab');
  assert.equal(await page.evaluate(() => document.activeElement.textContent),'Skip to content');
  const toggle=page.getByRole('button',{name:'Open navigation'});
  await toggle.click();
  assert.equal(await page.locator('#menu-toggle').getAttribute('aria-expanded'),'true');
  await page.keyboard.press('Escape');
  assert.equal(await page.locator('#menu-toggle').getAttribute('aria-expanded'),'false');
  assert.equal(await page.evaluate(() => document.activeElement.id),'menu-toggle');
  await toggle.click();
  await page.getByRole('navigation',{name:'Main navigation'}).getByRole('link',{name:'About us'}).click();
  assert.ok(page.url().endsWith('/about/'));
  await page.emulateMedia({reducedMotion:'reduce'});
  assert.equal(await page.evaluate(() => getComputedStyle(document.documentElement).scrollBehavior),'auto');
  result.interactions.push('Mobile menu, Escape focus return, keyboard skip link, and reduced motion');

  assert.equal((await page.goto(href('not-a-real-page/'))).status(),404);
  assert.match(await page.locator('h1').innerText(),/find your way home/);
  assert.ok((await page.getByRole('link',{name:'Back to the Ashram'}).getAttribute('href')).startsWith(base+'/'));
  const noJs = await browser.newContext({javaScriptEnabled:false,viewport:{width:375,height:812}});
  const staticPage=await noJs.newPage();
  await staticPage.goto(href(''));
  assert.equal(await staticPage.getByRole('navigation',{name:'Main navigation'}).isVisible(),true);
  await staticPage.goto(href('contact/'));
  assert.equal(await staticPage.getByRole('button',{name:'Preview my enquiry'}).isDisabled(),true);
  await noJs.close();
  result.interactions.push('Static 404 recovery and no-JavaScript navigation');
  assert.deepEqual(errors,[],'Browser JavaScript errors');
  await writeFile(`${output}/report.json`,JSON.stringify(result,null,2));
  const violations=result.accessibility.flatMap(item=>item.violations.map(v=>({route:item.route,...v})));
  console.log(JSON.stringify({layouts:result.layouts.length,accessibilityAudits:result.accessibility.length,interactions:result.interactions,violations},null,2));
  assert.equal(violations.length,0,'Accessibility violations; see report.json');
} finally {
  await browser?.close();
  await new Promise(resolve => server.close(resolve));
}
