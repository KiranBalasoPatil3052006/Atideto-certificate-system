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
  footerPhone: '☎ +91 90872 84053',
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

  return (
    <div
      id={id}
      className={`relative w-full max-w-[680px] mx-auto bg-white rounded-lg shadow-2xl overflow-hidden select-none text-slate-800 font-sans ${
        isEditingTemplate ? 'ring-2 ring-[#2F2FE4]' : ''
      }`}
      style={{
        aspectRatio: '1023 / 1537',
      }}
    >
      {/* Background Graphic */}
      <img
        src="/assets/background.png"
        alt="Offer Letter Frame"
        className="absolute inset-0 w-full h-full object-fill pointer-events-none z-0"
      />

      {/* Letter Inner Content */}
      <div
        className="relative z-10 w-full h-full flex flex-col justify-between"
        style={{ padding: '8% 9% 6%' }}
      >
        <div>
          {/* 1. Header / Logo */}
          <div className="flex justify-start mb-3">
            <img
              src="/assets/atideto-logo.png"
              alt="ATIDETO Technologies"
              className="h-[36px] sm:h-[48px] object-contain"
            />
          </div>

          {/* 2. Document Title */}
          <div className="text-center mb-3">
            <h1
              contentEditable={isEditingTemplate}
              suppressContentEditableWarning
              onBlur={(e) => updateField('title', e.currentTarget.textContent || '')}
              className={`text-[16px] sm:text-[20px] font-extrabold tracking-wide uppercase text-slate-900 ${
                isEditingTemplate ? 'outline-dashed outline-1 outline-[#2F2FE4] bg-blue-50/50 p-1' : ''
              }`}
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              {template.title}
            </h1>
            <div className="w-[120px] h-[2px] bg-[#2F2FE4] mx-auto mt-1.5 rounded-full" />
          </div>

          {/* 3. Offer No & Date Row */}
          <div className="flex justify-between items-center text-[10px] sm:text-[12px] font-medium text-slate-700 mb-4 pb-2 border-b border-slate-200">
            <p>
              Offer Letter No. : <strong className="font-mono text-slate-900">{data.offerNo || 'ATIDETO/2026/INT/001'}</strong>
            </p>
            <p>
              Date : <strong className="text-slate-900">{formatDate(data.offerDate)}</strong>
            </p>
          </div>

          {/* 4. Recipient Information Block */}
          <div className="space-y-0.5 text-[10.5px] sm:text-[12.5px] text-slate-800 mb-3 leading-snug">
            <p
              contentEditable={isEditingTemplate}
              suppressContentEditableWarning
              onBlur={(e) => updateField('to', e.currentTarget.textContent || '')}
              className={isEditingTemplate ? 'outline-dashed outline-1 outline-[#2F2FE4] p-0.5' : ''}
            >
              {template.to}
            </p>
            <p className="font-bold text-slate-900">
              <span>{data.salutation || 'Mr./Ms.'}</span> <span>{data.studentName || 'Student Name'}</span>
            </p>
            <p className="text-slate-700">{data.collegeName || 'College / Institution'}</p>
            <p className="text-slate-600 text-[10px] sm:text-[11.5px]">{data.studentEmail || 'student@example.com'}</p>
            <p className="text-slate-600 text-[10px] sm:text-[11.5px]">{data.studentMobile || '+91 98765 43210'}</p>
          </div>

          {/* 5. Salutation & Intro Paragraph */}
          <p className="text-[10.5px] sm:text-[12.5px] font-semibold text-slate-900 mb-1.5">
            <span
              contentEditable={isEditingTemplate}
              suppressContentEditableWarning
              onBlur={(e) => updateField('dear', e.currentTarget.textContent || '')}
              className={isEditingTemplate ? 'outline-dashed outline-1 outline-[#2F2FE4] p-0.5' : ''}
            >
              {template.dear}
            </span>{' '}
            {data.studentName || 'Student'},
          </p>

          <p
            contentEditable={isEditingTemplate}
            suppressContentEditableWarning
            onBlur={(e) => updateField('intro', e.currentTarget.textContent || '')}
            className={`text-[9.5px] sm:text-[11.5px] leading-relaxed text-slate-700 text-justify mb-3 ${
              isEditingTemplate ? 'outline-dashed outline-1 outline-[#2F2FE4] bg-blue-50/50 p-1.5' : ''
            }`}
          >
            {template.intro}
          </p>

          {/* 6. Structured Internship Details Table */}
          <div className="mb-3">
            <h2
              contentEditable={isEditingTemplate}
              suppressContentEditableWarning
              onBlur={(e) => updateField('detailsHeading', e.currentTarget.textContent || '')}
              className={`text-[11px] sm:text-[13px] font-bold text-slate-900 uppercase tracking-wider mb-1.5 ${
                isEditingTemplate ? 'outline-dashed outline-1 outline-[#2F2FE4] p-0.5' : ''
              }`}
            >
              {template.detailsHeading}
            </h2>

            <table className="w-full text-[9.5px] sm:text-[11.5px] text-slate-800 border-collapse bg-slate-50/60 rounded-lg overflow-hidden">
              <tbody>
                <tr className="border-b border-slate-200/80">
                  <td className="py-1 px-2.5 font-semibold text-slate-600 w-[140px]">Internship Domain</td>
                  <td className="py-1 px-1 font-bold text-slate-400">:</td>
                  <td className="py-1 px-2 font-bold text-[#2F2FE4]">{data.domain || 'Domain Course'}</td>
                </tr>
                <tr className="border-b border-slate-200/80">
                  <td className="py-1 px-2.5 font-semibold text-slate-600">Duration</td>
                  <td className="py-1 px-1 font-bold text-slate-400">:</td>
                  <td className="py-1 px-2 font-medium">{data.duration || '2 Months'}</td>
                </tr>
                <tr className="border-b border-slate-200/80">
                  <td className="py-1 px-2.5 font-semibold text-slate-600">Start Date</td>
                  <td className="py-1 px-1 font-bold text-slate-400">:</td>
                  <td className="py-1 px-2 font-medium">{formatDate(data.startDate)}</td>
                </tr>
                <tr className="border-b border-slate-200/80">
                  <td className="py-1 px-2.5 font-semibold text-slate-600">End Date</td>
                  <td className="py-1 px-1 font-bold text-slate-400">:</td>
                  <td className="py-1 px-2 font-medium">{formatDate(data.endDate)}</td>
                </tr>
                <tr>
                  <td className="py-1 px-2.5 font-semibold text-slate-600">Mode</td>
                  <td className="py-1 px-1 font-bold text-slate-400">:</td>
                  <td className="py-1 px-2 font-medium">{data.mode || 'Online / Hybrid'}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* 7. Closing Paragraph */}
          <p
            contentEditable={isEditingTemplate}
            suppressContentEditableWarning
            onBlur={(e) => updateField('closing', e.currentTarget.textContent || '')}
            className={`text-[9.5px] sm:text-[11.5px] leading-relaxed text-slate-700 text-justify mb-4 ${
              isEditingTemplate ? 'outline-dashed outline-1 outline-[#2F2FE4] bg-blue-50/50 p-1.5' : ''
            }`}
          >
            {template.closing}
          </p>
        </div>

        {/* 8. Signature Block & Footer */}
        <div>
          <div className="space-y-0.5 text-[9.5px] sm:text-[11.5px] mb-4">
            <p
              contentEditable={isEditingTemplate}
              suppressContentEditableWarning
              onBlur={(e) => updateField('sincerely', e.currentTarget.textContent || '')}
              className={isEditingTemplate ? 'outline-dashed outline-1 outline-[#2F2FE4] p-0.5' : ''}
            >
              {template.sincerely}
            </p>
            <div className="h-6 sm:h-8" />
            <p
              contentEditable={isEditingTemplate}
              suppressContentEditableWarning
              onBlur={(e) => updateField('digitalSig', e.currentTarget.textContent || '')}
              className={`font-mono text-slate-500 text-[8.5px] sm:text-[10px] ${
                isEditingTemplate ? 'outline-dashed outline-1 outline-[#2F2FE4] p-0.5' : ''
              }`}
            >
              {template.digitalSig}
            </p>
            <p
              contentEditable={isEditingTemplate}
              suppressContentEditableWarning
              onBlur={(e) => updateField('founder', e.currentTarget.textContent || '')}
              className={`font-bold text-slate-900 ${
                isEditingTemplate ? 'outline-dashed outline-1 outline-[#2F2FE4] p-0.5' : ''
              }`}
            >
              {template.founder}
            </p>
            <p
              contentEditable={isEditingTemplate}
              suppressContentEditableWarning
              onBlur={(e) => updateField('companyName', e.currentTarget.textContent || '')}
              className={`text-slate-700 ${
                isEditingTemplate ? 'outline-dashed outline-1 outline-[#2F2FE4] p-0.5' : ''
              }`}
            >
              {template.companyName}
            </p>
          </div>

          {/* Footer Bar */}
          <div className="flex flex-wrap items-center justify-between text-[7.5px] sm:text-[9.5px] text-slate-500 pt-2 border-t border-slate-200">
            <span>{template.footerAddress}</span>
            <span>{template.footerEmail}</span>
            <span>{template.footerPhone}</span>
            <span>{template.footerWebsite}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
