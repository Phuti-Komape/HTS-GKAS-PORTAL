/* ═══════════════════════════════════════════════════════════
   IN-APP NOTIFICATION SERVICE
   Read / Mark as Read / Dismissal Flow, Unread Count Badges,
   and Real-time Event Subscription for GKAS & HTS Residence
═══════════════════════════════════════════════════════════ */

import type { StudentNotification, NotificationType } from '../types/portal.js';

class NotificationService {
  private notifications: StudentNotification[] = [
    {
      id: 'notif-001',
      user_id: 'usr_student',
      title: '2027 Lease Agreement Ready',
      message: 'Your official 2027 residence lease agreement has been counter-signed for GKAS Room G-14.',
      type: 'success',
      link_url: '/portal/lease',
      is_read: false,
      created_at: '2027-02-01T08:00:00Z'
    },
    {
      id: 'notif-002',
      user_id: 'usr_student',
      title: 'Move-in Condition Inspection',
      message: 'Please complete your digital photographic room inventory check within 48 hours of arrival.',
      type: 'action_required',
      link_url: '/portal/movein',
      is_read: false,
      created_at: '2027-02-01T09:30:00Z'
    },
    {
      id: 'notif-003',
      user_id: 'usr_student',
      title: 'NSFAS Top-Up Grant Approved',
      message: 'Institutional bursary top-up allocation BUR-2027-089 has been verified and processed.',
      type: 'info',
      link_url: '/portal/bursary',
      is_read: true,
      read_at: '2027-02-02T11:20:00Z',
      created_at: '2027-01-28T14:15:00Z'
    }
  ];

  private listeners: Array<() => void> = [];

  constructor() {
    this.loadFromStorage();
  }

  private loadFromStorage() {
    try {
      const stored = localStorage.getItem('gkas_portal_notifications');
      if (stored) {
        this.notifications = JSON.parse(stored);
      }
    } catch (e) {}
  }

  private saveToStorage() {
    try {
      localStorage.setItem('gkas_portal_notifications', JSON.stringify(this.notifications));
    } catch (e) {}
    this.notify();
  }

  public subscribe(cb: () => void) {
    this.listeners.push(cb);
    return () => {
      this.listeners = this.listeners.filter(l => l !== cb);
    };
  }

  private notify() {
    this.listeners.forEach(cb => {
      try { cb(); } catch (e) {}
    });
  }

  public getNotifications(userId?: string): StudentNotification[] {
    if (!userId) return [...this.notifications];
    return this.notifications.filter(n => n.user_id === userId || n.user_id === 'all');
  }

  public getUnreadNotifications(userId?: string): StudentNotification[] {
    return this.getNotifications(userId).filter(n => !n.is_read);
  }

  public getUnreadCount(userId?: string): number {
    return this.getUnreadNotifications(userId).length;
  }

  public markNotificationAsRead(notificationId: string): boolean {
    const item = this.notifications.find(n => n.id === notificationId);
    if (item) {
      item.is_read = true;
      item.read_at = new Date().toISOString();
      this.saveToStorage();
      return true;
    }
    return false;
  }

  public markAllNotificationsAsRead(userId?: string): void {
    this.notifications.forEach(n => {
      if (!userId || n.user_id === userId || n.user_id === 'all') {
        n.is_read = true;
        n.read_at = new Date().toISOString();
      }
    });
    this.saveToStorage();
  }

  public createNotification(params: {
    user_id: string;
    title: string;
    message: string;
    type?: NotificationType;
    link_url?: string;
  }): StudentNotification {
    const newNotif: StudentNotification = {
      id: `notif-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      user_id: params.user_id,
      title: params.title,
      message: params.message,
      type: params.type || 'info',
      link_url: params.link_url,
      is_read: false,
      created_at: new Date().toISOString()
    };
    this.notifications.unshift(newNotif);
    this.saveToStorage();
    return newNotif;
  }
}

export const notificationService = new NotificationService();
