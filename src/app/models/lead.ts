export type LeadStatus = 'New' | 'Contacted' | 'Qualified' | 'Lost';

export type LeadSource = 'Website' | 'Referral' | 'Social Media' | 'Advertisement' | 'Other';

export interface Lead {
  id: number;
  name: string;
  email: string;
  phone: string;
  company: string;
  source: LeadSource;
  status: LeadStatus;
  createdAt: Date;
}
