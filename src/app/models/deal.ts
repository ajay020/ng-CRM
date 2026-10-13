export type DealStage = 'New' | 'Qualified' | 'Proposal' | 'Negotiation' | 'Won' | 'Lost';

export interface Deal {
  id: string;
  title: string;
  customerId: string;
  value: number;
  stage: DealStage;
  expectedCloseDate: Date;
  createdAt: Date;
}
