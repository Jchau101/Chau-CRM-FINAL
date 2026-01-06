
export enum PipelineStage {
  CONTACTER = 'CONTACTER',
  QUALIFIED = 'QUALIFIED',
  NEGOTIATION = 'NEGOTIATION',
  CLOSED = 'CLOSED'
}

// Display labels for stages
export const STAGE_LABELS: Record<PipelineStage, string> = {
  [PipelineStage.CONTACTER]: 'Contacter',
  [PipelineStage.QUALIFIED]: 'Qualified',
  [PipelineStage.NEGOTIATION]: 'Negotiation',
  [PipelineStage.CLOSED]: 'Closed',
};

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

export enum TaskPriority {
  HIGH = 'HIGH',
  MEDIUM = 'MEDIUM',
  LOW = 'LOW'
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  dueDate?: string;
  priority: TaskPriority;
  completed: boolean;
  linkedLeadIds: string[];
  createdAt: string;
  updatedAt: string;
}

export interface SavedList {
  id: string;
  listName: string;
  leadIds: string[];
  createdAt: string;
  updatedAt: string;
}
