/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { UserProgress, Language } from './types';
import { loadUserProgress, saveUserProgress } from './utils/storage';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { MobileNav } from './components/MobileNav';
import { OnboardingModal } from './components/OnboardingModal';
import { HomeView } from './components/HomeView';
import { LearnView } from './components/LearnView';
import { SpeakingArena } from './components/SpeakingArena';
import { WritingStudio } from './components/WritingStudio';
import { VocabularyGame } from './components/VocabularyGame';
import { GrammarGame } from './components/GrammarGame';
import { ProfileView } from './components/ProfileView';
import { BookOpen, Gamepad2, Layers } from 'lucide-react';

export default function App() {
  const [progress, setProgress] = useState<UserProgress>(loadUserProgress);
  const [activeSection, setActiveSection] = useState<string>('home');
  const [isOnboardingOpen, setIsOnboardingOpen] = useState<boolean>(false);
  const [gameSubTab, setGameSubTab] = useState<'vocab' | 'grammar'>('vocab');

  // Sync to local storage
  useEffect(() => {
    saveUserProgress(progress);
  }, [progress]);

  // Open onboarding on first load if not completed
  useEffect(() => {
    if (!progress.hasCompletedOnboarding) {
      setIsOnboardingOpen(true);
    }
  }, [progress.hasCompletedOnboarding]);

  const handleUpdateProgress = (updater: (prev: UserProgress) => UserProgress) => {
    setProgress((prev) => {
      const updated = updater(prev);
      saveUserProgress(updated);
      return updated;
    });
  };

  const handleLanguageToggle = (lang: Language) => {
    handleUpdateProgress((prev) => ({ ...prev, lang }));
  };

  const isMl = progress.lang === 'ml';

  return (
    <div className="min-h-screen bg-[#F5F7FC] text-[#111827] flex flex-col font-sans">
      {/* Top Navbar */}
      <Navbar
        progress={progress}
        onLanguageToggle={handleLanguageToggle}
        onNavigate={setActiveSection}
        activeSection={activeSection}
      />

      {/* Main Container */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        {/* Desktop Sidebar */}
        <Sidebar
          progress={progress}
          activeSection={activeSection}
          onNavigate={setActiveSection}
        />

        {/* Dynamic Content View Area */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-5xl overflow-y-auto">
          {activeSection === 'home' && (
            <HomeView
              progress={progress}
              onNavigate={setActiveSection}
              onUpdateProgress={handleUpdateProgress}
            />
          )}

          {activeSection === 'learn' && (
            <LearnView
              progress={progress}
              onUpdateProgress={handleUpdateProgress}
              onNavigate={setActiveSection}
            />
          )}

          {activeSection === 'speaking' && (
            <SpeakingArena
              progress={progress}
              onUpdateProgress={handleUpdateProgress}
            />
          )}

          {activeSection === 'writing' && (
            <WritingStudio
              progress={progress}
              onUpdateProgress={handleUpdateProgress}
            />
          )}

          {activeSection === 'games' && (
            <div className="space-y-6">
              {/* Game Sub-Navigation Bar */}
              <div className="flex items-center gap-2 p-1.5 bg-white rounded-2xl border border-slate-200 shadow-xs max-w-md">
                <button
                  onClick={() => setGameSubTab('vocab')}
                  className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                    gameSubTab === 'vocab'
                      ? 'bg-[#4F7CFF] text-white shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <BookOpen className="w-4 h-4" />
                  <span>{isMl ? 'പദസമ്പത്ത് (Vocabulary)' : 'Vocabulary Games'}</span>
                </button>
                <button
                  onClick={() => setGameSubTab('grammar')}
                  className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                    gameSubTab === 'grammar'
                      ? 'bg-[#8055E8] text-white shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Layers className="w-4 h-4" />
                  <span>{isMl ? 'വ്യാകരണം (Grammar)' : 'Grammar Quests'}</span>
                </button>
              </div>

              {gameSubTab === 'vocab' ? (
                <VocabularyGame
                  progress={progress}
                  onUpdateProgress={handleUpdateProgress}
                />
              ) : (
                <GrammarGame
                  progress={progress}
                  onUpdateProgress={handleUpdateProgress}
                />
              )}
            </div>
          )}

          {activeSection === 'profile' && (
            <ProfileView
              progress={progress}
              onUpdateProgress={handleUpdateProgress}
              onOpenOnboarding={() => setIsOnboardingOpen(true)}
            />
          )}
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <MobileNav
        progress={progress}
        activeSection={activeSection}
        onNavigate={setActiveSection}
      />

      {/* Onboarding / Goal Selection Modal */}
      <OnboardingModal
        progress={progress}
        isOpen={isOnboardingOpen}
        onComplete={(updates) => {
          handleUpdateProgress((prev) => ({ ...prev, ...updates }));
          setIsOnboardingOpen(false);
        }}
        onClose={() => setIsOnboardingOpen(false)}
      />
    </div>
  );
}
