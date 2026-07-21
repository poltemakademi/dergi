import { useState, useEffect, useMemo, useRef } from 'react';
import { User, Mail, Phone, Link as LinkIcon, Building2, Save, GraduationCap, FileText, Briefcase, MapPin, Hash, Camera, Globe } from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
import { useLocaleStore } from '../../store/useLocaleStore';
import { isProfileComplete } from '../../utils/profileValidation';
import { toast } from 'sonner';
import { useApiQuery } from '../../hooks/useApiQuery';
import { useApiMutation } from '../../hooks/useApiMutation';
import { FormSkeleton } from '../../components/skeletons/FormSkeleton';

export default function Profile() {
  const { user, activeRole, updateUser } = useAuthStore();
  const { t, locale } = useLocaleStore();

  const { data: profileResponse, isLoading: isFetching, error, refetch } = useApiQuery<any>({ url: '/api/user/profile' });
  const { mutate: updateProfile, isLoading: isSaving } = useApiMutation('/api/user/profile', {
    method: 'PUT',
    onSuccess: () => {
      updateUser(formData);
    }
  });

  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    institution: user?.institution || '',
    department: user?.department || '',
    title_field: user?.title_field || '',
    orcid: user?.orcid || '',
    bio: user?.bio || '',
    country: user?.country || '',
    research_interests: user?.research_interests || '',
    social_links: {
      scholar: user?.social_links?.scholar || '',
      researchgate: user?.social_links?.researchgate || '',
      linkedin: user?.social_links?.linkedin || '',
      twitter: user?.social_links?.twitter || ''
    }
  });

  const initialAvatar = user?.avatar?.startsWith('blob:') ? null : (user?.avatar || null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(initialAvatar);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setAvatarPreview(base64String);
        setFormData(prev => ({ ...prev, avatar: base64String }));
        toast.success(locale === 'tr' ? 'Profil fotoğrafı seçildi.' : 'Profile photo selected.');
      };
      reader.readAsDataURL(file);
    }
  };

  // Fetch complete profile on mount
  useEffect(() => {
    if (profileResponse) {
      const pData = profileResponse.data || profileResponse;
      setFormData(prev => ({ 
        ...prev, 
        ...pData,
        social_links: {
          ...prev.social_links,
          ...(pData.social_links || {})
        }
      }));
    }
  }, [profileResponse]);

  const { isValid, missingFields } = useMemo(() => isProfileComplete(activeRole, formData), [activeRole, formData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) {
      toast.error(locale === 'tr' ? 'Lütfen tüm zorunlu alanları doldurun.' : 'Please fill out all required fields.');
      return;
    }

    try {
      await updateProfile(formData);
    } catch (error) {
      // Error is handled by useApiMutation sonner integration
    }
  };

  const isMissing = (field: string) => !isValid && missingFields.includes(field);

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
          <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
            <div className="w-20 h-20 rounded-full bg-indigo-100 flex items-center justify-center border-4 border-white shadow-md overflow-hidden transition-all group-hover:ring-4 group-hover:ring-indigo-100 relative">
              {avatarPreview ? (
                <img src={avatarPreview} alt="Profile" className="w-full h-full object-cover group-hover:opacity-50 transition-opacity" />
              ) : (
                <User className="w-10 h-10 text-indigo-500 group-hover:opacity-0 transition-opacity" />
              )}
              <div className="absolute inset-0 bg-slate-900/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Camera className="w-6 h-6 text-white" />
              </div>
            </div>
            <input type="file" ref={fileInputRef} onChange={handleAvatarChange} className="hidden" accept="image/*" />
          </div>
        </div>

        {isFetching ? (
          <div className="p-8">
            <FormSkeleton fields={5} />
          </div>
        ) : error ? (
          <div className="p-8 text-center flex flex-col items-center gap-3">
            <div className="w-12 h-12 bg-rose-100 text-rose-500 rounded-full flex items-center justify-center mb-2">
              <Globe className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-800">{locale === 'tr' ? 'Profil Yüklenemedi' : 'Failed to Load Profile'}</h3>
            <p className="text-slate-500 text-sm">{error.message}</p>
            <button onClick={() => refetch()} className="mt-4 px-6 py-2 bg-slate-900 text-white rounded-lg font-semibold hover:bg-slate-800">
              {locale === 'tr' ? 'Yeniden Dene' : 'Retry'}
            </button>
          </div>
        ) : (
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
                value={formData.email || ''} 
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
                value={formData.phone || ''} 
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
                value={formData.institution || ''} 
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
                value={formData.department || ''} 
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
                value={formData.title_field || ''} 
                onChange={(e) => setFormData({...formData, title_field: e.target.value})}
                className={getInputClass('title_field')} 
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-slate-400" /> {locale === 'tr' ? 'Ülke' : 'Country'}
                {isFieldRequired('country') && <span className="text-rose-500">*</span>}
              </label>
              <input 
                type="text" 
                value={formData.country || ''} 
                onChange={(e) => setFormData({...formData, country: e.target.value})}
                className={getInputClass('country')} 
                placeholder={locale === 'tr' ? 'Örn: Türkiye' : 'e.g., Turkey'}
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                <Hash className="w-4 h-4 text-slate-400" /> {locale === 'tr' ? 'Araştırma İlgi Alanları' : 'Research Interests'}
                {isFieldRequired('research_interests') && <span className="text-rose-500">*</span>}
              </label>
              <input 
                type="text" 
                value={formData.research_interests || ''} 
                onChange={(e) => setFormData({...formData, research_interests: e.target.value})}
                className={getInputClass('research_interests')} 
                placeholder={locale === 'tr' ? 'Virgülle ayırarak yazın (Örn: Yapay Zeka, Veri Madenciliği)' : 'Comma separated (e.g., AI, Data Mining)'}
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                <LinkIcon className="w-4 h-4 text-slate-400" /> {t('profile.orcid')}
                {isFieldRequired('orcid') && <span className="text-rose-500">*</span>}
              </label>
              <input 
                type="text" 
                value={formData.orcid || ''} 
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
                value={formData.bio || ''} 
                onChange={(e) => setFormData({...formData, bio: e.target.value})}
                rows={4}
                className={`${getInputClass('bio')} resize-none`} 
                placeholder={locale === 'tr' ? 'Akademik geçmişinizden ve uzmanlık alanlarınızdan bahsedin...' : 'Describe your academic background and areas of expertise...'}
              />
            </div>
            
            {/* Social & Academic Links Section */}
            <div className="md:col-span-2 space-y-4 pt-6 border-t border-slate-100">
              <div>
                <h3 className="text-sm font-bold text-slate-800">{locale === 'tr' ? 'Akademik & Sosyal Profiller' : 'Academic & Social Profiles'}</h3>
                <p className="text-xs text-slate-500 mt-1">{locale === 'tr' ? 'Araştırma profillerinizin linklerini ekleyin.' : 'Add links to your research profiles.'}</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 bg-slate-100 p-1.5 rounded text-slate-500">
                    <Globe className="w-4 h-4" />
                  </div>
                  <input 
                    type="url" 
                    value={formData.social_links.scholar} 
                    onChange={(e) => setFormData({...formData, social_links: {...formData.social_links, scholar: e.target.value}})}
                    className="w-full pl-12 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white text-sm" 
                    placeholder="Google Scholar URL"
                  />
                </div>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 bg-slate-100 p-1.5 rounded text-slate-500 font-bold text-xs">
                    RG
                  </div>
                  <input 
                    type="url" 
                    value={formData.social_links.researchgate} 
                    onChange={(e) => setFormData({...formData, social_links: {...formData.social_links, researchgate: e.target.value}})}
                    className="w-full pl-12 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white text-sm" 
                    placeholder="ResearchGate URL"
                  />
                </div>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 bg-slate-100 p-1.5 rounded text-slate-500 font-bold text-xs">
                    in
                  </div>
                  <input 
                    type="url" 
                    value={formData.social_links.linkedin} 
                    onChange={(e) => setFormData({...formData, social_links: {...formData.social_links, linkedin: e.target.value}})}
                    className="w-full pl-12 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white text-sm" 
                    placeholder="LinkedIn URL"
                  />
                </div>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 bg-slate-100 p-1.5 rounded text-slate-500 font-bold text-xs">
                    X
                  </div>
                  <input 
                    type="url" 
                    value={formData.social_links.twitter} 
                    onChange={(e) => setFormData({...formData, social_links: {...formData.social_links, twitter: e.target.value}})}
                    className="w-full pl-12 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white text-sm" 
                    placeholder="Twitter (X) URL"
                  />
                </div>
              </div>
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
        )}
      </div>
    </div>
  );
}
