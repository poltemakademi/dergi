import { useState } from 'react';
import { Search, Star, Inbox as InboxIcon, Send, AlertCircle, X, Reply, Trash2, Loader2, ArrowLeft, Plus, Clock, MessageSquare } from 'lucide-react';
import { useLocaleStore } from '../../store/useLocaleStore';
import { useAuthStore } from '../../store/useAuthStore';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { useApiQuery } from '../../hooks/useApiQuery';
import { useApiMutation } from '../../hooks/useApiMutation';

export default function Messages() {
  const [selectedMessage, setSelectedMessage] = useState<any | null>(null);
  const [isComposeOpen, setIsComposeOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const { t, locale } = useLocaleStore();
  const { activeRole, user } = useAuthStore();
  const [folder, setFolder] = useState<'inbox' | 'sent' | 'starred'>('inbox');
  const [searchQuery, setSearchQuery] = useState('');

  const [composeTo, setComposeTo] = useState('');
  const [composeSubject, setComposeSubject] = useState('');
  const [composeContent, setComposeContent] = useState('');

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
    { 
      method: 'DELETE', 
      onSuccess: () => { 
        setSelectedMessage(null); 
        setIsDeleteConfirmOpen(false);
        refetch(); 
      }, 
      showSuccessToast: locale === 'tr' ? 'Mesaj silindi' : 'Message deleted' 
    }
  );

  const { mutate: starMessage } = useApiMutation<{ id: string }, any>(
    (payload) => `/api/messages/${payload.id}/star`, 
    { method: 'PATCH', onSuccess: () => refetch(), showSuccessToast: false }
  );
  
  const { mutate: markAsRead } = useApiMutation<{ id: string }, any>(
    (payload) => `/api/messages/${payload.id}/read`, 
    { method: 'PATCH', onSuccess: () => refetch(), showSuccessToast: false, showErrorToast: false }
  );

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

  const handleDeleteClick = () => {
    if (selectedMessage) {
      setIsDeleteConfirmOpen(true);
    }
  };

  const confirmDelete = () => {
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
    <div className="h-[calc(100vh-7rem)] sm:h-[calc(100vh-9.5rem)] bg-white rounded-2xl border border-slate-200 shadow-xl flex flex-col lg:flex-row overflow-hidden relative">
      
      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {isDeleteConfirmOpen && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/20 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }}
              className="bg-white rounded-2xl p-6 shadow-2xl max-w-sm w-full border border-slate-200"
            >
              <h3 className="font-bold text-lg text-slate-900 mb-2">{locale === 'tr' ? 'Mesajı sil' : 'Delete Message'}</h3>
              <p className="text-slate-600 text-sm mb-6">{locale === 'tr' ? 'Bu mesajı silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.' : 'Are you sure you want to delete this message? This action cannot be undone.'}</p>
              <div className="flex gap-3">
                <button onClick={() => setIsDeleteConfirmOpen(false)} className="flex-1 px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-xl font-bold text-sm text-slate-700">{locale === 'tr' ? 'İptal' : 'Cancel'}</button>
                <button onClick={confirmDelete} className="flex-1 px-4 py-2 bg-rose-600 hover:bg-rose-700 rounded-xl font-bold text-sm text-white">{locale === 'tr' ? 'Sil' : 'Delete'}</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Desktop Navigation Sidebar (visible >= lg) */}
      <div className="hidden lg:flex w-64 border-r border-slate-200/80 flex-col bg-slate-50/70 shrink-0">
        <div className="p-4 border-b border-slate-200/80">
          <button 
            onClick={() => setIsComposeOpen(true)}
            className="w-full bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white py-3 rounded-xl font-bold shadow-md shadow-indigo-200 transition-all flex justify-center items-center gap-2 active:scale-95 text-sm"
          >
            <Send className="w-4 h-4" /> {t('msg.compose')}
          </button>
        </div>
        <div className="p-3 space-y-1.5 flex-1">
          <button 
            onClick={() => setFolder('inbox')}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-semibold text-sm transition-all ${folder === 'inbox' ? 'bg-white text-indigo-600 shadow-sm border border-slate-200/80 font-bold' : 'text-slate-600 hover:bg-slate-200/50'}`}
          >
            <div className="flex items-center gap-3">
              <InboxIcon className="w-4 h-4" /> {t('msg.inbox')}
            </div>
            <span className="text-xs bg-indigo-50 text-indigo-600 font-bold px-2 py-0.5 rounded-full border border-indigo-100">3</span>
          </button>
          <button 
            onClick={() => setFolder('sent')}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-semibold text-sm transition-all ${folder === 'sent' ? 'bg-white text-indigo-600 shadow-sm border border-slate-200/80 font-bold' : 'text-slate-600 hover:bg-slate-200/50'}`}
          >
            <Send className="w-4 h-4" /> {t('msg.sent')}
          </button>
          <button 
            onClick={() => setFolder('starred')}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-semibold text-sm transition-all ${folder === 'starred' ? 'bg-white text-indigo-600 shadow-sm border border-slate-200/80 font-bold' : 'text-slate-600 hover:bg-slate-200/50'}`}
          >
            <Star className="w-4 h-4" /> {t('msg.starred')}
          </button>
        </div>
      </div>

      {/* Mobile Folder Top Navigation (< lg when no message selected) */}
      <div className={`lg:hidden border-b border-slate-200/80 bg-slate-50/90 p-2.5 flex items-center justify-between gap-2 shrink-0 ${selectedMessage ? 'hidden' : 'flex'}`}>
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
          className="shrink-0 bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1.5 rounded-lg text-xs font-bold shadow-sm flex items-center gap-1.5 transition-all active:scale-95"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>{locale === 'tr' ? 'Yaz' : 'New'}</span>
        </button>
      </div>

      {/* Main Mail List Pane */}
      <div className={`flex flex-col border-r border-slate-200/80 shrink-0 h-full ${selectedMessage ? 'hidden lg:flex w-80 lg:w-96' : 'w-full flex-1'}`}>
        <div className="p-3 sm:p-4 border-b border-slate-200/80 flex items-center justify-between bg-white shrink-0">
          <div className="relative w-full">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t('msg.search')} 
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all placeholder:text-slate-400" 
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar divide-y divide-slate-100">
          {isLoading ? (
            <div className="p-8 flex justify-center items-center text-slate-400 text-sm font-medium">{t('dashboard.loading')}</div>
          ) : error ? (
            <div className="p-8 flex justify-center items-center text-rose-500 text-sm gap-2">
              <AlertCircle className="w-5 h-5" /> {error.message || 'Failed to load messages'}
            </div>
          ) : (!messages || messages.length === 0) ? (
            <div className="p-8 flex flex-col justify-center items-center text-slate-400 gap-2">
              <MessageSquare className="w-8 h-8 text-slate-300" />
              <p className="text-sm font-medium">{t('msg.noMessages')}</p>
            </div>
          ) : (
            messages.map((msg: any) => (
              <div 
                key={msg.id} 
                onClick={() => handleSelectMessage(msg)}
                className={`p-3.5 sm:p-4 hover:bg-slate-50 cursor-pointer flex gap-3 sm:gap-3.5 transition-all ${msg.unread ? 'bg-indigo-50/20' : ''} ${selectedMessage?.id === msg.id ? 'bg-indigo-50/60 border-l-4 border-l-indigo-600' : 'border-l-4 border-l-transparent'}`}
              >
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-500 to-indigo-600 text-white font-bold flex items-center justify-center text-xs shrink-0 shadow-sm mt-0.5">
                  {msg.sender?.charAt(0) || 'U'}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1 gap-2">
                    <h4 className={`text-xs sm:text-sm truncate ${msg.unread ? 'font-bold text-slate-900' : 'font-medium text-slate-700'}`}>{msg.sender}</h4>
                    <span className={`text-[10px] sm:text-xs shrink-0 ${msg.unread ? 'font-bold text-indigo-600' : 'text-slate-400'}`}>{msg.date}</span>
                  </div>
                  <h5 className={`text-xs sm:text-sm mb-1 truncate ${msg.unread ? 'font-bold text-slate-900' : 'text-slate-700'}`}>{msg.subject}</h5>
                  <p className="text-xs text-slate-500 truncate">{msg.preview || msg.content}</p>
                </div>
                <div className="shrink-0 flex items-center">
                  <button onClick={(e) => handleStar(e, msg.id)} className="text-slate-300 hover:text-amber-500 p-1 transition-colors">
                    <Star className={`w-4 h-4 ${msg.starred ? 'fill-amber-500 text-amber-500' : ''}`} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Message Detail Reading Pane */}
      <div className={`flex-1 flex flex-col bg-slate-50/50 h-full ${!selectedMessage ? 'hidden lg:flex' : 'flex w-full'}`}>
        {selectedMessage ? (
          <div className="flex-1 flex flex-col h-full overflow-hidden">
            
            {/* Reading View Header Toolbar */}
            <div className="p-3 sm:p-4 border-b border-slate-200/80 bg-white shrink-0 shadow-2xs space-y-2">
              
              {/* Top Row: Back button on Left, Actions on Right */}
              <div className="flex items-center justify-between gap-2">
                <div>
                  {/* Back Button for mobile/tablet (< lg) */}
                  <button 
                    onClick={() => setSelectedMessage(null)}
                    className="lg:hidden inline-flex items-center gap-1 px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold transition-all active:scale-95 shrink-0"
                  >
                    <ArrowLeft className="w-3.5 h-3.5 text-slate-500" />
                    <span>{locale === 'tr' ? 'Geri' : 'Back'}</span>
                  </button>
                </div>

                {/* Action Toolbar */}
                <div className="flex items-center gap-1">
                  <button 
                    onClick={handleReply} 
                    className="flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-all" 
                    title={locale === 'tr' ? 'Yanıtla' : 'Reply'}
                  >
                    <Reply className="w-3.5 h-3.5" />
                    <span className="hidden xs:inline">{locale === 'tr' ? 'Yanıtla' : 'Reply'}</span>
                  </button>
                  <button 
                    onClick={(e) => handleStar(e, selectedMessage.id)} 
                    className="p-1.5 text-slate-400 hover:text-amber-500 hover:bg-amber-50 rounded-lg transition-all" 
                    title={locale === 'tr' ? 'Yıldızla' : 'Star'}
                  >
                    <Star className={`w-3.5 h-3.5 ${selectedMessage.starred ? 'fill-amber-500 text-amber-500' : ''}`} />
                  </button>
                  <button 
                    onClick={handleDeleteClick} 
                    className="p-1.5 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-all" 
                    title={locale === 'tr' ? 'Sil' : 'Delete'}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Subject Title */}
              <h2 className="text-sm sm:text-base font-bold text-slate-900 leading-snug break-words">{selectedMessage.subject}</h2>
              
              {/* Sender & Date Info */}
              <div className="flex items-center justify-between gap-3 pt-2 border-t border-slate-100">
                <div className="flex items-center gap-2.5 min-w-0 flex-1">
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 text-white font-bold flex items-center justify-center text-xs shadow-xs shrink-0">
                    {selectedMessage.sender?.charAt(0) || 'U'}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-slate-900 text-xs sm:text-sm leading-tight truncate">{selectedMessage.sender}</h4>
                    </div>
                    <p className="text-[11px] text-slate-400 font-mono truncate">{selectedMessage.email || 'noreply@novaijournal.com'}</p>
                  </div>
                </div>
                <div className="text-[11px] font-semibold text-slate-400 bg-slate-50 border border-slate-200/60 px-2 py-0.5 rounded-md shrink-0 flex items-center gap-1">
                  <Clock className="w-3 h-3 text-slate-400" />
                  {selectedMessage.date}
                </div>
              </div>
            </div>

            {/* Formatted Content Body Card */}
            <div className="p-3 sm:p-5 overflow-y-auto flex-1 bg-slate-50/60 custom-scrollbar space-y-3">
              
              {/* Notice Banner if content contains revision or evaluation keywords */}
              {(selectedMessage.content?.includes('revizyon') || selectedMessage.content?.includes('hakem')) && (
                <div className="bg-amber-50/90 border border-amber-200/80 rounded-xl p-3 flex items-center gap-2.5 text-amber-900 shadow-2xs">
                  <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                  <div className="text-xs">
                    <span className="font-bold">{locale === 'tr' ? 'Eylem Gerektiren Bildirim: ' : 'Action Required Notice: '}</span>
                    <span>{locale === 'tr' ? 'Bu mesaj hakem değerlendirme süreci ve revizyon talimatları içermektedir.' : 'This message contains review process and revision guidelines.'}</span>
                  </div>
                </div>
              )}

              {/* Compact Styled Message Body */}
              <div className="bg-white p-4 sm:p-6 rounded-xl border border-slate-200/80 shadow-2xs text-slate-700 text-xs sm:text-sm leading-relaxed space-y-3 font-sans whitespace-pre-wrap break-words">
                {selectedMessage.content}
              </div>

              {/* Bottom Quick Action Bar */}
              <div className="pt-1 flex justify-end">
                <button 
                  onClick={handleReply}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-bold text-xs shadow-sm shadow-indigo-200 transition-all active:scale-95"
                >
                  <Reply className="w-3.5 h-3.5" />
                  <span>{locale === 'tr' ? 'Yanıt Gönder' : 'Send Reply'}</span>
                </button>
              </div>

            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-slate-400 p-6">
            <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-300 mb-4 shadow-2xs">
              <InboxIcon className="w-8 h-8" />
            </div>
            <p className="font-bold text-slate-700 text-sm sm:text-base text-center mb-1">{locale === 'tr' ? 'Mesaj Seçilmedi' : 'No Message Selected'}</p>
            <p className="text-xs sm:text-sm text-slate-400 text-center">{locale === 'tr' ? 'Okumak için sol taraftaki listeden bir mesaj seçin.' : 'Select a message from the list to view.'}</p>
          </div>
        )}
      </div>

      {/* Compose Modal */}
      <AnimatePresence>
        {isComposeOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-md">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden border border-slate-200"
            >
              <div className="px-5 sm:px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/80 shrink-0">
                <h3 className="font-bold text-slate-800 text-sm sm:text-base flex items-center gap-2">
                  <Send className="w-4 h-4 text-indigo-600" />
                  {locale === 'tr' ? 'Yeni Mesaj Oluştur' : 'Compose New Message'}
                </h3>
                <button onClick={() => setIsComposeOpen(false)} className="text-slate-400 hover:text-slate-700 p-1 transition-colors rounded-lg hover:bg-slate-200/60">
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="p-5 sm:p-6 space-y-4 overflow-y-auto flex-1">
                <div className="flex items-center border-b border-slate-100 pb-2">
                  <span className="text-slate-400 text-xs sm:text-sm font-semibold w-14 sm:w-16 shrink-0">{locale === 'tr' ? 'Kime:' : 'To:'}</span>
                  <select 
                    value={composeTo} 
                    onChange={(e) => setComposeTo(e.target.value)} 
                    className={`flex-1 bg-transparent border-none focus:ring-0 text-xs sm:text-sm ${composeTo ? 'text-slate-800 font-semibold' : 'text-slate-400'}`}
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
                  <span className="text-slate-400 text-xs sm:text-sm font-semibold w-14 sm:w-16 shrink-0">{locale === 'tr' ? 'Konu:' : 'Subject:'}</span>
                  <input type="text" value={composeSubject} onChange={(e) => setComposeSubject(e.target.value)} className="flex-1 bg-transparent border-none focus:ring-0 text-xs sm:text-sm text-slate-800 font-bold" placeholder={locale === 'tr' ? 'Mesajınızın konusu...' : 'Subject of your message...'} />
                </div>
                <div className="pt-2">
                  <textarea 
                    value={composeContent}
                    onChange={(e) => setComposeContent(e.target.value)}
                    className="w-full h-40 sm:h-48 bg-slate-50/50 p-3 rounded-xl border border-slate-200/80 focus:ring-2 focus:ring-indigo-500 focus:bg-white text-xs sm:text-sm text-slate-700 resize-none transition-all placeholder:text-slate-400" 
                    placeholder={locale === 'tr' ? 'Mesajınızı buraya yazın...' : 'Write your message here...'}
                  />
                </div>
              </div>

              <div className="px-5 sm:px-6 py-4 bg-slate-50/80 border-t border-slate-100 flex justify-between items-center shrink-0">
                <button onClick={() => setIsComposeOpen(false)} className="px-4 py-2 text-xs sm:text-sm text-slate-600 font-semibold hover:bg-slate-200/60 rounded-xl transition-colors">
                  {locale === 'tr' ? 'İptal' : 'Cancel'}
                </button>
                <button 
                  onClick={handleSendMessage} 
                  disabled={isSending}
                  className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-xs sm:text-sm rounded-xl transition-all shadow-md shadow-indigo-200 flex items-center gap-2 active:scale-95"
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


