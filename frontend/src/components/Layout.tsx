import { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, BarChart3, Settings, LogOut, Menu, X } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';

export const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const { logout } = useAuth();

  const navItems = [
    { path: '/feed', label: 'Transactions', icon: Home },
    { path: '/analytics', label: 'Analytics', icon: BarChart3 },
    { path: '/settings', label: 'Settings', icon: Settings },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen bg-[#131313]">
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          variant="outline"
          className="bg-slate-800 border-slate-600 text-white hover:bg-slate-700"
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
        className={`fixed left-0 top-0 z-40 h-screen w-64 bg-[#0e0e0e] border-r-4 border-black transition-transform duration-300 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0`}
      >
        <div className="flex h-full flex-col">
          <div className="p-6 border-b-4 border-black">
            <h1
              className="text-2xl font-['Lexend'] font-bold text-[#ddb7ff] uppercase tracking-wider"
              style={{ fontFamily: 'Lexend, sans-serif' }}
            >
              SpendWise
            </h1>
            <p
              className="text-sm text-[#888] font-['Public_Sans'] mt-1"
            >
              Your money, plain and simple
            </p>
          </div>

          <nav className="flex-1 space-y-2 p-4">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              return (
                <Link key={item.path} to={item.path} onClick={() => setSidebarOpen(false)}>
                  <div
                    className={`flex items-center gap-3 py-3 px-4 font-['Lexend'] font-bold uppercase tracking-wider transition-all ${
                      active
                        ? 'bg-[#4cd7f6] text-black neo-shadow'
                        : 'text-white hover:bg-[#131313] border-2 border-transparent'
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    {item.label}
                  </div>
                </Link>
              );
            })}
          </nav>

          <div className="p-4 border-t-4 border-black">
            <button
              onClick={logout}
              className="flex items-center gap-3 w-full py-3 px-4 text-[#ff6b6b] hover:bg-[#ff6b6b]/10 font-['Lexend'] font-bold uppercase tracking-wider transition-all"
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