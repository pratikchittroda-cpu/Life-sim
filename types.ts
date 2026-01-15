export interface TimelinePoint {
  year: number;
  label: string;
  financialStability: number; // 0-100
  mentalHealth: number; // 0-100
  relationships: number; // 0-100
  regretProbability: number; // 0-100
  narrative: string;
  hiddenRisks: string[];
}

export interface SimulationResult {
  assumptions: string[];
  timeline: TimelinePoint[];
  keyForks: {
    decisionPoint: string;
    implication: string;
  }[];
  bestCase: string;
  worstCase: string;
  brutalTruths: string[];
  alternativeStrategy: string;
}

export interface UserInput {
  decision: string;
  currentAge: number;
  currentStatus: string;
  riskTolerance: 'Low' | 'Medium' | 'High' | 'Degen';
  goals: string;
}

export enum SimulationStatus {
  IDLE = 'IDLE',
  LOADING = 'LOADING',
  COMPLETE = 'COMPLETE',
  ERROR = 'ERROR',
}