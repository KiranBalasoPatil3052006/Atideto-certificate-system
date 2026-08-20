export interface CertificateRecord {
  id: string;
  certificateId: string;
  applicationId: string | null;
  studentName: string;
  course: string;
  college: string | null;
  registerNo?: string | null;
  startDate: string | null;
  endDate: string | null;
  duration: string | null;
  issueDate: string;
  status: 'active' | 'revoked' | string;
  verificationUrl?: string | null;
  verifiedCount: number;
  pdfUrl?: string | null;
  imgUrl?: string | null;
  createdAt: string;
}

export interface ElementStyle {
  fontFamily: string;
  fontSize?: number; // in px
  fontWeight: string;
  fontStyle: 'normal' | 'italic';
  color: string;
  letterSpacing?: number; // in px
}

export interface TypographySettings {
  studentNameFont: string;
  studentNameSize: number; // in px or scale
  studentNameColor: string;
  studentNameItalic: boolean;
  studentNameWeight: string;
  titleFont: string;
  titleColor: string;
  domainColor: string;
  descriptionFont: string;
  metaFont: string;
  letterSpacing: number; // in px

  // Element targets for full parity with original preview.html studio
  certName?: ElementStyle;
  certTitle?: ElementStyle;
  certEyebrow?: ElementStyle;
  certDomain?: ElementStyle;
  certDesc?: ElementStyle;
  certSignatory?: ElementStyle;
  certMeta?: ElementStyle;
}

export interface CompanyTemplateSettings {
  eyebrow: string;
  mainTitle: string;
  domainPrefix: string;
  descriptionParagraph1: string;
  descriptionParagraph2: string;
  founderDesignation: string;
  companyName: string;
  udyamId: string;
  email: string;
  phone: string;
  website: string;
}

export interface CertificateFormData {
  studentName: string;
  course: string;
  college: string;
  registerNo: string;
  startDate: string;
  endDate: string;
  duration: string;
  issueDate: string;
  verifyId: string;
  qrLink: string;
}
