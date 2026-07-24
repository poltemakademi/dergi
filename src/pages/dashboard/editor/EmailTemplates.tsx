import { useState } from 'react';
import { Save, Mail, Edit3 } from 'lucide-react';
import { useLocaleStore } from '../../../store/useLocaleStore';
import { toast } from 'sonner';

interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  body: string;
}

const DEFAULT_TEMPLATES: EmailTemplate[] = [
  {
    id: 'reviewer_invite',
    name: 'Reviewer Invitation (Hakem Daveti)',
    subject: '[Journal Name] Invitation to Review: {article_title}',
    body: 'Dear {reviewer_name},\n\nWe would like to invite you to review the manuscript "{article_title}" for our journal.\n\nPlease log in to your dashboard to accept or decline the invitation.\n\nBest regards,\nEditorial Team',
  },
  {
    id: 'decision_accept',
    name: 'Decision: Accept (Kabul Kararı)',
    subject: '[Journal Name] Decision on your manuscript: {article_title}',
    body: 'Dear {author_name},\n\nWe are pleased to inform you that your manuscript "{article_title}" has been accepted for publication.\n\nBest regards,\nEditorial Team',
  },
  {
    id: 'decision_reject',
    name: 'Decision: Reject (Ret Kararı)',
    subject: '[Journal Name] Decision on your manuscript: {article_title}',
    body: 'Dear {author_name},\n\nThank you for submitting your manuscript "{article_title}". We regret to inform you that we cannot accept it for publication at this time.\n\nBest regards,\nEditorial Team',
  }
];

export default function EmailTemplates() {
  const { locale } = useLocaleStore();
  const [templates, setTemplates] = useState<EmailTemplate[]>(DEFAULT_TEMPLATES);
  const [activeTemplateId, setActiveTemplateId] = useState<string>(DEFAULT_TEMPLATES[0].id);
  const [isSaving, setIsSaving] = useState(false);

  const activeTemplate = templates.find(t => t.id === activeTemplateId);

  const handleUpdate = (field: 'subject' | 'body', value: string) => {
    setTemplates(templates.map(t => t.id === activeTemplateId ? { ...t, [field]: value } : t));
  };

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      toast.success(locale === 'tr' ? 'Şablon başarıyla güncellendi' : 'Template updated successfully');
    }, 600);
  };

  return (
    <div className="max-w-5xl space-y-6 flex flex-col h-full">
      <div className="flex items-center justify-between border-b border-slate-100 pb-6 mb-2">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600 border border-emerald-100">
            <Mail className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-800">{locale === 'tr' ? 'E-posta Şablonları' : 'Email Templates'}</h2>
            <p className="text-sm text-slate-500">{locale === 'tr' ? 'Sistem tarafından gönderilen otomatik mesajları düzenleyin.' : 'Manage automated system email templates.'}</p>
          </div>
        </div>
        <button 
          onClick={handleSave}
          disabled={isSaving}
          className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-md disabled:opacity-50 cursor-pointer"
        >
          <Save className="w-4 h-4" /> {isSaving ? (locale === 'tr' ? 'Kaydediliyor...' : 'Saving...') : (locale === 'tr' ? 'Şablonu Kaydet' : 'Save Template')}
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 flex-1 min-h-[500px]">
        {/* Left: Template List */}
        <div className="w-full lg:w-72 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
          <div className="p-4 bg-slate-50 border-b border-slate-100">
            <h3 className="text-sm font-bold text-slate-700">{locale === 'tr' ? 'Şablon Seçimi' : 'Select Template'}</h3>
          </div>
          <div className="flex-1 overflow-y-auto">
            {templates.map(t => (
              <button
                key={t.id}
                onClick={() => setActiveTemplateId(t.id)}
                className={`w-full text-left p-4 border-b border-slate-100 transition-colors flex items-center justify-between group cursor-pointer ${activeTemplateId === t.id ? 'bg-indigo-50 border-l-4 border-l-indigo-500' : 'hover:bg-slate-50 border-l-4 border-l-transparent'}`}
              >
                <span className={`text-sm font-semibold ${activeTemplateId === t.id ? 'text-indigo-900' : 'text-slate-600'}`}>{t.name}</span>
                <Edit3 className={`w-4 h-4 ${activeTemplateId === t.id ? 'text-indigo-500' : 'text-slate-300 opacity-0 group-hover:opacity-100'}`} />
              </button>
            ))}
          </div>
        </div>

        {/* Right: Editor Canvas */}
        {activeTemplate && (
          <div className="flex-1 bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col gap-5">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 block">{locale === 'tr' ? 'E-posta Konusu' : 'Email Subject'}</label>
              <input
                type="text"
                value={activeTemplate.subject}
                onChange={(e) => handleUpdate('subject', e.target.value)}
                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 transition-colors text-sm font-medium text-slate-800"
              />
            </div>
            
            <div className="space-y-2 flex-1 flex flex-col">
              <label className="text-sm font-bold text-slate-700 block flex items-center justify-between">
                <span>{locale === 'tr' ? 'E-posta İçeriği' : 'Email Body'}</span>
                <span className="text-xs font-normal text-slate-400 font-mono">Variables: {'{article_title}'}, {'{author_name}'}</span>
              </label>
              <textarea
                value={activeTemplate.body}
                onChange={(e) => handleUpdate('body', e.target.value)}
                className="w-full flex-1 min-h-[300px] px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 transition-colors text-sm font-mono text-slate-700 resize-none"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
