import { Button } from '@/components/ui/button';
import { 
  Home, 
  FileText, 
  BarChart3, 
  Bell, 
  HelpCircle,
  Menu,
  X
} from 'lucide-react';
import { useState } from 'react';

interface NavigationProps {
  currentPage: string;
  onPageChange: (page: string) => void;
}

const navItems = [
  { id: 'dashboard', label: 'Accueil', icon: Home },
  { id: 'report', label: 'Signaler', icon: FileText },
  { id: 'alerts', label: 'Alertes', icon: Bell },
  { id: 'help', label: 'Que faire ?', icon: HelpCircle }
];

export default function Navigation({ currentPage, onPageChange }: NavigationProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <>
      {/* Navigation desktop - barre latérale */}
      <div className="hidden md:flex flex-col w-64 bg-primary text-primary-foreground p-4 space-y-2">
        <div className="mb-6">
          <h2 className="text-xl font-bold">ClimAlert</h2>
          <p className="text-sm text-primary-foreground/80">Navigation</p>
        </div>
        
        {navItems.map((item) => {
          const IconComponent = item.icon;
          return (
            <Button
              key={item.id}
              variant={currentPage === item.id ? "secondary" : "ghost"}
              className={`justify-start gap-2 ${
                currentPage === item.id 
                  ? "bg-secondary text-secondary-foreground" 
                  : "text-primary-foreground hover:bg-primary-foreground/10"
              }`}
              onClick={() => onPageChange(item.id)}
            >
              <IconComponent className="w-4 h-4" />
              {item.label}
            </Button>
          );
        })}
      </div>

      {/* Navigation mobile - barre du bas */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-primary border-t border-primary-foreground/20 z-50">
        <div className="grid grid-cols-4 gap-1 p-2">
          {navItems.map((item) => {
            const IconComponent = item.icon;
            return (
              <Button
                key={item.id}
                variant="ghost"
                className={`h-16 flex-col gap-1 ${
                  currentPage === item.id 
                    ? "bg-secondary text-secondary-foreground" 
                    : "text-primary-foreground hover:bg-primary-foreground/10"
                }`}
                onClick={() => onPageChange(item.id)}
              >
                <IconComponent className="w-5 h-5" />
                <span className="text-xs">{item.label}</span>
              </Button>
            );
          })}
        </div>
      </div>

      {/* Header mobile */}
      <div className="md:hidden bg-primary text-primary-foreground p-4 flex items-center justify-between">
        <h1 className="text-xl font-bold">ClimAlert</h1>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="text-primary-foreground"
        >
          {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </Button>
      </div>

      {/* Menu mobile déroulant */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-primary text-primary-foreground border-b border-primary-foreground/20">
          <div className="p-4 space-y-2">
            {navItems.map((item) => {
              const IconComponent = item.icon;
              return (
                <Button
                  key={item.id}
                  variant={currentPage === item.id ? "secondary" : "ghost"}
                  className={`w-full justify-start gap-2 ${
                    currentPage === item.id 
                      ? "bg-secondary text-secondary-foreground" 
                      : "text-primary-foreground hover:bg-primary-foreground/10"
                  }`}
                  onClick={() => {
                    onPageChange(item.id);
                    setIsMobileMenuOpen(false);
                  }}
                >
                  <IconComponent className="w-4 h-4" />
                  {item.label}
                </Button>
              );
            })}
          </div>
        </div>
      )}
    </>
  );
}