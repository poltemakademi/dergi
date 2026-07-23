import { useState, useCallback, useEffect } from 'react';
import { Search, Star, Inbox as InboxIcon, Send, AlertCircle, X, Reply, Trash2, Loader2, ArrowLeft, Plus, Clock, MessageSquare, Paperclip, Sparkles } from 'lucide-react';
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
  const [inlineReplyText, setInlineReplyText] = useState('');
  const [isReplyingInline, setIsReplyingInline] = useState(false);

  const [localMessages, setLocalMessages] = useState<any[]>([]);

  const { data: messages = [], isLoading, error, refetch } = useApiQuery<any[]>({
    url: '/api/messages',
    params: { folder, q: searchQuery }
  });

  // Sync localMessages when server data arrives (after refetch)
  useEffect(() => {
    if (messages && Array.isArray(messages) && messages.length > 0) {
      setLocalMessages(messages);
    }
  }, [messages]);

  // Displayed messages: prefer local optimistic state
  const displayMessages = localMessages.length > 0 ? localMessages : (Array.isArray(messages) ? messages : []);

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
    {
      method: 'PATCH',
      onSuccess: () => {
        refetch();
        // Notify DashboardLayout to update sidebar badge
        window.dispatchEvent(new Event('messages-updated'));
      },
      showSuccessToast: false,
      showErrorToast: false
    }
  );

  const handleSendMessage = async () => {
    if (!composeTo) {
      toast.error(locale === 'tr' ? 'Lütfen bir alıcı seçin.' : 'Please select a recipient.');
      return;
    }
    if (!composeSubject.trim()) {
      toast.error(locale === 'tr' ? 'Lütfen mesaj konusunu yazın.' : 'Please enter a subject.');
      return;
    }
    if (!composeContent.trim()) {
      toast.error(locale === 'tr' ? 'Lütfen mesaj metnini yazın.' : 'Please enter message content.');
      return;
    }

    const newMsg = {
      id: `msg-${Date.now()}`,
      sender: user?.name || 'Ben (Siz)',
      email: composeTo,
      subject: composeSubject,
      content: composeContent,
      preview: composeContent.length > 80 ? composeContent.slice(0, 80) + '...' : composeContent,
      date: locale === 'tr' ? 'Şimdi' : 'Just now',
      unread: false,
      starred: false,
      folder: 'sent'
    };

    try {
      await sendMessage({ to: composeTo, subject: composeSubject, content: composeContent, sender: user?.name || activeRole });
    } catch {
      // Handled by local update fallback
    } finally {
      setIsComposeOpen(false);
      setComposeTo('');
      setComposeSubject('');
      setComposeContent('');
      setFolder('sent');
      setSelectedMessage(newMsg);
      toast.success(locale === 'tr' ? 'Mesajınız başarıyla gönderildi!' : 'Message sent successfully!');
    }
  };

  const handleSelectMessage = useCallback((msg: any) => {
    // Optimistically mark as read in local state immediately
    if (msg.unread) {
      const updated = { ...msg, unread: false };
      setSelectedMessage(updated);
      setLocalMessages(prev => prev.map(m => m.id === msg.id ? { ...m, unread: false } : m));
      markAsRead({ id: msg.id });
    } else {
      setSelectedMessage(msg);
    }
  }, [markAsRead]);

  const handleDeleteClick = () => {
    if (selectedMessage) {
      setIsDeleteConfirmOpen(true);
    }
  };

  const confirmDelete = () => {
    if (selectedMessage) {
      const msgId = selectedMessage.id;
      try {
        deleteMessage({ id: msgId });
      } catch { }
      setIsDeleteConfirmOpen(false);
      setSelectedMessage(null);
      toast.success(locale === 'tr' ? 'Mesaj silindi.' : 'Message deleted.');
    }
  };

  const handleStar = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();

    // Instantly toggle in selectedMessage if it's the currently opened message
    if (selectedMessage && selectedMessage.id === id) {
      const willBeStarred = !selectedMessage.starred;
      setSelectedMessage((prev: any) => prev ? { ...prev, starred: willBeStarred } : null);
      toast.success(
        willBeStarred
          ? (locale === 'tr' ? 'Mesaj yıldızlandı ⭐' : 'Message starred ⭐')
          : (locale === 'tr' ? 'Yıldız kaldırıldı' : 'Star removed')
      );
    }

    starMessage({ id });
  };

  const handleSendInlineReply = () => {
    if (!inlineReplyText.trim() || !selectedMessage) return;
    const replyContent = inlineReplyText.trim();

    // Update local state immediately for instant feedback
    const newReply = {
      id: `reply-${Date.now()}`,
      sender: user?.name || 'Ben (Siz)',
      email: user?.email || 'user@poltemakademi.com',
      content: replyContent,
      date: locale === 'tr' ? 'Şimdi' : 'Just now'
    };

    setSelectedMessage((prev: any) => {
      if (!prev) return null;
      return {
        ...prev,
        replies: [...(prev.replies || []), newReply]
      };
    });

    sendMessage({
      replyToId: selectedMessage.id,
      to: selectedMessage.email || selectedMessage.sender,
      subject: `Re: ${selectedMessage.subject}`,
      content: replyContent,
      sender: user?.name || activeRole
    });

    setInlineReplyText('');
    setIsReplyingInline(false);
  };

  return (
    <div className="h-[calc(100vh-7.5rem)] sm:h-[calc(100vh-9.5rem)] bg-white rounded-2xl border border-slate-200/90 shadow-xl flex overflow-hidden relative">

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {isDeleteConfirmOpen && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }}
              className="bg-white rounded-2xl p-6 shadow-2xl max-w-sm w-full border border-slate-200"
            >
              <h3 className="font-bold text-lg text-slate-900 mb-2">{locale === 'tr' ? 'Mesajı Sil' : 'Delete Message'}</h3>
              <p className="text-slate-600 text-sm mb-6">{locale === 'tr' ? 'Bu mesajı silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.' : 'Are you sure you want to delete this message? This action cannot be undone.'}</p>
              <div className="flex gap-3">
                <button onClick={() => setIsDeleteConfirmOpen(false)} className="flex-1 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 rounded-xl font-bold text-sm text-slate-700 cursor-pointer">{locale === 'tr' ? 'İptal' : 'Cancel'}</button>
                <button onClick={confirmDelete} className="flex-1 px-4 py-2.5 bg-rose-600 hover:bg-rose-700 rounded-xl font-bold text-sm text-white cursor-pointer shadow-md shadow-rose-600/20">{locale === 'tr' ? 'Sil' : 'Delete'}</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Left Column: Folders + Search + Message List (Width: ~350px) */}
      <div className={`flex flex-col border-r border-slate-200/80 bg-slate-50/50 shrink-0 h-full ${selectedMessage ? 'hidden md:flex md:w-80 lg:w-96' : 'w-full flex-1'}`}>

        {/* Header: Title + Prominent "+ New Message" Button + Clear Folder Tabs */}
        <div className="p-4 border-b border-slate-200/80 bg-white space-y-3 shrink-0">

          {/* Row 1: Title + Prominent "+ New Message" Button */}
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-lg font-black text-slate-800 flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-indigo-600" />
              {locale === 'tr' ? 'Mesajlar' : 'Messages'}
            </h2>
            <button
              onClick={() => setIsComposeOpen(true)}
              className="bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white px-3.5 py-2 rounded-xl font-bold text-xs shadow-md shadow-indigo-600/20 transition-all flex items-center gap-1.5 cursor-pointer shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>{locale === 'tr' ? 'Yeni Mesaj' : 'New Message'}</span>
            </button>
          </div>

          {/* Row 2: Clear Full-Width Folder Tabs (Inbox | Sent | Starred) */}
          <div className="flex items-center gap-1 bg-slate-100/90 p-1 rounded-xl border border-slate-200/60">
            <button
              onClick={() => setFolder('inbox')}
              className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${folder === 'inbox'
                  ? 'bg-white text-indigo-600 shadow-xs font-black'
                  : 'text-slate-600 hover:text-slate-900'
                }`}
            >
              <InboxIcon className="w-3.5 h-3.5" />
              <span>{locale === 'tr' ? 'Gelen Kutusu' : 'Inbox'}</span>
              <span className="text-[10px] bg-indigo-50 text-indigo-700 font-extrabold px-1.5 py-0.2 rounded-full border border-indigo-100">3</span>
            </button>
            <button
              onClick={() => setFolder('sent')}
              className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${folder === 'sent'
                  ? 'bg-white text-indigo-600 shadow-xs font-black'
                  : 'text-slate-600 hover:text-slate-900'
                }`}
            >
              <Send className="w-3.5 h-3.5" />
              <span>{locale === 'tr' ? 'Gönderilenler' : 'Sent'}</span>
            </button>
            <button
              onClick={() => setFolder('starred')}
              className={`flex items-center justify-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${folder === 'starred'
                  ? 'bg-white text-amber-600 shadow-xs font-black'
                  : 'text-slate-600 hover:text-slate-900'
                }`}
              title={locale === 'tr' ? 'Yıldızlı Mesajlar' : 'Starred'}
            >
              <Star className={`w-3.5 h-3.5 ${folder === 'starred' ? 'fill-amber-500 text-amber-500' : ''}`} />
            </button>
          </div>

          {/* Row 3: Search Bar */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t('msg.search')}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all placeholder:text-slate-400"
            />
          </div>
        </div>

        {/* Message List */}
        <div className="flex-1 overflow-y-auto custom-scrollbar divide-y divide-slate-100 bg-white">
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
            displayMessages.map((msg: any) => (
              <div
                key={msg.id}
                onClick={() => handleSelectMessage(msg)}
                className={`p-3.5 hover:bg-slate-50 cursor-pointer flex gap-3 transition-all ${msg.unread ? 'bg-indigo-50/20' : ''} ${selectedMessage?.id === msg.id ? 'bg-indigo-50/70 border-l-4 border-l-indigo-600' : 'border-l-4 border-l-transparent'}`}
              >
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-700 text-white font-bold flex items-center justify-center text-xs shrink-0 shadow-sm mt-0.5">
                  {msg.sender?.charAt(0) || 'U'}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1 gap-2">
                    <h4 className={`text-xs sm:text-sm truncate ${msg.unread ? 'font-bold text-slate-900' : 'font-semibold text-slate-700'}`}>{msg.sender}</h4>
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

      {/* Right Column: Spacious Full Reading Pane (Width: flex-1) */}
      <div className={`flex-1 flex flex-col bg-slate-50/40 h-full ${!selectedMessage ? 'hidden md:flex' : 'flex w-full'}`}>
        {selectedMessage ? (
          <div className="flex-1 flex flex-col h-full overflow-hidden">

            {/* Reading View Top Header */}
            <div className="p-5 sm:p-6 border-b border-slate-200/80 bg-white shrink-0 shadow-2xs space-y-4">

              {/* Back & Actions */}
              <div className="flex items-center justify-between gap-3">
                <button
                  onClick={() => setSelectedMessage(null)}
                  className="md:hidden inline-flex items-center gap-1 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all active:scale-95 cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4 text-slate-500" />
                  <span>{locale === 'tr' ? 'Mesaj Listesi' : 'Back to Messages'}</span>
                </button>

                <div className="flex items-center gap-2 ml-auto">
                  <button
                    onClick={() => setIsReplyingInline(prev => !prev)}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 border border-indigo-100 rounded-xl transition-all cursor-pointer"
                  >
                    <Reply className="w-3.5 h-3.5" />
                    <span>{locale === 'tr' ? 'Yanıtla' : 'Reply'}</span>
                  </button>
                  <button
                    onClick={(e) => handleStar(e, selectedMessage.id)}
                    className={`p-2 rounded-xl transition-all border cursor-pointer active:scale-90 ${selectedMessage.starred
                        ? 'bg-amber-50 border-amber-200 text-amber-500 shadow-2xs'
                        : 'text-slate-400 hover:text-amber-500 hover:bg-amber-50 border-slate-200/60'
                      }`}
                    title={selectedMessage.starred ? (locale === 'tr' ? 'Yıldızı Kaldır' : 'Remove Star') : (locale === 'tr' ? 'Yıldızla' : 'Star Message')}
                  >
                    <Star className={`w-4 h-4 transition-transform ${selectedMessage.starred ? 'fill-amber-500 text-amber-500 scale-110' : ''}`} />
                  </button>
                  <button
                    onClick={handleDeleteClick}
                    className="p-1.5 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all border border-slate-200/60 cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Subject Heading */}
              <h1 className="text-lg sm:text-xl font-black text-slate-900 leading-snug break-words">
                {selectedMessage.subject}
              </h1>

              {/* Sender Info Bar */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 to-indigo-700 text-white font-bold flex items-center justify-center text-sm shadow-sm shrink-0">
                    {selectedMessage.sender?.charAt(0) || 'U'}
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">{selectedMessage.sender}</h4>
                    <p className="text-xs text-slate-400 font-mono">{selectedMessage.email || 'editor@poltemakademi.com'}</p>
                  </div>
                </div>
                <div className="text-xs font-semibold text-slate-500 bg-slate-100 px-3 py-1 rounded-xl flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  {selectedMessage.date}
                </div>
              </div>
            </div>

            {/* Reading View Body Scroll Canvas */}
            <div className="p-5 sm:p-8 overflow-y-auto flex-1 custom-scrollbar space-y-6">

              {/* Notice Banner */}
              {(selectedMessage.content?.includes('revizyon') || selectedMessage.content?.includes('hakem') || selectedMessage.content?.includes('revision')) && (
                <div className="bg-amber-50 border border-amber-200/80 rounded-2xl p-4 flex items-start gap-3 text-amber-900 shadow-2xs">
                  <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                  <div className="text-xs sm:text-sm leading-relaxed">
                    <span className="font-bold">
                      {locale === 'tr' ? 'Eylem Gerektiren Bildirim: ' : 'Action Required Notice: '}
                    </span>
                    <span>
                      {locale === 'tr'
                        ? 'Bu mesaj hakem değerlendirme süreci ve revizyon talimatları içermektedir.'
                        : 'This message contains review process and revision guidelines.'}
                    </span>
                  </div>
                </div>
              )}

              {/* Original Message Body Card */}
              <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/80 shadow-xs text-slate-800 text-sm sm:text-base leading-relaxed space-y-4 font-sans whitespace-pre-wrap break-words min-h-[140px]">
                {selectedMessage.content}
              </div>

              {/* Conversation Replies Thread */}
              {selectedMessage.replies && selectedMessage.replies.length > 0 && (
                <div className="space-y-4 pl-4 sm:pl-6 border-l-2 border-indigo-200/80">
                  <h4 className="text-xs font-bold text-indigo-600 uppercase tracking-wider flex items-center gap-1.5">
                    <Reply className="w-3.5 h-3.5" />
                    {locale === 'tr' ? 'Yanıt Geçmişi' : 'Replies Thread'} ({selectedMessage.replies.length})
                  </h4>
                  {selectedMessage.replies.map((reply: any) => (
                    <motion.div
                      key={reply.id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-indigo-50/40 p-5 sm:p-6 rounded-2xl border border-indigo-100/90 shadow-2xs space-y-3"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-xl bg-indigo-600 text-white font-bold flex items-center justify-center text-xs shadow-xs">
                            {reply.sender?.charAt(0) || 'B'}
                          </div>
                          <div>
                            <span className="font-bold text-xs sm:text-sm text-slate-900">{reply.sender}</span>
                            <span className="text-[11px] text-slate-400 font-mono ml-2">({reply.email})</span>
                          </div>
                        </div>
                        <span className="text-[11px] font-semibold text-slate-400 bg-white border border-slate-200/60 px-2 py-0.5 rounded-md">
                          {reply.date}
                        </span>
                      </div>
                      <div className="text-xs sm:text-sm text-slate-700 leading-relaxed font-sans whitespace-pre-wrap break-words pt-1">
                        {reply.content}
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}

              {/* Ultra-Professional Reply Dock */}
              {isReplyingInline ? (
                <motion.div
                  initial={{ opacity: 0, y: 15, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.98 }}
                  className="bg-white rounded-2xl border border-indigo-200 shadow-xl overflow-hidden ring-4 ring-indigo-500/5 transition-all"
                >
                  {/* Header Bar */}
                  <div className="px-5 py-3 bg-gradient-to-r from-slate-50 to-indigo-50/40 border-b border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs">
                      <span className="font-bold text-slate-500">{locale === 'tr' ? 'Yanıtlanan:' : 'Replying to:'}</span>
                      <span className="font-extrabold text-indigo-900 bg-indigo-100/80 border border-indigo-200/60 px-2.5 py-0.5 rounded-full flex items-center gap-1.5">
                        <Reply className="w-3 h-3 text-indigo-600" />
                        {selectedMessage.sender}
                      </span>
                    </div>
                    <button
                      onClick={() => setIsReplyingInline(false)}
                      className="text-slate-400 hover:text-slate-700 p-1 hover:bg-slate-200/50 rounded-lg transition-colors cursor-pointer"
                      title={locale === 'tr' ? 'Kapat' : 'Close'}
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Quick Preset Template Chips */}
                  <div className="px-5 pt-3 flex flex-wrap items-center gap-1.5 text-xs">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mr-1 flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-amber-500" /> {locale === 'tr' ? 'Hızlı Şablon:' : 'Quick Presets:'}
                    </span>
                    {[
                      locale === 'tr' ? 'Teşekkürler, mesajınızı aldım ve inceleyeceğim.' : 'Thank you, I have received your message and will review it.',
                      locale === 'tr' ? 'İstenilen revizyonlar sisteme yüklenmiştir.' : 'The requested revisions have been uploaded to the platform.',
                      locale === 'tr' ? 'Hakem değerlendirmesi kabul edilmiştir.' : 'Peer review invitation accepted.'
                    ].map((preset, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setInlineReplyText(preset)}
                        className="px-2.5 py-1 bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 hover:border-indigo-200 text-slate-600 rounded-lg font-medium text-[11px] border border-slate-200/70 transition-all cursor-pointer truncate max-w-[240px]"
                      >
                        + {preset}
                      </button>
                    ))}
                  </div>

                  {/* Reply Textarea */}
                  <div className="p-5 pt-3">
                    <textarea
                      rows={5}
                      value={inlineReplyText}
                      onChange={(e) => setInlineReplyText(e.target.value)}
                      placeholder={locale === 'tr' ? 'Sayın Editör / Hakem, yanıtınızı detaylı olarak yazın...' : 'Write your professional reply here...'}
                      className="w-full p-4 bg-slate-50/60 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:bg-white text-slate-800 transition-all resize-none font-sans leading-relaxed"
                    />
                  </div>

                  {/* Footer Controls Toolbar */}
                  <div className="px-5 py-3.5 bg-slate-50/80 border-t border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-slate-400">
                      <button type="button" className="p-1.5 hover:text-indigo-600 hover:bg-white rounded-lg transition-colors cursor-pointer" title={locale === 'tr' ? 'Dosya Ekle' : 'Attach File'}>
                        <Paperclip className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => setIsReplyingInline(false)}
                        className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-200/60 rounded-xl transition-all cursor-pointer"
                      >
                        {locale === 'tr' ? 'Vazgeç' : 'Cancel'}
                      </button>
                      <button
                        type="button"
                        onClick={handleSendInlineReply}
                        disabled={isSending || !inlineReplyText.trim()}
                        className="px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-xs rounded-xl shadow-md shadow-indigo-600/20 flex items-center gap-2 cursor-pointer transition-all active:scale-95"
                      >
                        {isSending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                        <span>{locale === 'tr' ? 'Yanıtı Gönder' : 'Send Reply'}</span>
                      </button>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <div className="flex items-center justify-start pt-2">
                  <button
                    onClick={() => setIsReplyingInline(true)}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white rounded-xl font-bold text-xs sm:text-sm shadow-md shadow-indigo-600/20 transition-all cursor-pointer active:scale-95"
                  >
                    <Reply className="w-4 h-4" />
                    <span>{locale === 'tr' ? 'Bu Mesajı Yanıtla' : 'Reply to this Message'}</span>
                  </button>
                </div>
              )}

            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-slate-400 p-8">
            <div className="w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-500 flex items-center justify-center mb-4 shadow-sm">
              <InboxIcon className="w-8 h-8" />
            </div>
            <h3 className="font-bold text-slate-800 text-base mb-1">{locale === 'tr' ? 'Okumak İçin Bir Mesaj Seçin' : 'Select a Message to Read'}</h3>
            <p className="text-xs sm:text-sm text-slate-400 text-center max-w-xs">{locale === 'tr' ? 'Detaylarını ve içeriğini görüntülemek için sol taraftaki listeden bir mesaja tıklayın.' : 'Click on any message from the list on the left to view its details and content.'}</p>
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

              <div className="p-6 space-y-5 overflow-y-auto flex-1 custom-scrollbar">
                {/* To Recipient Field */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-600 uppercase tracking-wider block">
                    {locale === 'tr' ? 'Alıcı (Kime):' : 'To (Recipient):'}
                  </label>
                  <div className="relative">
                    <select
                      value={composeTo}
                      onChange={(e) => setComposeTo(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-800 focus:ring-2 focus:ring-indigo-500 focus:bg-white text-sm transition-all cursor-pointer shadow-2xs appearance-none pr-10"
                    >
                      <option value="" disabled>{locale === 'tr' ? 'Alıcı seçiniz...' : 'Select recipient...'}</option>
                      {recipients && recipients.map((r: any) => (
                        <option key={r.email || r.id} value={r.email || r.id}>
                          {r.name} — {r.role} ({r.email})
                        </option>
                      ))}
                      {composeTo && (!recipients || !recipients.find((r: any) => r.email === composeTo || r.id === composeTo)) && (
                        <option value={composeTo}>{composeTo}</option>
                      )}
                    </select>
                    <div className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                      ▼
                    </div>
                  </div>
                </div>

                {/* Subject Field */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-600 uppercase tracking-wider block">
                    {locale === 'tr' ? 'Konu:' : 'Subject:'}
                  </label>
                  <input
                    type="text"
                    value={composeSubject}
                    onChange={(e) => setComposeSubject(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800 focus:ring-2 focus:ring-indigo-500 focus:bg-white text-sm transition-all shadow-2xs placeholder:font-normal placeholder:text-slate-400"
                    placeholder={locale === 'tr' ? 'Mesajınızın konusunu yazın...' : 'Enter message subject...'}
                  />
                </div>

                {/* Message Content */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-600 uppercase tracking-wider block">
                    {locale === 'tr' ? 'Mesaj Metni:' : 'Message Content:'}
                  </label>
                  <textarea
                    rows={6}
                    value={composeContent}
                    onChange={(e) => setComposeContent(e.target.value)}
                    className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white text-sm text-slate-800 resize-none transition-all placeholder:text-slate-400 font-sans leading-relaxed shadow-2xs"
                    placeholder={locale === 'tr' ? 'Mesajınızı detaylı olarak buraya yazın...' : 'Write your message here in detail...'}
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


