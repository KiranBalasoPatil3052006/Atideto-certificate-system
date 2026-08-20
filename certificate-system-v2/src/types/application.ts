export interface ApplicationRecord {
  id: string;
  applicationId: string;
  fullName: string;
  email: string;
  phone: string;
  countryCode: string;
  college: string;
  registerNo: string;
  degree: string;
  stream: string;
  graduationYear: string;
  programId: string;
  programTitle: string;
  selectedCourse: string;
  startDate: string;
  endDate: string;
  durationDays: number;
  reportIncluded: boolean;
  paymentOption: string;
  status: 'RECEIVED' | 'SELECTED' | 'COMPLETED' | 'CERTIFICATE_GENERATED' | 'REJECTED' | string;
  emailStatus: string;
  certificateId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ApplicationListResponse {
  success: boolean;
  data: {
    applications: ApplicationRecord[];
    total: number;
    page: number;
    totalPages: number;
  };
}

export interface StatsResponse {
  success: boolean;
  data: {
    total: number;
    byStatus: Record<string, number>;
  };
}
