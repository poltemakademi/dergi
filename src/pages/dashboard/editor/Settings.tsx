import { useState } from 'react';
import { Save, Globe, Image as ImageIcon, BookOpen } from 'lucide-react';
import { apiClient } from '../../../services/api/client';
import { toast } from 'sonner';

export default function Settings() {
  const [isSaving, setIsSaving] = useState(false);
  const [settings, setSettings] = useState({
    journalName: 'Journal of Modern Science',
    abbreviation: 'JMS',
    issn: '1234-5678',
    eIssn: '8765-4321',
    aimsScope: 'The Journal of Modern Science is an open-access peer-reviewed journal dedicated to publishing high-quality research...',
    crossrefPrefix: '10.1234',
    doajKey: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setSettings(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await apiClient.put('/api/editor/settings', settings);
      toast.success('Settings saved successfully');
    } catch (err: any) {
      console.error('Failed to save settings:', err);
      toast.error(err?.response?.data?.message || 'Failed to save settings');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-4xl space-y-8">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
        <div className="flex items-center gap-3 mb-6 border-b border-slate-100 pb-6">
          <BookOpen className="w-6 h-6 text-indigo-500" />
          <div>
            <h2 className="text-xl font-bold text-slate-800">Journal Information</h2>
            <p className="text-sm text-slate-500">Basic metadata for your hosted journal.</p>
          </div>
        </div>

        <form className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">Journal Name</label>
              <input type="text" name="journalName" value={settings.journalName} onChange={handleChange} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-colors" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">Abbreviation</label>
              <input type="text" name="abbreviation" value={settings.abbreviation} onChange={handleChange} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-colors" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">ISSN</label>
              <input type="text" name="issn" value={settings.issn} onChange={handleChange} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-colors font-mono" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">e-ISSN</label>
              <input type="text" name="eIssn" value={settings.eIssn} onChange={handleChange} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-colors font-mono" />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700">Aims & Scope</label>
            <textarea rows={4} name="aimsScope" value={settings.aimsScope} onChange={handleChange} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-colors" />
          </div>
        </form>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
        <div className="flex items-center gap-3 mb-6 border-b border-slate-100 pb-6">
          <Globe className="w-6 h-6 text-emerald-500" />
          <div>
            <h2 className="text-xl font-bold text-slate-800">Integrations & Identifiers</h2>
            <p className="text-sm text-slate-500">API keys for Crossref and DOAJ.</p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700">Crossref DOI Prefix</label>
            <input type="text" name="crossrefPrefix" value={settings.crossrefPrefix} onChange={handleChange} className="w-full md:w-1/2 px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-colors font-mono" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700">DOAJ API Key</label>
            <input type="password" name="doajKey" value={settings.doajKey} onChange={handleChange} placeholder="************************" className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-colors font-mono" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <ImageIcon className="w-6 h-6 text-rose-500" />
          <div>
            <h2 className="text-xl font-bold text-slate-800">Branding</h2>
            <p className="text-sm text-slate-500">Update logo and brand colors.</p>
          </div>
        </div>
        <button 
          onClick={handleSave}
          disabled={isSaving}
          className="w-full md:w-auto px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-all disabled:opacity-50"
        >
          <Save className="w-4 h-4" /> {isSaving ? 'Saving...' : 'Save All Settings'}
        </button>
      </div>
    </div>
  );
}
