import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { CertificateFormData, TypographySettings, CompanyTemplateSettings } from '../../types/certificate';
import { formatDate } from '../../lib/dateUtils';

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
    fontSize: typography?.studentNameSize || 44,
    color: typography?.studentNameColor || '#12539c',
    fontStyle: typography?.studentNameItalic !== false ? 'italic' : 'normal',
    fontWeight: typography?.studentNameWeight || '600',
    letterSpacing: typography?.letterSpacing || 1,
  };

  const titleStyle = typography?.certTitle || {
    fontFamily: typography?.titleFont || 'Playfair Display',
    color: typography?.titleColor || '#0b2545',
    fontWeight: '800',
    fontSize: 32,
    letterSpacing: 0.3,
  };

  const eyebrowStyle = typography?.certEyebrow || {
    fontFamily: 'Inter',
    color: '#5c7595',
    fontWeight: '700',
    letterSpacing: 3,
  };

  const domainStyle = typography?.certDomain || {
    fontFamily: 'Inter',
    color: typography?.domainColor || '#1f6fd6',
    fontWeight: '700',
  };

  const descStyle = typography?.certDesc || {
    fontFamily: typography?.descriptionFont || 'Inter',
    color: '#333d4a',
  };

  const signatoryStyle = typography?.certSignatory || {
    fontFamily: 'Inter',
    color: '#0b2545',
    fontWeight: '600',
  };

  const metaStyle = typography?.certMeta || {
    fontFamily: typography?.metaFont || 'JetBrains Mono',
    color: '#000000',
    fontWeight: '600',
  };

  const eyebrow = companyTemplate?.eyebrow || 'This certifies that';
  const mainTitle = companyTemplate?.mainTitle || 'Internship Completion Certificate';
  const udyamId = companyTemplate?.udyamId || 'UDYAM-TN-20-0242534';
  const founderDesignation = companyTemplate?.founderDesignation || 'Founder, ATIDETO Technologies';
  const email = companyTemplate?.email || 'hello@atideto.com';
  const phone = companyTemplate?.phone || '+91 98765 43210';
  const website = companyTemplate?.website || 'www.atideto.com';

  const defaultQrUrl = data.qrLink || `https://atideto-certificate-system.vercel.app/studentverify.html?id=${encodeURIComponent(data.verifyId || '')}`;

  return (
    <div
      id={id}
      className="relative w-full max-w-[1040px] mx-auto bg-white rounded-lg shadow-2xl overflow-hidden select-none"
      style={{
        aspectRatio: '1344 / 896',
      }}
    >
      {/* Background Frame Image */}
      <img
        src="/assets/background1.png"
        alt="Certificate Background"
        className="absolute inset-0 w-full h-full object-fill pointer-events-none z-0"
      />

      {/* Inner Certificate Content Area */}
      <div
        className="relative z-10 w-full h-full flex flex-col justify-between"
        style={{ padding: '3.6% 4.6% 2.6%' }}
      >
        {/* 1. Header Row (Logos & MSME) */}
        <div className="flex items-start justify-between">
          <div className="flex items-center">
            <img
              src="/assets/atideto-logo.png"
              alt="ATIDETO Technologies"
              className="h-[36px] sm:h-[48px] md:h-[54px] object-contain"
            />
          </div>
          <div className="flex flex-col items-end">
            <img
              src="/assets/msme-logo.png"
              alt="MSME Registered"
              className="h-[30px] sm:h-[42px] md:h-[48px] object-contain"
            />
            <span
              className="font-mono text-[9px] sm:text-[10.5px] font-extrabold text-[#0b2545] tracking-wider mt-0.5"
            >
              {udyamId}
            </span>
          </div>
        </div>

        {/* 2. Certificate Eyebrow & Title */}
        <div className="text-center -mt-2 sm:mt-0">
          <p
            className="text-[9.5px] sm:text-[11.5px] md:text-[12px] uppercase mb-0.5"
            style={{
              fontFamily: eyebrowStyle.fontFamily,
              color: eyebrowStyle.color,
              fontWeight: eyebrowStyle.fontWeight,
              letterSpacing: `${eyebrowStyle.letterSpacing || 3}px`,
            }}
          >
            {eyebrow}
          </p>
          <h2
            className="text-[18px] sm:text-[26px] md:text-[32px] tracking-tight"
            style={{
              fontFamily: titleStyle.fontFamily,
              color: titleStyle.color,
              fontWeight: titleStyle.fontWeight,
              letterSpacing: `${titleStyle.letterSpacing || 0.3}px`,
            }}
          >
            {mainTitle}
          </h2>
        </div>

        {/* 3. Student Name with Underline */}
        <div className="text-center my-0.5">
          <h3
            className="leading-none px-4"
            style={{
              fontFamily: nameStyle.fontFamily,
              color: nameStyle.color,
              fontSize: nameStyle.fontSize ? `clamp(22px, 3.5vw, ${nameStyle.fontSize}px)` : 'clamp(22px, 3.5vw, 44px)',
              fontStyle: nameStyle.fontStyle || 'italic',
              fontWeight: nameStyle.fontWeight || '600',
              letterSpacing: `${nameStyle.letterSpacing || 1}px`,
            }}
          >
            {data.studentName || 'Student Name'}
          </h3>
          <div
            className="mx-auto mt-1.5 h-[1.5px] w-[50%] max-w-[240px]"
            style={{
              background: 'linear-gradient(90deg, rgba(168, 121, 31, 0) 0%, rgba(168, 121, 31, 0.5) 20%, rgba(168, 121, 31, 0.7) 50%, rgba(168, 121, 31, 0.5) 80%, rgba(168, 121, 31, 0) 100%)',
              opacity: 0.7,
            }}
          />
        </div>

        {/* 4. Domain Pill Badge (Exact match to screenshot & preview.html) */}
        <div className="text-center my-1">
          <div
            className="inline-flex items-center justify-center px-4 sm:px-6 py-1 sm:py-1.5 rounded-full border border-[#12539c]/20 shadow-sm"
            style={{
              background: 'linear-gradient(135deg, rgba(11, 37, 69, 0.04) 0%, rgba(31, 111, 214, 0.08) 50%, rgba(168, 121, 31, 0.07) 100%)',
              borderLeft: '2.5px solid rgba(168, 121, 31, 0.6)',
              borderRight: '2.5px solid rgba(168, 121, 31, 0.6)',
              fontFamily: domainStyle.fontFamily || "'Inter', sans-serif",
            }}
          >
            <span className="text-[10px] sm:text-[12px] md:text-[13.5px] font-semibold text-[#0b2545]">
              Internship Domain&nbsp;:&nbsp;
              <span className="font-bold" style={{ color: domainStyle.color || '#1f6fd6', fontWeight: domainStyle.fontWeight || '700' }}>
                {data.course || 'Domain / Course'}
              </span>
            </span>
          </div>
        </div>

        {/* 5. Description Paragraphs (Exact match to screenshot) */}
        <div
          className="text-center space-y-1.5 sm:space-y-2 text-[9px] sm:text-[11px] md:text-[12px] leading-relaxed px-2 sm:px-6 max-w-[94%] mx-auto"
          style={{ fontFamily: descStyle.fontFamily || "'Inter', sans-serif", color: descStyle.color || '#333d4a' }}
        >
          <p className="m-0">
            This Certificate of Completion is proudly awarded in recognition of the successful completion of the
            internship program at <strong className="font-bold text-[#0b2545]">ATIDETO</strong>. Throughout the
            internship, the intern demonstrated professionalism, dedication, and a strong commitment to learning while
            contributing to assigned responsibilities and project objectives.
          </p>
          <p className="m-0">
            The internship was successfully completed from{' '}
            <span className="font-bold text-[#1f6fd6]">{formatDate(data.startDate)}</span> to{' '}
            <span className="font-bold text-[#1f6fd6]">{formatDate(data.endDate)}</span> by a student of{' '}
            <strong className="font-bold text-[#0b2545]">{data.college || '—'}</strong>
            {data.registerNo ? (
              <>
                {' '}(Register No.: <strong className="font-bold text-[#0b2545]">{data.registerNo}</strong>)
              </>
            ) : null}
            . We appreciate the intern's contribution and wish them continued success in their future academic and
            professional endeavors.
          </p>
        </div>

        {/* 6. Bottom Row: Meta (Left), QR Code (Center), Signature (Right) */}
        <div className="grid grid-cols-3 items-end pt-2 px-2 sm:px-4">
          {/* Left Meta Table */}
          <div className="space-y-0.5 text-[8.5px] sm:text-[10px] md:text-[11px]">
            <div className="grid grid-cols-[60px_1fr] sm:grid-cols-[70px_1fr] items-baseline">
              <span className="font-semibold text-[#0b2545]">Duration</span>
              <b className="font-mono font-bold" style={{ fontFamily: metaStyle.fontFamily, color: metaStyle.color }}>{data.duration || '—'}</b>
            </div>
            <div className="grid grid-cols-[60px_1fr] sm:grid-cols-[70px_1fr] items-baseline">
              <span className="font-semibold text-[#0b2545]">Issue Date</span>
              <b className="font-mono font-bold" style={{ fontFamily: metaStyle.fontFamily, color: metaStyle.color }}>{formatDate(data.issueDate)}</b>
            </div>
            <div className="grid grid-cols-[60px_1fr] sm:grid-cols-[70px_1fr] items-baseline">
              <span className="font-semibold text-[#0b2545]">Verify ID</span>
              <b className="font-mono font-bold" style={{ fontFamily: metaStyle.fontFamily, color: metaStyle.color }}>{data.verifyId || '—'}</b>
            </div>
          </div>

          {/* Center QR Code */}
          <div className="flex flex-col items-center justify-center text-center">
            <div className="p-1 bg-white border border-[#dfe4ea] rounded shadow-sm">
              <QRCodeSVG
                value={defaultQrUrl}
                size={58}
                level="M"
                includeMargin={false}
              />
            </div>
            <span className="text-[7.5px] sm:text-[9px] font-medium text-[#5c7595] mt-0.5">
              Scan to verify
            </span>
          </div>

          {/* Right Signature Block */}
          <div className="flex flex-col items-center justify-end text-center justify-self-end">
            <div className="w-[100px] sm:w-[130px] border-b border-[#0b2545] mb-1" />
            <p className="text-[8px] sm:text-[10px] md:text-[11px]" style={{ fontFamily: signatoryStyle.fontFamily || "'Inter', sans-serif", color: signatoryStyle.color || '#0b2545', fontWeight: signatoryStyle.fontWeight || '600' }}>
              {founderDesignation}
            </p>
          </div>
        </div>

        {/* 7. Footer Contact Bar */}
        <div className="flex items-center justify-center gap-4 sm:gap-8 text-[8px] sm:text-[9.5px] md:text-[10.5px] text-[#5c7595] pt-1.5 border-t border-[#dfe4ea] px-2 sm:px-4">
          <span className="flex items-center gap-1">
            <span className="text-[#1f6fd6]">✉</span> {email}
          </span>
          <span className="flex items-center gap-1">
            <span className="text-[#1f6fd6]">☎</span> {phone}
          </span>
          <span className="flex items-center gap-1">
            <span className="text-[#1f6fd6]">🌐</span> {website}
          </span>
        </div>
      </div>
    </div>
  );
};
