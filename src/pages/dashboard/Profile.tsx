import { useState } from 'react';
import { useAuthStore } from '../../store/useAuthStore';
import { Save, User, Mail, Link, CreditCard, Building } from 'lucide-react';

export default function Profile() {
  const { user } = useAuthStore();
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setTimeout(() => setIsSaving(false), 1000);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-800">Profile Settings</h2>
            <p className="text-sm text-slate-500 mt-1">Manage your academic profile and contact details.</p>
          </div>
          <div className="w-16 h-16 rounded-full bg-indigo-100 flex items-center justify-center border-4 border-white shadow-md">
            <User className="w-8 h-8 text-indigo-500" />
          </div>
        </div>

        <form onSubmit={handleSave} className="p-8 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                <User className="w-4 h-4 text-slate-400" /> Full Name
              </label>
              <input type="text" defaultValue={user?.name} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-colors" />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                <Mail className="w-4 h-4 text-slate-400" /> Email Address
              </label>
              <input type="email" defaultValue={user?.email} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-colors" />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                <Building className="w-4 h-4 text-slate-400" /> Institution
              </label>
              <input type="text" defaultValue="University of Science" className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-colors" />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                <Link className="w-4 h-4 text-slate-400" /> ORCID iD
              </label>
              <input type="text" defaultValue="0000-0002-1825-0097" className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-colors font-mono text-sm" />
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-slate-400" /> IBAN (For Reviewer Payments)
              </label>
              <input type="text" placeholder="TR00 0000 0000 0000 0000 0000 00" className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-colors font-mono text-sm" />
            </div>
          </div>

          <div className="flex justify-end pt-6 border-t border-slate-100">
            <button 
              type="submit" 
              disabled={isSaving}
              className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold flex items-center gap-2 transition-all disabled:opacity-70"
            >
              <Save className="w-5 h-5" />
              {isSaving ? 'Saving Changes...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
