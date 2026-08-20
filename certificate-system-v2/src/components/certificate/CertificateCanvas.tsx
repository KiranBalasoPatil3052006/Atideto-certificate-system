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
  const nameFont = typography?.studentNameFont || "'Cormorant Garamond', Georgia, serif";
  const nameColor = typography?.studentNameColor || '#0b1d3a';
  const nameSize = typography?.studentNameSize || 42;
  const nameItalic = typography?.studentNameItalic !== false;
  const nameWeight = typography?.studentNameWeight || '600';
  const titleFont = typography?.titleFont || "'Playfair Display', Georgia, serif";
  const titleColor = typography?.titleColor || '#0a192f';
  const domainColor = typography?.domainColor || '#2F2FE4';
  const letterSpacing = typography?.letterSpacing || 0;

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
        <div className="flex items-center justify-between">
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
              className="h-[32px] sm:h-[44px] md:h-[50px] object-contain"
            />
            <span
              className="font-mono text-[9px] sm:text-[11px] font-bold text-slate-700 tracking-wider mt-0.5"
            >
              {udyamId}
            </span>
          </div>
        </div>

        {/* 2. Certificate Eyebrow & Title */}
        <div className="text-center -mt-1 sm:mt-0">
          <p
            className="text-[10px] sm:text-[12px] md:text-[13px] font-bold uppercase tracking-[2.5px] text-slate-600 mb-0.5"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            {eyebrow}
          </p>
          <h2
            className="text-[18px] sm:text-[26px] md:text-[32px] font-extrabold tracking-tight"
            style={{
              fontFamily: titleFont,
              color: titleColor,
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
              fontFamily: nameFont,
              color: nameColor,
              fontSize: `clamp(22px, 3.4vw, ${nameSize}px)`,
              fontStyle: nameItalic ? 'italic' : 'normal',
              fontWeight: nameWeight,
              letterSpacing: `${letterSpacing}px`,
            }}
          >
            {data.studentName || 'Student Name'}
          </h3>
          <div
            className="mx-auto mt-1.5 h-[2px] w-[50%] max-w-[320px] rounded-full"
            style={{
              background: 'linear-gradient(90deg, transparent, #c5a059, #2F2FE4, #c5a059, transparent)',
            }}
          />
        </div>

        {/* 4. Domain Highlight */}
        <div className="text-center">
          <p
            className="text-[11px] sm:text-[13px] md:text-[14px] font-semibold text-slate-700"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            Internship Domain&nbsp;:&nbsp;
            <span
              className="font-bold underline decoration-2 underline-offset-2"
              style={{ color: domainColor }}
            >
              {data.course || 'Domain / Course'}
            </span>
          </p>
        </div>

        {/* 5. Description Paragraphs */}
        <div
          className="text-justify space-y-1 sm:space-y-1.5 text-[9.5px] sm:text-[11.5px] md:text-[12.5px] leading-relaxed text-[#333d4a] px-2 sm:px-4"
          style={{ fontFamily: "'Inter', sans-serif" }}
        >
          <p>
            This Certificate of Completion is proudly awarded in recognition of the successful completion of the
            internship program at <strong>ATIDETO</strong>. Throughout the internship, the intern demonstrated
            professionalism, dedication, and a strong commitment to learning while contributing to assigned
            responsibilities and project objectives.
          </p>
          <p>
            The internship was successfully completed from{' '}
            <span className="font-semibold text-slate-900">{formatDate(data.startDate)}</span> to{' '}
            <span className="font-semibold text-slate-900">{formatDate(data.endDate)}</span> by a student of{' '}
            <strong>{data.college || '—'}</strong>
            {data.registerNo ? (
              <>
                {' '}(Register No.: <strong>{data.registerNo}</strong>)
              </>
            ) : null}
            . We appreciate the intern's contribution and wish them continued success in their future academic and
            professional endeavors.
          </p>
        </div>

        {/* 6. Bottom Row: Meta (Left), QR Code (Center), Signature (Right) */}
        <div className="grid grid-cols-3 items-end pt-1 sm:pt-2 px-2 sm:px-4 border-t border-amber-900/10">
          {/* Meta Info */}
          <div className="space-y-0.5 text-[9px] sm:text-[11px] md:text-[12px] text-slate-700">
            <p>
              <span className="text-slate-500 mr-2 font-medium">Duration:</span>
              <strong className="text-slate-900">{data.duration || '—'}</strong>
            </p>
            <p>
              <span className="text-slate-500 mr-2 font-medium">Issue Date:</span>
              <strong className="text-slate-900">{formatDate(data.issueDate)}</strong>
            </p>
            <p>
              <span className="text-slate-500 mr-2 font-medium">Verify ID:</span>
              <strong className="font-mono text-slate-900 text-[8.5px] sm:text-[10.5px]">{data.verifyId || '—'}</strong>
            </p>
          </div>

          {/* QR Code */}
          <div className="flex flex-col items-center justify-center text-center">
            <div className="p-1 bg-white border border-slate-300 rounded shadow-sm">
              <QRCodeSVG
                value={defaultQrUrl}
                size={62}
                level="M"
                includeMargin={false}
              />
            </div>
            <span className="text-[7.5px] sm:text-[9.5px] font-semibold text-slate-600 mt-0.5 tracking-tight">
              Scan to verify
            </span>
          </div>

          {/* Signature Block */}
          <div className="flex flex-col items-end text-right">
            <div className="w-[110px] sm:w-[150px] border-b border-slate-800 mb-1" />
            <p className="text-[8.5px] sm:text-[10.5px] md:text-[11.5px] font-bold text-slate-900">
              {founderDesignation}
            </p>
          </div>
        </div>

        {/* 7. Footer Contact Bar */}
        <div className="flex items-center justify-between text-[8px] sm:text-[10px] md:text-[10.5px] text-slate-600 pt-1 border-t border-slate-200/80 px-2 sm:px-4">
          <span>✉ {email}</span>
          <span>☎ {phone}</span>
          <span>🌐 {website}</span>
        </div>
      </div>
    </div>
  );
};
