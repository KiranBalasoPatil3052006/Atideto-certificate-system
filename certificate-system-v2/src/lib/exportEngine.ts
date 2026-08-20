import { toPng, toBlob } from 'html-to-image';
import jsPDF from 'jspdf';
import JSZip from 'jszip';

export async function exportElementAsPng(element: HTMLElement, fileName: string): Promise<void> {
  const dataUrl = await toPng(element, {
    pixelRatio: 3,
    backgroundColor: '#ffffff',
    cacheBust: true,
  });

  const link = document.createElement('a');
  link.download = fileName.endsWith('.png') ? fileName : `${fileName}.png`;
  link.href = dataUrl;
  link.click();
}

export async function exportElementAsPdf(element: HTMLElement, fileName: string): Promise<void> {
  const dataUrl = await toPng(element, {
    pixelRatio: 3,
    backgroundColor: '#ffffff',
    cacheBust: true,
  });

  const pdf = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();

  pdf.addImage(dataUrl, 'PNG', 0, 0, pageWidth, pageHeight);
  pdf.save(fileName.endsWith('.pdf') ? fileName : `${fileName}.pdf`);
}

export async function exportOfferLetterAsPdf(element: HTMLElement, fileName: string): Promise<void> {
  const dataUrl = await toPng(element, {
    pixelRatio: 3,
    backgroundColor: '#ffffff',
    cacheBust: true,
  });

  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();

  pdf.addImage(dataUrl, 'PNG', 0, 0, pageWidth, pageHeight);
  pdf.save(fileName.endsWith('.pdf') ? fileName : `${fileName}.pdf`);
}

export async function createZipBundle(
  items: Array<{ name: string; element: HTMLElement }>,
  zipName: string
): Promise<void> {
  const zip = new JSZip();

  for (const item of items) {
    const blob = await toBlob(item.element, {
      pixelRatio: 3,
      backgroundColor: '#ffffff',
    });
    if (blob) {
      zip.file(`${item.name}.png`, blob);
    }
  }

  const zipBlob = await zip.generateAsync({ type: 'blob' });
  const url = URL.createObjectURL(zipBlob);
  const link = document.createElement('a');
  link.href = url;
  link.download = zipName.endsWith('.zip') ? zipName : `${zipName}.zip`;
  link.click();
  URL.revokeObjectURL(url);
}
