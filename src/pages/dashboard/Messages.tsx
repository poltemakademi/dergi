import { Search, Star, Inbox as InboxIcon, Send } from 'lucide-react';

const mockMessages = [
  { id: 1, sender: 'System', subject: 'Manuscript Status Updated', preview: 'Your manuscript "Modern Applications..." has moved to IN_REVIEW.', date: '10:30 AM', unread: true },
  { id: 2, sender: 'Reviewer 1', subject: 'Revision Notes Available', preview: 'Please see the attached structural revision requirements.', date: 'Yesterday', unread: true },
  { id: 3, sender: 'Executive Editor', subject: 'Welcome to the Platform', preview: 'Thank you for registering. Please complete your ORCID profile.', date: 'Oct 12', unread: false },
];

export default function Messages() {
  return (
    <div className="h-[calc(100vh-10rem)] bg-white rounded-2xl border border-slate-200 shadow-sm flex overflow-hidden">
      {/* Sidebar */}
      <div className="w-64 border-r border-slate-100 flex flex-col bg-slate-50/50">
        <div className="p-4 border-b border-slate-100">
          <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 rounded-xl font-bold shadow-md shadow-indigo-200 transition-colors flex justify-center items-center gap-2">
            <Send className="w-4 h-4" /> Compose
          </button>
        </div>
        <div className="p-2 space-y-1">
          <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg bg-white text-indigo-600 font-bold shadow-sm border border-slate-100">
            <InboxIcon className="w-5 h-5" /> Inbox
            <span className="ml-auto bg-indigo-100 text-indigo-600 text-xs px-2 py-0.5 rounded-full">2</span>
          </button>
          <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 font-medium hover:bg-slate-100 transition-colors">
            <Send className="w-5 h-5 text-slate-400" /> Sent
          </button>
          <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 font-medium hover:bg-slate-100 transition-colors">
            <Star className="w-5 h-5 text-slate-400" /> Starred
          </button>
        </div>
      </div>

      {/* Main Mail List */}
      <div className="flex-1 flex flex-col">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-white">
          <div className="relative w-72">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input type="text" placeholder="Search messages..." className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all" />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {mockMessages.map(msg => (
            <div key={msg.id} className={`p-4 border-b border-slate-100 hover:bg-slate-50 cursor-pointer flex gap-4 transition-colors ${msg.unread ? 'bg-indigo-50/30' : ''}`}>
              <button className="mt-1 text-slate-300 hover:text-amber-400 transition-colors">
                <Star className="w-5 h-5" />
              </button>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h4 className={`text-sm ${msg.unread ? 'font-bold text-slate-900' : 'font-medium text-slate-700'}`}>{msg.sender}</h4>
                  <span className={`text-xs ${msg.unread ? 'font-bold text-indigo-600' : 'text-slate-500'}`}>{msg.date}</span>
                </div>
                <h5 className={`text-sm mb-1 ${msg.unread ? 'font-bold text-slate-800' : 'text-slate-700'}`}>{msg.subject}</h5>
                <p className="text-sm text-slate-500 truncate">{msg.preview}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
