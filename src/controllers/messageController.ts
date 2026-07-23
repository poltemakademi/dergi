import type { Response } from 'express';
import type { AuthRequest } from '../middlewares/authMiddleware';

export interface MessageItem {
  id: string;
  sender: string;
  email: string;
  subject: string;
  content: string;
  preview: string;
  date: string;
  unread: boolean;
  starred: boolean;
  folder: 'inbox' | 'sent' | 'starred';
  recipientId?: string;
  senderId?: string;
  replyToId?: string;
  replies?: Array<{
    id: string;
    sender: string;
    email: string;
    content: string;
    date: string;
  }>;
}

// In-memory mock store initialized with realistic journal platform messages
let inMemoryMessages: MessageItem[] = [
  {
    id: 'msg-101',
    sender: 'Prof. Dr. Ahmet Yılmaz (Baş Editör)',
    email: 'editor@poltemakademi.com',
    subject: 'Makale Hakem Değerlendirme Süreci Tamamlandı',
    content: 'Sayın Araştırmacı,\n\n"Yapay Zeka Destekli Dergi Yönetim Sistemleri" başlıklı makalenizin hakem değerlendirme süreci tamamlanmıştır. Hakem raporları sistem üzerinden erişilebilir durumdadır.\n\nLütfen revizyon taleplerini en geç 15 gün içerisinde tamamlayıp sisteme tekrar yükleyiniz.\n\nİyi çalışmalar dileriz.\nPoltem Akademi Dergi Editörlüğü',
    preview: 'Sayın Araştırmacı, makalenizin hakem değerlendirme süreci tamamlanmıştır...',
    date: '10:45',
    unread: true,
    starred: true,
    folder: 'inbox',
    replies: []
  },
  {
    id: 'msg-102',
    sender: 'Sistem Bildirimi',
    email: 'system@poltemakademi.com',
    subject: 'Yeni Hakemlik Daveti',
    content: 'Sayın Değerlendirici,\n\nUzmanlık alanınızla ilgili yeni bir makale değerlendirme davetiniz bulunmaktadır. Lütfen kabul/red durumunuzu 3 gün içerisinde panelinizden bildiriniz.\n\nTeşekkürler.',
    preview: 'Uzmanlık alanınızla ilgili yeni bir makale değerlendirme davetiniz bulunmaktadır...',
    date: 'Dün, 16:30',
    unread: false,
    starred: false,
    folder: 'inbox',
    replies: []
  },
  {
    id: 'msg-103',
    sender: 'Doç. Dr. Ayşe Kaya (Bölüm Editörü)',
    email: 'ayse.kaya@poltemakademi.com',
    subject: 'Cilt 4 Sayı 2 Ön Kontrol Onayı',
    content: 'Merhaba,\n\nGöndermiş olduğunuz taslak makale format ve etik kurallar açısından uygun bulunmuştur. İşlem sırasına alınmıştır.\n\nSaygılarımla.',
    preview: 'Göndermiş olduğunuz taslak makale format ve etik kurallar açısından uygun bulunmuştur...',
    date: '18 Tem',
    unread: false,
    starred: true,
    folder: 'inbox',
    replies: []
  },
  {
    id: 'msg-104',
    sender: 'Ben (Siz)',
    email: 'user@poltemakademi.com',
    subject: 'Revize Makale Yüklemesi Hakkında',
    content: 'Sayın Editör,\n\nİstenilen revizyonlar yapılmış ve sisteme yüklenmiştir. Hakem önerileri doğrultusunda metin içi düzeltmeler kırmızı renkle işaretlenmiştir.\n\nBilgilerinize sunarım.',
    preview: 'Sayın Editör, İstenilen revizyonlar yapılmış ve sisteme yüklenmiştir...',
    date: '15 Tem',
    unread: false,
    starred: false,
    folder: 'sent',
    replies: []
  }
];

export const getMessages = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const folder = (req.query.folder as string) || 'inbox';
    const searchQuery = ((req.query.q as string) || (req.query.search as string) || '').toLowerCase().trim();

    let filtered = inMemoryMessages.filter((msg) => {
      if (folder === 'starred') {
        return msg.starred;
      }
      return msg.folder === folder;
    });

    if (searchQuery) {
      filtered = filtered.filter(
        (msg) =>
          msg.sender.toLowerCase().includes(searchQuery) ||
          msg.subject.toLowerCase().includes(searchQuery) ||
          msg.content.toLowerCase().includes(searchQuery)
      );
    }

    res.status(200).json(filtered);
  } catch (err: any) {
    res.status(500).json({ error: 'Internal server error', details: err.message });
  }
};

export const getRecipients = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userRole = (req.user as any)?.role || (req.user as any)?.roles?.[0]?.role || 'reviewer';

    // Official Editorial Contacts available for Authors and Reviewers
    const officialContacts = [
      { id: 'rec-1', name: 'Dergi Baş Editörlüğü', role: 'Baş Editör', email: 'editor@poltemakademi.com' },
      { id: 'rec-2', name: 'Alan / Bölüm Editörlüğü Desk', role: 'Bölüm Editörü', email: 'ayse.kaya@poltemakademi.com' },
      { id: 'rec-4', name: 'Yayın Kurulu ve Teknik Destek', role: 'Teknik Destek', email: 'support@poltemakademi.com' }
    ];

    // Editors and Admins can also access the reviewer coordination desk
    if (userRole === 'editor' || userRole === 'admin') {
      officialContacts.push({
        id: 'rec-3',
        name: 'Hakem Kurulu Koordinasyon Masası',
        role: 'Hakem Koordinasyon',
        email: 'reviewer.desk@poltemakademi.com'
      });
    }

    res.status(200).json(officialContacts);
  } catch (err: any) {
    res.status(500).json({ error: 'Internal server error', details: err.message });
  }
};

export const sendMessage = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { to, subject, content, sender, replyToId } = req.body;

    if (!to || !subject || !content) {
      res.status(400).json({ error: 'Missing required message fields' });
      return;
    }

    const replyObject = {
      id: `reply-${Date.now()}`,
      sender: sender || req.user?.name || 'Ben (Siz)',
      email: req.user?.email || 'user@poltemakademi.com',
      content,
      date: 'Şimdi'
    };

    // If replyToId is provided, append to parent message's replies thread
    if (replyToId) {
      const parent = inMemoryMessages.find((m) => m.id === replyToId);
      if (parent) {
        if (!parent.replies) parent.replies = [];
        parent.replies.push(replyObject);
      }
    } else {
      // Check if there is a parent message with matching subject or email
      const cleanSubject = subject.replace(/^Re:\s*/i, '').trim();
      const parent = inMemoryMessages.find((m) => m.subject.includes(cleanSubject));
      if (parent) {
        if (!parent.replies) parent.replies = [];
        parent.replies.push(replyObject);
      }
    }

    const newMessage: MessageItem = {
      id: `msg-${Date.now()}`,
      sender: sender || req.user?.name || 'Ben (Siz)',
      email: to,
      subject,
      content,
      preview: content.length > 80 ? content.slice(0, 80) + '...' : content,
      date: 'Şimdi',
      unread: false,
      starred: false,
      folder: 'sent',
      replies: []
    };

    inMemoryMessages.unshift(newMessage);

    res.status(201).json({ message: 'Message sent successfully', data: newMessage, reply: replyObject });
  } catch (err: any) {
    res.status(500).json({ error: 'Internal server error', details: err.message });
  }
};

export const deleteMessage = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    inMemoryMessages = inMemoryMessages.filter((m) => m.id !== id);
    res.status(200).json({ message: 'Message deleted successfully', id });
  } catch (err: any) {
    res.status(500).json({ error: 'Internal server error', details: err.message });
  }
};

export const starMessage = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const msg = inMemoryMessages.find((m) => m.id === id);
    if (msg) {
      msg.starred = !msg.starred;
    }
    res.status(200).json({ message: 'Star state toggled', data: msg });
  } catch (err: any) {
    res.status(500).json({ error: 'Internal server error', details: err.message });
  }
};

export const markAsRead = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const msg = inMemoryMessages.find((m) => m.id === id);
    if (msg) {
      msg.unread = false;
    }
    res.status(200).json({ message: 'Message marked as read', data: msg });
  } catch (err: any) {
    res.status(500).json({ error: 'Internal server error', details: err.message });
  }
};
