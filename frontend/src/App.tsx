import { useAuthStore } from '@/store/auth-store';
import { useContentStore } from '@/store/content-store';
import { AuthPage } from '@/components/AuthPage';
import { Sidebar } from '@/components/Sidebar';
import { Dashboard } from '@/components/Dashboard';
import { CalendarView } from '@/components/CalendarView';
import { AILab } from '@/components/AILab';
import { Toaster } from '@/components/ui/sonner';
import './App.css';

function App() {
  const { isAuthenticated } = useAuthStore();
  const { currentView } = useContentStore();

  if (!isAuthenticated) {
    return (
      <>
        <AuthPage />
        <Toaster />
      </>
    );
  }

  const renderCurrentView = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard />;
      case 'calendar':
        return <CalendarView />;
      case 'ai-lab':
        return <AILab />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        {renderCurrentView()}
      </main>
      <Toaster />
    </div>
  );
}

export default App;