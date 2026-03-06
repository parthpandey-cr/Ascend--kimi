import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { LandingPage } from '@/sections/LandingPage';
import { OnboardingFlow } from '@/sections/OnboardingFlow';
import { Dashboard } from '@/sections/Dashboard';
import type { UserProfile, DayData, AppState } from '@/types';
import { generateEmptyDayData } from '@/lib/constants';
import { Toaster } from '@/components/ui/sonner';

function App() {
  const [appState, setAppState] = useState<AppState>({
    currentView: 'landing',
    userProfile: null,
    currentDate: new Date().toISOString().split('T')[0],
    selectedDate: new Date().toISOString().split('T')[0],
    dayData: generateEmptyDayData(new Date().toISOString().split('T')[0]),
    weeklyData: { weekStart: '', days: [] },
  });

  // Load user profile from localStorage on mount
  useEffect(() => {
    const savedProfile = localStorage.getItem('timeOS_profile');
    if (savedProfile) {
      const profile: UserProfile = JSON.parse(savedProfile);
      setAppState(prev => ({
        ...prev,
        userProfile: profile,
        currentView: 'dashboard',
      }));
    }
  }, []);

  const handleStartOnboarding = () => {
    setAppState(prev => ({ ...prev, currentView: 'onboarding' }));
  };

  const handleCompleteOnboarding = (profile: UserProfile) => {
    localStorage.setItem('timeOS_profile', JSON.stringify(profile));
    setAppState(prev => ({
      ...prev,
      userProfile: profile,
      currentView: 'dashboard',
    }));
  };

  const handleUpdateDayData = (dayData: DayData) => {
    setAppState(prev => ({ ...prev, dayData }));
  };

  const handleLogout = () => {
    localStorage.removeItem('timeOS_profile');
    setAppState({
      currentView: 'landing',
      userProfile: null,
      currentDate: new Date().toISOString().split('T')[0],
      selectedDate: new Date().toISOString().split('T')[0],
      dayData: generateEmptyDayData(new Date().toISOString().split('T')[0]),
      weeklyData: { weekStart: '', days: [] },
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <AnimatePresence mode="wait">
        {appState.currentView === 'landing' && (
          <motion.div
            key="landing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <LandingPage onStart={handleStartOnboarding} />
          </motion.div>
        )}

        {appState.currentView === 'onboarding' && (
          <motion.div
            key="onboarding"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            <OnboardingFlow onComplete={handleCompleteOnboarding} />
          </motion.div>
        )}

        {appState.currentView === 'dashboard' && appState.userProfile && (
          <motion.div
            key="dashboard"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Dashboard
              userProfile={appState.userProfile}
              dayData={appState.dayData}
              onUpdateDayData={handleUpdateDayData}
              onLogout={handleLogout}
            />
          </motion.div>
        )}
      </AnimatePresence>
      <Toaster />
    </div>
  );
}

export default App;
