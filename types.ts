
export enum PipelineStage {
  PROSPECTING = 'Prospecting',
  CONTACTED = 'Contacted',
  PROPOSAL = 'Proposal Sent',
  NEGOTIATION = 'In Negotiation',
  WON = 'Won',
  LOST = 'Lost'
}

export interface Lead {
  id: string;
  name: string;
  company: string;
  email: string;
  value: number;
  stage: PipelineStage;
  notes: string;
  createdAt: string;
  aiScore?: number;
  aiSummary?: string;
}

export interface DashboardStats {
  totalLeads: number;
  wonDeals: number;
  pipelineValue: number;
  conversionRate: number;
}
