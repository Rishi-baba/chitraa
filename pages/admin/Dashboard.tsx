
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, PieChart, Pie, Cell } from 'recharts';
import { Activity, ShieldAlert, Cpu, Database, TrendingUp, Users, Scale, Zap } from 'lucide-react';

const AdminDashboard: React.FC = () => {
  const loadData = [
    { name: 'Jan', civil: 400, criminal: 240, writ: 120 },
    { name: 'Feb', civil: 300, criminal: 139, writ: 110 },
    { name: 'Mar', civil: 200, criminal: 980, writ: 220 },
    { name: 'Apr', civil: 278, criminal: 390, writ: 150 },
    { name: 'May', civil: 189, criminal: 480, writ: 180 },
    { name: 'Jun', civil: 239, criminal: 380, writ: 200 },
  ];

  const caseTypeData = [
    { name: 'Civil', value: 45 },
    { name: 'Criminal', value: 30 },
    { name: 'Writ', value: 15 },
    { name: 'Others', value: 10 },
  ];

  const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444'];

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold mb-2">System Analytics</h1>
          <p className="text-slate-400">Judicial Performance Node — Regional Node 01</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <GlassMetric icon={<Scale className="text-indigo-400" />} label="Readiness Compliance" value="78%" subValue="Target 90%" />
        <GlassMetric icon={<Zap className="text-amber-400" />} label="AI Transcription" value="92%" subValue="Adoption rate" />
        <GlassMetric icon={<TrendingUp className="text-emerald-400" />} label="Disposal Velocity" value="+14%" subValue="vs last month" />
        <GlassMetric icon={<Users className="text-red-400" />} label="Wait Time" value="-22m" subValue="Avg reduction" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div className="glass p-8 rounded-[2.5rem] space-y-6">
          <h3 className="text-xl font-bold flex items-center gap-2">
            <TrendingUp className="text-slate-500" />
            Case Mix by Category
          </h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={loadData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                <Tooltip contentStyle={{backgroundColor: '#0f1115', border: 'none', borderRadius: '12px'}} />
                <Bar dataKey="civil" fill="#6366f1" radius={[4, 4, 0, 0]} />
                <Bar dataKey="criminal" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass p-8 rounded-[2.5rem] space-y-6">
           <h3 className="text-xl font-bold mb-6">Courtroom Resource Allocation</h3>
           <div className="space-y-6">
              <ResourceBar label="CR-04 (Justice Ramachandran)" value={85} color="#6366f1" />
              <ResourceBar label="CR-08 (Justice Mehta)" value={42} color="#f59e0b" />
              <ResourceBar label="CR-12 (Justice Singh)" value={94} color="#10b981" />
              <ResourceBar label="CR-01 (Justice Bannerjee)" value={71} color="#ef4444" />
           </div>
        </div>
      </div>
    </div>
  );
};

const ResourceBar = ({ label, value, color }: { label: string; value: number; color: string }) => (
  <div className="space-y-2">
    <div className="flex justify-between text-xs font-bold uppercase tracking-wider text-slate-500">
      <span>{label}</span>
      <span>{value}% Load</span>
    </div>
    <div className="h-2 bg-white/5 rounded-full overflow-hidden">
      <div className="h-full transition-all duration-1000" style={{ width: `${value}%`, backgroundColor: color }}></div>
    </div>
  </div>
);

const GlassMetric = ({ icon, label, value, subValue }: { icon: React.ReactNode; label: string; value: string; subValue: string }) => (
  <div className="glass p-8 rounded-[2.5rem] flex items-center gap-6 border-white/10 group">
    <div className="p-4 bg-white/5 rounded-2xl">{icon}</div>
    <div>
      <p className="text-xs text-slate-500 uppercase tracking-widest font-bold mb-1">{label}</p>
      <div className="flex items-end gap-3">
        <p className="text-3xl font-bold">{value}</p>
        <span className="text-[10px] font-bold text-slate-400 mb-1.5">{subValue}</span>
      </div>
    </div>
  </div>
);

export default AdminDashboard;
