
import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, ListOrdered, Briefcase, Settings, Bell, Search, Gavel, User } from 'lucide-react';
import { Role } from '../../types';

interface LayoutProps {
  role: Role;
}

const Layout: React.FC<LayoutProps> = ({ role }) => {
  const location = useLocation();

  const navItems = {
    JUDGE: [
      { path: '/judge/dashboard', label: 'Dashboard', icon: LayoutDashboard },
      { path: '/judge/cause-list', label: 'Cause List', icon: ListOrdered },
    ],
    LAWYER: [
      { path: '/lawyer/dashboard', label: 'My Cases', icon: Briefcase },
    ],
    ADMIN: [
      { path: '/admin/dashboard', label: 'Analytics', icon: LayoutDashboard },
    ],
  };

  const currentNav = navItems[role] || [];

  return (
    <div className="min-h-screen bg-[#0b0d10] flex text-slate-200">
      {/* Sidebar */}
      <aside className="w-64 border-r border-white/10 bg-[#0f1115]/50 backdrop-blur-xl flex flex-col fixed h-full z-20">
        <div className="p-8 flex items-center gap-3">
          <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
            <Gavel className="text-black w-6 h-6" />
          </div>
          <span className="font-bold text-xl tracking-tighter">SMART<br/><span className="text-sm font-light text-slate-400">COURTS</span></span>
        </div>

        <nav className="flex-1 px-4 py-4 space-y-2">
          {currentNav.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  isActive 
                    ? 'bg-white/10 text-white border border-white/10 shadow-lg' 
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon size={20} />
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/5">
          <Link to="/" className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-white transition-colors">
            <User size={20} />
            <span className="text-sm">Switch Role</span>
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64 min-h-screen relative">
        <header className="h-20 border-b border-white/10 flex items-center justify-between px-10 bg-[#0b0d10]/80 backdrop-blur-md sticky top-0 z-10">
          <div className="flex items-center gap-6 flex-1">
            <div className="relative max-w-md w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
              <input 
                type="text" 
                placeholder="Search case numbers, parties..." 
                className="w-full bg-white/5 border border-white/10 rounded-full py-2 pl-10 pr-4 focus:outline-none focus:border-white/20 text-sm transition-all"
              />
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <span className={`px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase ${
                role === 'JUDGE' ? 'bg-indigo-500/20 text-indigo-400' :
                role === 'ADMIN' ? 'bg-emerald-500/20 text-emerald-400' :
                'bg-amber-500/20 text-amber-400'
              }`}>
                {role} MODE
              </span>
            </div>
            <button className="relative text-slate-400 hover:text-white transition-colors">
              <Bell size={20} />
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            <div className="h-8 w-8 bg-gradient-to-tr from-slate-700 to-slate-500 rounded-full flex items-center justify-center border border-white/20">
              <span className="text-xs font-bold">{role[0]}</span>
            </div>
          </div>
        </header>

        <div className="p-10">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Layout;
