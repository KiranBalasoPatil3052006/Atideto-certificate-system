import puppeteer from 'puppeteer';
import { buildCertificateHtml } from './template-html.js';
import { buildOfferLetterHtml } from './offer-letter-template.js';

export async function generateCertificatePdfBuffer(data) {
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

    const pdfBuffer = await page.pdf({
      format: 'A4',
      landscape: true,
      printBackground: true,
      margin: { top: '0px', right: '0px', bottom: '0px', left: '0px' },
      width: '1344px',
      height: '896px',
    });

    return Buffer.from(pdfBuffer);
  } finally {
    await browser.close();
  }
}

export async function generateOfferLetterPdfBuffer(data) {
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

    const pdfBuffer = await page.pdf({
      format: 'A4',
      landscape: false,
      printBackground: true,
      margin: { top: '0px', right: '0px', bottom: '0px', left: '0px' },
      width: '850px',
      height: '1275px',
    });

    return Buffer.from(pdfBuffer);
  } finally {
    await browser.close();
  }
}
