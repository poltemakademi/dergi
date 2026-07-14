export const translations = {
  en: {
    // Sidebar
    'nav.workspace': 'Workspace',
    'nav.contextMatrix': 'Context Matrix',
    'nav.communications': 'Communications',
    'nav.profile': 'Academic Profile',
    'nav.executiveEditor': 'Executive Editor',
    'nav.analytics': 'Analytics',
    'nav.manuscripts': 'Manuscripts',
    'nav.issueStudio': 'Issue Studio',
    'nav.configuration': 'Configuration',
    'nav.author': 'Author / Researcher',
    'nav.mySubmissions': 'My Submissions',
    'nav.newSubmission': 'New Submission',
    'nav.reviewer': 'Peer Reviewer',
    'nav.reviewQueue': 'Review Queue',
    'nav.layoutEditor': 'Layout & Production',
    'nav.productionLine': 'Production Line',
    'nav.galleyProofs': 'Galley Proofs',
    'nav.enterprise': 'Enterprise Edition',
    'nav.returnToWebsite': 'Return to Website',
    
    // Header
    'header.search': 'Search...',
    
    // Role Selector
    'roleSelect.welcome': 'Welcome back',
    'roleSelect.subtitle': 'Select your context to continue. Your workspace will automatically adapt to the permissions and tools required for your selected role.',
    'roleSelect.enter': 'Enter',
    'roleSelect.lastActive': 'Last active',
    
    // Role Names
    'role.editor': 'Editor',
    'role.author': 'Author',
    'role.reviewer': 'Reviewer',
    'role.layout_editor': 'Layout Editor',
    'role.super_admin': 'System Admin',
    
    // Status Labels
    'stat.pending': 'Pending',
    'stat.assigned': 'Assigned',
    'stat.inReview': 'In Review',
  },
  tr: {
    // Sidebar
    'nav.workspace': 'Çalışma Alanı',
    'nav.contextMatrix': 'Bağlam Matrisi',
    'nav.communications': 'İletişim',
    'nav.profile': 'Akademik Profil',
    'nav.executiveEditor': 'Sorumlu Editör',
    'nav.analytics': 'Analitik',
    'nav.manuscripts': 'Makaleler',
    'nav.issueStudio': 'Sayı Stüdyosu',
    'nav.configuration': 'Yapılandırma',
    'nav.author': 'Yazar / Araştırmacı',
    'nav.mySubmissions': 'Gönderilerim',
    'nav.newSubmission': 'Yeni Gönderi',
    'nav.reviewer': 'Hakem',
    'nav.reviewQueue': 'İnceleme Kuyruğu',
    'nav.layoutEditor': 'Mizanpaj ve Üretim',
    'nav.productionLine': 'Üretim Hattı',
    'nav.galleyProofs': 'Baskı Provaları',
    'nav.enterprise': 'Kurumsal Sürüm',
    'nav.returnToWebsite': 'Web Sitesine Dön',
    
    // Header
    'header.search': 'Ara...',
    
    // Role Selector
    'roleSelect.welcome': 'Tekrar hoş geldiniz',
    'roleSelect.subtitle': 'Devam etmek için bağlamınızı seçin. Çalışma alanınız, seçtiğiniz rol için gereken izinlere ve araçlara otomatik olarak uyum sağlayacaktır.',
    'roleSelect.enter': 'Giriş Yap',
    'roleSelect.lastActive': 'Son aktivite',

    // Role Names
    'role.editor': 'Editör',
    'role.author': 'Yazar',
    'role.reviewer': 'Hakem',
    'role.layout_editor': 'Mizanpaj Editörü',
    'role.super_admin': 'Sistem Yöneticisi',
    
    // Status Labels
    'stat.pending': 'Bekliyor',
    'stat.assigned': 'Atandı',
    'stat.inReview': 'İncelemede',
  }
};

export type Locale = 'en' | 'tr';
export type TranslationKey = keyof typeof translations.en;
