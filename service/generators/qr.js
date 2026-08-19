import QRCode from 'qrcode';

export async function generateQRBuffer(data) {
  return QRCode.toBuffer(data, {
    type: 'png',
    width: 200,
    margin: 2,
    color: { dark: '#000000', light: '#ffffff' },
  });
}

export async function generateQRDataUrl(data) {
  return QRCode.toDataURL(data, {
    width: 200,
    margin: 2,
    color: { dark: '#000000', light: '#ffffff' },
  });
}
