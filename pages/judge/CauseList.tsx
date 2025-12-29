
import React, { useState, useEffect } from 'react';
import { courtService } from '../../services/courtService';
import { Hearing, ReadinessStatus } from '../../types';
import { Printer, Filter, ChevronRight, FileText, StickyNote, CheckCircle2, AlertCircle } from 'lucide-react';

const JudgeCauseList: React.FC = () => {
  const [hearings, setHearings] = useState<Hearing[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadHearings();
  }, []);

  const loadHearings = async () => {
    setLoading(true);
    const h = await courtService.getHearings();
    setHearings(h);
    setLoading(false);
  };

  const readyHearings = hearings.filter(h => h.status === ReadinessStatus.READY);
  const notReadyHearings = hearings.filter(h => h.status !== ReadinessStatus.READY);

  if (loading) return null;

  return (
    <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Cause List — Court Room 4</h1>
          <p className="text-slate-400">Tuesday, 20 May 2025 • 10:00 AM – 04:30 PM</p>
        </div>
        <div className="flex gap-4">
          <button className="bg-white/5 border border-white/10 px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-white/10 flex items-center gap-2 transition-all">
            <Filter size={18} /> Filters
          </button>
          <button className="bg-white text-black px-6 py-2.5 rounded-xl text-sm font-bold hover:bg-slate-200 flex items-center gap-2 transition-all shadow-xl">
            <Printer size={18} /> Print List
          </button>
        </div>
      </div>

      {/* Cause List Table */}
      <div className="space-y-12">
        {/* Ready Section */}
        <section className="space-y-6">
          <div className="flex items-center gap-4">
            <div className="h-px flex-1 bg-white/5"></div>
            <h2 className="text-xs font-bold uppercase tracking-[0.3em] text-emerald-500 bg-emerald-500/10 px-4 py-1.5 rounded-full">
              Ready for Session
            </h2>
            <div className="h-px flex-1 bg-white/5"></div>
          </div>

          <div className="glass rounded-3xl overflow-hidden border border-white/5 shadow-2xl">
            <table className="w-full text-left border-collapse">
              <thead className="bg-white/5 text-[10px] uppercase tracking-widest text-slate-500 border-b border-white/5">
                <tr>
                  <th className="px-8 py-5 font-bold">Time</th>
                  <th className="px-8 py-5 font-bold">Case Info</th>
                  <th className="px-8 py-5 font-bold">Stage</th>
                  <th className="px-8 py-5 font-bold">Attendance</th>
                  <th className="px-8 py-5 font-bold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {readyHearings.map(h => (
                  <CauseListRow key={h.id} hearing={h} />
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Lunch Break Divider */}
        <div className="py-4 text-center">
          <div className="inline-flex items-center gap-4 bg-white/5 px-8 py-3 rounded-full border border-white/10">
            <div className="w-2 h-2 rounded-full bg-slate-500 animate-pulse"></div>
            <span className="text-xs font-bold uppercase tracking-widest text-slate-400">Lunch Recess — 01:00 PM to 02:00 PM</span>
            <div className="w-2 h-2 rounded-full bg-slate-500 animate-pulse"></div>
          </div>
        </div>

        {/* Not Ready / Afternoon Section */}
        <section className="space-y-6">
          <div className="flex items-center gap-4">
            <div className="h-px flex-1 bg-white/5"></div>
            <h2 className="text-xs font-bold uppercase tracking-[0.3em] text-red-400 bg-red-500/10 px-4 py-1.5 rounded-full">
              Cases with Pending Readiness
            </h2>
            <div className="h-px flex-1 bg-white/5"></div>
          </div>

          <div className="glass rounded-3xl overflow-hidden border border-red-500/10 bg-red-500/[0.02]">
            <table className="w-full text-left border-collapse">
              <tbody className="divide-y divide-white/5">
                {notReadyHearings.map(h => (
                  <CauseListRow key={h.id} hearing={h} isNotReady />
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
};

// Fix: Changed to React.FC to allow React reserved props like 'key' in list rendering
const CauseListRow: React.FC<{ hearing: Hearing; isNotReady?: boolean }> = ({ hearing, isNotReady }) => {
  return (
    <tr className={`group transition-colors ${isNotReady ? 'hover:bg-red-500/5' : 'hover:bg-white/5'}`}>
      <td className="px-8 py-6 align-top">
        <div className="text-lg font-bold">{hearing.timeSlot}</div>
        <div className="text-[10px] font-medium text-slate-500 uppercase tracking-wider">{hearing.predictedDuration} est.</div>
      </td>
      <td className="px-8 py-6 align-top">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-sm font-mono text-slate-400">{hearing.caseNumber}</span>
          <span className={`px-2 py-0.5 rounded text-[8px] font-bold uppercase ${
            hearing.priority === 'High' ? 'bg-red-500/10 text-red-400' : 'bg-white/5 text-slate-400'
          }`}>
            {hearing.priority} Priority
          </span>
        </div>
        <div className="text-base font-bold text-white group-hover:text-indigo-400 transition-colors">
          {hearing.partyA} <span className="text-slate-500 text-sm font-normal">v.</span> {hearing.partyB}
        </div>
        <div className="text-xs text-slate-500 mt-1">{hearing.caseType}</div>
      </td>
      <td className="px-8 py-6 align-top">
        <div className="text-sm font-medium text-slate-300">{hearing.stage}</div>
        <div className="flex items-center gap-1 mt-1">
          <div className="w-1.5 h-1.5 rounded-full bg-indigo-500"></div>
          <span className="text-[10px] text-slate-500 uppercase font-bold tracking-tighter">Listed Item #14</span>
        </div>
      </td>
      <td className="px-8 py-6 align-top">
        <div className="flex items-center gap-3">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center border ${
            hearing.advocatePresent ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500' : 'bg-red-500/10 border-red-500/20 text-red-500'
          }`}>
            {hearing.advocatePresent ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
          </div>
          <div>
            <div className="text-xs font-bold text-slate-300">
              {hearing.advocatePresent ? 'Advocate Ready' : 'Advocate Pending'}
            </div>
            <div className="text-[10px] text-slate-500">
              {hearing.attendanceCount} parties in lobby
            </div>
          </div>
        </div>
      </td>
      <td className="px-8 py-6 align-top">
        <div className="flex items-center gap-2">
          <button className="p-2.5 rounded-xl bg-white/5 hover:bg-white border border-white/5 hover:text-black transition-all" title="View Documents">
            <FileText size={18} />
          </button>
          <button className="p-2.5 rounded-xl bg-white/5 hover:bg-white border border-white/5 hover:text-black transition-all" title="Add Private Note">
            <StickyNote size={18} />
          </button>
          <button className="px-4 py-2.5 rounded-xl bg-indigo-500/10 hover:bg-indigo-500 text-indigo-400 hover:text-white border border-indigo-500/20 text-[10px] font-bold uppercase transition-all flex items-center gap-2">
            Call Case <ChevronRight size={14} />
          </button>
        </div>
      </td>
    </tr>
  );
};

export default JudgeCauseList;
