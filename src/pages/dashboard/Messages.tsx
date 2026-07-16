import { useState, useEffect } from 'react';
import { Search, Star, Inbox as InboxIcon, Send, AlertCircle, X, Reply, Trash2 } from 'lucide-react';
import { apiClient } from '../../services/api/client';
import { useLocaleStore } from '../../store/useLocaleStore';
import { useAuthStore } from '../../store/useAuthStore';
import { motion, AnimatePresence } from 'framer-motion';

export default function Messages() {
  const [messages, setMessages] = useState<any[]>([]);
  const [selectedMessage, setSelectedMessage] = useState<any | null>(null);
  const [isComposeOpen, setIsComposeOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { t, locale } = useLocaleStore();
  const { activeRole } = useAuthStore();

  const getRoleMockMessages = () => {
    switch (activeRole) {
      case 'editor':
      case 'super_admin':
        return [
          { id: '1', sender: 'Dr. Ayşe Yılmaz', email: 'ayse.yilmaz@university.edu.tr', subject: 'New Submission: Deep Learning in Medicine', preview: 'A new manuscript has been submitted to the AI section...', content: 'Dear Editor,\n\nI have submitted my latest manuscript titled "Deep Learning in Medicine" to the AI section. Please review the attached files and let me know if any further changes are required.\n\nBest regards,\nDr. Ayşe Yılmaz', date: '10:45 AM', unread: true },
          { id: '2', sender: 'System', email: 'noreply@novaijournal.com', subject: 'Weekly Analytics Report', preview: 'Your journal received 15 new submissions this week. Acceptance rate is at 23%.', content: 'Hello,\n\nHere is your weekly analytics report:\n- New Submissions: 15\n- Acceptance Rate: 23%\n- Pending Reviews: 8\n\nPlease log in to the dashboard to see detailed insights.', date: 'Yesterday', unread: false },
          { id: '3', sender: 'Prof. John Doe', email: 'j.doe@institute.org', subject: 'Review Completed', preview: 'I have submitted my review for the manuscript #1042.', content: 'Dear Editor,\n\nI have completed the review for manuscript #1042. I recommend a major revision. Detailed comments are attached in the system.\n\nRegards,\nProf. John Doe', date: 'Oct 12', unread: false }
        ];
      case 'author':
        return [
          { id: '1', sender: 'Editorial Office', email: 'editor@novaijournal.com', subject: 'Manuscript Received', preview: 'We have successfully received your submission titled "Quantum Computing Advances".', content: 'Dear Author,\n\nWe have successfully received your submission titled "Quantum Computing Advances". It is currently undergoing preliminary checks. You will be notified once it is assigned to reviewers.\n\nSincerely,\nEditorial Office', date: '09:00 AM', unread: true },
          { id: '2', sender: 'System Notification', email: 'noreply@novaijournal.com', subject: 'ORCID Verification Successful', preview: 'Your ORCID profile has been successfully linked to your account.', content: 'Hello,\n\nYour ORCID profile has been successfully linked and verified. This will be visible on all your future publications.\n\nThanks.', date: 'Yesterday', unread: false }
        ];
      case 'reviewer':
        return [
          { id: '1', sender: 'Managing Editor', email: 'managing@novaijournal.com', subject: 'Invitation to Review', preview: 'We would like to invite you to review a new manuscript in your field of expertise.', content: 'Dear Reviewer,\n\nBased on your expertise, we would like to invite you to review a new manuscript titled "Advanced Materials in Engineering". Please log in to accept or decline the invitation.\n\nBest,\nManaging Editor', date: '11:30 AM', unread: true },
          { id: '2', sender: 'System Notification', email: 'noreply@novaijournal.com', subject: 'Reminder: Review Due in 3 Days', preview: 'This is a gentle reminder that your review for manuscript #892 is due soon.', content: 'Hello,\n\nThis is a gentle reminder that your review for manuscript #892 is due in 3 days. Please submit your comments as soon as possible.\n\nThanks.', date: '2 Days Ago', unread: false },
          { id: '3', sender: 'Editorial Office', email: 'editor@novaijournal.com', subject: 'Thank You for Reviewing', preview: 'Thank you for your valuable contribution and timely review of the previous manuscript.', content: 'Dear Reviewer,\n\nThank you for your valuable contribution and timely review of the manuscript. Your efforts help maintain the high quality of our journal.\n\nSincerely,\nEditorial Office', date: 'Last Week', unread: false }
        ];
      case 'layout_editor':
        return [
          { id: '1', sender: 'Chief Editor', email: 'chief@novaijournal.com', subject: 'Issue #45 Ready for Typesetting', preview: 'All articles for Issue #45 have been approved. Please begin the galley proofing process.', content: 'Hello,\n\nAll articles for Issue #45 have been approved by the authors. Please begin the galley proofing and typesetting process. Target publication date is next month.\n\nBest,\nChief Editor', date: '08:15 AM', unread: true },
          { id: '2', sender: 'Author (M. Demir)', email: 'm.demir@university.edu', subject: 'Galley Proof Corrections', preview: 'I have reviewed the proofs and highlighted two minor typos on page 4.', content: 'Dear Layout Editor,\n\nI have reviewed the galley proofs. Everything looks great, but I found two minor typos on page 4. I have added sticky notes to the PDF.\n\nRegards,\nM. Demir', date: 'Yesterday', unread: false }
        ];
      default:
        return [];
    }
  };

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await apiClient.get('/api/messages');
        setMessages(response.data);
        setError(null);
      } catch (err: any) {
        console.warn('Failed to fetch messages, falling back to mock data:', err);
        setMessages(getRoleMockMessages());
        setError(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMessages();
  }, [activeRole]);

  const handleSelectMessage = (msg: any) => {
    setSelectedMessage(msg);
    if (msg.unread) {
      setMessages(messages.map(m => m.id === msg.id ? { ...m, unread: false } : m));
    }
  };

  return (
    <div className="h-[calc(100vh-10rem)] bg-white rounded-2xl border border-slate-200 shadow-sm flex overflow-hidden relative">
      {/* Sidebar */}
      <div className="w-64 border-r border-slate-100 flex flex-col bg-slate-50/50 shrink-0">
        <div className="p-4 border-b border-slate-100">
          <button 
            onClick={() => setIsComposeOpen(true)}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 rounded-xl font-bold shadow-md shadow-indigo-200 transition-colors flex justify-center items-center gap-2"
          >
            <Send className="w-4 h-4" /> {t('msg.compose')}
          </button>
        </div>
        <div className="p-2 space-y-1">
          <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg bg-white text-indigo-600 font-bold shadow-sm border border-slate-100">
            <InboxIcon className="w-5 h-5" /> {t('msg.inbox')}
            <span className="ml-auto bg-indigo-100 text-indigo-600 text-xs px-2 py-0.5 rounded-full">{messages.filter(m => m.unread).length || 0}</span>
          </button>
          <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 font-medium hover:bg-slate-100 transition-colors">
            <Send className="w-5 h-5 text-slate-400" /> {t('msg.sent')}
          </button>
          <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 font-medium hover:bg-slate-100 transition-colors">
            <Star className="w-5 h-5 text-slate-400" /> {t('msg.starred')}
          </button>
        </div>
      </div>

      {/* Main Mail List */}
      <div className={`flex flex-col border-r border-slate-100 shrink-0 ${selectedMessage ? 'hidden md:flex w-80 lg:w-96' : 'flex-1'}`}>
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-white shrink-0">
          <div className="relative w-full">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input type="text" placeholder={t('msg.search')} className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all" />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {isLoading ? (
            <div className="p-8 flex justify-center items-center text-slate-400">{t('dashboard.loading')}</div>
          ) : error ? (
            <div className="p-8 flex justify-center items-center text-red-500 gap-2">
              <AlertCircle className="w-5 h-5" /> {error}
            </div>
          ) : messages.length === 0 ? (
            <div className="p-8 flex justify-center items-center text-slate-400">{t('msg.noMessages')}</div>
          ) : (
            messages.map(msg => (
              <div 
                key={msg.id} 
                onClick={() => handleSelectMessage(msg)}
                className={`p-4 border-b border-slate-100 hover:bg-slate-50 cursor-pointer flex gap-4 transition-colors ${msg.unread ? 'bg-indigo-50/30' : ''} ${selectedMessage?.id === msg.id ? 'bg-indigo-50 border-l-4 border-l-indigo-500' : 'border-l-4 border-l-transparent'}`}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className={`text-sm ${msg.unread ? 'font-bold text-slate-900' : 'font-medium text-slate-700'}`}>{msg.sender}</h4>
                    <span className={`text-xs ${msg.unread ? 'font-bold text-indigo-600' : 'text-slate-500'}`}>{msg.date}</span>
                  </div>
                  <h5 className={`text-sm mb-1 ${msg.unread ? 'font-bold text-slate-800' : 'text-slate-700'}`}>{msg.subject}</h5>
                  <p className="text-sm text-slate-500 truncate">{msg.preview || msg.content}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Message Detail Reading Pane */}
      <div className={`flex-1 flex flex-col bg-slate-50/30 ${!selectedMessage ? 'hidden md:flex' : 'flex'}`}>
        {selectedMessage ? (
          <div className="flex-1 flex flex-col h-full overflow-hidden">
            {/* Detail Header */}
            <div className="p-6 border-b border-slate-100 bg-white shrink-0">
              <div className="flex items-start justify-between mb-6">
                <h2 className="text-xl font-bold text-slate-900">{selectedMessage.subject}</h2>
                <div className="flex items-center gap-2">
                  <button className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors tooltip-trigger">
                    <Reply className="w-5 h-5" />
                  </button>
                  <button className="p-2 text-slate-400 hover:text-amber-500 hover:bg-amber-50 rounded-lg transition-colors">
                    <Star className="w-5 h-5" />
                  </button>
                  <button className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-colors" onClick={() => setSelectedMessage(null)}>
                    <Trash2 className="w-5 h-5" />
                  </button>
                  {/* Mobile Back Button */}
                  <button className="md:hidden p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors ml-2" onClick={() => setSelectedMessage(null)}>
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg shadow-sm">
                  {selectedMessage.sender.charAt(0)}
                </div>
                <div>
                  <h4 className="font-bold text-slate-900">{selectedMessage.sender}</h4>
                  <p className="text-sm text-slate-500">{selectedMessage.email || 'noreply@novaijournal.com'}</p>
                </div>
                <div className="ml-auto text-sm text-slate-500 flex items-center gap-2">
                  {selectedMessage.date}
                </div>
              </div>
            </div>

            {/* Detail Body */}
            <div className="p-8 overflow-y-auto flex-1 text-slate-700 whitespace-pre-wrap leading-relaxed">
              {selectedMessage.content}
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-slate-400">
            <InboxIcon className="w-16 h-16 text-slate-200 mb-4" />
            <p className="font-medium text-slate-500">{locale === 'tr' ? 'Okumak için bir mesaj seçin' : 'Select a message to read'}</p>
          </div>
        )}
      </div>

      {/* Compose Modal */}
      <AnimatePresence>
        {isComposeOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden border border-slate-200"
            >
              <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
                <h3 className="font-bold text-slate-800">{locale === 'tr' ? 'Yeni Mesaj' : 'New Message'}</h3>
                <button onClick={() => setIsComposeOpen(false)} className="text-slate-400 hover:text-slate-700 transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-6 space-y-4">
                <div className="flex items-center border-b border-slate-100 pb-2">
                  <span className="text-slate-400 text-sm font-medium w-16">{locale === 'tr' ? 'Kime:' : 'To:'}</span>
                  <input type="text" className="flex-1 bg-transparent border-none focus:ring-0 text-slate-800" placeholder="editor@novaijournal.com" />
                </div>
                <div className="flex items-center border-b border-slate-100 pb-2">
                  <span className="text-slate-400 text-sm font-medium w-16">{locale === 'tr' ? 'Konu:' : 'Subject:'}</span>
                  <input type="text" className="flex-1 bg-transparent border-none focus:ring-0 text-slate-800 font-medium" placeholder={locale === 'tr' ? 'Mesajınızın konusu...' : 'Subject of your message...'} />
                </div>
                <div className="pt-2">
                  <textarea 
                    className="w-full h-48 bg-transparent border-none focus:ring-0 text-slate-700 resize-none" 
                    placeholder={locale === 'tr' ? 'Mesajınızı buraya yazın...' : 'Write your message here...'}
                  />
                </div>
              </div>
              <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-between items-center">
                <button onClick={() => setIsComposeOpen(false)} className="px-4 py-2 text-slate-600 font-medium hover:bg-slate-200 rounded-lg transition-colors">
                  {locale === 'tr' ? 'İptal' : 'Cancel'}
                </button>
                <button onClick={() => setIsComposeOpen(false)} className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg transition-colors shadow-md shadow-indigo-200 flex items-center gap-2">
                  <Send className="w-4 h-4" /> {locale === 'tr' ? 'Gönder' : 'Send'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
