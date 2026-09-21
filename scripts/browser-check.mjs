import { chromium } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { createServer } from 'node:http';
import { readFile, stat, readdir, mkdir, writeFile } from 'node:fs/promises';
import { resolve, join, extname } from 'node:path';
import assert from 'node:assert/strict';
import { checkContact } from './check-contact-browser.mjs';

const root = resolve('dist');
const base = (process.env.BASE_PATH || '/').replace(/\/$/, '');
const types = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.webp': 'image/webp', '.jpeg': 'image/jpeg', '.svg': 'image/svg+xml', '.woff2': 'font/woff2', '.woff': 'font/woff' };
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
  const galleries = (await readdir('src/content/gallery')).map(name => `gallery/${name.replace('.md', '')}/`);
  const routes = ['', 'donation/', 'contact/', 'events/', 'stories/', 'gallery/', ...events, ...stories, ...galleries, '404.html'];
  for (const width of [375, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: 1000 });
    for (const route of routes) {
      const response = await page.goto(href(route));
      assert.equal(response.status(), 200, `${route} did not load`);
      await page.evaluate(() => document.fonts.ready);
      assert.ok(await page.locator('#main [data-reveal]').count() > 0, `Missing scroll reveals: ${route}`);
      // Load below-fold images for a complete screenshot without changing source markup.
      await page.evaluate(() => { for (const img of document.images) img.loading = 'eager'; });
      await page.waitForFunction(() => [...document.images].every(img => img.complete && img.naturalWidth > 0));
      await page.evaluate(async () => { await Promise.all([...document.images].map(img => img.decode())); await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))); });
      assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `Horizontal overflow: ${route} at ${width}px`);
      if (route === '' || (width === 375 || width === 1440) && ['donation/','contact/','404.html','gallery/',galleries[0],events[0],stories[0]].includes(route)) {
        if (await page.locator('[data-reveal]').count()) {
          for (const item of await page.locator('[data-reveal]').all()) {
            await item.evaluate(el => el.scrollIntoView({behavior:'instant',block:'center'}));
            await page.waitForFunction(() => [...document.querySelectorAll('[data-reveal]')].filter(el => {const r=el.getBoundingClientRect();return r.bottom>0&&r.top<innerHeight-120;}).every(el => el.dataset.revealed === 'true'));
          }
          await page.evaluate(() => window.scrollTo({top:0,behavior:'instant'}));
        }
        await page.screenshot({ path: `${output}/${route.replaceAll('/', '-') || 'home'}-${width}.png`, fullPage: true, animations: 'disabled' });
      }
      result.layouts.push({ route, width, passed: true });
      if (width === 1440) {
        // Audit the fully revealed reading state, not transient fade opacity.
        await page.emulateMedia({reducedMotion:'reduce'});
        await page.waitForFunction(() => !document.documentElement.classList.contains('reveal-ready'));
        const audit = await new AxeBuilder({ page }).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze();
        const violations = audit.violations.map(v => ({ id: v.id, impact: v.impact, nodes: v.nodes.map(n => ({ target: n.target, summary: n.failureSummary })) }));
        result.accessibility.push({ route, violations });
        await page.emulateMedia({reducedMotion:'no-preference'});
      }
    }
  }
  await page.goto(href('gallery/'));
  assert.deepEqual(await page.locator('.gallery-card h3').allTextContents(), ['A Day of Shared Meals','Learning Together','Planting a Greener Tomorrow']);
  await page.goto(href(''));
  assert.equal(await page.locator('#gallery .gallery-card').count(),3);
  for (const width of [375, 768, 1024, 1440]) {
    await page.setViewportSize({width,height:900});
    await page.goto(href(galleries[0]));
    await page.emulateMedia({reducedMotion:'reduce'});
    const trigger = page.locator('[data-gallery-photo]').first();
    assert.equal(await page.locator('[data-gallery-photo]').count(),4);
    await trigger.click();
    const dialog = page.getByRole('dialog');
    await dialog.waitFor({state:'visible'});
    assert.equal(await page.locator('[data-counter]').innerText(),'1 of 4');
    assert.equal(await page.evaluate(() => document.body.style.position),'fixed');
    await page.keyboard.press('ArrowLeft');
    assert.equal(await page.locator('[data-counter]').innerText(),'4 of 4');
    await page.keyboard.press('ArrowRight');
    assert.equal(await page.locator('[data-counter]').innerText(),'1 of 4');
    await dialog.getByRole('button',{name:'Next photo',exact:true}).click();
    assert.equal(await page.locator('[data-counter]').innerText(),'2 of 4');
    await page.keyboard.press('Tab');
    assert.equal(await page.evaluate(() => document.activeElement?.getAttribute('data-close')),'');
    await page.keyboard.press('Shift+Tab');
    assert.equal(await page.evaluate(() => document.activeElement?.getAttribute('data-next')),'');
    await page.waitForFunction(() => document.querySelector('[data-image-slot] img')?.complete);
    assert.equal(await page.locator('[data-image-slot] img').evaluate(img => getComputedStyle(img).objectFit),'contain');
    const audit = await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze();
    assert.deepEqual(audit.violations.map(v=>v.id),[]);
    await page.screenshot({path:`${output}/gallery-viewer-${width}.png`});
    await page.keyboard.press('Escape');
    await dialog.waitFor({state:'hidden'});
    assert.equal(await trigger.evaluate(el => document.activeElement===el),true);
    assert.notEqual(await page.evaluate(() => document.body.style.position),'fixed');
    await trigger.click();
    await dialog.getByRole('button',{name:'Close photo viewer'}).click();
    await dialog.waitFor({state:'hidden'});
    assert.equal(await page.getByRole('button',{name:'Open navigation',exact:true}).isVisible(),width<1280);
  }
  await page.emulateMedia({reducedMotion:'no-preference'});
  const plain = await browser.newContext({javaScriptEnabled:false});
  const plainPage = await plain.newPage();
  await plainPage.goto(href(galleries[0]));
  await plainPage.locator('[data-gallery-photo]').first().click();
  assert.ok(plainPage.url().endsWith('.webp'));
  await plain.close();
  assert.equal((await page.goto(href('gallery/missing-album/'))).status(),404);
  result.interactions.push('Gallery ordering, previews, full-screen viewer, focus, keyboard wrap, responsive menu, and no-JavaScript photos');
  for (const route of [...events, ...stories, ...galleries]) {
    await page.goto(href(route));
    assert.equal((await page.reload()).status(), 200, `Direct refresh failed: ${route}`);
  }
  await page.goto(href(''));
  await page.getByRole('button', {name:'Pause slideshow',exact:true}).click();
  assert.equal(await page.locator('[data-active="true"] h2').evaluate(el => getComputedStyle(el).animationName), 'hero-text-down');
  assert.equal(await page.locator('[data-active="true"] .slide-description').evaluate(el => getComputedStyle(el).animationDelay), '0.2s');
  assert.equal(await page.locator('[data-active="true"] .button').evaluate(el => getComputedStyle(el).animationName), 'hero-text-up');
  const heroHeight = await page.locator('.home-slider').evaluate(el => el.getBoundingClientRect().height);
  await page.getByRole('button', {name:'Next slide',exact:true}).click();
  await page.waitForFunction(() => {
    const opacity = Number(getComputedStyle(document.querySelector('[data-slide][data-active="true"]')).opacity);
    return opacity > 0 && opacity < 1;
  });
  assert.equal(await page.locator('[data-slide][aria-hidden="true"]').evaluateAll(slides => slides.every(slide => slide.inert)), true);
  await page.waitForFunction(() => getComputedStyle(document.querySelector('[data-slide][data-active="true"]')).opacity === '1');
  assert.equal(await page.locator('.home-slider').evaluate(el => el.getBoundingClientRect().height), heroHeight, 'Crossfade must not shift the layout');
  result.interactions.push('Smooth crossfade, stable hero height, and inactive slide focus isolation');
  const revealCard = page.locator('.project-card').first();
  assert.equal(await revealCard.evaluate(el => getComputedStyle(el).opacity),'0','Offscreen content must be hidden before its reveal');
  await revealCard.evaluate(el => el.scrollIntoView({behavior:'instant',block:'center'}));
  await page.waitForFunction(() => {
    const card = document.querySelector('.project-card');
    const opacity = Number(getComputedStyle(card).opacity);
    return card.dataset.revealed === 'true' && opacity > 0 && opacity < 1;
  });
  await page.waitForFunction(() => document.querySelector('.project-card').getAnimations().length === 0);
  await page.evaluate(() => window.scrollTo({top:0,behavior:'instant'}));
  await revealCard.evaluate(el => el.scrollIntoView({behavior:'instant',block:'center'}));
  assert.equal(await revealCard.evaluate(el => el.getAnimations().length),0,'Scroll reveals must play only once');
  const serviceLink = page.locator('.service-card h3 a').first();
  await serviceLink.focus();
  assert.equal(await page.locator('.service-card').first().evaluate(el => getComputedStyle(el).opacity),'1','Focused content must be fully visible');
  await page.locator('.team-grid article').first().evaluate(el => el.scrollIntoView({behavior:'instant',block:'center'}));
  await page.waitForFunction(() => document.querySelector('.team-grid article').getAnimations().length > 0);
  assert.equal(await page.locator('.team-grid article').first().evaluate(el => el.getAnimations()[0].effect.getKeyframes()[0].transform), 'scale(0.6)');
  await page.emulateMedia({reducedMotion:'reduce'});
  assert.equal(await page.locator('[data-active="true"] h2').evaluate(el => getComputedStyle(el).animationName), 'none');
  await page.locator('.team-grid article').first().evaluate(el => el.scrollIntoView({behavior:'instant',block:'center'}));
  await page.waitForFunction(() => document.querySelector('.team-grid article').getAnimations().length === 0);
  assert.equal(await page.locator('.team-grid article').first().evaluate(el => getComputedStyle(el).opacity),'1','Reduced motion must reveal pending content');
  await page.emulateMedia({reducedMotion:'no-preference'});
  result.interactions.push('One-time scroll reveals, keyboard focus visibility, and reduced-motion cancellation');
  await page.clock.install();
  await page.goto(href(''));
  const activeSlide = () => page.locator('[data-slide][data-active="true"]').getAttribute('aria-label');
  await page.mouse.move(0, 0);
  await page.clock.fastForward(5000);
  assert.equal(await activeSlide(), '2 of 3');
  await page.locator('.home-slider').hover();
  await page.clock.fastForward(5000);
  assert.equal(await activeSlide(), '3 of 3', 'Hover must not stop looping');
  await page.clock.fastForward(5000);
  assert.equal(await activeSlide(), '1 of 3', 'Last slide must loop to the first');
  await page.getByRole('button', {name:'Next slide',exact:true}).click();
  assert.equal(await activeSlide(), '2 of 3');
  await page.clock.fastForward(5000);
  assert.equal(await activeSlide(), '3 of 3', 'Arrow selection must preserve playback');
  await page.getByRole('button', {name:'Previous slide',exact:true}).press('Enter');
  assert.equal(await activeSlide(), '2 of 3');
  await page.getByRole('button', {name:'Show slide 1',exact:true}).click();
  await page.clock.fastForward(5000);
  assert.equal(await activeSlide(), '2 of 3', 'Indicator selection must preserve playback');
  await page.getByRole('button', {name:'Pause slideshow',exact:true}).click();
  await page.getByRole('button', {name:'Show slide 1',exact:true}).click();
  await page.clock.fastForward(12000);
  assert.equal(await activeSlide(), '1 of 3', 'Manual selection must preserve explicit pause');
  await page.getByRole('button', {name:'Play slideshow',exact:true}).click();
  await page.clock.fastForward(5000);
  assert.equal(await activeSlide(), '2 of 3', 'Play must resume while its button remains hovered and focused');
  await page.getByRole('button', {name:'Pause slideshow',exact:true}).click();
  await page.locator('h1').evaluate(el => { el.setAttribute('tabindex','-1'); el.focus(); });
  await page.clock.fastForward(12000);
  assert.equal(await activeSlide(), '2 of 3', 'Explicit pause must persist');
  await page.emulateMedia({reducedMotion:'reduce'});
  assert.equal(await page.locator('[data-slide]').first().evaluate(el => getComputedStyle(el).transitionDuration), '0s');
  await page.getByRole('button', {name:'Next slide',exact:true}).click();
  await page.mouse.move(0,0);
  await page.clock.fastForward(12000);
  assert.equal(await activeSlide(), '3 of 3', 'Reduced motion must prevent autoplay');
  await page.getByRole('button', {name:'Play slideshow',exact:true}).press('Enter');
  await page.clock.fastForward(5000);
  assert.equal(await activeSlide(), '1 of 3', 'Reduced motion must still allow explicit keyboard playback');
  await page.getByRole('button', {name:'Pause slideshow',exact:true}).press('Enter');
  await page.clock.fastForward(12000);
  assert.equal(await activeSlide(), '1 of 3', 'Keyboard Pause must stop playback');
  await page.emulateMedia({reducedMotion:'no-preference'});
  await page.clock.resume();
  result.interactions.push('Carousel timing, controls, keyboard, continuous looping, explicit pause, and reduced motion');
  await page.goto(href('events/'));
  assert.deepEqual(await page.locator('.event-card h3').allTextContents(), ['A table for everyone', 'Health Checkup Camp', 'Eye Testing Camp', 'Tree Plantation']);
  await page.getByRole('button', {name:'Upcoming',exact:true}).click();
  assert.equal(await page.locator('.event-card:visible').count(),1);
  await page.getByRole('button', {name:'Past gatherings',exact:true}).click();
  assert.equal(await page.locator('.event-card:visible').count(),3);
  await page.getByRole('button', {name:'All gatherings',exact:true}).click();
  assert.equal(await page.locator('.event-card:visible').count(),4);
  result.interactions.push('Event filters: all, upcoming, and past');

  await page.goto(href('donation/'));
  const bankCard = page.locator('.bank-card').first();
  assert.equal(await bankCard.evaluate(el => getComputedStyle(el).opacity), '0');
  await bankCard.evaluate(el => el.scrollIntoView({behavior:'instant',block:'center'}));
  await page.waitForFunction(() => document.querySelector('.bank-card').dataset.revealed === 'true');
  assert.equal(await bankCard.evaluate(el => el.getAnimations()[0]?.effect?.getTiming().duration),600);
  await page.waitForFunction(() => getComputedStyle(document.querySelector('.bank-card')).opacity === '1');
  result.interactions.push('Shared reveal timing and hidden initial state on donation page');
  assert.deepEqual(await page.locator('[data-sponsor-amount]').evaluateAll(items => items.map(item => Number(item.dataset.sponsorAmount))), [2000,2500,4000,6000,12000,10000,12000,2000,500]);
  const bankDetails = await page.locator('.bank-grid').innerText();
  for (const value of ['4794000100023666','PUNB0479400','293110100044278','UBIN0829315','84048316367','SBIN0RRUKGB']) assert.ok(bankDetails.includes(value), `Missing published bank detail: ${value}`);
  assert.equal(await page.locator('.donation-qr').evaluate(img => img.complete && img.naturalWidth === 768 && img.naturalHeight === 996), true);
  const qrLink = page.getByRole('link',{name:'Save donation QR'});
  assert.equal(await qrLink.getAttribute('href'), `${base}/images/donation/donation-qr.jpeg`);
  assert.ok(await qrLink.getAttribute('download'));
  assert.equal(await page.locator('#donation-form').count(),0);
  result.interactions.push('Published sponsorship prices, all three bank accounts, and original downloadable QR image');

  await checkContact(page, href, output);
  result.interactions.push('Contact validation, inactive placeholder, confirmed success, preserved errors, retries, timeout, and duplicate prevention');

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
  await page.getByRole('navigation',{name:'Main navigation'}).getByRole('link',{name:'About Us'}).click();
  assert.ok(page.url().endsWith('/#about'));
  const nav = page.locator('#main-navigation');
  await page.waitForFunction(() => document.querySelector('[data-nav-path="#about"]')?.getAttribute('aria-current') === 'location');
  assert.equal(await nav.getByRole('link', {name:'Home',exact:true,includeHidden:true}).getAttribute('aria-current'), null);
  assert.deepEqual(await nav.getByRole('link', {includeHidden:true}).allTextContents(), ['Home','About Us','Our Services','Our Team','Events','Stories','Gallery','Contact']);
  assert.equal(await page.locator('#menu-toggle').getAttribute('aria-expanded'),'false');
  await page.goto(href('about/'));
  await page.waitForURL(href('#about'));
  await page.goto(href('stories/'));
  await page.getByRole('button', {name:'Open navigation'}).click();
  await page.getByRole('navigation', {name:'Main navigation'}).getByRole('link', {name:'Our Team'}).click();
  await page.waitForURL(href('#team'));
  await page.waitForFunction(() => document.querySelector('[data-nav-path="#team"]')?.getAttribute('aria-current') === 'location');
  await page.waitForFunction(() => { const top = document.querySelector('#team').getBoundingClientRect().top; return top >= 0 && top <= innerHeight * 0.3; });
  await page.reload();
  await page.waitForFunction(() => document.querySelector('[data-nav-path="#team"]')?.getAttribute('aria-current') === 'location');
  await page.goto(href(''));
  assert.equal(await nav.getByRole('link', {name:'Home',exact:true,includeHidden:true}).getAttribute('aria-current'), 'page');
  await page.emulateMedia({reducedMotion:'reduce'});
  assert.equal(await page.evaluate(() => getComputedStyle(document.documentElement).scrollBehavior),'auto');
  result.interactions.push('Mobile menu, Escape focus return, keyboard skip link, and reduced motion');
  // Scrolling must update the marker without changing the URL or browser history.
  const scrollUrl = page.url();
  for (const width of [375, 1440]) {
    await page.setViewportSize({width, height:900});
    for (const id of ['about', 'services', 'team', 'services', 'about']) {
      await page.locator(`#${id}`).evaluate(el => el.scrollIntoView({behavior:'instant', block:'start'}));
      await page.waitForFunction(id => document.querySelector(`[data-nav-path="#${id}"]`)?.getAttribute('aria-current') === 'location', id);
      assert.equal(await nav.locator('[aria-current]').count(),1);
      assert.equal(page.url(), scrollUrl);
    }
    await page.evaluate(() => window.scrollTo({top:0, behavior:'instant'}));
    await page.waitForFunction(() => document.querySelector('[data-nav-path=""]')?.getAttribute('aria-current') === 'page');
  }
  result.interactions.push('Scroll markers in both directions on mobile and desktop, without URL changes');


  assert.equal((await page.goto(href('not-a-real-page/'))).status(),404);
  assert.match(await page.locator('h1').innerText(),/find your\s+way home/);
  assert.ok((await page.getByRole('link',{name:'Back to the Ashram'}).getAttribute('href')).startsWith(base+'/'));
  const noJs = await browser.newContext({javaScriptEnabled:false,viewport:{width:375,height:812}});
  const staticPage=await noJs.newPage();
  await staticPage.goto(href(''));
  assert.equal(await staticPage.getByRole('navigation',{name:'Main navigation'}).isVisible(),true);
  assert.equal(await staticPage.locator('[data-slide]:visible').count(),1);
  assert.equal(await staticPage.locator('.slider-controls').isVisible(),false);
  assert.equal(await staticPage.locator('.project-card').first().evaluate(el => getComputedStyle(el).opacity),'1');
  await staticPage.goto(href('contact/'));
  assert.equal(await staticPage.getByRole('button',{name:'Send message'}).isDisabled(),true);
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
