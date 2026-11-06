import React from 'react';
import { UserProgress, Language } from '../types';
import { Flame, Zap, Coins, Globe, Compass, User } from 'lucide-react';

interface NavbarProps {
  progress: UserProgress;
  onLanguageToggle: (lang: Language) => void;
  onNavigate: (section: string) => void;
  activeSection: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  progress,
  onLanguageToggle,
  onNavigate,
  activeSection,
}) => {
  const isMl = progress.lang === 'ml';

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Zone 1: Brand Wordmark */}
        <div 
          onClick={() => onNavigate('home')}
          className="flex items-center gap-2.5 cursor-pointer select-none group shrink-0"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#4F7CFF] to-[#8055E8] flex items-center justify-center text-white shadow-md shadow-[#4F7CFF]/20 group-hover:scale-105 transition-transform">
            <Compass className="w-5 h-5 animate-spin-slow" />
          </div>
          <div>
            <div className="text-lg font-extrabold tracking-tight text-[#111827] flex items-center gap-1.5 leading-none">
              <span>ENGLISH</span>
              <span className="text-[#4F7CFF]">QUEST</span>
            </div>
            <p className="text-[11px] font-medium text-slate-500 font-malayalam leading-none mt-1">
              {isMl ? 'മലയാളികൾക്കായി ഇംഗ്ലീഷ്' : 'English for Malayalam Speakers'}
            </p>
          </div>
        </div>

        {/* Zone 2: Gamification Stats Strip */}
        <div className="flex items-center gap-2 sm:gap-4 shrink-0">
          {/* Streak Flame */}
          <div 
            title={isMl ? `തുടർച്ചയായ ${progress.streak} ദിനങ്ങൾ` : `${progress.streak} Day Streak`}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-amber-50 border border-amber-200/70 text-amber-800 text-xs sm:text-sm font-bold"
          >
            <Flame className="w-4 h-4 text-amber-500 fill-amber-500 animate-pulse" />
            <span className="tabular-nums">{progress.streak}</span>
            <span className="hidden sm:inline font-medium text-amber-700/80 text-xs">
              {isMl ? 'ദിനങ്ങൾ' : 'd'}
            </span>
          </div>

          {/* Level & XP */}
          <div 
            title={isMl ? `ലെവൽ ${progress.level} · ${progress.xp} XP` : `Level ${progress.level} · ${progress.xp} XP`}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-blue-50 border border-blue-200/70 text-[#4F7CFF] text-xs sm:text-sm font-bold"
          >
            <Zap className="w-4 h-4 text-[#4F7CFF] fill-[#4F7CFF]" />
            <span className="tabular-nums">{progress.xp}</span>
            <span className="hidden md:inline font-medium text-blue-600/80 text-xs">XP</span>
            <span className="hidden sm:inline-block px-1.5 py-0.5 rounded bg-[#4F7CFF] text-white text-[10px] font-bold">
              Lv {progress.level}
            </span>
          </div>

          {/* Coins */}
          <div 
            title={isMl ? `${progress.coins} കോയിനുകൾ` : `${progress.coins} Coins`}
            className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-emerald-50 border border-emerald-200/70 text-emerald-700 text-xs sm:text-sm font-bold"
          >
            <Coins className="w-4 h-4 text-emerald-500" />
            <span className="tabular-nums">{progress.coins}</span>
          </div>
        </div>

        {/* Zone 3: Language Toggle & User Trigger */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Language Switcher */}
          <button
            onClick={() => onLanguageToggle(isMl ? 'en' : 'ml')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 hover:border-slate-300 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-semibold transition-all active:scale-95"
            title="Toggle Language / ഭാഷ മാറ്റുക"
          >
            <Globe className="w-3.5 h-3.5 text-[#4F7CFF]" />
            <span className="font-bold">{isMl ? 'മലയാളം' : 'English'}</span>
          </button>

          {/* Profile Trigger */}
          <button
            onClick={() => onNavigate('profile')}
            className={`flex items-center gap-2 p-1.5 sm:px-3 sm:py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeSection === 'profile'
                ? 'bg-[#4F7CFF] text-white shadow-sm'
                : 'text-slate-700 hover:bg-slate-100'
            }`}
          >
            <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-[#8055E8] to-[#4F7CFF] flex items-center justify-center text-white text-xs font-bold">
              {progress.userName ? progress.userName.charAt(0).toUpperCase() : <User className="w-4 h-4" />}
            </div>
            <span className="hidden md:inline max-w-[100px] truncate">
              {progress.userName || (isMl ? 'പ്രൊഫൈൽ' : 'Profile')}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
};
