import React from 'react';
import { useApp } from '../context/AppContext';
import { cn } from '../utils/cn';

interface LayoutProps {
  children: React.ReactNode;
  onNavigateToMyBookings?: () => void;
  onNavigateHome?: () => void;
  currentRoute?: string;
}

export const Layout: React.FC<LayoutProps> = ({ 
    children, 
    onNavigateToMyBookings, 
    onNavigateHome,
    currentRoute 
}) => {
  const { role, setRole, notifications, removeNotification } = useApp();

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      {/* Navbar */}
      <nav className="bg-indigo-600 shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center space-x-8">
              <a 
                href="#" 
                onClick={(e) => { e.preventDefault(); onNavigateHome?.(); }}
                className="flex-shrink-0 flex items-center"
              >
               <span className="text-white text-xl font-bold tracking-tight">ModexTix</span>
              </a>

              {role === 'USER' && (
                  <div className="hidden md:flex space-x-4">
                      <button 
                        onClick={onNavigateHome}
                        className={cn("px-3 py-2 rounded-md text-sm font-medium transition-colors", currentRoute === 'HOME' ? "bg-indigo-700 text-white" : "text-indigo-100 hover:bg-indigo-500")}
                      >
                        Events
                      </button>
                      <button 
                        onClick={onNavigateToMyBookings}
                        className={cn("px-3 py-2 rounded-md text-sm font-medium transition-colors", currentRoute === 'MY_BOOKINGS' ? "bg-indigo-700 text-white" : "text-indigo-100 hover:bg-indigo-500")}
                      >
                        My Bookings
                      </button>
                  </div>
              )}
            </div>
            
            <div className="flex space-x-4">
              <button
                onClick={() => setRole('USER')}
                className={cn(
                  "px-3 py-2 rounded-md text-sm font-medium transition-colors",
                  role === 'USER' ? "bg-indigo-800 text-white" : "text-indigo-100 hover:bg-indigo-500"
                )}
              >
                <span className="flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                    User
                </span>
              </button>
              <button
                onClick={() => setRole('ADMIN')}
                className={cn(
                  "px-3 py-2 rounded-md text-sm font-medium transition-colors",
                  role === 'ADMIN' ? "bg-indigo-800 text-white" : "text-indigo-100 hover:bg-indigo-500"
                )}
              >
                <span className="flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                    Admin
                </span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>

      {/* Notifications Toast */}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
        {notifications.map((n) => (
          <div
            key={n.id}
            className={cn(
              "px-4 py-3 rounded-lg shadow-lg text-white text-sm font-medium flex items-center justify-between min-w-[300px] animate-fade-in-up",
              n.type === 'success' ? "bg-green-600" : "bg-red-600"
            )}
          >
            <span>{n.message}</span>
            <button
              onClick={() => removeNotification(n.id)}
              className="ml-4 text-white/80 hover:text-white"
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};