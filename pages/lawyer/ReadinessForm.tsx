
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { courtService } from '../../services/courtService';
import { Hearing, ReadinessStatus } from '../../types';
import { ChevronLeft, Info, CheckCircle, Clock, MapPin, AlertTriangle, XCircle } from 'lucide-react';

const ReadinessForm: React.FC = () => {
  const { hearingId } = useParams<{ hearingId: string }>();
  const navigate = useNavigate();
  const [hearing, setHearing] = useState<Hearing | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<ReadinessStatus>(ReadinessStatus.READY);
  const [reason, setReason] = useState("");

  useEffect(() => {
    loadHearing();
  }, [hearingId]);

  const loadHearing = async () => {
    if (!hearingId) return;
    const h = await courtService.getHearingById(hearingId);
    if (h) setHearing(h);
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!hearingId) return;
    setSaving(true);
    await courtService.updateReadiness(hearingId, status, status === ReadinessStatus.NOT_READY ? reason : undefined);
    setTimeout(() => {
      navigate('/lawyer/dashboard');
    }, 1000);
  };

  if (loading) return null;
  if (!hearing) return <div>Case not found</div>;

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-in slide-in-from-bottom-8 duration-500">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
        <ChevronLeft size={20} /> Back
      </button>

      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4 tracking-tight">Record Readiness</h1>
        <p className="text-slate-400 max-w-md mx-auto">This declaration affects courtroom prioritization and judicial scheduling.</p>
      </div>

      <form onSubmit={handleSubmit} className="glass p-10 rounded-[2.5rem] space-y-10 border-white/20">
        <div className="bg-white/5 p-8 rounded-3xl border border-white/5 flex flex-col items-center gap-4 text-center">
          <div className="text-xs font-mono text-slate-500 mb-1">{hearing.caseNumber}</div>
          <div className="text-2xl font-bold">{hearing.partyA} vs {hearing.partyB}</div>
        </div>

        <div className="space-y-8">
          <div className="grid grid-cols-2 gap-4">
            <button 
              type="button"
              onClick={() => setStatus(ReadinessStatus.READY)}
              className={`p-6 rounded-2xl border-2 transition-all flex flex-col items-center gap-3 ${
                status === ReadinessStatus.READY ? 'border-emerald-500 bg-emerald-500/10 text-emerald-400' : 'border-white/5 bg-white/5 text-slate-500'
              }`}
            >
              <CheckCircle />
              <span className="font-bold">READY</span>
            </button>
            <button 
              type="button"
              onClick={() => setStatus(ReadinessStatus.NOT_READY)}
              className={`p-6 rounded-2xl border-2 transition-all flex flex-col items-center gap-3 ${
                status === ReadinessStatus.NOT_READY ? 'border-red-500 bg-red-500/10 text-red-400' : 'border-white/5 bg-white/5 text-slate-500'
              }`}
            >
              <XCircle />
              <span className="font-bold">NOT READY</span>
            </button>
          </div>

          {status === ReadinessStatus.NOT_READY && (
            <div className="space-y-4 animate-in slide-in-from-top-2 duration-300">
              <label className="text-xs font-bold text-slate-500 uppercase">Reason for Unreadiness</label>
              <select 
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                required
                className="w-full bg-white/5 border border-white/10 rounded-xl p-4 outline-none focus:border-red-500/50"
              >
                <option value="">Select a reason...</option>
                <option value="Witness unavailable">Witness unavailable</option>
                <option value="Documents pending">Documents pending</option>
                <option value="Need more preparation time">Need more preparation time</option>
                <option value="Opposing counsel unavailable">Opposing counsel unavailable</option>
                <option value="Other">Other (Specify below)</option>
              </select>
              {reason === 'Other' && (
                <input 
                  type="text" 
                  placeholder="Describe your reason..." 
                  className="w-full bg-white/5 border border-white/10 rounded-xl p-4 outline-none focus:border-red-500/50"
                />
              )}
            </div>
          )}

          {status === ReadinessStatus.READY && (
            <div className="space-y-4 pt-4">
               <label className="flex items-center gap-3 cursor-pointer group">
                <input type="checkbox" required className="w-5 h-5 rounded border-white/20 bg-white/5 accent-indigo-500" />
                <span className="text-sm text-slate-400 group-hover:text-slate-300">Parties are present for today's hearing.</span>
               </label>
            </div>
          )}
        </div>

        <button 
          disabled={saving}
          className={`w-full py-4 font-bold rounded-2xl text-lg shadow-lg transition-all flex items-center justify-center gap-3 ${
            status === ReadinessStatus.READY ? 'bg-emerald-500 text-white' : 'bg-red-500 text-white'
          }`}
        >
          {saving ? 'Saving...' : `CONFIRM AS ${status.replace('_', ' ')}`}
        </button>
      </form>
    </div>
  );
};

export default ReadinessForm;
