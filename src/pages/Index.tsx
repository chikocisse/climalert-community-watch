import { useState } from 'react';
import LoginPage from '@/components/LoginPage';
import DashboardPage from '@/components/DashboardPage';
import ReportPage from '@/components/ReportPage';
import AlertsPage from '@/components/AlertsPage';
import HelpPage from '@/components/HelpPage';
import Navigation from '@/components/Navigation';

const Index = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentPage, setCurrentPage] = useState('dashboard');

  if (!isLoggedIn) {
    return <LoginPage onLogin={() => setIsLoggedIn(true)} />;
  }

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <DashboardPage />;
      case 'report':
        return <ReportPage />;
      case 'alerts':
        return <AlertsPage />;
      case 'help':
        return <HelpPage />;
      default:
        return <DashboardPage />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="md:flex">
        <Navigation currentPage={currentPage} onPageChange={setCurrentPage} />
        <div className="flex-1">
          {renderCurrentPage()}
        </div>
      </div>
    </div>
  );
};

export default Index;
