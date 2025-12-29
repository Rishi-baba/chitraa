
export type Role = 'JUDGE' | 'LAWYER' | 'ADMIN';

export enum ReadinessStatus {
  READY = 'READY',
  NOT_READY = 'NOT_READY',
  PENDING = 'PENDING'
}

export interface TranscriptLine {
  id: string;
  speaker: 'Judge' | 'Petitioner' | 'Respondent' | 'Witness';
  text: string;
  timestamp: string;
  confidence: number;
}

export interface Hearing {
  id: string;
  timeSlot: string;
  courtroom: string;
  caseNumber: string;
  partyA: string;
  partyB: string;
  caseType: string;
  status: ReadinessStatus;
  attendanceCount: number;
  predictedDuration: string;
  stage: string;
  priority: 'High' | 'Medium' | 'Low';
  advocatePresent: boolean;
  deadline: Date;
  readinessReason?: string;
  transcript?: TranscriptLine[];
  finalOrder?: string;
}

export interface Stats {
  today: number;
  month: number;
  totalPending: number;
  avgDuration: string;
  readinessCompliance: number;
  transcriptionEfficiency: number;
}

export interface CaseSummary {
  over10Years: number;
  fiveToTenYears: number;
  oneToFiveYears: number;
}

export interface Alert {
  id: string;
  type: 'readiness' | 'order' | 'review' | 'system';
  message: string;
  time: string;
}
