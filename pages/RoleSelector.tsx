
import React from 'react';
import { Link } from 'react-router-dom';
import { Gavel, User, ShieldCheck } from 'lucide-react';

const RoleSelector: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#0b0d10] flex flex-col items-center justify-center p-6 bg-[url('https://picsum.photos/1920/1080?grayscale&blur=10')] bg-cover bg-center">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm"></div>
      
      <div className="relative z-10 text-center mb-12">
        <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-2xl">
          <Gavel className="text-black w-10 h-10" />
        </div>
        <h1 className="text-4xl font-bold tracking-tight mb-2">SMART COURTS</h1>
        <p className="text-slate-400 uppercase tracking-[0.3em] text-sm">Judicial Operations Platform</p>
      </div>

      <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl w-full">
        <RoleCard 
          to="/judge/dashboard" 
          title="Judge" 
          description="Access cause lists, manage hearings, and view pending case loads." 
          icon={<Gavel />}
          color="indigo"
        />
        <RoleCard 
          to="/lawyer/dashboard" 
          title="Lawyer" 
          description="View assigned cases and mark readiness for upcoming hearings." 
          icon={<User />}
          color="amber"
        />
        <RoleCard 
          to="/admin/dashboard" 
          title="Admin" 
          description="System-wide analytics, resource allocation, and performance monitoring." 
          icon={<ShieldCheck />}
          color="emerald"
        />
      </div>

      <footer className="relative z-10 mt-16 text-slate-500 text-xs tracking-widest uppercase">
        Internal Judiciary System — Prototype v1.0
      </footer>
    </div>
  );
};

interface RoleCardProps {
  to: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
}

const RoleCard: React.FC<RoleCardProps> = ({ to, title, description, icon, color }) => {
  const borderColors = {
    indigo: 'hover:border-indigo-500/50',
    amber: 'hover:border-amber-500/50',
    emerald: 'hover:border-emerald-500/50',
  };

  return (
    <Link 
      to={to} 
      className={`glass p-8 rounded-3xl transition-all duration-500 transform hover:-translate-y-2 group flex flex-col items-center text-center ${borderColors[color as keyof typeof borderColors]}`}
    >
      <div className="mb-6 p-4 rounded-2xl bg-white/5 text-slate-300 group-hover:bg-white group-hover:text-black transition-all duration-500">
        {/* Use React.isValidElement and cast to React.ReactElement<any> to allow additional props like 'size' during cloning */}
        {React.isValidElement(icon) ? React.cloneElement(icon as React.ReactElement<any>, { size: 32 }) : icon}
      </div>
      <h2 className="text-2xl font-bold mb-3">{title}</h2>
      <p className="text-slate-400 text-sm leading-relaxed mb-6">{description}</p>
      <span className="text-xs font-bold uppercase tracking-widest text-white/40 group-hover:text-white transition-colors">
        Enter Workspace &rarr;
      </span>
    </Link>
  );
};

export default RoleSelector;
