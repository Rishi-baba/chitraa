
import { Hearing, Stats, CaseSummary, Alert, ReadinessStatus, TranscriptLine } from '../types';
import { mockHearings, judgeStats, caseSummary, mockAlerts } from '../data/mockData';

class CourtService {
  private hearings: Hearing[] = [...mockHearings];
  private stats: Stats = { ...judgeStats };
  private alerts: Alert[] = [...mockAlerts];

  async getHearings(): Promise<Hearing[]> {
    return new Promise((resolve) => {
      setTimeout(() => resolve(this.hearings), 300);
    });
  }

  async getHearingById(id: string): Promise<Hearing | undefined> {
    return this.hearings.find(h => h.id === id);
  }

  async getStats(): Promise<Stats> {
    return new Promise((resolve) => resolve(this.stats));
  }

  async getCaseSummary(): Promise<CaseSummary> {
    return new Promise((resolve) => resolve(caseSummary));
  }

  async getAlerts(): Promise<Alert[]> {
    return new Promise((resolve) => resolve(this.alerts));
  }

  async markComplete(id: string, transcript?: TranscriptLine[], finalOrder?: string): Promise<boolean> {
    const idx = this.hearings.findIndex(h => h.id === id);
    if (idx !== -1) {
      this.hearings[idx].status = ReadinessStatus.READY; // ensure state
      this.hearings[idx].transcript = transcript;
      this.hearings[idx].finalOrder = finalOrder;
      
      // For the prototype, we keep it in list but flag complete if we had a field
      // but the UI currently filters out. Let's actually remove it from "Active"
      this.hearings = this.hearings.filter(h => h.id !== id);
      this.stats.today += 1;
      return true;
    }
    return false;
  }

  async updateReadiness(id: string, status: ReadinessStatus, reason?: string): Promise<boolean> {
    const hearing = this.hearings.find(h => h.id === id);
    if (hearing) {
      hearing.status = status;
      hearing.readinessReason = reason;
      if (status === ReadinessStatus.READY) hearing.advocatePresent = true;
      return true;
    }
    return false;
  }
}

export const courtService = new CourtService();
