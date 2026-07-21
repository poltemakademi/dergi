import { useState } from 'react';
import { Search, Star, Inbox as InboxIcon, Send, AlertCircle, X, Reply, Trash2, Loader2, ArrowLeft, Plus } from 'lucide-react';
import { useLocaleStore } from '../../store/useLocaleStore';
import { useAuthStore } from '../../store/useAuthStore';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { useApiQuery } from '../../hooks/useApiQuery';
import { useApiMutation } from '../../hooks/useApiMutation';

export default function Messages() {
  const [selectedMessage, setSelectedMessage] = useState<any | null>(null);
  const [isComposeOpen, setIsComposeOpen] = useState(false);
  const { t, locale } = useLocaleStore();
  const { activeRole, user } = useAuthStore();
  const [folder, setFolder] = useState<'inbox' | 'sent' | 'starred'>('inbox');
  const [searchQuery, setSearchQuery] = useState('');
  
  const { data: messages = [], isLoading, error, refetch } = useApiQuery<any[]>({
    url: '/api/messages',
    params: { folder, q: searchQuery }
  });

  const { data: recipients = [] } = useApiQuery<any[]>({
    url: '/api/messages/recipients'
  });

  const { mutate: sendMessage, isLoading: isSending } = useApiMutation('/api/messages', {
    method: 'POST',
    onSuccess: () => {
      setIsComposeOpen(false);
      setComposeTo('');
      setComposeSubject('');
      setComposeContent('');
      refetch();
    },
    showSuccessToast: locale === 'tr' ? 'Mesajınız başarıyla gönderildi' : 'Message sent successfully'
  });

  const { mutate: deleteMessage } = useApiMutation<{ id: string }, any>(
    (payload) => `/api/messages/${payload.id}`, 
    { method: 'DELETE', onSuccess: () => { setSelectedMessage(null); refetch(); }, showSuccessToast: true }
  );

  const { mutate: starMessage } = useApiMutation<{ id: string }, any>(
    (payload) => `/api/messages/${payload.id}/star`, 
    { method: 'PATCH', onSuccess: () => refetch(), showSuccessToast: false }
  );
  
  const { mutate: markAsRead } = useApiMutation<{ id: string }, any>(
    (payload) => `/api/messages/${payload.id}/read`, 
    { method: 'PATCH', onSuccess: () => refetch(), showSuccessToast: false, showErrorToast: false }
  );

  const [composeTo, setComposeTo] = useState('');
  const [composeSubject, setComposeSubject] = useState('');
  const [composeContent, setComposeContent] = useState('');

  const handleSendMessage = () => {
    if (!composeTo || !composeSubject || !composeContent) {
      toast.error(locale === 'tr' ? 'Lütfen tüm alanları doldurun' : 'Please fill all fields');
      return;
    }
    sendMessage({ to: composeTo, subject: composeSubject, content: composeContent, sender: user?.name || activeRole });
  };

  const handleSelectMessage = (msg: any) => {
    setSelectedMessage(msg);
    if (msg.unread) {
      markAsRead({ id: msg.id });
    }
  };

  const handleDelete = () => {
    if (selectedMessage) {
      deleteMessage({ id: selectedMessage.id });
    }
  };

  const handleStar = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    starMessage({ id });
  };

  const handleReply = () => {
    if (selectedMessage) {
      setComposeTo(selectedMessage.email || selectedMessage.sender);
      setComposeSubject(`Re: ${selectedMessage.subject}`);
      setIsComposeOpen(true);
    }
  };

  return (
    <div className="h-[calc(100vh-7.5rem)] sm:h-[calc(100vh-10rem)] bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col lg:flex-row overflow-hidden relative">
      
      {/* Desktop Sidebar (visible >= lg) */}
      <div className="hidden lg:flex w-64 border-r border-slate-100 flex-col bg-slate-50/50 shrink-0">
        <div className="p-4 border-b border-slate-100">
          <button 
            onClick={() => setIsComposeOpen(true)}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 rounded-xl font-bold shadow-md shadow-indigo-200 transition-all flex justify-center items-center gap-2 active:scale-95"
          >
            <Send className="w-4 h-4" /> {t('msg.compose')}
          </button>
        </div>
        <div className="p-2 space-y-1">
          <button 
            onClick={() => setFolder('inbox')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg font-bold transition-colors ${folder === 'inbox' ? 'bg-white text-indigo-600 shadow-sm border border-slate-100' : 'text-slate-600 hover:bg-slate-100'}`}
          >
            <InboxIcon className="w-5 h-5" /> {t('msg.inbox')}
          </button>
          <button 
            onClick={() => setFolder('sent')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg font-bold transition-colors ${folder === 'sent' ? 'bg-white text-indigo-600 shadow-sm border border-slate-100' : 'text-slate-600 hover:bg-slate-100'}`}
          >
            <Send className="w-5 h-5" /> {t('msg.sent')}
          </button>
          <button 
            onClick={() => setFolder('starred')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg font-bold transition-colors ${folder === 'starred' ? 'bg-white text-indigo-600 shadow-sm border border-slate-100' : 'text-slate-600 hover:bg-slate-100'}`}
          >
            <Star className="w-5 h-5" /> {t('msg.starred')}
          </button>
        </div>
      </div>

      {/* Mobile Top Folder Bar & Compose Header (visible < lg when no message selected) */}
      <div className={`lg:hidden border-b border-slate-100 bg-slate-50/80 p-2.5 flex items-center justify-between gap-2 shrink-0 ${selectedMessage ? 'hidden' : 'flex'}`}>
        <div className="flex items-center gap-1.5 overflow-x-auto custom-scrollbar py-0.5">
          <button 
            onClick={() => setFolder('inbox')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${folder === 'inbox' ? 'bg-indigo-600 text-white shadow-sm' : 'bg-white text-slate-600 border border-slate-200/80 hover:bg-slate-100'}`}
          >
            <InboxIcon className="w-3.5 h-3.5" /> {t('msg.inbox')}
          </button>
          <button 
            onClick={() => setFolder('sent')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${folder === 'sent' ? 'bg-indigo-600 text-white shadow-sm' : 'bg-white text-slate-600 border border-slate-200/80 hover:bg-slate-100'}`}
          >
            <Send className="w-3.5 h-3.5" /> {t('msg.sent')}
          </button>
          <button 
            onClick={() => setFolder('starred')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${folder === 'starred' ? 'bg-indigo-600 text-white shadow-sm' : 'bg-white text-slate-600 border border-slate-200/80 hover:bg-slate-100'}`}
          >
            <Star className="w-3.5 h-3.5" /> {t('msg.starred')}
          </button>
        </div>

        <button 
          onClick={() => setIsComposeOpen(true)}
          className="shrink-0 bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1.5 rounded-lg text-xs font-bold shadow-sm flex items-center gap-1 transition-all active:scale-95"
          title={t('msg.compose')}
        >
          <Plus className="w-4 h-4" />
          <span className="hidden xs:inline">{t('msg.compose')}</span>
        </button>
      </div>

      {/* Main Mail List */}
      <div className={`flex flex-col border-r border-slate-100 shrink-0 h-full ${selectedMessage ? 'hidden md:flex w-full md:w-80 lg:w-96' : 'w-full flex-1'}`}>
        <div className="p-3 sm:p-4 border-b border-slate-100 flex items-center justify-between bg-white shrink-0">
          <div className="relative w-full">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t('msg.search')} 
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all" 
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {isLoading ? (
            <div className="p-8 flex justify-center items-center text-slate-400">{t('dashboard.loading')}</div>
          ) : error ? (
            <div className="p-8 flex justify-center items-center text-red-500 gap-2">
              <AlertCircle className="w-5 h-5" /> {error.message || 'Failed to load messages'}
            </div>
          ) : (!messages || messages.length === 0) ? (
            <div className="p-8 flex justify-center items-center text-slate-400">{t('msg.noMessages')}</div>
          ) : (
            messages.map((msg: any) => (
              <div 
                key={msg.id} 
                onClick={() => handleSelectMessage(msg)}
                className={`p-3.5 sm:p-4 border-b border-slate-100 hover:bg-slate-50 cursor-pointer flex gap-3 sm:gap-4 transition-colors ${msg.unread ? 'bg-indigo-50/30' : ''} ${selectedMessage?.id === msg.id ? 'bg-indigo-50 border-l-4 border-l-indigo-500' : 'border-l-4 border-l-transparent'}`}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className={`text-sm truncate ${msg.unread ? 'font-bold text-slate-900' : 'font-medium text-slate-700'}`}>{msg.sender}</h4>
                    <span className={`text-[11px] sm:text-xs shrink-0 ml-2 ${msg.unread ? 'font-bold text-indigo-600' : 'text-slate-500'}`}>{msg.date}</span>
                  </div>
                  <h5 className={`text-sm mb-1 truncate ${msg.unread ? 'font-bold text-slate-800' : 'text-slate-700'}`}>{msg.subject}</h5>
                  <p className="text-xs sm:text-sm text-slate-500 truncate">{msg.preview || msg.content}</p>
                </div>
                <div className="shrink-0 flex items-center">
                  <button onClick={(e) => handleStar(e, msg.id)} className="text-slate-400 hover:text-amber-500 p-1">
                    <Star className={`w-4 h-4 ${msg.starred ? 'fill-amber-500 text-amber-500' : ''}`} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Message Detail Reading Pane */}
      <div className={`flex-1 flex flex-col bg-slate-50/30 h-full ${!selectedMessage ? 'hidden md:flex' : 'flex w-full'}`}>
        {selectedMessage ? (
          <div className="flex-1 flex flex-col h-full overflow-hidden">
            
            {/* Top Toolbar in Detail View */}
            <div className="p-4 sm:p-6 border-b border-slate-100 bg-white shrink-0">
              <div className="flex items-center justify-between gap-2 mb-4">
                
                {/* Mobile Back Button */}
                <button 
                  onClick={() => setSelectedMessage(null)}
                  className="md:hidden inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>{locale === 'tr' ? 'Geri' : 'Back'}</span>
                </button>

                <div className="flex items-center gap-1 sm:gap-2 ml-auto">
                  <button onClick={handleReply} className="p-2 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors" title={locale === 'tr' ? 'Yanıtla' : 'Reply'}>
                    <Reply className="w-5 h-5" />
                  </button>
                  <button onClick={(e) => handleStar(e, selectedMessage.id)} className="p-2 text-slate-500 hover:text-amber-500 hover:bg-amber-50 rounded-lg transition-colors" title={locale === 'tr' ? 'Yıldızla' : 'Star'}>
                    <Star className={`w-5 h-5 ${selectedMessage.starred ? 'fill-amber-500 text-amber-500' : ''}`} />
                  </button>
                  <button onClick={handleDelete} className="p-2 text-slate-500 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-colors" title={locale === 'tr' ? 'Sil' : 'Delete'}>
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <h2 className="text-lg sm:text-xl font-bold text-slate-900 mb-4 leading-tight">{selectedMessage.subject}</h2>
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-base sm:text-lg shadow-sm shrink-0">
                    {selectedMessage.sender?.charAt(0) || 'U'}
                  </div>
                  <div className="overflow-hidden">
                    <h4 className="font-bold text-slate-900 text-sm sm:text-base truncate">{selectedMessage.sender}</h4>
                    <p className="text-xs sm:text-sm text-slate-500 truncate">{selectedMessage.email || 'noreply@novaijournal.com'}</p>
                  </div>
                </div>
                <div className="text-xs text-slate-500 font-medium">
                  {selectedMessage.date}
                </div>
              </div>
            </div>

            <div className="p-4 sm:p-8 overflow-y-auto flex-1 text-slate-700 text-sm sm:text-base whitespace-pre-wrap leading-relaxed">
              {selectedMessage.content}
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-slate-400 p-6">
            <InboxIcon className="w-12 h-12 sm:w-16 sm:h-16 text-slate-200 mb-3 sm:mb-4" />
            <p className="font-medium text-slate-500 text-sm sm:text-base text-center">{locale === 'tr' ? 'Okumak için bir mesaj seçin' : 'Select a message to read'}</p>
          </div>
        )}
      </div>

      {/* Compose Modal */}
      <AnimatePresence>
        {isComposeOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/50 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden border border-slate-200"
            >
              <div className="px-4 sm:px-6 py-3.5 border-b border-slate-100 flex items-center justify-between bg-slate-50 shrink-0">
                <h3 className="font-bold text-slate-800 text-sm sm:text-base">{locale === 'tr' ? 'Yeni Mesaj' : 'New Message'}</h3>
                <button onClick={() => setIsComposeOpen(false)} className="text-slate-400 hover:text-slate-700 p-1 transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="p-4 sm:p-6 space-y-4 overflow-y-auto flex-1">
                <div className="flex items-center border-b border-slate-100 pb-2">
                  <span className="text-slate-400 text-xs sm:text-sm font-medium w-14 sm:w-16 shrink-0">{locale === 'tr' ? 'Kime:' : 'To:'}</span>
                  <select 
                    value={composeTo} 
                    onChange={(e) => setComposeTo(e.target.value)} 
                    className={`flex-1 bg-transparent border-none focus:ring-0 text-xs sm:text-sm ${composeTo ? 'text-slate-800' : 'text-slate-400'}`}
                  >
                    <option value="" disabled>{locale === 'tr' ? 'Alıcı seçin...' : 'Select recipient...'}</option>
                    {recipients && recipients.map((r: any) => (
                      <option key={r.email || r.id} value={r.email || r.id}>{r.name} ({r.role})</option>
                    ))}
                    {composeTo && (!recipients || !recipients.find((r: any) => r.email === composeTo || r.id === composeTo)) && (
                       <option value={composeTo}>{composeTo}</option>
                    )}
                  </select>
                </div>
                <div className="flex items-center border-b border-slate-100 pb-2">
                  <span className="text-slate-400 text-xs sm:text-sm font-medium w-14 sm:w-16 shrink-0">{locale === 'tr' ? 'Konu:' : 'Subject:'}</span>
                  <input type="text" value={composeSubject} onChange={(e) => setComposeSubject(e.target.value)} className="flex-1 bg-transparent border-none focus:ring-0 text-xs sm:text-sm text-slate-800 font-medium" placeholder={locale === 'tr' ? 'Mesajınızın konusu...' : 'Subject of your message...'} />
                </div>
                <div className="pt-2">
                  <textarea 
                    value={composeContent}
                    onChange={(e) => setComposeContent(e.target.value)}
                    className="w-full h-40 sm:h-48 bg-transparent border-none focus:ring-0 text-xs sm:text-sm text-slate-700 resize-none" 
                    placeholder={locale === 'tr' ? 'Mesajınızı buraya yazın...' : 'Write your message here...'}
                  />
                </div>
              </div>

              <div className="px-4 sm:px-6 py-3.5 bg-slate-50 border-t border-slate-100 flex justify-between items-center shrink-0">
                <button onClick={() => setIsComposeOpen(false)} className="px-3 sm:px-4 py-2 text-xs sm:text-sm text-slate-600 font-medium hover:bg-slate-200 rounded-lg transition-colors">
                  {locale === 'tr' ? 'İptal' : 'Cancel'}
                </button>
                <button 
                  onClick={handleSendMessage} 
                  disabled={isSending}
                  className="px-4 sm:px-6 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-xs sm:text-sm rounded-lg transition-all shadow-md shadow-indigo-200 flex items-center gap-2 active:scale-95"
                >
                  {isSending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                  {locale === 'tr' ? 'Gönder' : 'Send'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}

