import React, { useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { CertificateFormData, TypographySettings, CompanyTemplateSettings } from '../../types/certificate';
import { formatCertificateDate } from '../../lib/dateUtils';
import { getCleanFontFamily, loadGoogleFont } from '../../lib/fontLoader';

interface CertificateCanvasProps {
  data: CertificateFormData;
  typography?: Partial<TypographySettings>;
  companyTemplate?: Partial<CompanyTemplateSettings>;
  id?: string;
}

export const CertificateCanvas: React.FC<CertificateCanvasProps> = ({
  data,
  typography,
  companyTemplate,
  id = 'certificateCanvas',
}) => {
  // Element-level typography styling resolution matching preview.html parity
  const nameStyle = typography?.certName || {
    fontFamily: typography?.studentNameFont || 'Cormorant Garamond',
    fontSize: typography?.studentNameSize,
    color: typography?.studentNameColor || '#12539c',
    fontStyle: typography?.studentNameItalic !== false ? 'italic' : 'normal',
    fontWeight: typography?.studentNameWeight || '600',
    letterSpacing: typography?.letterSpacing !== undefined ? typography.letterSpacing : 1,
  };

  const titleStyle = typography?.certTitle || {
    fontFamily: typography?.titleFont || 'Playfair Display',
    color: typography?.titleColor || '#0b2545',
    fontWeight: '800',
    fontSize: undefined,
    fontStyle: 'normal',
    letterSpacing: 0.3,
  };

  const eyebrowStyle = typography?.certEyebrow || {
    fontFamily: 'Inter',
    color: '#5c7595',
    fontWeight: '500',
    fontSize: undefined,
    fontStyle: 'normal',
    letterSpacing: 2.5,
  };

  const domainStyle = typography?.certDomain || {
    fontFamily: 'Inter',
    color: typography?.domainColor || '#12539c',
    fontWeight: '700',
    fontSize: undefined,
    fontStyle: 'normal',
    letterSpacing: 0.4,
  };

  const descStyle = typography?.certDesc || {
    fontFamily: typography?.descriptionFont || 'Inter',
    color: '#333d4a',
    fontWeight: '400',
    fontSize: undefined,
    fontStyle: 'normal',
    letterSpacing: 0,
  };

  const signatoryStyle = typography?.certSignatory || {
    fontFamily: 'Inter',
    color: '#0b2545',
    fontWeight: '600',
    fontSize: undefined,
    fontStyle: 'normal',
    letterSpacing: 0,
  };

  const metaStyle = typography?.certMeta || {
    fontFamily: typography?.metaFont || 'JetBrains Mono',
    color: '#000000',
    fontWeight: '600',
    fontSize: undefined,
    fontStyle: 'normal',
    letterSpacing: 0.2,
  };

  // Ensure any custom fonts are dynamically loaded in document head
  useEffect(() => {
    if (nameStyle.fontFamily) loadGoogleFont(nameStyle.fontFamily);
    if (titleStyle.fontFamily) loadGoogleFont(titleStyle.fontFamily);
    if (eyebrowStyle.fontFamily) loadGoogleFont(eyebrowStyle.fontFamily);
    if (domainStyle.fontFamily) loadGoogleFont(domainStyle.fontFamily);
    if (descStyle.fontFamily) loadGoogleFont(descStyle.fontFamily);
    if (signatoryStyle.fontFamily) loadGoogleFont(signatoryStyle.fontFamily);
    if (metaStyle.fontFamily) loadGoogleFont(metaStyle.fontFamily);
  }, [
    nameStyle.fontFamily,
    titleStyle.fontFamily,
    eyebrowStyle.fontFamily,
    domainStyle.fontFamily,
    descStyle.fontFamily,
    signatoryStyle.fontFamily,
    metaStyle.fontFamily,
  ]);

  const eyebrow = companyTemplate?.eyebrow || 'THIS CERTIFIES THAT';
  const mainTitle = companyTemplate?.mainTitle || 'Internship Completion Certificate';
  const domainPrefix = companyTemplate?.domainPrefix || 'Internship Domain';
  const p1Text =
    companyTemplate?.descriptionParagraph1 ||
    'This Certificate of Completion is proudly awarded in recognition of the successful completion of the internship program at ATIDETO. Throughout the internship, the intern demonstrated professionalism, dedication, and a strong commitment to learning while contributing to assigned responsibilities and project objectives.';
  const p2Prefix = companyTemplate?.descriptionParagraph2Prefix || 'The internship was successfully completed from';
  const p2Mid = companyTemplate?.descriptionParagraph2Mid || 'by a student of';
  const p2Suffix =
    companyTemplate?.descriptionParagraph2Suffix ||
    '. We appreciate the intern\'s contribution and wish them continued success in their future academic and professional endeavors.';
  const durationLabel = companyTemplate?.durationLabel || 'Duration';
  const issueDateLabel = companyTemplate?.issueDateLabel || 'Issue Date';
  const verifyIdLabel = companyTemplate?.verifyIdLabel || 'Verify ID';
  const qrCaption = companyTemplate?.qrCaption || 'Scan to verify';

  const udyamId = companyTemplate?.udyamId || 'UDYAM-TN-20-0242534';
  const founderDesignation = companyTemplate?.founderDesignation || 'Founder, ATIDETO Technologies';
  const email = companyTemplate?.email || 'hello@atideto.com';
  const phone = companyTemplate?.phone || '+91 98765 43210';
  const website = companyTemplate?.website || 'www.atideto.com';

  const defaultQrUrl =
    data.qrLink ||
    `https://atideto-certificate-system.vercel.app/studentverify.html?id=${encodeURIComponent(data.verifyId || '')}`;

  return (
    <div className="certificate-wrapper">
      <div className="certificate" id={id}>
        {/* Background Frame Image */}
        <img
          src="/assets/background1.png"
          alt="Certificate Background"
          className="cert-bg"
        />

        {/* Inner Certificate Content Area */}
        <div className="cert-inner">
          {/* 1. Header Row (Logos & MSME) */}
          <div className="cert-top">
            <div className="cert-top-left">
              <img
                src="/assets/atideto-logo.png"
                alt="ATIDETO Technologies"
                className="cert-atideto-logo"
              />
            </div>
            <div className="cert-top-right">
              <img
                src="/assets/msme-logo.png"
                alt="MSME Registered"
                className="cert-msme-logo"
              />
              <span className="udyam-id" id="out-udyamId">
                {udyamId}
              </span>
            </div>
          </div>

          {/* 2. Certificate Eyebrow & Title */}
          <div className="cert-title-block">
            <p
              className="cert-eyebrow"
              id="out-eyebrow"
              style={{
                fontFamily: getCleanFontFamily(eyebrowStyle.fontFamily, 'sans-serif'),
                color: eyebrowStyle.color,
                fontWeight: eyebrowStyle.fontWeight,
                fontStyle: eyebrowStyle.fontStyle,
                fontSize: eyebrowStyle.fontSize ? `${eyebrowStyle.fontSize}px` : undefined,
                letterSpacing:
                  eyebrowStyle.letterSpacing !== undefined ? `${eyebrowStyle.letterSpacing}px` : undefined,
              }}
            >
              {eyebrow}
            </p>
            <h2
              className="cert-title"
              id="out-title"
              style={{
                fontFamily: getCleanFontFamily(titleStyle.fontFamily, 'serif'),
                color: titleStyle.color,
                fontWeight: titleStyle.fontWeight,
                fontStyle: titleStyle.fontStyle,
                fontSize: titleStyle.fontSize ? `${titleStyle.fontSize}px` : undefined,
                letterSpacing:
                  titleStyle.letterSpacing !== undefined ? `${titleStyle.letterSpacing}px` : undefined,
              }}
            >
              {mainTitle}
            </h2>
          </div>

          {/* 3. Student Name with Underline */}
          <div className="cert-name-block">
            <h3
              className="cert-name"
              id="out-studentName"
              style={{
                fontFamily: getCleanFontFamily(nameStyle.fontFamily, 'serif'),
                color: nameStyle.color,
                fontSize: nameStyle.fontSize ? `${nameStyle.fontSize}px` : undefined,
                fontStyle: nameStyle.fontStyle || 'italic',
                fontWeight: nameStyle.fontWeight || '600',
                letterSpacing: nameStyle.letterSpacing !== undefined ? `${nameStyle.letterSpacing}px` : undefined,
              }}
            >
              {data.studentName || 'Student Name'}
            </h3>
            <div className="cert-underline" />
          </div>

          {/* 4. Domain Pill Badge */}
          <div className="cert-domain-wrapper">
            <p
              className="cert-domain"
              style={{
                fontFamily: getCleanFontFamily(domainStyle.fontFamily, 'sans-serif'),
                fontSize: domainStyle.fontSize ? `${domainStyle.fontSize}px` : undefined,
                fontStyle: domainStyle.fontStyle,
                letterSpacing: domainStyle.letterSpacing !== undefined ? `${domainStyle.letterSpacing}px` : undefined,
              }}
            >
              {domainPrefix}&nbsp;:&nbsp;
              <span
                id="out-domain"
                style={{
                  color: domainStyle.color || '#12539c',
                  fontWeight: domainStyle.fontWeight || '700',
                  fontFamily: getCleanFontFamily(domainStyle.fontFamily, 'sans-serif'),
                }}
              >
                {data.course || 'Domain / Course'}
              </span>
            </p>
          </div>

          {/* 5. Description Paragraphs */}
          <div
            className="cert-description"
            style={{
              fontFamily: getCleanFontFamily(descStyle.fontFamily, 'sans-serif'),
              color: descStyle.color,
              fontWeight: descStyle.fontWeight,
              fontStyle: descStyle.fontStyle,
              fontSize: descStyle.fontSize ? `${descStyle.fontSize}px` : undefined,
              letterSpacing: descStyle.letterSpacing !== undefined ? `${descStyle.letterSpacing}px` : undefined,
            }}
          >
            <p id="out-descParagraph">
              {p1Text.includes('ATIDETO') ? (
                <>
                  {p1Text.split('ATIDETO')[0]}
                  <strong>ATIDETO</strong>
                  {p1Text.split('ATIDETO').slice(1).join('ATIDETO')}
                </>
              ) : (
                p1Text
              )}
            </p>
            <p>
              {p2Prefix}{' '}
              <span id="out-startDate">{formatCertificateDate(data.startDate)}</span> to{' '}
              <span id="out-endDate">{formatCertificateDate(data.endDate)}</span> {p2Mid}{' '}
              <strong id="out-collegeName">{data.college || '—'}</strong>
              {data.registerNo ? (
                <>
                  {' '}(Register No.: <strong id="out-registerNo">{data.registerNo}</strong>)
                </>
              ) : null}
              {p2Suffix}
            </p>
          </div>

          {/* 6. Bottom Information Row: Meta (Left), QR Code (Center), Signature (Right) */}
          <div className="cert-bottom">
            {/* Left Meta Table */}
            <div className="cert-meta">
              <p style={{ fontStyle: metaStyle.fontStyle, fontSize: metaStyle.fontSize ? `${metaStyle.fontSize}px` : undefined }}>
                <span>{durationLabel}</span>
                <b
                  id="out-duration"
                  style={{
                    fontFamily: getCleanFontFamily(metaStyle.fontFamily, 'monospace'),
                    color: metaStyle.color,
                    fontWeight: metaStyle.fontWeight,
                    letterSpacing: metaStyle.letterSpacing !== undefined ? `${metaStyle.letterSpacing}px` : undefined,
                  }}
                >
                  {data.duration || '—'}
                </b>
              </p>
              <p style={{ fontStyle: metaStyle.fontStyle, fontSize: metaStyle.fontSize ? `${metaStyle.fontSize}px` : undefined }}>
                <span>{issueDateLabel}</span>
                <b
                  id="out-issueDate"
                  style={{
                    fontFamily: getCleanFontFamily(metaStyle.fontFamily, 'monospace'),
                    color: metaStyle.color,
                    fontWeight: metaStyle.fontWeight,
                    letterSpacing: metaStyle.letterSpacing !== undefined ? `${metaStyle.letterSpacing}px` : undefined,
                  }}
                >
                  {formatCertificateDate(data.issueDate)}
                </b>
              </p>
              <p style={{ fontStyle: metaStyle.fontStyle, fontSize: metaStyle.fontSize ? `${metaStyle.fontSize}px` : undefined }}>
                <span>{verifyIdLabel}</span>
                <b
                  id="out-verifyId"
                  style={{
                    fontFamily: getCleanFontFamily(metaStyle.fontFamily, 'monospace'),
                    color: metaStyle.color,
                    fontWeight: metaStyle.fontWeight,
                    letterSpacing: metaStyle.letterSpacing !== undefined ? `${metaStyle.letterSpacing}px` : undefined,
                  }}
                >
                  {data.verifyId || '—'}
                </b>
              </p>
            </div>

            {/* Center QR Code */}
            <div className="cert-qr">
              <div className="qr-box">
                <QRCodeSVG
                  value={defaultQrUrl}
                  size={72}
                  level="M"
                  includeMargin={false}
                />
              </div>
              <span>{qrCaption}</span>
            </div>

            {/* Right Signature Block */}
            <div className="cert-signature">
              <div className="sig-line" />
              <p
                id="out-founderName"
                style={{
                  fontFamily: getCleanFontFamily(signatoryStyle.fontFamily, 'sans-serif'),
                  color: signatoryStyle.color,
                  fontWeight: signatoryStyle.fontWeight,
                  fontStyle: signatoryStyle.fontStyle,
                  fontSize: signatoryStyle.fontSize ? `${signatoryStyle.fontSize}px` : undefined,
                  letterSpacing: signatoryStyle.letterSpacing !== undefined ? `${signatoryStyle.letterSpacing}px` : undefined,
                }}
              >
                {founderDesignation}
              </p>
            </div>
          </div>

          {/* 7. Footer Contact Bar */}
          <div className="cert-footer">
            <span>
              <i>✉</i> <span id="out-mail">{email}</span>
            </span>
            <span>
              <i>☎</i> <span id="out-contact">{phone}</span>
            </span>
            <span>
              <i>🌐</i> <span id="out-website">{website}</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
