import React from 'react';
import { UserProgress } from '../types';
import { 
  Home, 
  Map, 
  Mic, 
  PenTool, 
  Gamepad2, 
  User, 
  Sparkles,
  ChevronRight
} from 'lucide-react';

interface SidebarProps {
  progress: UserProgress;
  activeSection: string;
  onNavigate: (section: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  progress,
  activeSection,
  onNavigate,
}) => {
  const isMl = progress.lang === 'ml';

  const navItems = [
    {
      id: 'home',
      labelEn: 'Home',
      labelMl: 'ഹോം (Home)',
      icon: Home,
      badge: null
    },
    {
      id: 'learn',
      labelEn: 'Learn Path',
      labelMl: 'പഠന പാത (5 Stages)',
      icon: Map,
      badge: `Stage ${progress.unlockedStages}`
    },
    {
      id: 'speaking',
      labelEn: 'Speaking Arena',
      labelMl: 'സ്പീക്കിംഗ് അരീന (AI)',
      icon: Mic,
      badge: 'AI Partner'
    },
    {
      id: 'writing',
      labelEn: 'Writing Studio',
      labelMl: 'റൈറ്റിംഗ് സ്റ്റുഡിയോ',
      icon: PenTool,
      badge: '100 Pts'
    },
    {
      id: 'games',
      labelEn: 'Game Quests',
      labelMl: 'ഗെയിമുകൾ (Quests)',
      icon: Gamepad2,
      badge: 'Vocab & Gram'
    },
    {
      id: 'profile',
      labelEn: 'Profile & Badges',
      labelMl: 'പ്രൊഫൈൽ & നേട്ടങ്ങൾ',
      icon: User,
      badge: null
    }
  ];

  const xpInCurrentLevel = progress.xp % 100;

  return (
    <aside className="hidden lg:flex flex-col w-64 bg-white border-r border-slate-200 min-h-[calc(100vh-4rem)] p-4 shrink-0">
      {/* Navigation Links */}
      <nav className="space-y-1.5 flex-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeSection === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-sm font-semibold transition-all group ${
                isActive
                  ? 'bg-[#4F7CFF] text-white shadow-md shadow-[#4F7CFF]/25'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-5 h-5 transition-transform group-hover:scale-110 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-[#4F7CFF]'}`} />
                <span className={isMl ? 'font-malayalam' : ''}>
                  {isMl ? item.labelMl : item.labelEn}
                </span>
              </div>
              {item.badge && (
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                  isActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'
                }`}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Level Progress Mini Card */}
      <div className="mt-auto p-4 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 text-white shadow-lg">
        <div className="flex items-center justify-between text-xs mb-2 font-medium">
          <span className="flex items-center gap-1.5 text-amber-400 font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            {isMl ? `ലെവൽ ${progress.level}` : `Level ${progress.level}`}
          </span>
          <span className="text-slate-300 tabular-nums">
            {xpInCurrentLevel}/100 XP
          </span>
        </div>
        
        {/* Progress Bar */}
        <div className="w-full bg-slate-700/70 h-2 rounded-full overflow-hidden">
          <div
            className="bg-gradient-to-r from-[#4F7CFF] via-[#8055E8] to-[#37D6A0] h-full rounded-full transition-all duration-500"
            style={{ width: `${Math.min(100, Math.max(5, xpInCurrentLevel))}%` }}
          />
        </div>

        <button
          onClick={() => onNavigate('speaking')}
          className="mt-3.5 w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-semibold text-white transition-colors"
        >
          <span>{isMl ? 'ഇംഗ്ലീഷ് സംസാരിക്കാം' : 'Practice Speaking'}</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </aside>
  );
};
