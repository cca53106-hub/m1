/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { LanguageProvider } from './context/LanguageContext.tsx';
import { AuthProvider } from './context/AuthContext.tsx';
import Navbar from './components/Navbar.tsx';
import Hero from './components/Hero.tsx';
import Leadership from './components/Leadership.tsx';
import Features from './components/Features.tsx';
import Courses from './components/Courses.tsx';
import Faculty from './components/Faculty.tsx';
import Achievements from './components/Achievements.tsx';
import Contact from './components/Contact.tsx';
import Footer from './components/Footer.tsx';
import SatiricalTutor from './components/SatiricalTutor.tsx';
import FunnyNewsTicker from './components/FunnyNewsTicker.tsx';
import FeesCalculator from './components/FeesCalculator.tsx';
import InstallPrompt from './components/InstallPrompt.tsx';
import NotificationManager from './components/NotificationManager.tsx';
import AdminPanel from './components/AdminPanel.tsx';

export default function App() {
  const [isAdminOpen, setIsAdminOpen] = React.useState(false);

  // Global handler for hidden admin trigger
  React.useEffect(() => {
    const handleAdminOpen = () => setIsAdminOpen(true);
    window.addEventListener('open-admin', handleAdminOpen);
    return () => window.removeEventListener('open-admin', handleAdminOpen);
  }, []);

  return (
    <AuthProvider>
      <LanguageProvider>
        <div className="min-h-screen bg-base font-sans text-text-main selection:bg-accent/20 selection:text-primary-dark transition-colors duration-300">
          <FunnyNewsTicker />
          <Navbar />
          <main>
            <Hero />
            <Leadership />
            <Features />
            <Courses />
            <Faculty />
            <Achievements />
            <Contact />
          </main>
          <Footer />
          <SatiricalTutor />
          <FeesCalculator />
          <InstallPrompt />
          <NotificationManager />
          <AdminPanel isOpen={isAdminOpen} onClose={() => setIsAdminOpen(false)} />
        </div>
      </LanguageProvider>
    </AuthProvider>
  );
}
