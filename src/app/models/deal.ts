export type DealStage = 'New' | 'Qualified' | 'Proposal' | 'Negotiation' | 'Won' | 'Lost';

export interface Deal {
  id: string;
  title: string;
  customer: string;
  value: number;
  stage: DealStage;
  expectedCloseDate: Date;
  createdAt: Date;
}
