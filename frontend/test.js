const puppeteer = require('puppeteer');
(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto('http://localhost:3000/themes');
  await page.evaluate(() => window.scrollBy(0, 3000));
  await page.waitForTimeout(1000);
  const discoveryBar = await page.evaluate(() => document.querySelector('.sticky').getBoundingClientRect());
  const showingText = await page.evaluate(() => {
    const p = Array.from(document.querySelectorAll('p')).find(el => el.textContent.includes('Showing'));
    return p ? p.getBoundingClientRect() : null;
  });
  console.log('DiscoveryBar:', discoveryBar);
  console.log('ShowingText:', showingText);
  await browser.close();
})();
