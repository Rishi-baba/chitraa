
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { courtService } from '../../services/courtService';
import { Hearing, ReadinessStatus } from '../../types';
import { Briefcase, Calendar, Clock, MapPin, Search, ChevronRight, CheckCircle, AlertCircle, Hourglass } from 'lucide-react';

const LawyerDashboard: React.FC = () => {
  const [myHearings, setMyHearings] = useState<Hearing[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMyCases();
  }, []);

  const loadMyCases = async () => {
    setLoading(true);
    const h = await courtService.getHearings();
    setMyHearings(h.slice(0, 3));
    setLoading(false);
  };

  if (loading) return null;

  return (
    <div className="max-w-6xl mx-auto space-y-12 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Advocate Portal</h1>
          <p className="text-slate-400">Senior Counsel Arjun Varma • Bar ID: MH/1244/2012</p>
        </div>
        <div className="flex items-center gap-4 bg-white/5 p-2 rounded-2xl border border-white/10">
          <div className="px-6 py-2 text-center border-r border-white/10">
            <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">Readiness Score</p>
            <p className="text-xl font-bold text-emerald-400">92%</p>
          </div>
          <div className="px-6 py-2 text-center">
            <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">Next Hearing</p>
            <p className="text-xl font-bold text-amber-400">10:30 AM</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3 space-y-8">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <h2 className="text-xl font-bold flex items-center gap-3">
              <Calendar className="text-indigo-400" />
              Today's Engagements
            </h2>
            <button className="text-indigo-400 text-sm hover:underline font-medium">View Full Calendar</button>
          </div>

          <div className="space-y-6">
            {myHearings.map(h => (
              <LawyerCaseCard key={h.id} hearing={h} />
            ))}
          </div>
        </div>

        <div className="space-y-8">
          <div className="glass p-6 rounded-3xl space-y-6">
            <h3 className="text-lg font-bold">Quick Actions</h3>
            <div className="space-y-3">
              <ActionItem icon={<Search size={18}/>} label="Search E-File" />
              <ActionItem icon={<Briefcase size={18}/>} label="Apply for Certified Copy" />
            </div>
          </div>

          <div className="glass p-6 rounded-3xl bg-indigo-500/5 border-indigo-500/20">
             <div className="flex items-center gap-2 mb-4 text-indigo-400">
               <Hourglass size={20} />
               <h3 className="font-bold">Compliance Clock</h3>
             </div>
             <p className="text-xs text-slate-400 leading-relaxed">
               Declarations must be submitted <span className="text-white font-bold">48 hours</span> before scheduled hearings to avoid automatic postponement flags.
             </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const LawyerCaseCard: React.FC<{ hearing: Hearing }> = ({ hearing }) => {
  const isPending = hearing.status === ReadinessStatus.PENDING;
  const deadlinePassed = hearing.deadline < new Date();
  
  return (
    <div className={`glass p-8 rounded-[2rem] border-2 transition-all group ${
      isPending && deadlinePassed ? 'border-red-500/20 bg-red-500/[0.02]' : 'border-white/5'
    }`}>
      <div className="flex flex-col md:flex-row justify-between gap-6">
        <div className="space-y-4 flex-1">
          <div className="flex items-center gap-3">
            <div className="px-3 py-1 bg-white/5 rounded-lg text-xs font-mono text-slate-400">{hearing.caseNumber}</div>
            <div className={`w-2 h-2 rounded-full ${
              hearing.status === ReadinessStatus.READY ? 'bg-emerald-500' :
              deadlinePassed ? 'bg-red-500 animate-pulse' : 'bg-amber-500'
            }`}></div>
            <span className={`text-[10px] font-bold uppercase tracking-widest ${
              deadlinePassed && isPending ? 'text-red-400' : 'text-slate-500'
            }`}>
              {hearing.status.replace('_', ' ')}
              {isPending && deadlinePassed && " — SYSTEM OVERDUE"}
            </span>
          </div>

          <h3 className="text-2xl font-bold group-hover:text-indigo-400 transition-colors">
            {hearing.partyA} vs {hearing.partyB}
          </h3>

          <div className="flex flex-wrap items-center gap-6 text-sm text-slate-400">
            <div className="flex items-center gap-2"><Clock size={16} /> {hearing.timeSlot}</div>
            <div className="flex items-center gap-2"><MapPin size={16} /> {hearing.courtroom}</div>
            <div className="flex items-center gap-2 text-indigo-400 font-medium">{hearing.stage}</div>
          </div>
        </div>

        <div className="flex flex-col justify-center gap-3 min-w-[200px]">
          {isPending ? (
            <Link 
              to={`/readiness/${hearing.id}`}
              className={`px-6 py-3 font-bold rounded-xl text-center transition-all shadow-lg ${
                deadlinePassed ? 'bg-red-500 text-white hover:bg-red-600' : 'bg-amber-500 text-black hover:bg-amber-600'
              }`}
            >
              Mark Readiness
            </Link>
          ) : (
            <div className="px-6 py-3 bg-emerald-500/10 text-emerald-500 font-bold rounded-xl border border-emerald-500/20 flex items-center justify-center gap-2">
              <CheckCircle size={18} /> Declared Ready
            </div>
          )}
          <button className="px-6 py-3 bg-white/5 hover:bg-white/10 text-white font-bold rounded-xl border border-white/10 flex items-center justify-center gap-2 transition-all">
            Case Docket <ChevronRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

const ActionItem = ({ icon, label }: { icon: React.ReactNode; label: string }) => (
  <button className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 text-slate-400 hover:text-white transition-all text-sm font-medium border border-transparent hover:border-white/10">
    {icon}
    {label}
  </button>
);

export default LawyerDashboard;
