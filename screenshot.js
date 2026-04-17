const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800 });
  await page.goto('https://invoice-iq-dashboard.vercel.app', { waitUntil: 'networkidle2' });
  await page.screenshot({ path: 'public/dapp-screenshot.png' });
  await browser.close();
})();
