const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({
    headless: true,
    args: [
      'no-sandbox',
      'disable-setuid-sandbox',
    ]
  });
  const page = await browser.newPage();
  await page.goto('http://127.0.0.1:3000/');
  await page.screenshot({ path: 'example.png' });

  await browser.close();
})();
