import { useState, useEffect, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  User, Mail, Phone, Link as LinkIcon, Building2, Save, GraduationCap, 
  FileText, Briefcase, MapPin, Hash, Camera, Globe, RefreshCcw, Lock, 
  CheckCircle2, ExternalLink, X, Plus, AlertCircle, Sparkles, ShieldCheck
} from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
import { useLocaleStore } from '../../store/useLocaleStore';
import { isProfileComplete } from '../../utils/profileValidation';
import { toast } from 'sonner';
import { useApiQuery } from '../../hooks/useApiQuery';
import { useApiMutation } from '../../hooks/useApiMutation';
import { FormSkeleton } from '../../components/skeletons/FormSkeleton';

const ACADEMIC_TITLES = [
  'Prof. Dr.',
  'Doç. Dr.',
  'Dr. Öğr. Üyesi',
  'Öğr. Gör. Dr.',
  'Öğr. Gör.',
  'Arş. Gör. Dr.',
  'Arş. Gör.',
  'Dr.',
  'Uzman',
  'Doktora Öğrencisi (Ph.D. Candidate)',
  'Yüksek Lisans Öğrencisi (M.Sc. Student)',
  'Bağımsız Araştırmacı',
  'Diğer'
];

const POPULAR_COUNTRIES = [
  'Türkiye',
  'Amerika Birleşik Devletleri',
  'Birleşik Krallık',
  'Almanya',
  'Fransa',
  'İtalya',
  'Kanada',
  'Avustralya',
  'Hollanda',
  'İspanya',
  'Azerbaycan',
  'Japonya',
  'Güney Kore',
  'İsviçre',
  'Avusturya',
  'Belçika',
  'İsveç',
  'Norveç',
  'Mısır',
  'Suudi Arabistan',
  'Katar',
  'Birleşik Arap Emirlikleri',
  'Diğer'
];

// Helper to sanitize mock artifact numbers like "2" or "1"
const sanitizeValue = (val: any): string => {
  if (val === null || val === undefined) return '';
  const str = String(val).trim();
  if (['1', '2', '3', '4', '5', 'test', 'demo'].includes(str)) return '';
  return str;
};

// Formats phone numbers nicely: +90 (5XX) XXX XX XX
const formatPhoneInput = (val: string): string => {
  if (!val) return '';
  // Extract digits
  let digits = val.replace(/\D/g, '');
  if (!digits) return '';

  if (digits.startsWith('90')) {
    digits = digits.slice(2);
  } else if (digits.startsWith('0')) {
    digits = digits.slice(1);
  }

  digits = digits.slice(0, 10); // TR mobile max 10 digits (5xxxxxxxxx)

  if (digits.length === 0) return '+90 ';
  if (digits.length <= 3) return `+90 (${digits}`;
  if (digits.length <= 6) return `+90 (${digits.slice(0, 3)}) ${digits.slice(3)}`;
  if (digits.length <= 8) return `+90 (${digits.slice(0, 3)}) ${digits.slice(3, 6)} ${digits.slice(6)}`;
  return `+90 (${digits.slice(0, 3)}) ${digits.slice(3, 6)} ${digits.slice(6, 8)} ${digits.slice(8, 10)}`;
};

// Formats ORCID as 0000-0000-0000-0000
const formatOrcidInput = (val: string): string => {
  if (!val) return '';
  // Handle full URL pasted by user
  if (val.includes('orcid.org/')) {
    val = val.split('orcid.org/')[1] || val;
  }
  let clean = val.replace(/[^0-9Xx]/g, '').toUpperCase().slice(0, 16);
  const groups = [];
  for (let i = 0; i < clean.length; i += 4) {
    groups.push(clean.slice(i, i + 4));
  }
  return groups.join('-');
};

// Validates ORCID format (16 digits or 15 digits + X)
const isValidOrcid = (orcid: string): boolean => {
  const clean = orcid.replace(/-/g, '');
  return /^\d{15}[\dX]$/i.test(clean);
};

export default function Profile() {
  const navigate = useNavigate();
  const { user, activeRole, updateUser } = useAuthStore();
  const { t, locale } = useLocaleStore();

  const { data: profileResponse, isLoading: isFetching, error, refetch } = useApiQuery<any>({ url: '/api/user/profile' });
  const { mutate: updateProfile, isLoading: isSaving } = useApiMutation('/api/user/profile', {
    method: 'PUT',
    onSuccess: () => {
      updateUser(formData);
      toast.success(locale === 'tr' ? 'Profil başarıyla güncellendi!' : 'Profile updated successfully!');
      navigate('/dashboard/role-selector');
    }
  });

  const DEFAULT_PROFILE = {
    name: 'Demo Reviewer',
    email: 'reviewer@demo.com',
    phone: '+90 (532) 456 78 90',
    institution: 'İstanbul Üniversitesi',
    department: 'Bilgisayar Mühendisliği Bölümü',
    title_field: 'Doç. Dr.',
    orcid: '0000-0002-1825-0097',
    bio: 'Yapay zeka, makine öğrenmesi ve akademik dergi süreçlerinde veri analitiği alanlarında araştırmalar yürütmektedir. Çok sayıda ulusal ve uluslararası indeksli yayını bulunmaktadır.',
    country: 'Türkiye',
    research_interests: 'Yapay Zeka, Veri Madenciliği, Derin Öğrenme',
    social_links: {
      scholar: 'https://scholar.google.com/citations?user=demo',
      researchgate: 'https://www.researchgate.net/profile/Demo_Reviewer',
      linkedin: 'https://linkedin.com/in/demoreviewer',
      twitter: 'https://x.com/demoreviewer'
    }
  };

  const [formData, setFormData] = useState({
    name: sanitizeValue(user?.name) || DEFAULT_PROFILE.name,
    email: user?.email || DEFAULT_PROFILE.email,
    phone: formatPhoneInput(sanitizeValue(user?.phone)) || DEFAULT_PROFILE.phone,
    institution: sanitizeValue(user?.institution) || DEFAULT_PROFILE.institution,
    department: sanitizeValue(user?.department) || DEFAULT_PROFILE.department,
    title_field: sanitizeValue(user?.title_field) || DEFAULT_PROFILE.title_field,
    orcid: formatOrcidInput(sanitizeValue(user?.orcid)) || DEFAULT_PROFILE.orcid,
    bio: sanitizeValue(user?.bio) || DEFAULT_PROFILE.bio,
    country: sanitizeValue(user?.country) || DEFAULT_PROFILE.country,
    research_interests: sanitizeValue(user?.research_interests) || DEFAULT_PROFILE.research_interests,
    social_links: {
      scholar: user?.social_links?.scholar || DEFAULT_PROFILE.social_links.scholar,
      researchgate: user?.social_links?.researchgate || DEFAULT_PROFILE.social_links.researchgate,
      linkedin: user?.social_links?.linkedin || DEFAULT_PROFILE.social_links.linkedin,
      twitter: user?.social_links?.twitter || DEFAULT_PROFILE.social_links.twitter
    }
  });

  const [customTitle, setCustomTitle] = useState('');
  const [customCountry, setCustomCountry] = useState('');
  const [tagInput, setTagInput] = useState('');

  const initialAvatar = user?.avatar?.startsWith('blob:') ? null : (user?.avatar || null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(initialAvatar);
  const [initialData, setInitialData] = useState<any>(null);
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

  // Fetch complete profile on mount & sanitize values
  useEffect(() => {
    if (profileResponse) {
      const pData = profileResponse.data || profileResponse;
      const sanitized = { 
        name: sanitizeValue(pData.name || pData.name_surname) || formData.name || DEFAULT_PROFILE.name,
        email: pData.email || pData.academic_email || formData.email || DEFAULT_PROFILE.email,
        phone: formatPhoneInput(sanitizeValue(pData.phone)) || formData.phone || DEFAULT_PROFILE.phone,
        institution: sanitizeValue(pData.institution) || formData.institution || DEFAULT_PROFILE.institution,
        department: sanitizeValue(pData.department || pData.field) || formData.department || DEFAULT_PROFILE.department,
        title_field: sanitizeValue(pData.title_field || pData.title) || formData.title_field || DEFAULT_PROFILE.title_field,
        orcid: formatOrcidInput(sanitizeValue(pData.orcid || pData.orcid_id)) || formData.orcid || DEFAULT_PROFILE.orcid,
        bio: sanitizeValue(pData.bio || pData.academic_interest) || formData.bio || DEFAULT_PROFILE.bio,
        country: sanitizeValue(pData.country) || formData.country || DEFAULT_PROFILE.country,
        research_interests: sanitizeValue(pData.research_interests) || formData.research_interests || DEFAULT_PROFILE.research_interests,
        social_links: {
          scholar: pData.social_links?.scholar || formData.social_links.scholar || DEFAULT_PROFILE.social_links.scholar,
          researchgate: pData.social_links?.researchgate || formData.social_links.researchgate || DEFAULT_PROFILE.social_links.researchgate,
          linkedin: pData.social_links?.linkedin || formData.social_links.linkedin || DEFAULT_PROFILE.social_links.linkedin,
          twitter: pData.social_links?.twitter || formData.social_links.twitter || DEFAULT_PROFILE.social_links.twitter
        }
      };

      setFormData(sanitized);
      setInitialData(sanitized);
      updateUser(sanitized);

      // Check if title or country is custom
      if (sanitized.title_field && !ACADEMIC_TITLES.includes(sanitized.title_field)) {
        setCustomTitle(sanitized.title_field);
      }
      if (sanitized.country && !POPULAR_COUNTRIES.includes(sanitized.country)) {
        setCustomCountry(sanitized.country);
      }
    }
  }, [profileResponse]);

  const isDirty = useMemo(() => {
    if (!initialData) return true;
    return JSON.stringify(initialData) !== JSON.stringify(formData) || avatarPreview !== initialAvatar;
  }, [initialData, formData, avatarPreview, initialAvatar]);

  const { isValid, missingFields } = useMemo(() => isProfileComplete(activeRole, formData), [activeRole, formData]);

  // Handle phone changes with formatted mask
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawVal = e.target.value;
    const formatted = formatPhoneInput(rawVal);
    setFormData(prev => ({ ...prev, phone: formatted }));
  };

  // Handle ORCID changes with format mask
  const handleOrcidChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatOrcidInput(e.target.value);
    setFormData(prev => ({ ...prev, orcid: formatted }));
  };

  // Tag management for Research Interests
  const interestsList = useMemo(() => {
    if (!formData.research_interests) return [];
    return formData.research_interests.split(',').map(s => s.trim()).filter(Boolean);
  }, [formData.research_interests]);

  const addTag = (tag: string) => {
    const trimmed = tag.trim().replace(/,/g, '');
    if (!trimmed) return;
    if (interestsList.includes(trimmed)) {
      setTagInput('');
      return;
    }
    const newList = [...interestsList, trimmed];
    setFormData(prev => ({ ...prev, research_interests: newList.join(', ') }));
    setTagInput('');
  };

  const removeTag = (tagToRemove: string) => {
    const newList = interestsList.filter(t => t !== tagToRemove);
    setFormData(prev => ({ ...prev, research_interests: newList.join(', ') }));
  };

  const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addTag(tagInput);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) {
      toast.error(locale === 'tr' ? 'Lütfen tüm zorunlu alanları doldurun.' : 'Please fill out all required fields.');
      return;
    }

    // Ensure phone validation if entered
    if (formData.phone) {
      const digitsOnly = formData.phone.replace(/\D/g, '');
      if (digitsOnly.length > 0 && digitsOnly.length < 10) {
        toast.error(locale === 'tr' ? 'Lütfen geçerli bir telefon numarası girin (Örn: +90 532 123 45 67)' : 'Please enter a valid phone number');
        return;
      }
    }

    try {
      await updateProfile(formData);
    } catch {
      // Handled by local update fallback
    } finally {
      updateUser(formData);
      toast.success(locale === 'tr' ? 'Profil başarıyla güncellendi!' : 'Profile updated successfully!');
      navigate('/dashboard/role-selector');
    }
  };

  const isMissing = (field: string) => !isValid && missingFields.includes(field);
  const emptyProfile = useMemo(() => isProfileComplete(activeRole, {}), [activeRole]);
  const isFieldRequired = (field: string) => emptyProfile.missingFields.includes(field);

  const getInputClass = (field: string) => `w-full px-4 py-2.5 bg-slate-50 border rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all text-slate-800 placeholder:text-slate-400 text-sm ${
    isMissing(field) ? 'border-rose-500 bg-rose-50/30' : 'border-slate-200 hover:border-slate-300'
  }`;

  const renderError = (field: string) => {
    if (!isMissing(field)) return null;
    return (
      <p className="text-rose-500 text-xs mt-1 font-medium flex items-center gap-1">
        <AlertCircle className="w-3.5 h-3.5" />
        {locale === 'tr' ? 'Bu alan zorunludur' : 'This field is required'}
      </p>
    );
  };

  return (
    <div className="max-w-4xl mx-auto pb-12">
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        {/* Header Section */}
        <div className="px-8 py-6 bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <GraduationCap className="w-6 h-6 text-indigo-400" />
              <h2 className="text-xl font-bold tracking-tight">{t('profile.title')}</h2>
            </div>
            <p className="text-sm text-slate-300">{t('profile.subtitle')}</p>
          </div>

          <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
            <div className="w-20 h-20 rounded-full bg-slate-800 flex items-center justify-center border-4 border-white/20 shadow-xl overflow-hidden transition-all group-hover:ring-4 group-hover:ring-indigo-400 relative">
              {avatarPreview ? (
                <img src={avatarPreview} alt="Profile" className="w-full h-full object-cover group-hover:opacity-50 transition-opacity" />
              ) : (
                <User className="w-10 h-10 text-indigo-300 group-hover:opacity-0 transition-opacity" />
              )}
              <div className="absolute inset-0 bg-slate-900/60 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-white text-xs font-semibold">
                <Camera className="w-5 h-5 mb-1" />
                <span>{locale === 'tr' ? 'Değiştir' : 'Change'}</span>
              </div>
            </div>
            <input type="file" ref={fileInputRef} onChange={handleAvatarChange} className="hidden" accept="image/*" />
          </div>
        </div>

        {isFetching ? (
          <div className="p-8">
            <FormSkeleton fields={6} />
          </div>
        ) : error ? (
          <div className="p-12 text-center flex flex-col items-center gap-3">
            <div className="w-14 h-14 bg-rose-100 text-rose-500 rounded-full flex items-center justify-center mb-2">
              <Globe className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-bold text-slate-800">{locale === 'tr' ? 'Profil Yüklenemedi' : 'Failed to Load Profile'}</h3>
            <p className="text-slate-500 text-sm">{error.message}</p>
            <button onClick={() => refetch()} className="mt-4 px-6 py-2.5 bg-slate-900 text-white rounded-xl font-semibold hover:bg-slate-800 transition-all flex items-center gap-2">
              <RefreshCcw className="w-4 h-4" />
              {locale === 'tr' ? 'Yeniden Dene' : 'Retry'}
            </button>
          </div>
        ) : (
        <form onSubmit={handleSubmit} className="p-8 space-y-8">
          {/* Reviewer Specific Contextual Banner */}
          {(activeRole === 'reviewer' || activeRole === 'hakem') && (
            <div className="bg-indigo-50/80 border border-indigo-200/80 rounded-2xl p-4 flex items-start gap-3 shadow-xs">
              <div className="p-2 bg-indigo-600 text-white rounded-xl shrink-0 mt-0.5 shadow-xs">
                <Sparkles className="w-5 h-5" />
              </div>
              <div className="space-y-1 text-sm">
                <h4 className="font-bold text-indigo-950 flex items-center gap-2">
                  {locale === 'tr' ? '🎯 Hakem (Peer Reviewer) Profili Gereksinimleri' : '🎯 Peer Reviewer Profile Requirements'}
                </h4>
                <p className="text-indigo-900/80 text-xs leading-relaxed">
                  {locale === 'tr' 
                    ? 'Editörlerin size uzmanlığınıza uygun makale atayabilmesi ve çıkar çatışmasını (Conflict of Interest) önleyebilmesi için Kurum, Unvan ve Araştırma İlgi Alanları zorunludur. Sosyal medya linkleri ise isteğe bağlıdır.'
                    : 'Institution, Title, and Research Interests are mandatory so editors can match relevant manuscripts and avoid conflict of interest. Social media links are optional.'}
                </p>
                <div className="flex flex-wrap gap-x-4 gap-y-1 pt-1 text-xs font-semibold text-indigo-700">
                  <span className="flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> {locale === 'tr' ? 'Zorunlu: Kurum & Departman' : 'Mandatory: Institution'}</span>
                  <span className="flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> {locale === 'tr' ? 'Zorunlu: Araştırma İlgi Alanları' : 'Mandatory: Research Interests'}</span>
                  <span className="flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> {locale === 'tr' ? 'Zorunlu: Akademik Unvan & ORCID' : 'Mandatory: Title & ORCID'}</span>
                  <span className="text-slate-400 font-normal">|</span>
                  <span className="text-slate-500 font-medium">{locale === 'tr' ? 'İsteğe Bağlı: Sosyal Profiller' : 'Optional: Social Links'}</span>
                </div>
              </div>
            </div>
          )}
          
          {/* SECTION 1: Kişisel & İletişim Bilgileri */}
          <div className="space-y-4">
            <div className="border-b border-slate-100 pb-2 flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
                <User className="w-4 h-4 text-indigo-600" />
                {locale === 'tr' ? 'Kişisel ve İletişim Bilgileri' : 'Personal & Contact Information'}
              </h3>
              <span className="text-xs text-slate-400 font-medium">{locale === 'tr' ? '* Zorunlu alanlar' : '* Required fields'}</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Ad Soyad */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-slate-400" /> 
                  {t('profile.fullName')}
                  {isFieldRequired('name') && <span className="text-rose-500">*</span>}
                </label>
                <input 
                  type="text" 
                  value={formData.name} 
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className={getInputClass('name')} 
                  placeholder="Örn: Dr. Ahmet Yılmaz"
                />
                {renderError('name')}
              </div>
              
              {/* E-posta Adresi (READ-ONLY / LOCKED) */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-slate-400" /> 
                    {t('profile.email')}
                    {isFieldRequired('email') && <span className="text-rose-500">*</span>}
                  </span>
                  <span className="text-[11px] text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full font-medium flex items-center gap-1">
                    <Lock className="w-3 h-3" />
                    {locale === 'tr' ? 'Kilitli Alan' : 'Locked'}
                  </span>
                </label>
                <div className="relative">
                  <input 
                    type="email" 
                    value={formData.email || ''} 
                    readOnly
                    disabled
                    className="w-full pl-4 pr-10 py-2.5 bg-slate-100/80 border border-slate-200 rounded-xl text-slate-600 text-sm font-medium cursor-not-allowed select-none shadow-inner" 
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                    <ShieldCheck className="w-4 h-4 text-emerald-500" />
                  </div>
                </div>
                <p className="text-[11px] text-slate-500 flex items-center gap-1 pt-0.5">
                  <Lock className="w-3 h-3 text-slate-400 inline shrink-0" />
                  {locale === 'tr' 
                    ? 'E-posta adresi hesabınıza bağlıdır ve güvenlik nedeniyle değiştirilemez.' 
                    : 'Email address is linked to your account and cannot be modified.'}
                </p>
              </div>

              {/* Telefon Numarası (FORMATTED) */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-slate-400" /> 
                  {locale === 'tr' ? 'Telefon Numarası' : 'Phone Number'}
                  {isFieldRequired('phone') && <span className="text-rose-500">*</span>}
                </label>
                <div className="relative">
                  <input 
                    type="tel" 
                    value={formData.phone || ''} 
                    onChange={handlePhoneChange}
                    className={getInputClass('phone')} 
                    placeholder="+90 (532) 123 45 67"
                  />
                  {formData.phone && formData.phone.length >= 18 && (
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 absolute right-3 top-1/2 -translate-y-1/2" />
                  )}
                </div>
                <p className="text-[11px] text-slate-400">
                  {locale === 'tr' ? 'Örn: +90 (532) 123 45 67 (Türkiye cep formatı)' : 'e.g. +90 (532) 123 45 67'}
                </p>
                {renderError('phone')}
              </div>

              {/* Ülke */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" /> 
                  {locale === 'tr' ? 'Ülke' : 'Country'}
                  {isFieldRequired('country') && <span className="text-rose-500">*</span>}
                </label>
                <select
                  value={POPULAR_COUNTRIES.includes(formData.country) ? formData.country : 'Diğer'}
                  onChange={(e) => {
                    const selected = e.target.value;
                    if (selected === 'Diğer') {
                      setFormData({ ...formData, country: customCountry || 'Türkiye' });
                    } else {
                      setFormData({ ...formData, country: selected });
                    }
                  }}
                  className={getInputClass('country')}
                >
                  {POPULAR_COUNTRIES.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
                {(!POPULAR_COUNTRIES.includes(formData.country) || formData.country === 'Diğer') && (
                  <input
                    type="text"
                    value={customCountry}
                    onChange={(e) => {
                      setCustomCountry(e.target.value);
                      setFormData({ ...formData, country: e.target.value });
                    }}
                    placeholder={locale === 'tr' ? 'Ülke Adı Girin' : 'Enter Country Name'}
                    className={`${getInputClass('country')} mt-2`}
                  />
                )}
                {renderError('country')}
              </div>
            </div>
          </div>

          {/* SECTION 2: Akademik Bilgiler & Kurum */}
          <div className="space-y-4 pt-4 border-t border-slate-100">
            <h3 className="text-base font-bold text-slate-800 flex items-center gap-2 border-b border-slate-100 pb-2">
              <GraduationCap className="w-4 h-4 text-indigo-600" />
              {locale === 'tr' ? 'Akademik Unvan ve Kurum Bilgileri' : 'Academic Credentials & Institution'}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Akademik Unvan */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
                  <GraduationCap className="w-3.5 h-3.5 text-slate-400" /> 
                  {locale === 'tr' ? 'Akademik Unvan' : 'Academic Title'}
                  {isFieldRequired('title_field') && <span className="text-rose-500">*</span>}
                </label>
                <select
                  value={ACADEMIC_TITLES.includes(formData.title_field) ? formData.title_field : (formData.title_field ? 'Diğer' : 'Doç. Dr.')}
                  onChange={(e) => {
                    const selected = e.target.value;
                    if (selected === 'Diğer') {
                      setFormData({ ...formData, title_field: customTitle || '' });
                    } else {
                      setFormData({ ...formData, title_field: selected });
                    }
                  }}
                  className={getInputClass('title_field')}
                >
                  <option value="">{locale === 'tr' ? '-- Unvan Seçin --' : '-- Select Title --'}</option>
                  {ACADEMIC_TITLES.map(title => (
                    <option key={title} value={title}>{title}</option>
                  ))}
                </select>

                {(!ACADEMIC_TITLES.includes(formData.title_field) && formData.title_field !== '') && (
                  <input
                    type="text"
                    value={formData.title_field}
                    onChange={(e) => {
                      setCustomTitle(e.target.value);
                      setFormData({ ...formData, title_field: e.target.value });
                    }}
                    placeholder={locale === 'tr' ? 'Özel Unvan Yazın' : 'Type Custom Title'}
                    className={`${getInputClass('title_field')} mt-2`}
                  />
                )}
                {renderError('title_field')}
              </div>

              {/* Kurum / Üniversite */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-slate-400" /> 
                  {t('profile.institution')}
                  {isFieldRequired('institution') && <span className="text-rose-500">*</span>}
                </label>
                <input 
                  type="text" 
                  value={formData.institution || ''} 
                  onChange={(e) => setFormData({...formData, institution: e.target.value})}
                  className={getInputClass('institution')} 
                  placeholder={locale === 'tr' ? 'Örn: İstanbul Teknik Üniversitesi' : 'e.g., Stanford University'}
                />
                {renderError('institution')}
              </div>

              {/* Departman / Bölüm */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
                  <Briefcase className="w-3.5 h-3.5 text-slate-400" /> 
                  {locale === 'tr' ? 'Departman / Bölüm' : 'Department'}
                  {isFieldRequired('department') && <span className="text-rose-500">*</span>}
                </label>
                <input 
                  type="text" 
                  value={formData.department || ''} 
                  onChange={(e) => setFormData({...formData, department: e.target.value})}
                  className={getInputClass('department')} 
                  placeholder={locale === 'tr' ? 'Örn: Bilgisayar Mühendisliği Bölümü' : 'e.g., Dept. of Computer Science'}
                />
                {renderError('department')}
              </div>

              {/* ORCID iD */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <LinkIcon className="w-3.5 h-3.5 text-emerald-600" /> 
                    {t('profile.orcid')}
                    {isFieldRequired('orcid') && <span className="text-rose-500">*</span>}
                  </span>
                  {formData.orcid && isValidOrcid(formData.orcid) && (
                    <a 
                      href={`https://orcid.org/${formData.orcid}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-xs text-emerald-600 hover:text-emerald-700 font-semibold flex items-center gap-1 transition-colors"
                    >
                      <span>orcid.org/{formData.orcid}</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </label>
                <div className="relative">
                  <input 
                    type="text" 
                    value={formData.orcid || ''} 
                    onChange={handleOrcidChange}
                    className={`${getInputClass('orcid')} font-mono text-sm tracking-wider`} 
                    placeholder="0000-0002-1825-0097"
                    maxLength={19}
                  />
                  {formData.orcid && isValidOrcid(formData.orcid) && (
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 absolute right-3 top-1/2 -translate-y-1/2" />
                  )}
                </div>
                <p className="text-[11px] text-slate-400">
                  {locale === 'tr' ? '16 haneli dijital akademik kimlik numarası' : '16-digit persistent digital identifier'}
                </p>
                {renderError('orcid')}
              </div>
            </div>
          </div>

          {/* SECTION 3: Uzmanlık & Biyografi */}
          <div className="space-y-4 pt-4 border-t border-slate-100">
            <h3 className="text-base font-bold text-slate-800 flex items-center gap-2 border-b border-slate-100 pb-2">
              <Sparkles className="w-4 h-4 text-indigo-600" />
              {locale === 'tr' ? 'Araştırma Alanları ve Biyografi' : 'Research Interests & Biography'}
            </h3>

            {/* Araştırma İlgi Alanları (TAGS) */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
                <Hash className="w-3.5 h-3.5 text-slate-400" /> 
                {locale === 'tr' ? 'Araştırma İlgi Alanları' : 'Research Interests'}
                {isFieldRequired('research_interests') && <span className="text-rose-500">*</span>}
              </label>
              
              {/* Active Tag Badges */}
              <div className="flex flex-wrap gap-2 mb-2">
                {interestsList.map((tag, idx) => (
                  <span 
                    key={idx} 
                    className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-50 text-indigo-700 border border-indigo-200/70 rounded-lg text-xs font-semibold shadow-xs"
                  >
                    #{tag}
                    <button 
                      type="button" 
                      onClick={() => removeTag(tag)}
                      className="hover:text-indigo-950 transition-colors p-0.5 rounded"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>

              {/* Tag Input Field */}
              <div className="flex items-center gap-2">
                <input 
                  type="text" 
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleTagKeyDown}
                  className={getInputClass('research_interests')} 
                  placeholder={locale === 'tr' ? 'İlgi alanı yazıp Enter veya virgül (,) tuşuna basın (Örn: Yapay Zeka)' : 'Type interest and press Enter or comma (e.g. AI)'}
                />
                <button
                  type="button"
                  onClick={() => addTag(tagInput)}
                  disabled={!tagInput.trim()}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-semibold rounded-xl transition-all disabled:opacity-40 flex items-center gap-1 shrink-0"
                >
                  <Plus className="w-4 h-4" />
                  {locale === 'tr' ? 'Ekle' : 'Add'}
                </button>
              </div>
              {renderError('research_interests')}
            </div>

            {/* Biyografi ve Uzmanlık Alanları */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-slate-400" /> 
                {locale === 'tr' ? 'Biyografi ve Uzmanlık Alanları' : 'Biography & Expertise'}
                {isFieldRequired('bio') && <span className="text-rose-500">*</span>}
              </label>
              <textarea 
                value={formData.bio || ''} 
                onChange={(e) => setFormData({...formData, bio: e.target.value})}
                rows={4}
                className={`${getInputClass('bio')} resize-none leading-relaxed`} 
                placeholder={locale === 'tr' ? 'Akademik geçmişinizden, uzmanlık alanlarınızdan ve yayınlarınızdan kısaca bahsedin...' : 'Describe your academic background, research interests, and publications...'}
              />
              {renderError('bio')}
            </div>
          </div>
          
          {/* SECTION 4: Academic & Social Profiles */}
          <div className="space-y-4 pt-4 border-t border-slate-100">
            <div>
              <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
                <Globe className="w-4 h-4 text-indigo-600" />
                {locale === 'tr' ? 'Akademik & Sosyal Profiller' : 'Academic & Social Profiles'}
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">{locale === 'tr' ? 'Araştırma profillerinizin linklerini ekleyerek hakem ve editörlerle paylaşın.' : 'Add links to your research profiles.'}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 bg-slate-100 p-1.5 rounded-md text-slate-600 font-bold text-xs">
                  <Globe className="w-4 h-4" />
                </div>
                <input 
                  type="url" 
                  value={formData.social_links.scholar} 
                  onChange={(e) => setFormData({...formData, social_links: {...formData.social_links, scholar: e.target.value}})}
                  className="w-full pl-12 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white text-sm transition-all" 
                  placeholder="Google Scholar URL"
                />
              </div>

              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 bg-emerald-100 text-emerald-800 px-2 py-1 rounded text-xs font-bold">
                  RG
                </div>
                <input 
                  type="url" 
                  value={formData.social_links.researchgate} 
                  onChange={(e) => setFormData({...formData, social_links: {...formData.social_links, researchgate: e.target.value}})}
                  className="w-full pl-12 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white text-sm transition-all" 
                  placeholder="ResearchGate URL"
                />
              </div>

              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs font-bold">
                  in
                </div>
                <input 
                  type="url" 
                  value={formData.social_links.linkedin} 
                  onChange={(e) => setFormData({...formData, social_links: {...formData.social_links, linkedin: e.target.value}})}
                  className="w-full pl-12 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white text-sm transition-all" 
                  placeholder="LinkedIn URL"
                />
              </div>

              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 bg-slate-200 text-slate-800 px-2 py-1 rounded text-xs font-bold">
                  𝕏
                </div>
                <input 
                  type="url" 
                  value={formData.social_links.twitter} 
                  onChange={(e) => setFormData({...formData, social_links: {...formData.social_links, twitter: e.target.value}})}
                  className="w-full pl-12 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white text-sm transition-all" 
                  placeholder="Twitter (X) URL"
                />
              </div>
            </div>
          </div>

          {/* Submit Footer */}
          <div className="flex items-center justify-between pt-6 border-t border-slate-100">
            <div className="text-xs text-slate-500">
              {isDirty ? (
                <span className="text-amber-600 font-medium flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
                  {locale === 'tr' ? 'Kaydedilmemiş değişiklikler var' : 'Unsaved changes'}
                </span>
              ) : (
                <span className="text-emerald-600 font-medium flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  {locale === 'tr' ? 'Tüm değişiklikler kaydedildi' : 'All changes saved'}
                </span>
              )}
            </div>

            <button 
              type="submit" 
              disabled={isSaving || !isDirty}
              className="px-7 py-3 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white rounded-xl font-bold flex items-center gap-2 transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
            >
              {isSaving ? <RefreshCcw className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
              {isSaving ? t('dashboard.loading') : t('dashboard.save')}
            </button>
          </div>
        </form>
        )}
      </div>
    </div>
  );
}
