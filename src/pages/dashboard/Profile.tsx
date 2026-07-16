import { useState, useEffect, useMemo } from 'react';
import { User, Mail, Phone, Link as LinkIcon, Building2, Save, GraduationCap, FileText, Briefcase } from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
import { apiClient } from '../../services/api/client';
import { useLocaleStore } from '../../store/useLocaleStore';
import { isProfileComplete } from '../../utils/profileValidation';
import { toast } from 'sonner';

export default function Profile() {
  const { user, activeRole, updateUser } = useAuthStore();
  const { t, locale } = useLocaleStore();
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    institution: user?.institution || '',
    department: user?.department || '',
    title_field: user?.title_field || '',
    orcid: user?.orcid || '',
    bio: user?.bio || ''
  });

  // Fetch complete profile on mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await apiClient.get('/api/user/profile');
        setFormData(prev => ({ ...prev, ...response.data }));
      } catch (error) {
        console.error('Failed to load profile details:', error);
      }
    };
    fetchProfile();
  }, []);

  const { isValid, missingFields } = useMemo(() => isProfileComplete(activeRole, formData), [activeRole, formData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) {
      toast.error(locale === 'tr' ? 'Lütfen tüm zorunlu alanları doldurun.' : 'Please fill out all required fields.');
      return;
    }

    setIsSaving(true);
    try {
      await apiClient.put('/api/user/profile', formData);
      // Update global user state immediately
      updateUser(formData);
      toast.success(locale === 'tr' ? 'Profil güncellendi' : 'Profile updated successfully');
    } catch (error: any) {
      console.warn('Backend connection failed, applying changes locally for mockup:', error);
      // Fallback: update global user state anyway so the lock screen goes away in our demo
      updateUser(formData);
      toast.success(locale === 'tr' ? 'Profil güncellendi (Yerel MOCK)' : 'Profile updated (Local MOCK)');
    } finally {
      setIsSaving(false);
    }
  };

  const isMissing = (field: string) => !isValid && missingFields.includes(field);
  const isRequired = (field: string) => missingFields.includes(field) || formData[field as keyof typeof formData]; // simplified check: if it's missing it's required. Alternatively, we can check `isProfileComplete` empty profile to get all required fields.

  const emptyProfile = useMemo(() => isProfileComplete(activeRole, {}), [activeRole]);
  const isFieldRequired = (field: string) => emptyProfile.missingFields.includes(field);

  const getInputClass = (field: string) => `w-full px-4 py-2 bg-slate-50 border rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-colors ${
    isMissing(field) ? 'border-rose-500 bg-rose-50/30' : 'border-slate-200'
  }`;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-800">{t('profile.title')}</h2>
            <p className="text-sm text-slate-500 mt-1">{t('profile.subtitle')}</p>
          </div>
          <div className="w-16 h-16 rounded-full bg-indigo-100 flex items-center justify-center border-4 border-white shadow-md">
            <User className="w-8 h-8 text-indigo-500" />
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                <User className="w-4 h-4 text-slate-400" /> {t('profile.fullName')}
                {isFieldRequired('name') && <span className="text-rose-500">*</span>}
              </label>
              <input 
                type="text" 
                value={formData.name} 
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className={getInputClass('name')} 
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                <Mail className="w-4 h-4 text-slate-400" /> {t('profile.email')}
                {isFieldRequired('email') && <span className="text-rose-500">*</span>}
              </label>
              <input 
                type="email" 
                value={formData.email} 
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className={getInputClass('email')} 
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                <Phone className="w-4 h-4 text-slate-400" /> {locale === 'tr' ? 'Telefon Numarası' : 'Phone Number'}
                {isFieldRequired('phone') && <span className="text-rose-500">*</span>}
              </label>
              <input 
                type="tel" 
                value={formData.phone} 
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                className={getInputClass('phone')} 
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                <Building2 className="w-4 h-4 text-slate-400" /> {t('profile.institution')}
                {isFieldRequired('institution') && <span className="text-rose-500">*</span>}
              </label>
              <input 
                type="text" 
                value={formData.institution} 
                onChange={(e) => setFormData({...formData, institution: e.target.value})}
                className={getInputClass('institution')} 
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-slate-400" /> {locale === 'tr' ? 'Departman / Bölüm' : 'Department'}
                {isFieldRequired('department') && <span className="text-rose-500">*</span>}
              </label>
              <input 
                type="text" 
                value={formData.department} 
                onChange={(e) => setFormData({...formData, department: e.target.value})}
                className={getInputClass('department')} 
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-slate-400" /> {locale === 'tr' ? 'Akademik Unvan' : 'Academic Title'}
                {isFieldRequired('title_field') && <span className="text-rose-500">*</span>}
              </label>
              <input 
                type="text" 
                value={formData.title_field} 
                onChange={(e) => setFormData({...formData, title_field: e.target.value})}
                className={getInputClass('title_field')} 
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                <LinkIcon className="w-4 h-4 text-slate-400" /> {t('profile.orcid')}
                {isFieldRequired('orcid') && <span className="text-rose-500">*</span>}
              </label>
              <input 
                type="text" 
                value={formData.orcid} 
                onChange={(e) => setFormData({...formData, orcid: e.target.value})}
                className={`${getInputClass('orcid')} font-mono text-sm`} 
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                <FileText className="w-4 h-4 text-slate-400" /> {locale === 'tr' ? 'Biyografi ve Uzmanlık Alanları' : 'Biography & Expertise'}
                {isFieldRequired('bio') && <span className="text-rose-500">*</span>}
              </label>
              <textarea 
                value={formData.bio} 
                onChange={(e) => setFormData({...formData, bio: e.target.value})}
                rows={4}
                className={`${getInputClass('bio')} resize-none`} 
                placeholder={locale === 'tr' ? 'Akademik geçmişinizden ve uzmanlık alanlarınızdan bahsedin...' : 'Describe your academic background and areas of expertise...'}
              />
            </div>
          </div>

          <div className="flex justify-end pt-6 border-t border-slate-100">
            <button 
              type="submit" 
              disabled={isSaving}
              className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold flex items-center gap-2 transition-all disabled:opacity-70"
            >
              <Save className="w-5 h-5" />
              {isSaving ? t('dashboard.loading') : t('dashboard.save')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
