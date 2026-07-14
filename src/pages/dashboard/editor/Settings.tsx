import { Save, Globe, Image as ImageIcon, BookOpen } from 'lucide-react';

export default function Settings() {
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
              <input type="text" defaultValue="Journal of Modern Science" className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-colors" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">Abbreviation</label>
              <input type="text" defaultValue="JMS" className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-colors" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">ISSN</label>
              <input type="text" defaultValue="1234-5678" className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-colors font-mono" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">e-ISSN</label>
              <input type="text" defaultValue="8765-4321" className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-colors font-mono" />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700">Aims & Scope</label>
            <textarea rows={4} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-colors" defaultValue="The Journal of Modern Science is an open-access peer-reviewed journal dedicated to publishing high-quality research..." />
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
            <input type="text" defaultValue="10.1234" className="w-full md:w-1/2 px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-colors font-mono" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700">DOAJ API Key</label>
            <input type="password" defaultValue="************************" className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-colors font-mono" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <ImageIcon className="w-6 h-6 text-rose-500" />
            <div>
              <h2 className="text-xl font-bold text-slate-800">Branding</h2>
              <p className="text-sm text-slate-500">Update logo and brand colors.</p>
            </div>
          </div>
          <button className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold flex items-center gap-2 transition-all">
            <Save className="w-4 h-4" /> Save All Settings
          </button>
        </div>
      </div>
    </div>
  );
}
