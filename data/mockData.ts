
import { Hearing, ReadinessStatus, Stats, CaseSummary, Alert } from '../types';

const now = new Date();
const tMinus48 = new Date(now.getTime() - 48 * 60 * 60 * 1000);
const tPlus24 = new Date(now.getTime() + 24 * 60 * 60 * 1000);

export const mockHearings: Hearing[] = [
  {
    id: 'h1',
    timeSlot: '10:30 AM',
    courtroom: 'CR-04',
    caseNumber: 'WP/2241/2022',
    partyA: 'Global Tech Solutions',
    partyB: 'Ministry of IT',
    caseType: 'Writ Petition',
    status: ReadinessStatus.READY,
    attendanceCount: 4,
    predictedDuration: '45 mins',
    stage: 'Final Hearing',
    priority: 'High',
    advocatePresent: true,
    deadline: tMinus48,
  },
  {
    id: 'h2',
    timeSlot: '11:15 AM',
    courtroom: 'CR-04',
    caseNumber: 'OS/455/2021',
    partyA: 'Amit Kumar',
    partyB: 'Vikas Builders Ltd.',
    caseType: 'Civil Suit',
    status: ReadinessStatus.READY,
    attendanceCount: 2,
    predictedDuration: '20 mins',
    stage: 'Evidence',
    priority: 'Medium',
    advocatePresent: true,
    deadline: tPlus24,
  },
  {
    id: 'h3',
    timeSlot: '12:00 PM',
    courtroom: 'CR-04',
    caseNumber: 'CA/88/2023',
    partyA: 'Realty Corp',
    partyB: 'Zonal Authority',
    caseType: 'Commercial Arbitration',
    status: ReadinessStatus.NOT_READY,
    readinessReason: 'Witness unavailable',
    attendanceCount: 1,
    predictedDuration: '60 mins',
    stage: 'Arguments',
    priority: 'High',
    advocatePresent: false,
    deadline: tMinus48,
  },
  {
    id: 'h4',
    timeSlot: '02:30 PM',
    courtroom: 'CR-04',
    caseNumber: 'MS/12/2024',
    partyA: 'Sarah Jenkins',
    partyB: 'City Municipal',
    caseType: 'Miscellaneous',
    status: ReadinessStatus.PENDING,
    attendanceCount: 0,
    predictedDuration: '15 mins',
    stage: 'Admission',
    priority: 'Low',
    advocatePresent: false,
    deadline: tPlus24,
  }
];

export const judgeStats: Stats = {
  today: 12,
  month: 145,
  totalPending: 842,
  avgDuration: '28m',
  readinessCompliance: 78,
  transcriptionEfficiency: 92
};

export const caseSummary: CaseSummary = {
  over10Years: 42,
  fiveToTenYears: 128,
  oneToFiveYears: 672
};

export const mockAlerts: Alert[] = [
  { id: 'a1', type: 'readiness', message: 'WP/2241 Advocate confirmed readiness.', time: '10m ago' },
  { id: 'a2', type: 'system', message: 'Deadline passed for MS/12. Auto-flagged PENDING.', time: '1h ago' }
];
