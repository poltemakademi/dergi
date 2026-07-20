import { useState, useEffect } from 'react';
import { Save, Globe, Image as ImageIcon, BookOpen, AlertTriangle } from 'lucide-react';
import { useLocaleStore } from '../../../store/useLocaleStore';
import { useApiQuery } from '../../../hooks/useApiQuery';
import { useApiMutation } from '../../../hooks/useApiMutation';
import { FormSkeleton } from '../../../components/skeletons/FormSkeleton';

export default function Settings() {
  const { t, locale } = useLocaleStore();
  
  const { data: fetchedSettings, isLoading, error } = useApiQuery<any>({
    url: '/api/journal/settings'
  });

  const [settings, setSettings] = useState({
    journalName: '',
    abbreviation: '',
    issn: '',
    eIssn: '',
    aimsScope: '',
    crossrefPrefix: '',
    doajKey: ''
  });

  useEffect(() => {
    if (fetchedSettings) {
      setSettings({
        journalName: fetchedSettings.journalName || '',
        abbreviation: fetchedSettings.abbreviation || '',
        issn: fetchedSettings.issn || '',
        eIssn: fetchedSettings.eIssn || '',
        aimsScope: fetchedSettings.aimsScope || '',
        crossrefPrefix: fetchedSettings.crossrefPrefix || '',
        doajKey: fetchedSettings.doajKey || ''
      });
    }
  }, [fetchedSettings]);

  const { mutate: updateSettings, isLoading: isSaving } = useApiMutation('/api/journal/settings', {
    method: 'PUT',
    showSuccessToast: locale === 'tr' ? 'Ayarlar başarıyla kaydedildi' : 'Settings saved successfully'
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setSettings(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSave = () => {
    updateSettings(settings);
  };

  if (isLoading) {
    return <FormSkeleton fields={7} />;
  }

  if (error) {
    return (
      <div className="p-12 flex flex-col items-center justify-center text-rose-500 gap-4 bg-white rounded-2xl border border-slate-200 shadow-sm mt-6">
        <AlertTriangle className="w-8 h-8" />
        <p className="font-medium">{error.message || 'Failed to load settings.'}</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl space-y-8">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
        <div className="flex items-center gap-3 mb-6 border-b border-slate-100 pb-6">
          <BookOpen className="w-6 h-6 text-indigo-500" />
          <div>
            <h2 className="text-xl font-bold text-slate-800">{locale === 'tr' ? 'Dergi Bilgileri' : 'Journal Information'}</h2>
            <p className="text-sm text-slate-500">{locale === 'tr' ? 'Derginizin temel meta verileri.' : 'Basic metadata for your hosted journal.'}</p>
          </div>
        </div>

        <form className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">{t('settings.journalName')}</label>
              <input type="text" name="journalName" value={settings.journalName} onChange={handleChange} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-colors" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">{locale === 'tr' ? 'Kısaltma' : 'Abbreviation'}</label>
              <input type="text" name="abbreviation" value={settings.abbreviation} onChange={handleChange} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-colors" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">{t('settings.issn')}</label>
              <input type="text" name="issn" value={settings.issn} onChange={handleChange} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-colors font-mono" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">e-ISSN</label>
              <input type="text" name="eIssn" value={settings.eIssn} onChange={handleChange} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-colors font-mono" />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700">{locale === 'tr' ? 'Amaç ve Kapsam' : 'Aims & Scope'}</label>
            <textarea rows={4} name="aimsScope" value={settings.aimsScope} onChange={handleChange} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-colors" />
          </div>
        </form>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
        <div className="flex items-center gap-3 mb-6 border-b border-slate-100 pb-6">
          <Globe className="w-6 h-6 text-emerald-500" />
          <div>
            <h2 className="text-xl font-bold text-slate-800">{locale === 'tr' ? 'Entegrasyonlar ve Tanımlayıcılar' : 'Integrations & Identifiers'}</h2>
            <p className="text-sm text-slate-500">{locale === 'tr' ? 'Crossref ve DOAJ için API anahtarları.' : 'API keys for Crossref and DOAJ.'}</p>
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
            <h2 className="text-xl font-bold text-slate-800">{locale === 'tr' ? 'Markalaşma' : 'Branding'}</h2>
            <p className="text-sm text-slate-500">{locale === 'tr' ? 'Logoyu ve marka renklerini güncelleyin.' : 'Update logo and brand colors.'}</p>
          </div>
        </div>
        <button 
          onClick={handleSave}
          disabled={isSaving}
          className="w-full md:w-auto px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-all disabled:opacity-50"
        >
          <Save className="w-4 h-4" /> {isSaving ? t('dashboard.loading') : (locale === 'tr' ? 'Tüm Ayarları Kaydet' : 'Save All Settings')}
        </button>
      </div>
    </div>
  );
}
