import React from 'react';
import { UserProgress } from '../types';
import { Home, Mic, PenTool, Gamepad2, User } from 'lucide-react';

interface MobileNavProps {
  progress: UserProgress;
  activeSection: string;
  onNavigate: (section: string) => void;
}

export const MobileNav: React.FC<MobileNavProps> = ({
  progress,
  activeSection,
  onNavigate,
}) => {
  const isMl = progress.lang === 'ml';

  const navTabs = [
    { id: 'home', labelEn: 'Home', labelMl: 'ഹോം', icon: Home },
    { id: 'speaking', labelEn: 'Speaking', labelMl: 'സംസാരം', icon: Mic },
    { id: 'writing', labelEn: 'Writing', labelMl: 'എഴുത്ത്', icon: PenTool },
    { id: 'games', labelEn: 'Games', labelMl: 'ഗെയിംസ്', icon: Gamepad2 },
    { id: 'profile', labelEn: 'Profile', labelMl: 'പ്രൊഫൈൽ', icon: User },
  ];

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 shadow-lg pb-safe">
      <div className="grid grid-cols-5 items-center h-16 max-w-lg mx-auto px-1">
        {navTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeSection === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onNavigate(tab.id)}
              className={`min-h-[44px] min-w-[44px] flex flex-col items-center justify-center py-1 transition-all select-none active:scale-95 ${
                isActive ? 'text-[#4F7CFF]' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <div className={`relative p-1 rounded-full transition-transform ${isActive ? 'scale-110' : ''}`}>
                <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : 'stroke-2'}`} />
                {isActive && (
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 bg-[#4F7CFF] rounded-full" />
                )}
              </div>
              <span className={`text-[10px] font-semibold tracking-tight truncate max-w-full px-0.5 mt-0.5 ${
                isActive ? 'font-bold text-[#4F7CFF]' : 'text-slate-600'
              } ${isMl ? 'font-malayalam' : ''}`}>
                {isMl ? tab.labelMl : tab.labelEn}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
