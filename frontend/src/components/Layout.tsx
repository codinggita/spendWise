import { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, BarChart3, Settings, LogOut, Menu, X, Sun, Moon, Monitor } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/context/ThemeContext';

export const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const { logout } = useAuth();
  const { theme, setTheme } = useTheme();

  const navItems = [
    { path: '/feed', label: 'Transactions', icon: Home },
    { path: '/analytics', label: 'Analytics', icon: BarChart3 },
    { path: '/settings', label: 'Settings', icon: Settings },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          variant="outline"
          className="bg-card border-black text-foreground hover:bg-surface-high"
        >
          {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 z-40 h-screen w-64 bg-card border-r-4 border-black transition-all duration-300 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0`}
      >
        <div className="flex h-full flex-col">
          <div className="p-6 border-b-4 border-black">
            <h1
              className="text-2xl font-['Lexend'] font-bold text-primary uppercase tracking-wider"
              style={{ fontFamily: 'Lexend, sans-serif' }}
            >
              SpendWise
            </h1>
            <p
              className="text-sm text-muted-foreground font-['Public_Sans'] mt-1"
            >
              Your money, plain and simple
            </p>
          </div>

          <nav className="flex-1 space-y-2 p-4 overflow-y-auto">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              return (
                <Link key={item.path} to={item.path} onClick={() => setSidebarOpen(false)}>
                  <div
                    className={`flex items-center gap-3 py-3 px-4 font-['Lexend'] font-bold uppercase tracking-wider transition-all ${
                      active
                        ? 'bg-secondary text-secondary-foreground neo-shadow-sm border-2 border-black'
                        : 'text-foreground hover:bg-surface-high border-2 border-transparent'
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    {item.label}
                  </div>
                </Link>
              );
            })}
          </nav>

          {/* Theme Switcher in Sidebar */}
          <div className="p-4 border-t-4 border-black space-y-4">
            <div className="space-y-2">
              <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground px-2">Color Key</p>
              <div className="grid grid-cols-2 gap-2 px-2">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-expense border border-black"></div>
                  <span className="text-[10px] font-bold uppercase text-foreground">Expense (-)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-income border border-black"></div>
                  <span className="text-[10px] font-bold uppercase text-foreground">Income (+)</span>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground px-2">Theme Mode</p>
              <div className="flex gap-1 bg-background border-2 border-black p-1">
              <button
                onClick={() => setTheme('light')}
                className={`flex-1 flex justify-center py-2 transition-all ${theme === 'light' ? 'bg-tertiary text-tertiary-foreground' : 'text-muted-foreground hover:bg-surface-high'}`}
                title="Light Mode"
              >
                <Sun className="h-4 w-4" />
              </button>
              <button
                onClick={() => setTheme('dark')}
                className={`flex-1 flex justify-center py-2 transition-all ${theme === 'dark' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-surface-high'}`}
                title="Dark Mode"
              >
                <Moon className="h-4 w-4" />
              </button>
              <button
                onClick={() => setTheme('system')}
                className={`flex-1 flex justify-center py-2 transition-all ${theme === 'system' ? 'bg-secondary text-secondary-foreground' : 'text-muted-foreground hover:bg-surface-high'}`}
                title="System Mode"
              >
                <Monitor className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

          <div className="p-4 border-t-4 border-black">
            <button
              onClick={logout}
              className="flex items-center gap-3 w-full py-3 px-4 text-destructive hover:bg-destructive/10 font-['Lexend'] font-bold uppercase tracking-wider transition-all"
            >
              <LogOut className="h-5 w-5" />
              Logout
            </button>
          </div>
        </div>
      </aside>

      <motion.main
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
        className="lg:ml-64 p-8 pt-16 lg:pt-8"
      >
        <Outlet />
      </motion.main>
    </div>
  );
};

export default Layout;