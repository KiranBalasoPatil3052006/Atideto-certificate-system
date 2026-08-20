import React from 'react';
import { formatDate } from '../../lib/dateUtils';

export interface OfferLetterData {
  offerNo: string;
  offerDate: string;
  salutation: string;
  studentName: string;
  collegeName: string;
  studentEmail: string;
  studentMobile: string;
  domain: string;
  duration: string;
  startDate: string;
  endDate: string;
  mode: string;
}

export interface OfferLetterTemplate {
  title: string;
  to: string;
  dear: string;
  intro: string;
  detailsHeading: string;
  closing: string;
  sincerely: string;
  digitalSig: string;
  founder: string;
  companyName: string;
  footerAddress: string;
  footerEmail: string;
  footerPhone: string;
  footerWebsite: string;
}

export const DEFAULT_OFFER_TEMPLATE: OfferLetterTemplate = {
  title: 'INTERNSHIP OFFER LETTER',
  to: 'To,',
  dear: 'Dear',
  intro:
    'We are pleased to offer you an internship opportunity with ATIDETO Technologies. This internship is designed to provide practical industry exposure, hands-on learning, and real-world project experience while helping you strengthen your technical and professional skills.',
  detailsHeading: 'Internship Details',
  closing:
    'Upon successful completion of the internship and fulfillment of the program requirements, you will be eligible to receive an Internship Completion Certificate issued by ATIDETO Technologies. We are delighted to welcome you to our team and look forward to supporting your learning and professional growth. We wish you a rewarding and successful internship experience.',
  sincerely: 'Sincerely,',
  digitalSig: '(Digital Signature)',
  founder: 'Founder',
  companyName: 'ATIDETO Technologies',
  footerAddress: '📍 Ponnamapet, Salem, Tamil Nadu – 636001',
  footerEmail: '✉ atideto.in@gmail.com',
  footerPhone: '☎ +91 XXXXX XXXXX',
  footerWebsite: '🌐 www.atideto.in',
};

interface OfferLetterCanvasProps {
  data: OfferLetterData;
  template?: OfferLetterTemplate;
  isEditingTemplate?: boolean;
  onTemplateChange?: (newTemplate: OfferLetterTemplate) => void;
  id?: string;
}

export const OfferLetterCanvas: React.FC<OfferLetterCanvasProps> = ({
  data,
  template = DEFAULT_OFFER_TEMPLATE,
  isEditingTemplate = false,
  onTemplateChange,
  id = 'offerLetterCanvas',
}) => {
  const updateField = (field: keyof OfferLetterTemplate, val: string) => {
    if (onTemplateChange) {
      onTemplateChange({ ...template, [field]: val });
    }
  };

  const getEditableClass = (isInline = false) => {
    if (!isEditingTemplate) return '';
    return isInline
      ? 'outline-dashed outline-1 outline-[#2166c4] bg-[#2166c4]/10 rounded px-1 cursor-text'
      : 'outline-dashed outline-1 outline-[#2166c4] bg-[#2166c4]/10 rounded p-1.5 cursor-text';
  };

  return (
    <div
      id={id}
      className={`relative w-full max-w-[680px] mx-auto bg-white rounded shadow-2xl overflow-hidden select-none text-[#333333] ${
        isEditingTemplate ? 'ring-2 ring-[#2166c4]' : ''
      }`}
      style={{
        aspectRatio: '1023 / 1537',
        fontFamily: "'Inter', sans-serif",
      }}
    >
      {/* Background Graphic */}
      <img
        src="/assets/background.png"
        alt="Offer Letter Frame"
        className="absolute inset-0 w-full h-full object-fill pointer-events-none z-0"
      />

      {/* Letter Inner Content Container */}
      <div
        className="relative z-10 w-full h-full flex flex-col justify-between"
        style={{ padding: '6.5% 8.5% 5.5%' }}
      >
        <div>
          {/* 1. Header / Logo (Centered) */}
          <div className="flex justify-center items-center min-h-[48px] mb-2">
            <img
              src="/assets/atideto-logo.png"
              alt="ATIDETO Technologies"
              className="h-[42px] sm:h-[56px] w-auto object-contain"
            />
          </div>

          {/* 2. Document Title: Poppins SemiBold, 28pt, Navy #0A3D91 */}
          <div className="text-center my-3">
            <h1
              contentEditable={isEditingTemplate}
              suppressContentEditableWarning
              onBlur={(e) => updateField('title', e.currentTarget.textContent || '')}
              className={`text-[16px] sm:text-[22px] md:text-[26px] font-semibold uppercase tracking-wide text-[#0A3D91] ${getEditableClass()}`}
              style={{ fontFamily: "'Poppins', sans-serif" }}
            >
              {template.title}
            </h1>
            <div className="w-full h-[1px] bg-[#D9E5F7] mt-3 mb-4" />
          </div>

          {/* 3. Offer No & Date Row: Inter Medium, 10.5pt, #555555 */}
          <div className="flex justify-between items-center text-[9px] sm:text-[11px] font-medium text-[#555555] mb-4">
            <p className="m-0">
              Offer Letter No. : <span className="font-medium text-[#555555]">{data.offerNo || 'ATIDETO/2026/INT/018'}</span>
            </p>
            <p className="m-0">
              Date : <span className="font-medium text-[#555555]">{formatDate(data.offerDate) || '22 June 2026'}</span>
            </p>
          </div>

          {/* 4. Recipient Information Block */}
          <div className="flex flex-col gap-1 text-[9.5px] sm:text-[11.5px] text-[#333333] mb-4">
            <p
              contentEditable={isEditingTemplate}
              suppressContentEditableWarning
              onBlur={(e) => updateField('to', e.currentTarget.textContent || '')}
              className={`font-medium ${getEditableClass(true)}`}
            >
              {template.to}
            </p>
            <p className="font-semibold text-[#333333] m-0">
              <span>{data.salutation || 'Mr./Ms.'}</span>{' '}
              <span className="text-[#1e40af] font-semibold">{data.studentName || 'Student Name'}</span>
            </p>
            <p className="font-normal text-[#333333] m-0">{data.collegeName || 'College / Institution'}</p>
            <p className="font-normal text-[#333333] m-0">{data.studentEmail || 'student@example.com'}</p>
            <p className="font-normal text-[#333333] m-0">{data.studentMobile || '+91 98765 43210'}</p>
          </div>

          {/* 5. Salutation & Intro Paragraph */}
          <p className="text-[9.5px] sm:text-[11.5px] font-medium text-[#333333] mb-3">
            <span
              contentEditable={isEditingTemplate}
              suppressContentEditableWarning
              onBlur={(e) => updateField('dear', e.currentTarget.textContent || '')}
              className={getEditableClass(true)}
            >
              {template.dear}
            </span>{' '}
            <span className="text-[#1e40af] font-semibold">{data.studentName || 'Student'}</span>,
          </p>

          <p
            contentEditable={isEditingTemplate}
            suppressContentEditableWarning
            onBlur={(e) => updateField('intro', e.currentTarget.textContent || '')}
            className={`text-[9px] sm:text-[11px] leading-[1.6] text-[#333333] text-justify mb-4 ${getEditableClass()}`}
          >
            {template.intro}
          </p>

          {/* 6. Internship Details Section Heading & Soft Table */}
          <div className="mb-4">
            <h2
              contentEditable={isEditingTemplate}
              suppressContentEditableWarning
              onBlur={(e) => updateField('detailsHeading', e.currentTarget.textContent || '')}
              className={`text-[10.5px] sm:text-[13px] font-semibold text-[#1e40af] mb-2.5 ${getEditableClass(true)}`}
              style={{ fontFamily: "'Poppins', sans-serif" }}
            >
              {template.detailsHeading}
            </h2>

            <table
              className="w-full border-collapse rounded-lg overflow-hidden text-[9px] sm:text-[10.5px] leading-snug"
              style={{
                background: 'rgba(244, 248, 255, 0.45)',
                border: '1px solid rgba(217, 229, 247, 0.75)',
              }}
            >
              <tbody>
                <tr className="border-b border-[rgba(217,229,247,0.5)]">
                  <td className="py-2 px-3.5 font-medium text-[#1e40af] w-[36%]">Internship Domain</td>
                  <td className="py-2 px-1 text-center text-[#333333] w-[4%]">:</td>
                  <td className="py-2 px-3.5 font-normal text-[#333333] w-[60%]">{data.domain || 'Artificial Intelligence'}</td>
                </tr>
                <tr className="border-b border-[rgba(217,229,247,0.5)]">
                  <td className="py-2 px-3.5 font-medium text-[#1e40af]">Duration</td>
                  <td className="py-2 px-1 text-center text-[#333333]">:</td>
                  <td className="py-2 px-3.5 font-normal text-[#333333]">{data.duration || '2 Months'}</td>
                </tr>
                <tr className="border-b border-[rgba(217,229,247,0.5)]">
                  <td className="py-2 px-3.5 font-medium text-[#1e40af]">Start Date</td>
                  <td className="py-2 px-1 text-center text-[#333333]">:</td>
                  <td className="py-2 px-3.5 font-normal text-[#333333]">{formatDate(data.startDate) || '01 June 2026'}</td>
                </tr>
                <tr className="border-b border-[rgba(217,229,247,0.5)]">
                  <td className="py-2 px-3.5 font-medium text-[#1e40af]">End Date</td>
                  <td className="py-2 px-1 text-center text-[#333333]">:</td>
                  <td className="py-2 px-3.5 font-normal text-[#333333]">{formatDate(data.endDate) || '31 July 2026'}</td>
                </tr>
                <tr>
                  <td className="py-2 px-3.5 font-medium text-[#1e40af]">Mode</td>
                  <td className="py-2 px-1 text-center text-[#333333]">:</td>
                  <td className="py-2 px-3.5 font-normal text-[#333333]">{data.mode || 'Online'}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* 7. Closing Paragraph */}
          <p
            contentEditable={isEditingTemplate}
            suppressContentEditableWarning
            onBlur={(e) => updateField('closing', e.currentTarget.textContent || '')}
            className={`text-[9px] sm:text-[11px] leading-[1.6] text-[#333333] text-justify mb-4 ${getEditableClass()}`}
          >
            {template.closing}
          </p>
        </div>

        {/* 8. Signature Block & Footer Bar */}
        <div>
          {/* Signature Area (Right Positioned, Left Aligned Text) */}
          <div className="flex flex-col items-start self-end justify-self-end ml-auto text-left mt-8 mb-2 w-auto">
            <p
              contentEditable={isEditingTemplate}
              suppressContentEditableWarning
              onBlur={(e) => updateField('sincerely', e.currentTarget.textContent || '')}
              className={`text-[9px] sm:text-[11px] font-medium text-[#333333] m-0 w-full text-left ${getEditableClass(true)}`}
            >
              {template.sincerely}
            </p>
            <div className="h-[36px] sm:h-[48px] w-full" />
            <p
              contentEditable={isEditingTemplate}
              suppressContentEditableWarning
              onBlur={(e) => updateField('digitalSig', e.currentTarget.textContent || '')}
              className={`text-[7.5px] sm:text-[9.5px] italic text-[#6b7a8f] m-0 mb-1 w-full text-center ${getEditableClass(true)}`}
            >
              {template.digitalSig}
            </p>
            <p
              contentEditable={isEditingTemplate}
              suppressContentEditableWarning
              onBlur={(e) => updateField('founder', e.currentTarget.textContent || '')}
              className={`text-[9px] sm:text-[11px] font-semibold text-[#333333] m-0 mb-0.5 w-full text-center ${getEditableClass(true)}`}
            >
              {template.founder}
            </p>
            <p
              contentEditable={isEditingTemplate}
              suppressContentEditableWarning
              onBlur={(e) => updateField('companyName', e.currentTarget.textContent || '')}
              className={`text-[9px] sm:text-[11px] font-medium text-[#333333] m-0 w-full text-left whitespace-nowrap ${getEditableClass(true)}`}
            >
              {template.companyName}
            </p>
          </div>

          {/* 9. Single Line Footer Bar */}
          <div className="flex items-center justify-center gap-1.5 sm:gap-2.5 text-[7px] sm:text-[9.5px] text-[#666666] pt-3 border-t border-[#D9E5F7] text-center whitespace-nowrap">
            <span
              contentEditable={isEditingTemplate}
              suppressContentEditableWarning
              onBlur={(e) => updateField('footerAddress', e.currentTarget.textContent || '')}
              className={getEditableClass(true)}
            >
              {template.footerAddress}
            </span>
            <span className="text-[#D9E5F7]">•</span>
            <span
              contentEditable={isEditingTemplate}
              suppressContentEditableWarning
              onBlur={(e) => updateField('footerEmail', e.currentTarget.textContent || '')}
              className={getEditableClass(true)}
            >
              {template.footerEmail}
            </span>
            <span className="text-[#D9E5F7]">•</span>
            <span
              contentEditable={isEditingTemplate}
              suppressContentEditableWarning
              onBlur={(e) => updateField('footerPhone', e.currentTarget.textContent || '')}
              className={getEditableClass(true)}
            >
              {template.footerPhone}
            </span>
            <span className="text-[#D9E5F7]">•</span>
            <span
              contentEditable={isEditingTemplate}
              suppressContentEditableWarning
              onBlur={(e) => updateField('footerWebsite', e.currentTarget.textContent || '')}
              className={getEditableClass(true)}
            >
              {template.footerWebsite}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
