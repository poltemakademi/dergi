import { useState, useRef, useEffect } from 'react';
import { Bell, Check, Info, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import { useSSE, type Notification } from '../hooks/useSSE';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

export default function NotificationDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useSSE();
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const getIcon = (type: Notification['type']) => {
    switch (type) {
      case 'INFO': return <Info className="w-5 h-5 text-indigo-500" />;
      case 'SUCCESS': return <CheckCircle className="w-5 h-5 text-emerald-500" />;
      case 'WARNING': return <AlertTriangle className="w-5 h-5 text-amber-500" />;
      case 'ERROR': return <AlertTriangle className="w-5 h-5 text-rose-500" />;
      default: return <Bell className="w-5 h-5 text-slate-500" />;
    }
  };

  const getBgColor = (type: Notification['type'], isRead: boolean) => {
    if (isRead) return 'bg-white hover:bg-slate-50';
    switch (type) {
      case 'INFO': return 'bg-indigo-50/50 hover:bg-indigo-50';
      case 'SUCCESS': return 'bg-emerald-50/50 hover:bg-emerald-50';
      case 'WARNING': return 'bg-amber-50/50 hover:bg-amber-50';
      case 'ERROR': return 'bg-rose-50/50 hover:bg-rose-50';
      default: return 'bg-slate-50/50 hover:bg-slate-50';
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="relative text-slate-400 hover:text-slate-900 transition-colors p-2 rounded-lg hover:bg-slate-50"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full border border-white"></span>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute -right-2 sm:right-0 mt-2 w-[calc(100vw-2rem)] max-w-xs sm:max-w-sm sm:w-96 bg-white rounded-2xl shadow-xl border border-slate-200/80 overflow-hidden z-50 origin-top-right"
          >
            <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <h3 className="font-bold text-slate-800">Notifications</h3>
              {unreadCount > 0 && (
                <button 
                  onClick={markAllAsRead}
                  className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1 transition-colors"
                >
                  <Check className="w-3.5 h-3.5" /> Mark all as read
                </button>
              )}
            </div>

            <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
              {notifications.length === 0 ? (
                <div className="p-8 text-center text-slate-500 flex flex-col items-center gap-2">
                  <Bell className="w-8 h-8 text-slate-300" />
                  <p>No notifications yet</p>
                </div>
              ) : (
                <div className="divide-y divide-slate-100">
                  {notifications.slice(0, 10).map((notification) => (
                    <div 
                      key={notification.id}
                      onClick={() => !notification.isRead && markAsRead(notification.id)}
                      className={`p-4 flex gap-3 cursor-pointer transition-colors ${getBgColor(notification.type, notification.isRead)}`}
                    >
                      <div className="shrink-0 mt-0.5">
                        {getIcon(notification.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start gap-2 mb-1">
                          <p className={`text-sm font-semibold truncate ${notification.isRead ? 'text-slate-700' : 'text-slate-900'}`}>
                            {notification.title}
                          </p>
                          <span className="text-[10px] font-medium text-slate-400 shrink-0 flex items-center gap-1 mt-0.5">
                            <Clock className="w-3 h-3" /> {formatTime(notification.createdAt)}
                          </span>
                        </div>
                        <p className={`text-xs line-clamp-2 ${notification.isRead ? 'text-slate-500' : 'text-slate-600 font-medium'}`}>
                          {notification.message}
                        </p>
                      </div>
                      {!notification.isRead && (
                        <div className="shrink-0 flex items-center">
                          <div className="w-2 h-2 rounded-full bg-indigo-500"></div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="p-3 border-t border-slate-100 text-center bg-slate-50/50">
              <Link 
                to="/dashboard/activity" 
                onClick={() => setIsOpen(false)}
                className="text-xs font-bold text-slate-600 hover:text-indigo-600 transition-colors"
              >
                View all activity
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
