import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from './lib/firebase';
import { useUserProfile } from './hooks/useUserProfile';
import { canAccessCommunity } from './utils/permissions';
import { Header } from './components/Header';
import { Story } from './pages/Story';
import { ForecastWizard } from './pages/ForecastWizard';
import { ManagePositions } from './pages/ManagePositions';
import { AdminPanel } from './pages/AdminPanel';
import { Community } from './pages/Community';
import { Profile } from './pages/Profile';
import { ThemeToggle } from './components/ThemeToggle';
import { Footer } from './components/Footer';
import { usePageScroll } from './hooks/usePageScroll';

function AppContent() {
  const [user] = useAuthState(auth);
  const { profile } = useUserProfile();
  usePageScroll(); // Add the scroll hook here

  return (
    <div className="min-h-screen bg-white dark:bg-dark-bg transition-colors flex flex-col">
      <ThemeToggle />
      <Header />
      <main className="pt-[73px]">
        <Routes>
          <Route path="/" element={<ForecastWizard />} />
          <Route path="/story" element={<Story />} />
          {canAccessCommunity(profile) && <Route path="/community" element={<Community />} />}
          <Route path="/manage" element={<ManagePositions />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/admin" element={<AdminPanel />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;