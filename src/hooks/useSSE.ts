import { useState, useEffect, useCallback } from 'react';
import { apiClient } from '../services/api/client';
import { useAuthStore } from '../store/useAuthStore';

export interface Notification {
  id: string;
  type: 'INFO' | 'SUCCESS' | 'WARNING' | 'ERROR';
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  roleContext?: string;
  alertType?: string;
}

export function useSSE() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isConnected, setIsConnected] = useState(false);
  const { user } = useAuthStore();

  const fetchNotifications = useCallback(async () => {
    if (!user) return;
    try {
      const response = await apiClient.get('/api/notifications?limit=15');
      setNotifications(response.data);
      setUnreadCount(response.data.filter((n: Notification) => !n.isRead).length);
    } catch (error) {
      console.error('Failed to fetch notifications via polling:', error);
    }
  }, [user]);

  useEffect(() => {
    if (!user) return;

    // Initial fetch
    fetchNotifications();

    let eventSource: EventSource | null = null;
    let fallbackInterval: ReturnType<typeof setInterval> | null = null;

    const connectSSE = () => {
      // Assuming SSE endpoint exists at /api/notifications/stream
      // We pass the JWT token in URL or cookies. Note: EventSource doesn't support custom headers easily without a polyfill.
      // If we use cookies, this is fine. If not, we rely on the polling fallback.
      const sseUrl = `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'}/api/notifications/stream`;
      
      try {
        eventSource = new EventSource(sseUrl, { withCredentials: true });

        eventSource.onopen = () => {
          setIsConnected(true);
          if (fallbackInterval) {
            clearInterval(fallbackInterval);
            fallbackInterval = null;
          }
        };

        eventSource.onmessage = (event) => {
          try {
            const newNotification = JSON.parse(event.data);
            setNotifications(prev => [newNotification, ...prev]);
            setUnreadCount(prev => prev + 1);
          } catch (e) {
            console.error('Error parsing SSE message:', e);
          }
        };

        eventSource.onerror = () => {
          setIsConnected(false);
          eventSource?.close();
          // Fallback to polling every 30 seconds if SSE fails
          if (!fallbackInterval) {
            fallbackInterval = setInterval(fetchNotifications, 30000);
          }
          // Try to reconnect SSE after 10 seconds
          setTimeout(connectSSE, 10000);
        };
      } catch (err) {
        console.warn('SSE initialization failed, falling back to polling:', err);
        if (!fallbackInterval) {
          fallbackInterval = setInterval(fetchNotifications, 30000);
        }
      }
    };

    // If you don't actually have an SSE backend ready yet, you can comment `connectSSE()` 
    // out and just use the interval polling immediately.
    // connectSSE();
    fallbackInterval = setInterval(fetchNotifications, 30000);

    return () => {
      if (eventSource) {
        eventSource.close();
      }
      if (fallbackInterval) {
        clearInterval(fallbackInterval);
      }
    };
  }, [user, fetchNotifications]);

  const markAsRead = async (id: string) => {
    try {
      await apiClient.patch(`/api/notifications/${id}/read`);
      setNotifications(prev => 
        prev.map(n => n.id === id ? { ...n, isRead: true } : n)
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await apiClient.patch('/api/notifications/read-all');
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch (error) {
      console.error('Failed to mark all as read:', error);
    }
  };

  return {
    notifications,
    unreadCount,
    isConnected,
    markAsRead,
    markAllAsRead,
    refresh: fetchNotifications
  };
}
