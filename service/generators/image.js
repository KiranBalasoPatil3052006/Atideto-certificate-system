import puppeteer from 'puppeteer';
import { buildCertificateHtml } from './template-html.js';
import { buildOfferLetterHtml } from './offer-letter-template.js';

export async function generateCertificateImage(data) {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  try {
    const page = await browser.newPage();
    const html = buildCertificateHtml(data);

    await page.setContent(html, {
      waitUntil: 'load',
      timeout: 60000,
    });

    await page.setViewport({ width: 1344, height: 896, deviceScaleFactor: 2 });

    const element = await page.$('body');
    if (!element) throw new Error('Certificate body element not found');

    const screenshotBuffer = await element.screenshot({
      type: 'png',
      omitBackground: true,
    });

    return Buffer.from(screenshotBuffer);
  } finally {
    await browser.close();
  }
}

export async function generateOfferLetterImage(data) {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  try {
    const page = await browser.newPage();
    const html = buildOfferLetterHtml(data);

    await page.setContent(html, {
      waitUntil: 'load',
      timeout: 60000,
    });

    await page.setViewport({ width: 850, height: 1275, deviceScaleFactor: 2 });

    const element = await page.$('body');
    if (!element) throw new Error('Offer letter body element not found');

    const screenshotBuffer = await element.screenshot({
      type: 'png',
      omitBackground: true,
    });

    return Buffer.from(screenshotBuffer);
  } finally {
    await browser.close();
  }
}
