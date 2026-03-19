import React, { useEffect } from 'react';
import { useAppStore } from '../store';
import { cn } from '../lib/utils';
import { 
  FileText, 
  Wand2, 
  PenTool, 
  Filter, 
  FileCheck, 
  Settings,
  TerminalSquare
} from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export function Layout({ children, activeTab, setActiveTab }: LayoutProps) {
  const { theme, isDarkMode, language } = useAppStore();

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(isDarkMode ? 'dark' : 'light');
    
    // Remove all theme classes
    const themeClasses = Array.from(root.classList).filter(c => c.startsWith('theme-'));
    themeClasses.forEach(c => root.classList.remove(c));
    
    // Add current theme class
    root.classList.add(`theme-${theme}`);
  }, [theme, isDarkMode]);

  const navItems = [
    { id: 'ingestion', label: language === 'en' ? 'Doc Ingestion' : '文件匯入', icon: FileText },
    { id: 'generator', label: language === 'en' ? 'Guidance Gen' : '指引生成', icon: Wand2 },
    { id: 'editor', label: language === 'en' ? 'MD Editor & Agent' : '編輯器與代理', icon: PenTool },
    { id: 'triage', label: language === 'en' ? 'Submission Triage' : '案件分類', icon: Filter },
    { id: 'report', label: language === 'en' ? 'Review Report' : '審查報告', icon: FileCheck },
    { id: 'settings', label: language === 'en' ? 'Settings' : '設定', icon: Settings },
  ];

  return (
    <div className="flex h-screen w-full bg-background text-foreground overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 border-r border-border bg-card flex flex-col">
        <div className="p-6 border-b border-border">
          <h1 className="text-xl font-bold text-primary flex items-center gap-2">
            <Wand2 className="w-6 h-6" />
            SmartMed 3.0
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            {language === 'en' ? 'Regulatory Review System' : '智慧醫材審查系統'}
          </p>
        </div>
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors",
                  isActive 
                    ? "bg-primary text-primary-foreground" 
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                )}
              >
                <Icon className="w-5 h-5" />
                {item.label}
              </button>
            );
          })}
        </nav>
        <div className="p-4 border-t border-border">
          <button 
            onClick={() => setActiveTab('terminal')}
            className={cn(
              "w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors",
              activeTab === 'terminal'
                ? "bg-primary text-primary-foreground" 
                : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
            )}
          >
            <TerminalSquare className="w-5 h-5" />
            {language === 'en' ? 'Telemetry' : '遙測終端'}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-full overflow-hidden bg-muted/20">
        <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-6xl mx-auto h-full">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
