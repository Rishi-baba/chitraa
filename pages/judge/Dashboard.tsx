
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { courtService } from '../../services/courtService';
import { Hearing, Stats, CaseSummary, Alert, ReadinessStatus } from '../../types';
import { Clock, MapPin, Users, Calendar, AlertCircle, CheckCircle2, MoreVertical, X, Eye, Bell, Play } from 'lucide-react';

const JudgeDashboard: React.FC = () => {
  const [hearings, setHearings] = useState<Hearing[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [summary, setSummary] = useState<CaseSummary | null>(null);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const [h, s, sum, a] = await Promise.all([
      courtService.getHearings(),
      courtService.getStats(),
      courtService.getCaseSummary(),
      courtService.getAlerts()
    ]);
    setHearings(h);
    setStats(s);
    setSummary(sum);
    setAlerts(a);
    setLoading(false);
  };

  const handleComplete = async (id: string) => {
    await courtService.markComplete(id);
    setShowModal(null);
    loadData();
  };

  if (loading) return (
    <div className="flex items-center justify-center h-[60vh]">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
    </div>
  );

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold mb-2">Judge's Command Center</h1>
          <p className="text-slate-400">Hon'ble Justice M. S. Ramachandran — Court Room 4</p>
        </div>
        <Link 
          to="/judge/cause-list" 
          className="bg-white text-black px-6 py-3 rounded-full font-bold text-sm tracking-wide glow-button"
        >
          VIEW CAUSE LIST FOR TODAY
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard label="Today's Hearings" value={stats?.today || 0} icon={<Calendar className="text-indigo-400" />} />
        <StatCard label="Compliance Rate" value={`${stats?.readinessCompliance || 0}%`} icon={<CheckCircle2 className="text-emerald-400" />} />
        <StatCard label="Total Pending" value={stats?.totalPending || 0} icon={<Users className="text-amber-400" />} />
        <StatCard label="Transcription" value={`${stats?.transcriptionEfficiency || 0}%`} icon={<Clock className="text-slate-400" />} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Clock className="text-slate-500" />
              Upcoming Sessions
            </h2>
            <span className="text-xs text-slate-500 font-medium bg-white/5 px-3 py-1 rounded-full uppercase tracking-widest">
              Live Updates Active
            </span>
          </div>

          <div className="space-y-4">
            {hearings.length > 0 ? (
              hearings.sort((a, b) => a.status === ReadinessStatus.READY ? -1 : 1).map((h) => (
                <HearingCard 
                  key={h.id} 
                  hearing={h} 
                  onComplete={() => setShowModal(h.id)} 
                  onStart={() => navigate(`/judge/hearing/${h.id}/live`)}
                />
              ))
            ) : (
              <div className="glass p-12 rounded-3xl text-center text-slate-500">
                All hearings for today are completed.
              </div>
            )}
          </div>
        </div>

        <div className="space-y-10">
          <section className="space-y-4">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <AlertCircle className="text-slate-500" />
              Pending Load
            </h2>
            <div className="space-y-3">
              <PendingCard label="> 10 Years" count={summary?.over10Years || 0} color="red" />
              <PendingCard label="5 – 10 Years" count={summary?.fiveToTenYears || 0} color="yellow" />
              <PendingCard label="1 – 5 Years" count={summary?.oneToFiveYears || 0} color="blue" />
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Bell className="text-slate-500" />
              Priority Alerts
            </h2>
            <div className="glass rounded-3xl p-6 divide-y divide-white/5">
              {alerts.map(a => (
                <div key={a.id} className="py-4 first:pt-0 last:pb-0">
                  <div className="flex justify-between items-start mb-1">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                      a.type === 'readiness' ? 'bg-emerald-500/10 text-emerald-400' :
                      a.type === 'order' ? 'bg-indigo-500/10 text-indigo-400' :
                      'bg-amber-500/10 text-amber-400'
                    }`}>
                      {a.type}
                    </span>
                    <span className="text-[10px] text-slate-500">{a.time}</span>
                  </div>
                  <p className="text-sm text-slate-300 leading-snug">{a.message}</p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={() => setShowModal(null)}></div>
          <div className="glass p-10 rounded-3xl max-w-md w-full relative z-10 animate-in zoom-in-95 duration-200">
            <h3 className="text-2xl font-bold mb-4">Mark Complete?</h3>
            <p className="text-slate-400 mb-8 leading-relaxed">
              This will finalize the hearing records and move it to the orders section.
            </p>
            <div className="flex gap-4">
              <button onClick={() => setShowModal(null)} className="flex-1 px-6 py-3 rounded-xl border border-white/10 hover:bg-white/5 transition-colors font-bold">Cancel</button>
              <button onClick={() => handleComplete(showModal)} className="flex-1 px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold glow-button">Finalize</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const StatCard = ({ label, value, icon }: { label: string; value: number | string; icon: React.ReactNode }) => (
  <div className="glass p-6 rounded-3xl flex items-center gap-5 hover:border-white/20 transition-all">
    <div className="p-3 bg-white/5 rounded-2xl">{icon}</div>
    <div>
      <p className="text-xs text-slate-500 uppercase tracking-widest font-bold mb-1">{label}</p>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  </div>
);

const HearingCard: React.FC<{ hearing: Hearing; onComplete: () => void; onStart: () => void }> = ({ hearing, onComplete, onStart }) => {
  const isReady = hearing.status === ReadinessStatus.READY;
  const isNotReady = hearing.status === ReadinessStatus.NOT_READY;

  return (
    <div className={`glass p-6 rounded-3xl border-l-4 transition-all hover:translate-x-1 ${
      isReady ? 'border-l-emerald-500' : isNotReady ? 'border-l-red-500' : 'border-l-amber-500'
    }`}>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex-1 space-y-4">
          <div className="flex items-center gap-3">
            <span className="text-lg font-bold">{hearing.timeSlot}</span>
            <div className="h-4 w-px bg-white/10"></div>
            <span className="text-xs font-mono text-slate-400 bg-white/5 px-2 py-0.5 rounded">{hearing.caseNumber}</span>
            <span className={`text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-tighter ${
              isReady ? 'bg-emerald-500/10 text-emerald-400' : 
              isNotReady ? 'bg-red-500/10 text-red-400' : 
              'bg-amber-500/10 text-amber-400'
            }`}>
              {hearing.status.replace('_', ' ')}
            </span>
          </div>
          
          <div>
            <h3 className="text-xl font-bold mb-1">{hearing.partyA} vs {hearing.partyB}</h3>
            <p className="text-sm text-slate-400 flex items-center gap-4">
              <span className="flex items-center gap-1"><MapPin size={14} /> {hearing.courtroom}</span>
              <span className="flex items-center gap-1 font-medium text-slate-300">{hearing.caseType}</span>
            </p>
          </div>
        </div>

        <div className="flex md:flex-col gap-2 shrink-0">
          <button 
            onClick={onStart}
            className="flex-1 md:w-32 py-2.5 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white flex items-center justify-center gap-2 text-xs font-bold transition-all shadow-lg"
          >
            <Play size={14} fill="currentColor" /> START
          </button>
          <button 
            onClick={onComplete}
            className="flex-1 md:w-32 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center gap-2 text-xs font-bold transition-all"
          >
            <CheckCircle2 size={14} /> Finish
          </button>
        </div>
      </div>
    </div>
  );
};

const PendingCard = ({ label, count, color }: { label: string; count: number; color: 'red' | 'yellow' | 'blue' }) => {
  const colors = {
    red: 'text-red-400 bg-red-500/10 border-red-500/20',
    yellow: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
    blue: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
  };
  return (
    <div className={`glass p-4 rounded-2xl flex items-center justify-between border ${colors[color]}`}>
      <span className="text-sm font-bold opacity-80">{label}</span>
      <span className="text-xl font-bold">{count}</span>
    </div>
  );
};

export default JudgeDashboard;
