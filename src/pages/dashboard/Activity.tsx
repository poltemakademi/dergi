import { useState } from 'react';
import { Bell, Check, Info, AlertTriangle, CheckCircle, Clock, Filter, Trash2 } from 'lucide-react';
import { useSSE, type Notification } from '../../hooks/useSSE';
import { motion } from 'framer-motion';
import { apiClient } from '../../services/api/client';
import { useLocaleStore } from '../../store/useLocaleStore';
import { useApiMutation } from '../../hooks/useApiMutation';

export default function Activity() {
  const { notifications, unreadCount, markAsRead, markAllAsRead, refresh } = useSSE();
  const [filter, setFilter] = useState<'ALL' | 'UNREAD'>('ALL');
  const { t, locale } = useLocaleStore();

  const { mutate: clearHistoryMutation, isLoading: isDeleting } = useApiMutation('/api/notifications', {
    method: 'DELETE',
    onSuccess: () => {
      refresh();
    },
    showSuccessToast: locale === 'tr' ? 'Bildirim geçmişi temizlendi.' : 'Notification history cleared.'
  });

  const filteredNotifications = notifications.filter(n => filter === 'ALL' || !n.isRead);

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
      case 'INFO': return 'bg-indigo-50/50 border-l-4 border-indigo-500';
      case 'SUCCESS': return 'bg-emerald-50/50 border-l-4 border-emerald-500';
      case 'WARNING': return 'bg-amber-50/50 border-l-4 border-amber-500';
      case 'ERROR': return 'bg-rose-50/50 border-l-4 border-rose-500';
      default: return 'bg-slate-50/50 border-l-4 border-slate-500';
    }
  };

  const clearAllHistory = async () => {
    if (!window.confirm(locale === 'tr' ? 'Tüm bildirim geçmişini silmek istediğinize emin misiniz?' : 'Are you sure you want to clear all notification history?')) return;
    clearHistoryMutation();
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-black text-slate-800 flex items-center gap-3">
            <Bell className="w-7 h-7 text-indigo-500" />
            {t('activity.title')}
          </h2>
          <p className="text-slate-500 mt-1">{locale === 'tr' ? 'Son platform aktivitelerinizi ve uyarılarınızı inceleyin.' : 'Review your recent platform activity and alerts.'}</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="flex bg-slate-100 p-1 rounded-lg">
            <button 
              onClick={() => setFilter('ALL')}
              className={`px-4 py-1.5 text-sm font-bold rounded-md transition-colors ${filter === 'ALL' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              {locale === 'tr' ? 'Tümü' : 'All'}
            </button>
            <button 
              onClick={() => setFilter('UNREAD')}
              className={`px-4 py-1.5 text-sm font-bold rounded-md transition-colors flex items-center gap-2 ${filter === 'UNREAD' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              {locale === 'tr' ? 'Okunmamış' : 'Unread'}
              {unreadCount > 0 && (
                <span className="bg-rose-500 text-white text-[10px] px-1.5 py-0.5 rounded-full">{unreadCount}</span>
              )}
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-2 text-sm font-medium text-slate-600">
            <Filter className="w-4 h-4" /> {locale === 'tr' ? `${filteredNotifications.length} öğe gösteriliyor` : `Showing ${filteredNotifications.length} items`}
          </div>
          <div className="flex items-center gap-4">
            {unreadCount > 0 && (
              <button 
                onClick={markAllAsRead}
                className="text-sm font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1.5 transition-colors"
              >
                <Check className="w-4 h-4" /> {locale === 'tr' ? 'Tümünü okundu işaretle' : 'Mark all read'}
              </button>
            )}
            <button 
              onClick={clearAllHistory}
              disabled={isDeleting || notifications.length === 0}
              className="text-sm font-semibold text-rose-500 hover:text-rose-600 flex items-center gap-1.5 transition-colors disabled:opacity-50"
            >
              <Trash2 className="w-4 h-4" /> {locale === 'tr' ? 'Geçmişi Temizle' : 'Clear History'}
            </button>
          </div>
        </div>

        {filteredNotifications.length === 0 ? (
          <div className="p-16 text-center flex flex-col items-center justify-center">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
              <Bell className="w-8 h-8 text-slate-300" />
            </div>
            <h3 className="text-lg font-bold text-slate-700">{locale === 'tr' ? 'Bildirim Yok' : 'No Notifications'}</h3>
            <p className="text-slate-500 mt-1">{locale === 'tr' ? 'Her şey yolunda! Yeni aktiviteler burada görünecektir.' : "You're all caught up! New activity will appear here."}</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {filteredNotifications.map((notification) => (
              <motion.div 
                key={notification.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                onClick={() => !notification.isRead && markAsRead(notification.id)}
                className={`p-6 flex items-start gap-4 cursor-pointer transition-colors ${getBgColor(notification.type, notification.isRead)}`}
              >
                <div className="shrink-0 mt-1">
                  {getIcon(notification.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 mb-2">
                    <h4 className={`text-base font-bold ${notification.isRead ? 'text-slate-700' : 'text-slate-900'}`}>
                      {notification.title}
                    </h4>
                    <span className="text-xs font-semibold text-slate-500 shrink-0 flex items-center gap-1.5 bg-slate-100 px-2.5 py-1 rounded-md w-fit">
                      <Clock className="w-3.5 h-3.5" /> {new Date(notification.createdAt).toLocaleString()}
                    </span>
                  </div>
                  <p className={`text-sm ${notification.isRead ? 'text-slate-500' : 'text-slate-700 font-medium'}`}>
                    {notification.message}
                  </p>
                  
                  {/* Visual Context Tags */}
                  {(notification.roleContext || notification.alertType) && (
                    <div className="flex flex-wrap items-center gap-2 mt-3">
                      {notification.roleContext && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold tracking-wide uppercase bg-slate-100 text-slate-600 border border-slate-200">
                          {locale === 'tr' ? 'Rol' : 'Role'}: {notification.roleContext}
                        </span>
                      )}
                      {notification.alertType && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold tracking-wide uppercase bg-indigo-50 text-indigo-600 border border-indigo-100/50">
                          {locale === 'tr' ? 'Tür' : 'Type'}: {notification.alertType}
                        </span>
                      )}
                    </div>
                  )}
                </div>
                {!notification.isRead && (
                  <div className="shrink-0 flex items-center justify-center h-full ml-4">
                    <div className="w-2.5 h-2.5 rounded-full bg-indigo-500 shadow-sm shadow-indigo-500/50"></div>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
